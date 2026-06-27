import React, { useCallback, useRef } from 'react';
import { useCanvas } from '../../hooks/useCanvas';

interface Petal {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number; rotationSpeed: number;
  size: number; opacity: number;
  color: string;
  wobble: number; wobbleSpeed: number;
  wobblePhase: number;
}

const PETAL_COLORS = ['#ffb6c1', '#ffabc0', '#ff85a1', '#f9d5e5', '#ffc6d3', '#e8b4b8', '#dda0dd'];

const PetalCanvas: React.FC<{ count?: number; mouseTrail?: boolean }> = ({
  count = 25,
  mouseTrail = false,
}) => {
  const petalsRef = useRef<Petal[]>([]);
  const mouseRef = useRef({ x: -100, y: -100, active: false });
  const lastSpawnRef = useRef(0);

  const spawnPetal = (width: number, x?: number, y?: number): Petal => ({
    x: x ?? Math.random() * width,
    y: y ?? -20,
    vx: (Math.random() - 0.5) * 40,
    vy: Math.random() * 40 + 20,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 4,
    size: Math.random() * 8 + 5,
    opacity: Math.random() * 0.6 + 0.4,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    wobble: Math.random() * 30,
    wobbleSpeed: Math.random() * 2 + 1,
    wobblePhase: Math.random() * Math.PI * 2,
  });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => {
      // Spawn new petals from top
      if (petalsRef.current.length < count && Math.random() < 0.15) {
        petalsRef.current.push(spawnPetal(width));
      }

      // Mouse trail petals
      if (mouseTrail && mouseRef.current.active) {
        const now = performance.now();
        if (now - lastSpawnRef.current > 80) {
          lastSpawnRef.current = now;
          for (let i = 0; i < 2; i++) {
            petalsRef.current.push(spawnPetal(
              width,
              mouseRef.current.x + (Math.random() - 0.5) * 30,
              mouseRef.current.y + (Math.random() - 0.5) * 30,
            ));
          }
        }
      }

      petalsRef.current = petalsRef.current.filter((p) => {
        p.wobblePhase += delta * p.wobbleSpeed;
        p.x += p.vx * delta + Math.sin(p.wobblePhase) * p.wobble * delta;
        p.y += p.vy * delta;
        p.rotation += p.rotationSpeed * delta;
        p.opacity -= delta * 0.05;

        if (p.y > height + 30 || p.opacity <= 0) return false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);

        // Draw elliptical petal
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.fill();

        // Petal vein
        ctx.beginPath();
        ctx.moveTo(-p.size * 0.7, 0);
        ctx.lineTo(p.size * 0.7, 0);
        ctx.strokeStyle = `rgba(255,255,255,0.3)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
        return true;
      });
    },
    [count, mouseTrail]
  );

  const canvasRef = useCanvas(draw, [count, mouseTrail]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
  }, []);

  React.useEffect(() => {
    if (!mouseTrail) return;
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseTrail, handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 3,
      }}
    />
  );
};

export default PetalCanvas;
