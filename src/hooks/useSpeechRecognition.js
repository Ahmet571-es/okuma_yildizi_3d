import { useState, useRef, useCallback, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// Ses Tanıma v3: Robust MediaRecorder → Google STT
// Fallback: Web Speech API
// Çocuk dostu: Bas → Konuş → Otomatik dur
// ═══════════════════════════════════════════════════════════════

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [completedAt, setCompletedAt] = useState(0);
  const [error, setError] = useState(null);
  const [isSupported] = useState(true);
  const [mode, setMode] = useState('init'); // init | google | webspeech

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timeoutRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const webSpeechRef = useRef(null);
  const analyserRef = useRef(null);
  const isRecordingRef = useRef(false);

  // ─── Detect best mode on mount ───
  useEffect(() => {
    // Google STT health check
    fetch('/api/health').then(r => r.json()).then(d => {
      if (d.googleStt) {
        setMode('google');
        console.log('[STT] Mode: Google Cloud');
      } else {
        setMode('webspeech');
        console.log('[STT] Mode: Web Speech API (fallback)');
      }
    }).catch(() => setMode('webspeech'));

    // Web Speech API setup
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
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
        if (e.error !== 'aborted' && e.error !== 'no-speech') {
          setError('Ses tanıma hatası. Chrome kullandığından emin ol.');
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
    }

    return () => {
      try { webSpeechRef.current?.abort(); } catch {}
    };
  }, []);

  // ─── Ses seviyesi algılama (otomatik dur) ───
  const setupSilenceDetection = useCallback((stream) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = { audioCtx, analyser };

      let silenceStart = null;
      let speechDetected = false;

      const checkSilence = () => {
        if (!isRecordingRef.current) return;

        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;

        if (avg > 15) {
          // Ses var
          speechDetected = true;
          silenceStart = null;
          setTranscript('Konuşuyorsun...');
        } else if (speechDetected) {
          // Konuştuktan sonra sessizlik
          if (!silenceStart) silenceStart = Date.now();
          else if (Date.now() - silenceStart > 1500) {
            // 1.5 sn sessizlik → otomatik dur
            console.log('[STT] Sessizlik algılandı, durduruluyor');
            stopRecording();
            return;
          }
        }

        requestAnimationFrame(checkSilence);
      };

      requestAnimationFrame(checkSilence);
    } catch (e) {
      console.warn('[STT] Ses analiz kurulamadı:', e);
    }
  }, []);

  // ─── Kaydı Durdur ───
  const stopRecording = useCallback(() => {
    isRecordingRef.current = false;
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (analyserRef.current?.audioCtx) {
      try { analyserRef.current.audioCtx.close(); } catch {}
    }
  }, []);

  // ─── Google Cloud STT ───
  const startGoogleSTT = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      streamRef.current = stream;
      chunksRef.current = [];
      isRecordingRef.current = true;

      // Mime type
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mimeType = 'audio/webm;codecs=opus';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        isRecordingRef.current = false;
        stream.getTracks().forEach(t => t.stop());

        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log('[STT] Kayıt boyutu:', blob.size, 'bytes');

        if (blob.size < 500) {
          setError('Ses çok kısa. Tekrar dene!');
          setTranscript('');
          setIsListening(false);
          return;
        }

        setTranscript('Anlıyorum...');

        try {
          const reader = new FileReader();
          const base64 = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          const resp = await fetch('/api/google-stt/recognize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64, encoding: 'WEBM_OPUS', sampleRate: 48000 }),
          });

          if (!resp.ok) throw new Error('STT API hatası: ' + resp.status);

          const data = await resp.json();
          const text = data.transcript?.trim();

          if (text) {
            console.log('[STT] Sonuç:', text, `(${(data.confidence * 100).toFixed(0)}%)`);
            setTranscript(text);
            setFinalTranscript(text);
            setCompletedAt(Date.now());
            setError(null);
          } else {
            setError('Seni anlayamadım. Tekrar dene!');
            setTranscript('');
          }
        } catch (err) {
          console.warn('[STT] Google hatası:', err.message);
          setMode('webspeech');
          setError('Ses tanıma hatası. Tekrar dene!');
          setTranscript('');
        }

        setIsListening(false);
      };

      recorder.onerror = (e) => {
        console.error('[STT] Recorder hatası:', e);
        isRecordingRef.current = false;
        stream.getTracks().forEach(t => t.stop());
        setMode('webspeech');
        setError('Kayıt hatası. Tekrar dene!');
        setIsListening(false);
      };

      // Başlat
      recorder.start(200);
      setIsListening(true);
      setError(null);
      setTranscript('Dinliyorum...');
      console.log('[STT] Google kayıt başladı');

      // Sessizlik algılama
      setupSilenceDetection(stream);

      // Max 10 sn
      timeoutRef.current = setTimeout(() => {
        console.log('[STT] 10sn timeout');
        stopRecording();
      }, 10000);

    } catch (err) {
      console.error('[STT] Mikrofon hatası:', err.name, err.message);
      if (err.name === 'NotAllowedError') {
        setError('Mikrofon izni gerekli! Tarayıcı ayarlarından izin ver.');
      } else if (err.name === 'NotFoundError') {
        setError('Mikrofon bulunamadı! Bir mikrofon bağla.');
      } else {
        setError('Mikrofon açılamadı: ' + err.message);
      }
      setMode('webspeech');
      setIsListening(false);
    }
  }, [setupSilenceDetection, stopRecording]);

  // ─── Web Speech API Fallback ───
  const startWebSpeech = useCallback(() => {
    if (!webSpeechRef.current) {
      setError('Ses tanıma desteklenmiyor. Chrome tarayıcı kullan.');
      return;
    }
    setTranscript(''); setError(null);
    try {
      webSpeechRef.current.start();
      timeoutRef.current = setTimeout(() => {
        try { webSpeechRef.current.stop(); } catch {}
      }, 10000);
    } catch {
      setError('Ses tanıma başlatılamadı. Sayfayı yenile.');
    }
  }, []);

  // ─── START ───
  const startListening = useCallback(() => {
    if (isListening) return;
    setFinalTranscript('');
    setTranscript('');
    setError(null);

    if (mode === 'google') startGoogleSTT();
    else startWebSpeech();
  }, [isListening, mode, startGoogleSTT, startWebSpeech]);

  // ─── STOP ───
  const stopListening = useCallback(() => {
    if (mode === 'google') stopRecording();
    else { try { webSpeechRef.current?.stop(); } catch {} }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }, [mode, stopRecording]);

  return {
    isListening, transcript, finalTranscript, completedAt,
    error, isSupported, startListening, stopListening, mode,
  };
}
