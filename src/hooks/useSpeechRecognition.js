import { useState, useRef, useCallback, useEffect } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setIsSupported(false); return; }

    const rec = new SR();
    rec.lang = 'tr-TR';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 3;

    rec.onstart = () => { setIsListening(true); setError(null); };
    rec.onresult = (e) => {
      let final = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(final || interim);
    };
    rec.onerror = (e) => {
      const msgs = { 'no-speech': 'Ses algılanamadı. Tekrar dene!', 'audio-capture': 'Mikrofon bulunamadı.', 'not-allowed': 'Mikrofon izni gerekli.' };
      setError(msgs[e.error] || 'Ses tanıma hatası');
      setIsListening(false);
    };
    rec.onend = () => { setIsListening(false); if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    recognitionRef.current = rec;

    return () => { try { rec.abort(); } catch {} if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    setTranscript(''); setError(null);
    try {
      recognitionRef.current.start();
      timeoutRef.current = setTimeout(() => { try { recognitionRef.current.stop(); } catch {} }, 10000);
    } catch {}
  }, [isListening]);

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch {}
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { isListening, transcript, error, isSupported, startListening, stopListening };
}
