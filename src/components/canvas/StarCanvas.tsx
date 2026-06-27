import React, { useCallback } from 'react';
import { useCanvas } from '../../hooks/useCanvas';

interface Star {
  x: number; y: number; r: number;
  opacity: number; speed: number; phase: number;
}

let stars: Star[] = [];

const StarCanvas: React.FC<{ count?: number }> = ({ count = 200 }) => {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => {
      // Initialize stars
      if (stars.length !== count) {
        stars = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height * 0.75,
          r: Math.random() * 1.8 + 0.4,
          opacity: Math.random(),
          speed: Math.random() * 1.5 + 0.5,
          phase: Math.random() * Math.PI * 2,
        }));
      }

      stars.forEach((star) => {
        star.phase += delta * star.speed;
        const o = 0.3 + 0.7 * Math.abs(Math.sin(star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 220, ${o})`;
        ctx.shadowBlur = star.r > 1.3 ? 6 : 3;
        ctx.shadowColor = '#fff8dc';
        ctx.fill();
        ctx.shadowBlur = 0;
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
        pointerEvents: 'none', zIndex: 1,
      }}
    />
  );
};

export default StarCanvas;
