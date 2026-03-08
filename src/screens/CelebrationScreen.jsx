import React, { useEffect, useState } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { getWorldById } from '../config/worlds';
import ParticleField from '../components/ParticleField';

export default function CelebrationScreen() {
  const { currentWorldId, childName, stars, completedLetters, setScreen } = useGameStore();
  const { speak } = useTextToSpeech();
  const [show, setShow] = useState(false);
  const world = getWorldById(currentWorldId);

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
    const done = world?.letters.every(l => completedLetters.includes(l));
    speak(done
      ? `Tebrikler ${childName}! ${world?.name} tamamlandı! ${stars} yıldızın var! Harika bir kaşifsin!`
      : `Harika iş ${childName}! Devam edebilirsin! ${stars} yıldızın oldu!`
    );
  }, []);

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-indigo-950 via-purple-900 to-violet-800 flex flex-col items-center justify-center overflow-hidden">
      <ParticleField color="#FFD700" count={40} />
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({length:25}).map((_,i) => (
          <div key={i} className="absolute animate-sparkle"
            style={{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,
              fontSize:`${Math.random()*20+16}px`,animationDelay:`${Math.random()*2}s`}}>
            {['⭐','🌟','✨','🎉','🎊'][Math.floor(Math.random()*5)]}
          </div>
        ))}
      </div>
      <div className={`relative z-10 text-center transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <div className="text-8xl mb-6 animate-bounce-slow">🏆</div>
        <h1 className="font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
          Tebrikler {childName}!</h1>
        {world && <p className="font-body text-xl text-purple-200 mt-3">{world.name} — {world.subtitle}</p>}
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-4xl">⭐</span>
          <span className="font-display text-5xl text-amber-300 font-bold">{stars}</span>
        </div>
        <p className="font-body text-purple-300 mt-2">{completedLetters.length}/29 ses tamamlandı</p>
        <div className="flex flex-col gap-4 mt-10">
          <button onClick={() => setScreen('worldSelect')}
            className="px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full font-display text-xl font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition-all">
            Devam Et!</button>
          <button onClick={() => setScreen('welcome')}
            className="text-purple-300/60 hover:text-purple-200 font-body text-sm underline transition-colors">Ana Menü</button>
        </div>
      </div>
    </div>
  );
}
