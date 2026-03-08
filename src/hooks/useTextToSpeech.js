import { useState, useRef, useCallback } from 'react';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);
  const abortRef = useRef(null);

  const speakEL = useCallback(async (text) => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const resp = await fetch('/api/tts/speak', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }), signal: ctrl.signal,
    });
    if (!resp.ok) { const d = await resp.json().catch(()=>({})); if (d.fallback) throw new Error('FALLBACK'); throw new Error('TTS fail'); }
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); setIsSpeaking(false); resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(url); setIsSpeaking(false); reject(); };
      setIsSpeaking(true); audio.play().catch(reject);
    });
  }, []);

  const speakWS = useCallback((text) => new Promise((resolve, reject) => {
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

  const speak = useCallback(async (text) => {
    if (!text) return;
    try { await speakEL(text); }
    catch { try { await speakWS(text); } catch { setIsSpeaking(false); } }
  }, [speakEL, speakWS]);

  const stop = useCallback(() => {
    abortRef.current?.abort(); audioRef.current?.pause();
    window.speechSynthesis?.cancel(); setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
