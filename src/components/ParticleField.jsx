import React, { useMemo } from 'react';

export default function ParticleField({ color = '#FFD700', count = 20 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i, size: Math.random()*8+3, x: Math.random()*100, y: Math.random()*100,
      delay: Math.random()*5, duration: Math.random()*4+3, opacity: Math.random()*0.3+0.1,
    })), [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div key={p.id} className="particle"
          style={{ width:p.size+'px', height:p.size+'px', left:p.x+'%', top:p.y+'%',
            backgroundColor:color, opacity:p.opacity, animationDelay:p.delay+'s', animationDuration:p.duration+'s' }} />
      ))}
    </div>
  );
}
