import React, { useEffect, useState } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { WORLDS } from '../config/worlds';
import { CURRICULUM, MEB_ORDER, getLettersByGroup } from '../config/curriculum';
import ParticleField from '../components/ParticleField';

export default function WorldSelectScreen() {
  const { childName, completedLetters, stars, setCurrentWorld, setCurrentLetter, setScreen } = useGameStore();
  const { speak, isSpeaking } = useTextToSpeech();
  const [greeted, setGreeted] = useState(false);

  const unlockedCount = WORLDS.filter(w => completedLetters.length >= w.unlockRequirement).length;

  useEffect(() => {
    if (!greeted) {
      setGreeted(true);
      if (unlockedCount <= 1) {
        speak(`${childName}, Orman Ülkesinde Leo seni bekliyor! Hadi başlayalım!`);
      } else {
        speak(`${childName}, ${unlockedCount} dünya seni bekliyor! Hangisine gitmek istersin?`);
      }
    }
  }, [greeted, childName, unlockedCount, speak]);

  const getProgress = (w) => {
    const done = w.letters.filter(l => completedLetters.includes(l)).length;
    return { done, total: w.letters.length, pct: Math.round((done / w.letters.length) * 100) };
  };

  const isUnlocked = (w) => completedLetters.length >= w.unlockRequirement;

  const selectWorld = async (w) => {
    if (!isUnlocked(w) || isSpeaking) return;
    const letters = getLettersByGroup(w.groupId);
    const next = letters.find(l => !completedLetters.includes(l.letter));
    const letter = next || letters[0];
    await speak(`${w.name}! ${w.mascot.name} seni bekliyor! ${letter.letter} sesini öğreneceğiz!`);
    setCurrentWorld(w.id);
    setCurrentLetter(letter.letter);
    setTimeout(() => setScreen('game'), 400);
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 flex flex-col overflow-hidden">
      <ParticleField color="#FFD700" count={15} />

      <div className="relative z-10 pt-6 px-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-white font-bold">Merhaba {childName}!</h2>
          <p className="font-body text-purple-300 text-sm">
            {unlockedCount <= 1 ? 'İlk maceran seni bekliyor!' : `${unlockedCount} dünya açık!`}
          </p>
        </div>
        <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
          <span className="text-xl">⭐</span>
          <span className="font-display text-xl text-amber-300 font-bold">{stars}</span>
        </div>
      </div>

      {/* Overall progress */}
      <div className="relative z-10 mx-6 mt-4">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedLetters.length / 29) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-purple-300/50 text-xs font-body">Öğrendiğin sesler</p>
          <p className="text-purple-300/70 text-xs font-body">{completedLetters.length}/29 ses</p>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {WORLDS.map((w, i) => {
          const unlocked = isUnlocked(w);
          const prog = getProgress(w);
          return (
            <button key={w.id} onClick={() => selectWorld(w)} disabled={!unlocked || isSpeaking}
              className={`w-full p-5 rounded-3xl text-left transition-all duration-300
                ${unlocked ? 'glass hover:bg-white/15 active:scale-[0.98]' : 'bg-white/5 opacity-40 cursor-not-allowed'}`}>
              <div className="flex items-center gap-4">
                <div className={`text-5xl shrink-0 ${unlocked ? 'animate-float' : ''}`}
                  style={{animationDelay:`${i*200}ms`}}>
                  {unlocked ? w.mascot.emoji : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl text-white font-bold">
                    {w.name}
                    {prog.pct === 100 && <span className="text-sm ml-2">✅</span>}
                  </h3>
                  <p className="font-body text-sm text-purple-300 mb-2">
                    {unlocked
                      ? `${w.mascot.name} ile ${w.letters.length} ses öğreneceksin!`
                      : `Önce ${w.unlockRequirement} ses öğren, sonra bu dünya açılır`}
                  </p>
                  {unlocked && (
                    <div className="flex gap-1.5 flex-wrap">
                      {w.letters.map(letter => {
                        const done = completedLetters.includes(letter);
                        return (
                          <div key={letter} title={`${letter} sesi`}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-display transition-all
                              ${done
                                ? 'bg-amber-400 text-amber-900 shadow-md shadow-amber-400/30'
                                : 'bg-white/10 text-white/50'}`}>
                            {done ? `${letter}✓` : letter}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {unlocked && (
                  <div className="font-display text-2xl font-bold" style={{color:w.theme.accent}}>%{prog.pct}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 pb-6 px-6 flex justify-center">
        <button onClick={() => { if (confirm('İlerleme sıfırlansın mı?')) useGameStore.getState().resetProgress(); }}
          className="text-purple-400/40 hover:text-purple-300 text-xs font-body underline transition-colors">
          Sıfırla
        </button>
      </div>
    </div>
  );
}
