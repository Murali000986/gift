import React, { useCallback, useRef } from 'react';
import { useCanvas } from '../../hooks/useCanvas';

interface Butterfly {
  x: number; y: number;
  vx: number; vy: number;
  targetX: number; targetY: number;
  wingPhase: number; wingSpeed: number;
  color1: string; color2: string;
  size: number;
  opacity: number;
}

const COLORS = [
  ['#ff69b4', '#da70d6'],
  ['#da70d6', '#9370db'],
  ['#ff85a1', '#ffb6c1'],
  ['#87ceeb', '#b0e2ff'],
  ['#ffd700', '#ffb347'],
  ['#98fb98', '#90ee90'],
];

const ButterflyCanvas: React.FC<{ count?: number }> = ({ count = 8 }) => {
  const butterfliesRef = useRef<Butterfly[]>([]);
  const initializedRef = useRef(false);

  const makeButterfly = (width: number, height: number): Butterfly => {
    const [c1, c2] = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * width,
      y: Math.random() * height * 0.8,
      vx: (Math.random() - 0.5) * 60,
      vy: (Math.random() - 0.5) * 60,
      targetX: Math.random() * width,
      targetY: Math.random() * height * 0.8,
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: Math.random() * 4 + 3,
      color1: c1,
      color2: c2,
      size: Math.random() * 12 + 8,
      opacity: Math.random() * 0.5 + 0.5,
    };
  };

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => {
      if (!initializedRef.current || butterfliesRef.current.length !== count) {
        butterfliesRef.current = Array.from({ length: count }, () => makeButterfly(width, height));
        initializedRef.current = true;
      }

      butterfliesRef.current.forEach((bf) => {
        bf.wingPhase += delta * bf.wingSpeed;

        // Steering
        const dx = bf.targetX - bf.x;
        const dy = bf.targetY - bf.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 40) {
          bf.targetX = Math.random() * width;
          bf.targetY = 50 + Math.random() * height * 0.75;
        }

        const steer = 40;
        bf.vx += (dx / (dist + 1)) * steer * delta;
        bf.vy += (dy / (dist + 1)) * steer * delta;
        bf.vx *= 0.95;
        bf.vy *= 0.95;

        const spd = Math.sqrt(bf.vx ** 2 + bf.vy ** 2);
        const maxSpd = 70;
        if (spd > maxSpd) {
          bf.vx = (bf.vx / spd) * maxSpd;
          bf.vy = (bf.vy / spd) * maxSpd;
        }

        bf.x += bf.vx * delta;
        bf.y += bf.vy * delta;

        // Wrap
        if (bf.x < -50) bf.x = width + 50;
        if (bf.x > width + 50) bf.x = -50;
        if (bf.y < 0) bf.y = 10;
        if (bf.y > height) bf.y = height - 10;

        // Wing flap scale: 1 = open, 0 = closed
        const wingScale = Math.abs(Math.sin(bf.wingPhase));

        ctx.save();
        ctx.translate(bf.x, bf.y);
        ctx.globalAlpha = bf.opacity;

        // Draw wings
        const drawWing = (side: number, color: string) => {
          ctx.save();
          ctx.scale(side * wingScale, 1);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            bf.size * 1.5, -bf.size,
            bf.size * 2.2, -bf.size * 0.3,
            bf.size * 1.8, bf.size * 0.5
          );
          ctx.bezierCurveTo(bf.size, bf.size * 1.2, 0, bf.size * 0.5, 0, 0);
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.fill();

          // Lower wing
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            bf.size, bf.size * 0.8,
            bf.size * 1.5, bf.size * 1.5,
            bf.size * 0.8, bf.size * 1.8
          );
          ctx.bezierCurveTo(0, bf.size * 2, 0, bf.size * 1, 0, 0);
          ctx.fillStyle = color + 'aa';
          ctx.fill();
          ctx.restore();
        };

        drawWing(1, bf.color1);
        drawWing(-1, bf.color2);

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.5, bf.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#2d1b4e';
        ctx.fill();

        ctx.restore();
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
        pointerEvents: 'none', zIndex: 4,
      }}
    />
  );
};

export default ButterflyCanvas;
