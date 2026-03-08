import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import MicButton from '../components/MicButton';
import ParticleField from '../components/ParticleField';

export default function NameScreen() {
  const { setChildName, setScreen } = useGameStore();
  const { isListening, transcript, finalTranscript, completedAt, startListening, stopListening } = useSpeechRecognition();
  const { speak, isSpeaking } = useTextToSpeech();
  const [phase, setPhase] = useState('asking');
  const [name, setName] = useState('');
  const [asked, setAsked] = useState(false);
  const lastProcessed = React.useRef(0);

  useEffect(() => {
    if (!asked) { setAsked(true); speak('Merhaba küçük kaşif! Adın ne? Mikrofona söyle!'); }
  }, [asked, speak]);

  useEffect(() => {
    if (!finalTranscript || !completedAt) return;
    if (completedAt <= lastProcessed.current) return;
    if (phase !== 'listening') return;

    lastProcessed.current = completedAt;
    const n = finalTranscript.trim().split(' ')[0];
    if (n.length > 0) {
      const cap = n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
      setName(cap); setPhase('confirming');
      speak(`Senin adın ${cap}, doğru mu? Evet dersen başlayalım!`);
    }
  }, [finalTranscript, completedAt, phase, speak]);

  const handleMic = useCallback(() => {
    if (isSpeaking) return;
    if (isListening) stopListening();
    else { setPhase('listening'); startListening(); }
  }, [isListening, isSpeaking, startListening, stopListening]);

  const confirmYes = async () => {
    setChildName(name);
    await speak(`Harika ${name}! Yıldız Ülkesine hoş geldin!`);
    setTimeout(() => setScreen('worldSelect'), 800);
  };
  const confirmNo = () => { setName(''); setPhase('asking'); speak('Tamam, tekrar söyle! Adın ne?'); };
  const skip = async () => {
    setChildName('Kaşif');
    await speak('Tamam Kaşif! Haydi başlayalım!');
    setTimeout(() => setScreen('worldSelect'), 800);
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-indigo-950 via-purple-900 to-violet-800 flex flex-col items-center justify-center overflow-hidden">
      <ParticleField color="#a78bfa" count={20} />
      <div className={`text-8xl mb-6 ${isSpeaking ? 'mascot-talk' : 'animate-float'}`}>🌟</div>
      <div className="glass rounded-3xl px-8 py-6 max-w-md mx-4 text-center mb-8">
        {phase === 'asking' && <p className="font-display text-2xl text-white">Adın ne, küçük kaşif?</p>}
        {phase === 'listening' && (
          <div><p className="font-display text-2xl text-white mb-2">Dinliyorum...</p>
            {transcript && <p className="font-body text-lg text-amber-300">{transcript}</p>}</div>
        )}
        {phase === 'confirming' && (
          <div><p className="font-display text-2xl text-white mb-4">
            Senin adın <span className="text-amber-300 font-bold">{name}</span>?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={confirmYes} disabled={isSpeaking}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-full font-display text-xl text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50">Evet!</button>
              <button onClick={confirmNo} disabled={isSpeaking}
                className="px-8 py-3 bg-rose-500 hover:bg-rose-400 rounded-full font-display text-xl text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50">Hayır</button>
            </div></div>
        )}
      </div>
      {phase !== 'confirming' && <MicButton isListening={isListening} disabled={isSpeaking} onPress={handleMic} />}
      <button onClick={skip} className="absolute bottom-8 text-purple-300/50 hover:text-purple-200 text-sm font-body underline transition-colors">Adımı söylemek istemiyorum</button>
    </div>
  );
}
