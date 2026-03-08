import React, { useState } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import ParticleField from '../components/ParticleField';

const TEACHER_PIN = '1234'; // Varsayılan PIN

export default function RoleScreen() {
  const { setScreen } = useGameStore();
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleStudent = () => {
    setScreen('welcome');
  };

  const handleTeacher = () => {
    setShowPin(true);
  };

  const handlePinSubmit = () => {
    if (pin === TEACHER_PIN) {
      setScreen('teacher');
    } else {
      setPinError(true);
      setPin('');
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handlePinKey = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          if (newPin === TEACHER_PIN) {
            setScreen('teacher');
          } else {
            setPinError(true);
            setPin('');
            setTimeout(() => setPinError(false), 2000);
          }
        }, 300);
      }
    }
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-indigo-950 via-purple-900 to-violet-800 flex flex-col items-center justify-center overflow-hidden">
      <ParticleField color="#FFD700" count={20} />

      {!showPin ? (
        // ─── Rol Seçimi ───
        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6 animate-float">⭐</div>
          <h1 className="font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 mb-2">
            Yıldız Ülkesi
          </h1>
          <p className="font-body text-lg text-purple-200 mb-10">Kim olarak giriş yapıyorsun?</p>

          <div className="flex flex-col gap-4 w-72 mx-auto">
            <button
              onClick={handleStudent}
              className="px-8 py-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl font-display text-2xl font-bold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-4xl block mb-1">🎒</span>
              Öğrenciyim
            </button>

            <button
              onClick={handleTeacher}
              className="px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl font-display text-2xl font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-4xl block mb-1">👩‍🏫</span>
              Öğretmenim
            </button>
          </div>
        </div>
      ) : (
        // ─── Öğretmen PIN Girişi ───
        <div className="relative z-10 text-center">
          <button
            onClick={() => { setShowPin(false); setPin(''); setPinError(false); }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 text-white/50 hover:text-white font-body text-sm underline"
          >
            ← Geri
          </button>

          <div className="text-5xl mb-4">👩‍🏫</div>
          <h2 className="font-display text-2xl text-white font-bold mb-2">Öğretmen Girişi</h2>
          <p className="font-body text-sm text-purple-300 mb-6">4 haneli PIN kodunu gir</p>

          {/* PIN dots */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full transition-all duration-200 ${
                  pinError
                    ? 'bg-red-500 animate-wiggle'
                    : i < pin.length
                      ? 'bg-amber-400 scale-110'
                      : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {pinError && (
            <p className="font-body text-sm text-red-400 mb-4">Yanlış PIN. Tekrar dene.</p>
          )}

          {/* Number pad */}
          <div className="grid grid-cols-3 gap-3 w-64 mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((key, i) => {
              if (key === null) return <div key={i} />;
              if (key === 'del') {
                return (
                  <button
                    key={i}
                    onClick={() => setPin(pin.slice(0, -1))}
                    className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-display text-lg transition-all active:scale-90"
                  >
                    ←
                  </button>
                );
              }
              return (
                <button
                  key={i}
                  onClick={() => handlePinKey(String(key))}
                  className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-display text-2xl font-bold transition-all active:scale-90 hover:scale-105"
                >
                  {key}
                </button>
              );
            })}
          </div>

          <p className="font-body text-xs text-purple-400/50 mt-6">Varsayılan PIN: 1234</p>
        </div>
      )}
    </div>
  );
}
