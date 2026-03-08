import { useState, useRef, useCallback, useEffect } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [completedAt, setCompletedAt] = useState(0); // timestamp - forces re-trigger
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastFinalRef = useRef('');

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setIsSupported(false); return; }

    const rec = new SR();
    rec.lang = 'tr-TR';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 3;

    rec.onstart = () => {
      setIsListening(true);
      setError(null);
      console.log('[STT] Dinleme başladı');
    };

    rec.onresult = (e) => {
      let final = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      // Canlı gösterim için (konuşurken ekranda görünsün)
      setTranscript(final || interim);

      // Final sonuç geldiğinde kaydet
      if (final) {
        lastFinalRef.current = final;
        console.log('[STT] Final:', final);
      }
    };

    rec.onerror = (e) => {
      console.warn('[STT] Hata:', e.error);
      const msgs = {
        'no-speech': 'Ses algılanamadı. Tekrar dene!',
        'audio-capture': 'Mikrofon bulunamadı.',
        'not-allowed': 'Mikrofon izni gerekli.',
        'aborted': null, // sessizce geç
      };
      const msg = msgs[e.error];
      if (msg) setError(msg);
      else if (!msgs.hasOwnProperty(e.error)) setError('Ses tanıma hatası: ' + e.error);
      setIsListening(false);
    };

    rec.onend = () => {
      console.log('[STT] Dinleme bitti, final:', lastFinalRef.current);
      setIsListening(false);
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }

      // Dinleme bittiğinde final transcript'i yayınla
      const result = lastFinalRef.current || '';
      if (result.trim()) {
        setFinalTranscript(result.trim());
        setCompletedAt(Date.now()); // Aynı kelime tekrarlansa bile yeniden tetikler
      }
    };

    recognitionRef.current = rec;

    return () => {
      try { rec.abort(); } catch {}
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    lastFinalRef.current = '';
    setTranscript('');
    setFinalTranscript('');
    setError(null);
    try {
      recognitionRef.current.start();
      // 8 saniye sonra otomatik dur
      timeoutRef.current = setTimeout(() => {
        console.log('[STT] Zaman aşımı, durduruluyor');
        try { recognitionRef.current.stop(); } catch {}
      }, 8000);
    } catch (err) {
      console.error('[STT] Başlatılamadı:', err);
      setError('Ses tanıma başlatılamadı. Sayfayı yenile.');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch {}
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }, []);

  return {
    isListening,
    transcript,       // Canlı gösterim (konuşurken)
    finalTranscript,  // İşleme (konuşma bitince)
    completedAt,      // Re-trigger için timestamp
    error,
    isSupported,
    startListening,
    stopListening,
  };
}
