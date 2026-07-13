"use client";

import { useEffect, useRef } from "react";

interface ParticlesProps {
  count?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
  className?: string;
  /** 0-1 global opacity multiplier, can be driven live via CSS var if needed. */
  opacity?: number;
}

/**
 * Lightweight canvas particle field. Uses a single rAF loop, respects DPR,
 * pauses when off-screen, and honours reduced-motion. Built for 60fps.
 */
export default function Particles({
  count = 40,
  color = "255,255,255",
  maxSize = 2.4,
  speed = 0.25,
  className = "",
  opacity = 1,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let running = true;

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let particles: P[] = [];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const seed = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: rand(-speed, speed),
        vy: rand(-speed, speed) - speed * 0.4,
        r: rand(0.5, maxSize),
        a: rand(0.15, 0.7),
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.a * opacity})`;
        ctx.fill();
      }
      if (running && !reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    if (!reduce) {
      raf = requestAnimationFrame(draw);
    } else {
      draw(); // single static frame
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    // Pause when scrolled out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !reduce) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [count, color, maxSize, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
