import { Router } from 'express';
const router = Router();

// ═══════════════════════════════════════════════════════════════
// Google Cloud TTS — Türkçe Sesler
// WaveNet: Doğal, insan benzeri ses (1M karakter/ay ücretsiz)
// Chirp HD: En yeni, en doğal ses
// ═══════════════════════════════════════════════════════════════

const TURKISH_VOICES = {
  // WaveNet - Yüksek kalite (ücretsiz tier)
  'tr-TR-Wavenet-A': { gender: 'FEMALE', description: 'Kadın - sıcak, doğal' },
  'tr-TR-Wavenet-B': { gender: 'MALE', description: 'Erkek - güven verici' },
  'tr-TR-Wavenet-C': { gender: 'FEMALE', description: 'Kadın - enerjik' },
  'tr-TR-Wavenet-D': { gender: 'FEMALE', description: 'Kadın - sakin' },
  'tr-TR-Wavenet-E': { gender: 'MALE', description: 'Erkek - sıcak' },
  // Standard - Temel kalite (4M karakter/ay ücretsiz)
  'tr-TR-Standard-A': { gender: 'FEMALE', description: 'Kadın - standart' },
  'tr-TR-Standard-B': { gender: 'MALE', description: 'Erkek - standart' },
  'tr-TR-Standard-C': { gender: 'FEMALE', description: 'Kadın - standart 2' },
  'tr-TR-Standard-D': { gender: 'FEMALE', description: 'Kadın - standart 3' },
  'tr-TR-Standard-E': { gender: 'MALE', description: 'Erkek - standart 2' },
};

// Varsayılan ses: Kadın WaveNet-D (en temiz Türkçe telaffuz)
const DEFAULT_VOICE = 'tr-TR-Wavenet-D';

router.post('/speak', async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    if (!text) return res.status(400).json({ error: 'Metin gerekli' });

    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GOOGLE_TTS_API_KEY tanımlı değil', fallback: true });
    }

    const selectedVoice = voiceName || process.env.GOOGLE_TTS_VOICE || DEFAULT_VOICE;

    // SSML ile daha doğru Türkçe telaffuz
    const ssmlText = `<speak><lang xml:lang="tr-TR"><prosody rate="slow" pitch="+0.5st">${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}</prosody></lang></speak>`;

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { ssml: ssmlText },
          voice: {
            languageCode: 'tr-TR',
            name: selectedVoice,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.85,  // Çocuklar için yavaş ve net
            pitch: 0.5,         // Biraz kalın, daha doğal
            volumeGainDb: 2.0,  // Biraz daha yüksek ses
            effectsProfileId: ['small-bluetooth-speaker-class-device'],
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Google TTS Hatası:', JSON.stringify(errData));
      return res.status(response.status).json({
        error: 'Google TTS hatası',
        details: errData.error?.message || 'Bilinmeyen hata',
        fallback: true,
      });
    }

    const data = await response.json();

    if (!data.audioContent) {
      return res.status(500).json({ error: 'Ses üretilemedi', fallback: true });
    }

    // Base64 audio → binary buffer
    const audioBuffer = Buffer.from(data.audioContent, 'base64');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(audioBuffer);
  } catch (err) {
    console.error('Google TTS hatası:', err.message);
    res.status(500).json({ error: 'TTS sunucu hatası', fallback: true });
  }
});

// Mevcut sesleri listele
router.get('/voices', (_req, res) => {
  res.json({
    voices: Object.entries(TURKISH_VOICES).map(([name, info]) => ({
      name,
      ...info,
    })),
    default: DEFAULT_VOICE,
  });
});

export default router;
