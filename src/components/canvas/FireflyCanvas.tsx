import React, { useCallback, useRef } from 'react';
import { useCanvas } from '../../hooks/useCanvas';

interface Firefly {
  x: number; y: number;
  vx: number; vy: number;
  opacity: number; phase: number;
  speed: number;
  r: number;
  // Control points for bezier-like movement
  targetX: number; targetY: number;
}

const FireflyCanvas: React.FC<{ count?: number }> = ({ count = 40 }) => {
  const firefliesRef = useRef<Firefly[]>([]);
  const initializedRef = useRef(false);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => {
      // Initialize once
      if (!initializedRef.current || firefliesRef.current.length !== count) {
        firefliesRef.current = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: height * 0.3 + Math.random() * height * 0.6,
          vx: (Math.random() - 0.5) * 30,
          vy: (Math.random() - 0.5) * 30,
          opacity: Math.random(),
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.8 + 0.3,
          r: Math.random() * 2.5 + 1,
          targetX: Math.random() * width,
          targetY: height * 0.3 + Math.random() * height * 0.6,
        }));
        initializedRef.current = true;
      }

      firefliesRef.current.forEach((ff) => {
        ff.phase += delta * ff.speed;

        // Organic steering toward target
        const dx = ff.targetX - ff.x;
        const dy = ff.targetY - ff.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
          ff.targetX = Math.random() * width;
          ff.targetY = height * 0.3 + Math.random() * height * 0.65;
        }

        ff.vx += (dx / dist) * 15 * delta;
        ff.vy += (dy / dist) * 15 * delta;

        // Dampen velocity
        ff.vx *= 0.96;
        ff.vy *= 0.96;

        // Clamp speed
        const spd = Math.sqrt(ff.vx ** 2 + ff.vy ** 2);
        if (spd > 40) {
          ff.vx = (ff.vx / spd) * 40;
          ff.vy = (ff.vy / spd) * 40;
        }

        ff.x += ff.vx * delta;
        ff.y += ff.vy * delta;

        // Wrap edges
        if (ff.x < 0) ff.x = width;
        if (ff.x > width) ff.x = 0;
        if (ff.y < height * 0.2) ff.y = height * 0.2;
        if (ff.y > height) ff.y = height * 0.95;

        const alpha = 0.2 + 0.8 * Math.abs(Math.sin(ff.phase));

        // Glow trail
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.r * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.r * 3);
        grad.addColorStop(0, `rgba(170, 255, 85, ${alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(170, 255, 85, 0)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 255, 120, ${alpha})`;
        ctx.fill();
      });
    },
    [count]
  );

  const canvasRef = useCanvas(draw, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 2,
      }}
    />
  );
};

export default FireflyCanvas;
