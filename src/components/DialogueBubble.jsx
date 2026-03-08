import React from 'react';

export default function DialogueBubble({ type, emoji, name, text, isSpeaking, color }) {
  if (type === 'mascot') {
    return (
      <div className="flex items-start gap-3 animate-pop">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-lg ${isSpeaking ? 'mascot-talk' : ''}`}
          style={{ backgroundColor: color+'30', borderColor: color, borderWidth: 2 }}>
          {emoji}
        </div>
        <div className="flex-1 max-w-[80%]">
          <p className="text-xs font-display mb-1" style={{color}}>{name}</p>
          <div className="glass rounded-2xl rounded-tl-sm px-4 py-3" style={{borderColor:color+'30',borderWidth:1}}>
            <p className="font-body text-base text-white leading-relaxed">{text}</p>
            {isSpeaking && <div className="sound-wave mt-2" style={{color}}><span/><span/><span/><span/><span/></div>}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 justify-end animate-pop">
      <div className="max-w-[75%]">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-tr-sm px-4 py-3 border border-white/10">
          <p className="font-body text-base text-white leading-relaxed">{text}</p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-lg shrink-0">🗣️</div>
    </div>
  );
}
