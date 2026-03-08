import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import claudeRoutes from './routes/claude.js';
import elevenlabsRoutes from './routes/elevenlabs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// ─── CORS ───
if (isProd) {
  app.use(cors()); // Production'da Render kendi domain'ini yönetir
} else {
  app.use(cors({ origin: 'http://localhost:5173' }));
}

app.use(express.json({ limit: '5mb' }));

// ─── API Routes ───
app.use('/api/claude', claudeRoutes);
app.use('/api/tts', elevenlabsRoutes);

// ─── Health Check ───
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: isProd ? 'production' : 'development',
    claude: !!process.env.ANTHROPIC_API_KEY,
    elevenlabs: !!process.env.ELEVENLABS_API_KEY,
  });
});

// ─── Production: Vite build'i serve et ───
if (isProd) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`🌟 Yıldız Ülkesi ${isProd ? '(PROD)' : '(DEV)'} → http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) console.warn('⚠️  ANTHROPIC_API_KEY tanımlı değil!');
  if (!process.env.ELEVENLABS_API_KEY) console.warn('⚠️  ELEVENLABS_API_KEY tanımlı değil!');
});
