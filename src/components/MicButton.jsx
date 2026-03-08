import React from 'react';

export default function MicButton({ isListening, disabled, onPress, size = 'medium', color = '#EF4444' }) {
  const sz = { small: 'w-14 h-14', medium: 'w-18 h-18', large: 'w-20 h-20' }[size] || 'w-18 h-18';
  return (
    <button onClick={onPress} disabled={disabled} aria-label={isListening ? 'Durdur' : 'Konuş'}
      className={`relative rounded-full flex items-center justify-center transition-all duration-200 ${sz}
        ${disabled ? 'opacity-40 cursor-not-allowed bg-gray-600' : isListening ? 'mic-pulse scale-110' : 'bg-white/20 hover:bg-white/30 hover:scale-105 active:scale-95'}`}
      style={isListening && !disabled ? { backgroundColor: color } : {}}>
      {isListening && !disabled && <>
        <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{backgroundColor:color}} />
        <div className="absolute -inset-2 rounded-full animate-pulse opacity-10" style={{backgroundColor:color}} />
      </>}
      {isListening ? (
        <div className="sound-wave text-white"><span/><span/><span/><span/><span/></div>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
      )}
    </button>
  );
}
