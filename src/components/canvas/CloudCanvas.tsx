import React, { useCallback, useRef } from 'react';
import { useCanvas } from '../../hooks/useCanvas';

interface Cloud {
  x: number; y: number;
  speed: number; scale: number;
  opacity: number; layer: number;
}

const CloudCanvas: React.FC = () => {
  const cloudsRef = useRef<Cloud[]>([]);
  const initializedRef = useRef(false);

  const makeCloud = (width: number, height: number, startLeft = false): Cloud => {
    const layer = Math.floor(Math.random() * 3); // 0=far,1=mid,2=near
    return {
      x: startLeft ? -300 : Math.random() * width,
      y: height * 0.05 + Math.random() * height * 0.35,
      speed: (layer + 1) * 10 + Math.random() * 10,
      scale: 0.5 + layer * 0.3 + Math.random() * 0.3,
      opacity: 0.1 + layer * 0.08 + Math.random() * 0.07,
      layer,
    };
  };

  const drawCloudShape = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, opacity: number) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#c8d8f0';
    ctx.shadowColor = '#a0b8e0';
    ctx.shadowBlur = 15;

    const circles = [
      { dx: 0, dy: 0, r: 40 * scale },
      { dx: 35 * scale, dy: -15 * scale, r: 32 * scale },
      { dx: -35 * scale, dy: -10 * scale, r: 28 * scale },
      { dx: 65 * scale, dy: 5 * scale, r: 25 * scale },
      { dx: -60 * scale, dy: 5 * scale, r: 22 * scale },
      { dx: 100 * scale, dy: 10 * scale, r: 20 * scale },
    ];

    circles.forEach(({ dx, dy, r }) => {
      ctx.beginPath();
      ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => {
      if (!initializedRef.current) {
        cloudsRef.current = Array.from({ length: 8 }, () => makeCloud(width, height, false));
        initializedRef.current = true;
      }

      // Sort by layer for correct rendering order
      cloudsRef.current.sort((a, b) => a.layer - b.layer);

      cloudsRef.current.forEach((cloud) => {
        cloud.x += cloud.speed * delta;
        if (cloud.x > width + 250) {
          // Reset to left
          cloud.x = -300;
          cloud.y = height * 0.05 + Math.random() * height * 0.35;
        }

        drawCloudShape(ctx, cloud.x, cloud.y, cloud.scale, cloud.opacity);
      });
    },
    []
  );

  const canvasRef = useCanvas(draw, []);

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

export default CloudCanvas;
