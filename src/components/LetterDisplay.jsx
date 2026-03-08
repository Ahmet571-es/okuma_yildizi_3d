import React from 'react';

export default function LetterDisplay({ letter, sound, mouth, accentColor }) {
  return (
    <div className="relative z-10 flex items-center justify-center py-3">
      <div className="relative flex items-center gap-4 rounded-2xl px-6 py-3"
        style={{ background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`, border: `2px solid ${accentColor}40` }}>
        {/* Büyük harf */}
        <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
          style={{ background: `${accentColor}15`, boxShadow: `0 0 20px ${accentColor}20` }}>
          <span className="font-display text-4xl font-extrabold" style={{color:accentColor}}>{letter}</span>
          <span className="font-body text-xs opacity-70" style={{color:accentColor}}>sesi: {sound}</span>
        </div>
        {/* Ağız pozisyonu ipucu */}
        <div className="max-w-[200px]">
          <p className="font-body text-xs text-white/60 leading-snug">{mouth}</p>
        </div>
      </div>
    </div>
  );
}
