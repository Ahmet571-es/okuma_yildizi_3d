import React from 'react';
import { PHASE_LABELS } from '../config/curriculum';

export default function PhaseIndicator({ phases, currentPhase, phaseScores, accentColor }) {
  const currentIdx = phases.indexOf(currentPhase);

  return (
    <div className="relative z-10 px-4 py-2">
      <div className="flex items-center justify-center gap-1">
        {phases.map((phase, i) => {
          const isActive = i === currentIdx;
          const isDone = i < currentIdx || phaseScores[phase] !== undefined;
          const score = phaseScores[phase];

          return (
            <div key={phase} className="flex items-center">
              <div className={`flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                {/* Dot */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                  ${isDone ? 'bg-amber-400 text-amber-900' :
                    isActive ? 'ring-2 ring-offset-1 ring-offset-transparent' : 'bg-white/10 text-white/30'}`}
                  style={isActive ? { backgroundColor: accentColor+'60', ringColor: accentColor, color: '#fff' } : {}}>
                  {isDone ? (score >= 3 ? '★' : '✓') : i + 1}
                </div>
                {/* Label */}
                <span className={`text-[9px] font-body mt-0.5 whitespace-nowrap
                  ${isActive ? 'text-white font-bold' : isDone ? 'text-amber-300/70' : 'text-white/20'}`}>
                  {PHASE_LABELS[phase]?.split(' ').slice(-1)[0]}
                </span>
              </div>
              {/* Connector */}
              {i < phases.length - 1 && (
                <div className={`w-6 h-0.5 mx-0.5 transition-all ${isDone ? 'bg-amber-400/50' : 'bg-white/10'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
