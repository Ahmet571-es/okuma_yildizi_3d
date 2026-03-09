import React, { useRef, useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// Harf Yazma Bileşeni — Çocuk parmağıyla/mouse ile harfi çizer
// Büyük harf rehber olarak gösterilir, çocuk üzerinden geçer
// ═══════════════════════════════════════════════════════════════

export default function LetterTracing({ letter, accentColor, onComplete }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const totalPixelsRef = useRef(0);

  const CANVAS_SIZE = 280;
  const REQUIRED_STROKES = 2; // 2 kez çizince tamamlanır

  // ─── Canvas setup ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // High DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = CANVAS_SIZE + 'px';
    canvas.style.height = CANVAS_SIZE + 'px';
    ctx.scale(dpr, dpr);

    drawGuide(ctx);
  }, [letter]);

  // ─── Rehber harfi çiz ───
  const drawGuide = useCallback((ctx) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Arka plan
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.roundRect(0, 0, CANVAS_SIZE, CANVAS_SIZE, 20);
    ctx.fill();

    // Kılavuz çizgiler (defter çizgileri)
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    // Üst çizgi
    ctx.beginPath(); ctx.moveTo(20, CANVAS_SIZE * 0.25); ctx.lineTo(CANVAS_SIZE - 20, CANVAS_SIZE * 0.25); ctx.stroke();
    // Orta çizgi (noktalı)
    ctx.beginPath(); ctx.moveTo(20, CANVAS_SIZE * 0.5); ctx.lineTo(CANVAS_SIZE - 20, CANVAS_SIZE * 0.5); ctx.stroke();
    // Alt çizgi
    ctx.beginPath(); ctx.moveTo(20, CANVAS_SIZE * 0.75); ctx.lineTo(CANVAS_SIZE - 20, CANVAS_SIZE * 0.75); ctx.stroke();
    ctx.setLineDash([]);

    // Rehber harf (büyük, soluk)
    ctx.fillStyle = accentColor + '25';
    ctx.strokeStyle = accentColor + '40';
    ctx.lineWidth = 3;
    ctx.font = `bold ${CANVAS_SIZE * 0.6}px "Baloo 2", cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    ctx.strokeText(letter, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
  }, [letter, accentColor]);

  // ─── Çizim başlat ───
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: (touch.clientX - rect.left),
      y: (touch.clientY - rect.top),
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    lastPosRef.current = pos;
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const pos = getPos(e);

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = accentColor + '80';
    ctx.shadowBlur = 4;

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    ctx.restore();

    totalPixelsRef.current += Math.hypot(pos.x - lastPosRef.current.x, pos.y - lastPosRef.current.y);
    lastPosRef.current = pos;
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Minimum çizim kontrolü
    if (totalPixelsRef.current > 50) {
      const newCount = strokeCount + 1;
      setStrokeCount(newCount);

      if (newCount >= REQUIRED_STROKES) {
        setShowSuccess(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1500);
      }
    }
  };

  // ─── Temizle ───
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawGuide(ctx);
    totalPixelsRef.current = 0;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Başlık */}
      <p className="font-display text-lg text-white font-bold">
        {showSuccess ? 'Harika yazdın!' : `"${letter}" harfini yaz!`}
      </p>
      <p className="font-body text-xs text-white/50">
        Parmağınla veya mouse ile harfin üzerinden geç ({strokeCount}/{REQUIRED_STROKES})
      </p>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{ touchAction: 'none' }}
          className={`rounded-2xl border-2 cursor-crosshair transition-all ${
            showSuccess ? 'border-amber-400 shadow-lg shadow-amber-400/30' : 'border-white/20'
          }`}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />

        {/* Başarı overlay */}
        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
            <div className="text-6xl animate-pop">⭐</div>
          </div>
        )}
      </div>

      {/* Temizle butonu */}
      {!showSuccess && (
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-body text-white/60 hover:text-white transition-all"
        >
          Temizle
        </button>
      )}
    </div>
  );
}
