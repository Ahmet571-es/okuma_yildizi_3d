import React, { useState, useEffect } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import ParticleField from '../components/ParticleField';

export default function WelcomeScreen() {
  const { setScreen, childName } = useGameStore();
  const { speak } = useTextToSpeech();
  const [show, setShow] = useState(false);
  const [micOk, setMicOk] = useState(false);

  const [tapCount, setTapCount] = useState(0);

  // Gizli öğretmen erişimi: yıldıza 5 kez tıkla
  const handleStarTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      setTapCount(0);
      setScreen('teacher');
    }
  };

  useEffect(() => { setTimeout(() => setShow(true), 400); }, []);

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicOk(true);
      await speak('Yıldız Ülkesine hoş geldin! Harika bir macera seni bekliyor!');
      setTimeout(() => setScreen(childName ? 'worldSelect' : 'name'), 1500);
    } catch {
      alert('Mikrofon izni gerekli! Lütfen izin ver.');
    }
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-indigo-950 via-purple-900 to-violet-800 flex flex-col items-center justify-center overflow-hidden">
      <ParticleField color="#FFD700" count={30} />
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white animate-sparkle"
            style={{ width: Math.random()*4+1+'px', height: Math.random()*4+1+'px',
              top: Math.random()*100+'%', left: Math.random()*100+'%',
              animationDelay: Math.random()*3+'s', opacity: Math.random()*0.6+0.2 }} />
        ))}
      </div>
      <div className={`relative z-10 text-center transition-all duration-1000 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-8xl mb-4 animate-float cursor-pointer" onClick={handleStarTap}>⭐</div>
        <h1 className="font-display text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">
          Yıldız Ülkesi
        </h1>
        <p className="font-body text-xl text-purple-200 mt-2">Sesli Okuma Macerası</p>
      </div>
      <div className={`relative z-10 flex gap-6 mt-8 text-5xl transition-all duration-1000 delay-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
        {['🦁','🐬','🦅','🦊','🐧'].map((e,i) => (
          <div key={e} className="animate-float" style={{animationDelay:`${i*0.3}s`}}>{e}</div>
        ))}
      </div>
      <div className={`relative z-10 mt-10 transition-all duration-1000 delay-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
        {micOk ? (
          <div className="text-green-400 font-body text-xl flex items-center gap-2">✅ Mikrofon hazır!</div>
        ) : (
          <button onClick={requestMic}
            className="px-10 py-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full font-display text-2xl font-bold text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all">
            <span className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
              Maceraya Başla!
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
