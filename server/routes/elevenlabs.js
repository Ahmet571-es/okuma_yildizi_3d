import { Router } from 'express';
const router = Router();

router.post('/speak', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    if (!text) return res.status(400).json({ error: 'Metin gerekli' });
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ error: 'ELEVENLABS_API_KEY yok', fallback: true });
    }
    const selectedVoice = voiceId || process.env.ELEVENLABS_VOICE_ID || 'XrExE9yKIg1WjnnlVkGX';
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': process.env.ELEVENLABS_API_KEY },
      body: JSON.stringify({
        text, model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.75, similarity_boost: 0.80, style: 0.45, use_speaker_boost: true },
      }),
    });
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'TTS hatası', fallback: true });
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    res.status(500).json({ error: 'TTS hatası', fallback: true });
  }
});

export default router;
