import React from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { MEB_ORDER, GROUP_INFO, CURRICULUM, PHASE_LABELS } from '../config/curriculum';
import { ASSESSMENT_CRITERIA, calculateLetterScore } from '../config/assessment';

export default function TeacherScreen() {
  const { childName, completedLetters, stars, assessments, sessionCount, setScreen } = useGameStore();

  const overallProgress = Math.round((completedLetters.length / 29) * 100);

  // Grup bazlı ilerleme
  const groupProgress = GROUP_INFO.map(g => {
    const done = g.letters.filter(l => completedLetters.includes(l)).length;
    return { ...g, done, pct: Math.round((done / g.letters.length) * 100) };
  });

  // Detaylı değerlendirmeler
  const letterAssessments = completedLetters.map(letter => {
    const data = assessments[letter];
    const letterInfo = CURRICULUM[letter];
    if (!data?.phaseScores) return { letter, group: letterInfo?.group, score: null };
    const calc = calculateLetterScore(data.phaseScores);
    return { letter, group: letterInfo?.group, ...calc, date: data.date, phaseScores: data.phaseScores };
  });

  return (
    <div className="h-full w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white font-bold">Öğretmen Paneli</h1>
          <p className="font-body text-sm text-slate-400">MEB Ölçme-Değerlendirme</p>
        </div>
        <button onClick={() => setScreen('welcome')}
          className="px-4 py-2 glass rounded-lg text-white/70 hover:text-white text-sm font-body transition-colors">
          ← Geri
        </button>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-3xl mx-auto">
        {/* Öğrenci Kartı */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl text-white font-bold">{childName || 'Öğrenci'}</h2>
              <p className="font-body text-sm text-slate-400">{sessionCount} oturum tamamlandı</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1"><span>⭐</span><span className="font-display text-2xl text-amber-300 font-bold">{stars}</span></div>
              <p className="font-body text-xs text-slate-400">{completedLetters.length}/29 ses</p>
            </div>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all" style={{width:`${overallProgress}%`}} />
          </div>
          <p className="text-right text-xs text-slate-400 mt-1">Genel İlerleme: %{overallProgress}</p>
        </div>

        {/* Grup Bazlı İlerleme */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-white font-bold mb-4">MEB Ses Grupları</h3>
          <div className="space-y-3">
            {groupProgress.map(g => (
              <div key={g.id} className="flex items-center gap-4">
                <div className="w-24 shrink-0">
                  <p className="font-body text-sm text-white font-semibold">{g.id}. Grup</p>
                  <p className="font-body text-xs text-slate-400">{g.weeks} hafta</p>
                </div>
                <div className="flex-1">
                  <div className="flex gap-1 mb-1">
                    {g.letters.map(l => (
                      <span key={l} className={`px-2 py-0.5 rounded text-xs font-display font-bold
                        ${completedLetters.includes(l) ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/5 text-white/30'}`}>
                        {l}
                      </span>
                    ))}
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all" style={{width:`${g.pct}%`}} />
                  </div>
                </div>
                <span className="font-display text-sm text-white font-bold w-12 text-right">%{g.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detaylı Harf Değerlendirmeleri */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-white font-bold mb-4">Harf Bazlı Değerlendirme</h3>
          {letterAssessments.length === 0 ? (
            <p className="font-body text-slate-400 text-sm">Henüz tamamlanan harf yok.</p>
          ) : (
            <div className="space-y-3">
              {letterAssessments.map(a => (
                <div key={a.letter} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-display text-lg font-bold text-white">{a.letter}</span>
                      <div>
                        <p className="font-body text-sm text-white font-semibold">{a.letter} Sesi — {a.group}. Grup</p>
                        {a.date && <p className="font-body text-xs text-slate-400">{new Date(a.date).toLocaleDateString('tr-TR')}</p>}
                      </div>
                    </div>
                    {a.score !== null && a.label && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold
                        ${a.level === 'excellent' ? 'bg-emerald-500/20 text-emerald-300' :
                          a.level === 'good' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-rose-500/20 text-rose-300'}`}>
                        {a.label} — %{a.percent}
                      </span>
                    )}
                  </div>
                  {a.phaseScores && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {Object.entries(a.phaseScores).map(([phase, score]) => (
                        <div key={phase} className="bg-white/5 rounded-lg px-3 py-1.5 text-xs">
                          <span className="text-slate-400 font-body">{PHASE_LABELS[phase] || phase}: </span>
                          <span className={`font-bold ${score >= 3 ? 'text-emerald-300' : score >= 2 ? 'text-amber-300' : 'text-rose-300'}`}>
                            {score}/3
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MEB Kazanım Referansları */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-white font-bold mb-4">MEB Kazanım Referansları</h3>
          <div className="space-y-2">
            {Object.entries(ASSESSMENT_CRITERIA).map(([key, c]) => (
              <div key={key} className="bg-white/5 rounded-lg p-3">
                <p className="font-body text-xs text-cyan-300 font-mono">{c.code}</p>
                <p className="font-body text-sm text-white font-semibold">{c.label}</p>
                <p className="font-body text-xs text-slate-400">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pedagojik Notlar */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-white font-bold mb-3">Pedagojik Notlar</h3>
          <div className="font-body text-sm text-slate-300 space-y-2">
            <p>Bu uygulama MEB 2024 Türkiye Yüzyılı Maarif Modeli kapsamında Ses Temelli Cümle Yöntemi ile tasarlanmıştır.</p>
            <p>Her ses 5 aşamada öğretilir: Sesi Fark Etme, Sesi Üretme, Hece Oluşturma, Kelime Okuma, Cümle Kurma.</p>
            <p>Kelime havuzları kümülatiftir: her aşamada SADECE o ana kadar öğretilmiş seslerle oluşturulabilen kelimeler kullanılır.</p>
            <p>1. Grup (A,N,E,T,İ,L) 6 haftalık derinlikli çalışma, 2. Grup 4 hafta, 3-5. Gruplar 2'şer hafta süre önerilir.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
