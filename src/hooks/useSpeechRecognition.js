import { useState, useRef, useCallback, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// Ses Tanıma: Google Cloud STT (primary) → Web Speech API (fallback)
// MediaRecorder ile ses kaydı → base64 → server → Google STT
// ═══════════════════════════════════════════════════════════════

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [completedAt, setCompletedAt] = useState(0);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timeoutRef = useRef(null);
  const webSpeechRef = useRef(null);
  const useGoogleSTT = useRef(true); // Google STT başarısız olursa false

  // ─── Web Speech API Setup (fallback) ───
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = 'tr-TR';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 3;

    let lastFinal = '';

    rec.onstart = () => { setIsListening(true); setError(null); };
    rec.onresult = (e) => {
      let final = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(final || interim);
      if (final) lastFinal = final;
    };
    rec.onerror = (e) => {
      if (e.error !== 'aborted') {
        const msgs = { 'no-speech': 'Ses algılanamadı.', 'audio-capture': 'Mikrofon bulunamadı.', 'not-allowed': 'Mikrofon izni gerekli.' };
        setError(msgs[e.error] || null);
      }
      setIsListening(false);
    };
    rec.onend = () => {
      setIsListening(false);
      if (lastFinal?.trim()) {
        setFinalTranscript(lastFinal.trim());
        setCompletedAt(Date.now());
      }
      lastFinal = '';
    };

    webSpeechRef.current = rec;
    return () => { try { rec.abort(); } catch {} };
  }, []);

  // ─── Google Cloud STT: Kaydet → Gönder → Sonuç ───
  const startGoogleSTT = useCallback(async () => {
    try {
      // Mikrofon erişimi
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 48000, echoCancellation: true, noiseSuppression: true }
      });
      streamRef.current = stream;
      chunksRef.current = [];

      // MediaRecorder başlat
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stream'i kapat
        stream.getTracks().forEach(t => t.stop());

        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size < 1000) {
          // Çok kısa kayıt
          setError('Ses algılanamadı. Tekrar dene!');
          setIsListening(false);
          return;
        }

        setTranscript('Anlıyorum...');

        try {
          // Blob → Base64
          const reader = new FileReader();
          const base64 = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          // Google STT'ye gönder
          const resp = await fetch('/api/google-stt/recognize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audio: base64,
              encoding: 'WEBM_OPUS',
              sampleRate: 48000,
            }),
          });

          if (!resp.ok) {
            const d = await resp.json().catch(() => ({}));
            throw new Error(d.details || d.error || 'STT hatası');
          }

          const data = await resp.json();
          const text = data.transcript?.trim();

          if (text) {
            console.log('[Google STT]', text, `(güven: ${(data.confidence * 100).toFixed(0)}%)`);
            setTranscript(text);
            setFinalTranscript(text);
            setCompletedAt(Date.now());
          } else {
            setError('Ses algılanamadı. Tekrar dene!');
            setTranscript('');
          }
        } catch (err) {
          console.warn('[Google STT] Hata:', err.message);
          // Google STT başarısız → sonraki seferde Web Speech API kullan
          useGoogleSTT.current = false;
          setError('Ses tanıma başarısız. Tekrar dene!');
          setTranscript('');
        }

        setIsListening(false);
      };

      // Kayda başla
      recorder.start(250); // 250ms chunk
      setIsListening(true);
      setError(null);
      setTranscript('');
      console.log('[Google STT] Kayıt başladı');

      // 8 saniye sonra otomatik dur
      timeoutRef.current = setTimeout(() => {
        console.log('[Google STT] Zaman aşımı');
        if (recorder.state === 'recording') recorder.stop();
      }, 8000);

    } catch (err) {
      console.error('[Google STT] Mikrofon hatası:', err);
      setError('Mikrofon erişimi başarısız.');
      setIsListening(false);
      useGoogleSTT.current = false;
    }
  }, []);

  // ─── Web Speech API Fallback ───
  const startWebSpeech = useCallback(() => {
    if (!webSpeechRef.current) {
      setError('Ses tanıma desteklenmiyor. Chrome kullanın.');
      return;
    }
    setTranscript(''); setError(null);
    try {
      webSpeechRef.current.start();
      timeoutRef.current = setTimeout(() => {
        try { webSpeechRef.current.stop(); } catch {}
      }, 8000);
    } catch (err) {
      console.error('[WebSpeech] Başlatılamadı:', err);
      setError('Ses tanıma başlatılamadı.');
    }
  }, []);

  // ─── Ana Dinleme Başlatma ───
  const startListening = useCallback(() => {
    if (isListening) return;
    setFinalTranscript('');
    setTranscript('');
    setError(null);

    if (useGoogleSTT.current) {
      startGoogleSTT();
    } else {
      startWebSpeech();
    }
  }, [isListening, startGoogleSTT, startWebSpeech]);

  // ─── Durdurma ───
  const stopListening = useCallback(() => {
    // Google STT kaydını durdur
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    // Web Speech API durdur
    try { webSpeechRef.current?.stop(); } catch {}
    // Timeout temizle
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }, []);

  return {
    isListening,
    transcript,
    finalTranscript,
    completedAt,
    error,
    isSupported,
    startListening,
    stopListening,
  };
}
