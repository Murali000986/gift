import { useEffect, useRef, useCallback } from 'react';

export function useCanvas(
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => void,
  deps: React.DependencyList = []
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1); // cap at 100ms
      lastTimeRef.current = timestamp;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      draw(ctx, width, height, delta);

      rafRef.current = requestAnimationFrame(animate);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return canvasRef;
}
