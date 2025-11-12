"use client";
import { useEffect, useRef } from 'react';

export default function ArchitectureWireframe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let rotation = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawWireframe = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(20, 18, 17, 0.95)');
      gradient.addColorStop(1, 'rgba(30, 25, 22, 0.98)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Draw multiple buildings with perspective
      drawBuilding(ctx, -120, -80, 80, 200, rotation);
      drawBuilding(ctx, 0, -100, 100, 240, rotation);
      drawBuilding(ctx, 120, -60, 70, 180, rotation);

      // Draw connecting lines and grid
      drawConnectingGrid(ctx, -150, -150, 300, 300);

      ctx.restore();

      rotation += 0.003;
      animationId = requestAnimationFrame(drawWireframe);
    };

    const drawBuilding = (ctx, x, y, width, height, rot) => {
      const depth = 40;
      const color = `rgba(0, 217, 255, ${0.6 + Math.sin(rot + x) * 0.2})`;
      const accentColor = `rgba(100, 255, 200, ${0.4 + Math.cos(rot + y) * 0.2})`;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;

      // Front face
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.stroke();

      // Back face (perspective)
      ctx.beginPath();
      ctx.rect(x + depth, y - depth, width, height);
      ctx.stroke();

      // Connecting edges
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + depth, y - depth);
      ctx.moveTo(x + width, y);
      ctx.lineTo(x + width + depth, y - depth);
      ctx.moveTo(x, y + height);
      ctx.lineTo(x + depth, y + height - depth);
      ctx.moveTo(x + width, y + height);
      ctx.lineTo(x + width + depth, y + height - depth);
      ctx.stroke();

      // Windows grid
      const windowSize = 12;
      const windowGap = 18;
      ctx.strokeStyle = `rgba(0, 217, 255, 0.3)`;
      ctx.lineWidth = 0.8;

      for (let i = 0; i < Math.floor(width / windowGap); i++) {
        for (let j = 0; j < Math.floor(height / windowGap); j++) {
          const wx = x + i * windowGap + 5;
          const wy = y + j * windowGap + 5;
          ctx.beginPath();
          ctx.rect(wx, wy, windowSize, windowSize);
          ctx.stroke();
        }
      }
    };

    const drawConnectingGrid = (ctx, x, y, w, h) => {
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.15)';
      ctx.lineWidth = 0.5;

      const gridSize = 40;
      for (let i = 0; i <= w / gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * gridSize, y);
        ctx.lineTo(x + i * gridSize, y + h);
        ctx.stroke();
      }

      for (let i = 0; i <= h / gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y + i * gridSize);
        ctx.lineTo(x + w, y + i * gridSize);
        ctx.stroke();
      }

      // Diagonal accent lines
      ctx.strokeStyle = 'rgba(100, 255, 200, 0.1)';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y + h);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + w, y);
      ctx.lineTo(x, y + h);
      ctx.stroke();
    };

    drawWireframe();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="wireframe-canvas"
      role="img"
      aria-label="Animated 3D architecture wireframe visualization"
    />
  );
}

