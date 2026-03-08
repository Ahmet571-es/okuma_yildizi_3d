import { useState, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// TTS Cascade: Google Cloud → ElevenLabs → Web Speech API
// Her biri başarısız olursa sonraki devreye girer
// ═══════════════════════════════════════════════════════════════

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);
  const abortRef = useRef(null);

  // Helper: fetch audio and play
  const fetchAndPlay = useCallback(async (url, body) => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!resp.ok) {
      const d = await resp.json().catch(() => ({}));
      if (d.fallback) throw new Error('FALLBACK');
      throw new Error('TTS fail: ' + resp.status);
    }
    const blob = await resp.blob();
    const audioUrl = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(audioUrl); setIsSpeaking(false); resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(audioUrl); setIsSpeaking(false); reject(); };
      setIsSpeaking(true);
      audio.play().catch(reject);
    });
  }, []);

  // Web Speech API (son çare)
  const speakWebSpeech = useCallback((text) => new Promise((resolve, reject) => {
    if (!window.speechSynthesis) { reject(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'tr-TR'; u.rate = 0.85; u.pitch = 1.1;
    const v = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('tr'));
    if (v) u.voice = v;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => { setIsSpeaking(false); resolve(); };
    u.onerror = (e) => { setIsSpeaking(false); e.error !== 'canceled' ? reject(e) : resolve(); };
    window.speechSynthesis.speak(u);
  }), []);

  // Ana konuşma: Google Cloud → ElevenLabs → Web Speech
  const speak = useCallback(async (text) => {
    if (!text) return;

    // 1. Google Cloud TTS (primary - 1M karakter/ay ücretsiz)
    try {
      await fetchAndPlay('/api/google-tts/speak', { text });
      return;
    } catch (e) {
      if (e.name === 'AbortError') return;
      console.warn('Google TTS:', e.message);
    }

    // 2. ElevenLabs (fallback 1)
    try {
      await fetchAndPlay('/api/tts/speak', { text });
      return;
    } catch (e) {
      if (e.name === 'AbortError') return;
      console.warn('ElevenLabs:', e.message);
    }

    // 3. Web Speech API (son çare)
    try {
      await speakWebSpeech(text);
    } catch {
      setIsSpeaking(false);
    }
  }, [fetchAndPlay, speakWebSpeech]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
