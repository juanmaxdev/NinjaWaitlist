'use client';

import React, { useEffect, useRef } from 'react';

type RainOverlayProps = {
  active?: boolean;
  density?: number;
  speed?: number;
  color?: string;
  dropWidth?: number;
  maxDropLength?: number;
  zIndex?: number;
  showLetters?: boolean;
  targetWord?: string;
  decoyLetters?: string[];
  letterColor?: string;
  letterSize?: number;
  letterDuration?: number
  onFinish?: () => void;
};

type Drop = {
  x: number;
  y: number;
  length: number;
  speed: number;
  thickness: number;
  opacity: number;
  wind: number;
};

type LetterDrop = {
  x: number;
  y: number;
  letter: string;
  speed: number;
  opacity: number;
  wind: number;
  isTarget: boolean;
};

export default function RainOverlay({
  active = false,
  density = 0.6,
  speed = 1,
  color = 'rgba(255,255,255,0.18)',
  dropWidth = 1,
  maxDropLength = 20,
  zIndex = 0,
  showLetters = false,
  targetWord = 'shinobi',
  decoyLetters = ['a', 'e', 'r', 't', 'y', 'u', 'p', 'd', 'f', 'g', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'm', 'q', 'w'],
  letterColor = '#D6DE21',
  letterSize = 16,
  letterDuration = 30,
  onFinish,
}: RainOverlayProps) {
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dropsRef = useRef<Drop[]>([]);
  const letterDropsRef = useRef<LetterDrop[]>([]);
  const letterStartTimeRef = useRef<number | null>(null);
  const letterActiveRef = useRef<boolean>(false);
  const letterTimeoutRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rainStoppedRef = useRef<boolean>(false);
  const finishCalledRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      ctxRef.current = canvas.getContext('2d');
    } catch (e) {
      ctxRef.current = null;
    }

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const dropsCount = Math.max(6, Math.round((canvas.width / 1000) * (density * 100)));
      dropsRef.current = Array.from({ length: dropsCount }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 6 + Math.random() * maxDropLength,
        speed: (1 + Math.random() * 1.5) * speed,
        thickness: dropWidth * (0.6 + Math.random() * 1.4),
        opacity: 0.08 + Math.random() * 0.3,
        wind: -0.2 + Math.random() * 0.4,
      }));

      if (showLetters) {
        if (letterTimeoutRef.current) {
          clearTimeout(letterTimeoutRef.current);
          letterTimeoutRef.current = null;
        }
        const letterCount = Math.max(5, Math.round((canvas.width / 1000) * (density * 8)));
        letterDropsRef.current = Array.from({ length: letterCount }).map(() => {
          const isTargetLetter = Math.random() < 0.3;
          const availableTargetLetters = targetWord.split('');
          const letter = isTargetLetter
            ? availableTargetLetters[Math.floor(Math.random() * availableTargetLetters.length)]
            : decoyLetters[Math.floor(Math.random() * decoyLetters.length)];

          return {
            x: Math.random() * canvas.width,
            y: -Math.random() * canvas.height,
            letter: letter.toUpperCase(),
            speed: (0.5 + Math.random() * 1) * speed,
            opacity: 0.7 + Math.random() * 0.3,
            wind: -0.1 + Math.random() * 0.2,
            isTarget: targetWord.toLowerCase().includes(letter.toLowerCase()),
          };
        });
        letterStartTimeRef.current = Date.now();
        letterActiveRef.current = true;
        rainStoppedRef.current = false;
        letterTimeoutRef.current = window.setTimeout(() => {
          rainStoppedRef.current = true;
          if (!finishCalledRef.current) {
            finishCalledRef.current = true;
            onFinish?.();
          }
        }, (letterDuration || 0) * 1000) as unknown as number;
      }
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);

    const render = () => {
      const ctx = ctxRef.current;
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (active) {
        if (ctx) {
          dropsRef.current.forEach((d) => {
            const x2 = d.x + d.wind * d.length;
            const y2 = d.y + d.length;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = d.thickness;
            const grad = ctx.createLinearGradient(d.x, d.y, x2, y2);
            grad.addColorStop(0, color);
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.strokeStyle = grad;
            ctx.stroke();
            d.x += d.wind * d.speed;
            d.y += d.speed * d.speed * 0.8;
            if (d.y > canvas.height + d.length || d.x < -50 || d.x > canvas.width + 50) {
              if (!rainStoppedRef.current) {
                d.x = Math.random() * canvas.width;
                d.y = -10 - Math.random() * 100;
                d.length = 6 + Math.random() * maxDropLength;
                d.speed = (1 + Math.random() * 1.5) * speed;
                d.thickness = dropWidth * (0.6 + Math.random() * 1.4);
                d.opacity = 0.08 + Math.random() * 0.3;
                d.wind = -0.2 + Math.random() * 0.4;
              }
            }
          });

          if (showLetters && letterStartTimeRef.current) {
            const elapsed = (Date.now() - letterStartTimeRef.current) / 1000;
            letterActiveRef.current = elapsed < letterDuration;

            if (elapsed >= letterDuration) {
              rainStoppedRef.current = true;
              if (!finishCalledRef.current) {
                finishCalledRef.current = true;
                onFinish?.();
              }
            }
          }

          if (showLetters && letterActiveRef.current) {
            ctx.font = `bold ${letterSize}px 'Courier New', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            letterDropsRef.current.forEach((letter) => {
              ctx.globalAlpha = letter.opacity;

              ctx.fillStyle = letter.isTarget ? letterColor : '#ff4444';

              ctx.shadowColor = letter.isTarget ? letterColor : '#ff4444';
              ctx.shadowBlur = 1;

              ctx.fillText(letter.letter, letter.x, letter.y);

              ctx.shadowBlur = 0;

              letter.x += letter.wind * letter.speed;
              letter.y += letter.speed * 2.5;

              if (letter.y > canvas.height + 20 || letter.x < -20 || letter.x > canvas.width + 20) {
                if (letterActiveRef.current) {
                  const isTargetLetter = Math.random() < 0.3;
                  const availableTargetLetters = targetWord.split('');
                  const newLetter = isTargetLetter
                    ? availableTargetLetters[Math.floor(Math.random() * availableTargetLetters.length)]
                    : decoyLetters[Math.floor(Math.random() * decoyLetters.length)];

                  letter.x = Math.random() * canvas.width;
                  letter.y = -20 - Math.random() * 50;
                  letter.letter = newLetter.toUpperCase();
                  letter.speed = (0.5 + Math.random() * 1) * speed;
                  letter.opacity = 0.7 + Math.random() * 0.3;
                  letter.wind = -0.1 + Math.random() * 0.2;
                  letter.isTarget = targetWord.toLowerCase().includes(newLetter.toLowerCase());
                }
              }
            });

            ctx.globalAlpha = 1;
          }
  } else {
          if (showLetters && letterStartTimeRef.current) {
            const elapsed = (Date.now() - letterStartTimeRef.current) / 1000;
            letterActiveRef.current = elapsed < letterDuration;
            if (elapsed >= letterDuration) {
              rainStoppedRef.current = true;
              if (!finishCalledRef.current) {
                finishCalledRef.current = true;
                onFinish?.();
              }
            }
          }
        }
      }
      if (ctx && active) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (letterTimeoutRef.current) clearTimeout(letterTimeoutRef.current);
      observer.disconnect();
    };
  }, [
    active,
    density,
    speed,
    color,
    dropWidth,
    maxDropLength,
    showLetters,
    targetWord,
    decoyLetters,
    letterColor,
    letterSize,
    letterDuration,
  ]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="rain-overlay"
      aria-hidden
      className="absolute inset-0"
      style={{
        width: '100%',
        height: '100%',
        zIndex,
      }}
    />
  );
}
