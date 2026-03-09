import { Router } from 'express';

const router = Router();

// ═══════════════════════════════════════════════════════════════
// Google Cloud Speech-to-Text
// Çocuğun sesini metne çevirir — Web Speech API'den çok daha doğru
// Aynı GOOGLE_TTS_API_KEY ile çalışır
// ═══════════════════════════════════════════════════════════════

router.post('/recognize', async (req, res) => {
  try {
    const { audio, encoding, sampleRate } = req.body;

    if (!audio) {
      return res.status(400).json({ error: 'Ses verisi gerekli' });
    }

    const apiKey = process.env.GOOGLE_TTS_API_KEY; // Aynı key STT için de geçerli
    if (!apiKey) {
      return res.status(500).json({ error: 'GOOGLE_TTS_API_KEY tanımlı değil', fallback: true });
    }

    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            encoding: encoding || 'WEBM_OPUS',
            sampleRateHertz: sampleRate || 48000,
            languageCode: 'tr-TR',
            model: 'latest_long',
            useEnhanced: true,
            enableAutomaticPunctuation: false,
            // Çocuk sesi için optimize
            metadata: {
              interactionType: 'VOICE_COMMAND',
              microphoneDistance: 'NEARFIELD',
              originalMediaType: 'AUDIO',
              recordingDeviceType: 'PC',
            },
            // Alternatif sonuçlar (en iyi eşleşme için)
            maxAlternatives: 3,
            // Kısa ses parçaları için
            enableWordTimeOffsets: false,
          },
          audio: {
            content: audio, // Base64 encoded audio
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Google STT Hatası:', JSON.stringify(errData));
      return res.status(response.status).json({
        error: 'Ses tanıma hatası',
        details: errData.error?.message || 'Bilinmeyen hata',
        fallback: true,
      });
    }

    const data = await response.json();

    // Sonuçları parse et
    if (!data.results || data.results.length === 0) {
      return res.json({ transcript: '', alternatives: [], confidence: 0 });
    }

    const best = data.results[0].alternatives[0];
    const alternatives = data.results[0].alternatives.map((a) => ({
      transcript: a.transcript,
      confidence: a.confidence || 0,
    }));

    console.log(`[STT] "${best.transcript}" (güven: ${(best.confidence * 100).toFixed(0)}%)`);

    res.json({
      transcript: best.transcript || '',
      confidence: best.confidence || 0,
      alternatives,
    });
  } catch (err) {
    console.error('STT hatası:', err.message);
    res.status(500).json({ error: 'STT sunucu hatası', fallback: true });
  }
});

export default router;
