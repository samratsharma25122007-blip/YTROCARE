"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * The centrepiece. A pinned, full-viewport section whose scroll position
 * scrubs a pre-rendered IMAGE SEQUENCE (extracted from the RO video) drawn to
 * a canvas — forward on scroll-down, backward on scroll-up, holding on the
 * final frame at the end. Drawing a decoded image is instant, so unlike
 * seeking a <video> this never lags regardless of scroll speed. An elegant
 * editorial headline sits on the left over a soft scrim.
 */

const FRAME_COUNT = 121;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const frameUrl = (i: number) =>
  `${BASE}/frames/f_${String(i).padStart(3, "0")}.webp`;

export default function ScrollVideoStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [framesOk, setFramesOk] = useState(true);

  // Scroll-derived target progress [0,1]; the rAF loop eases toward it.
  const target = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Preload the frame images ---
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loadedCount = 0;
    let firstFailed = false;

    const drawFrame = (idx: number) => {
      const img = images[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      // "cover" fit — fill the canvas, cropping the overflow.
      let dw: number, dh: number;
      if (cr > ir) {
        dw = cw;
        dh = cw / ir;
      } else {
        dh = ch;
        dw = ch * ir;
      }
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    // Nearest already-loaded frame, so fast scrubbing before full preload
    // never shows a blank gap.
    const nearestLoaded = (idx: number) => {
      if (images[idx]?.complete && images[idx]?.naturalWidth) return idx;
      for (let d = 1; d < FRAME_COUNT; d++) {
        const lo = idx - d;
        const hi = idx + d;
        if (lo >= 0 && images[lo]?.complete && images[lo]?.naturalWidth) return lo;
        if (hi < FRAME_COUNT && images[hi]?.complete && images[hi]?.naturalWidth)
          return hi;
      }
      return -1;
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loadedCount++;
        // Paint the very first frame as soon as it arrives so the purifier is
        // visible immediately at the top of the section.
        if (i === 0) drawFrame(0);
      };
      img.onerror = () => {
        if (i === 0 && !firstFailed) {
          firstFailed = true;
          setFramesOk(false);
        }
      };
      img.src = frameUrl(i);
      images[i] = img;
    }

    // --- Canvas sizing (device-pixel crisp, "cover") ---
    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      drawFrame(lastDrawn >= 0 ? lastDrawn : 0);
    };

    // --- Smooth playback: ease displayed progress toward the scroll target.
    // Drawing an image is instant, so this smoothing adds silkiness WITHOUT
    // any decode lag — the frame is always locked to the scroll.
    let displayed = 0;
    let lastDrawn = -1;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // Frame-rate-independent smoothing (~0.15s settle) — smooth yet tight.
      const k = 1 - Math.pow(0.0000009, dt);
      displayed += (target.current - displayed) * k;
      const idx = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, Math.round(displayed * (FRAME_COUNT - 1)))
      );
      if (idx !== lastDrawn) {
        const use = nearestLoaded(idx);
        if (use >= 0) {
          drawFrame(use);
          lastDrawn = idx;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    layout();
    raf = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(stage);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      // Light scrub keeps the scroll input itself buttery.
      scrub: 0.35,
      onUpdate: (self) => {
        target.current = self.progress;
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      st.kill();
    };
  }, [framesOk]);

  return (
    <section
      ref={sectionRef}
      id="story"
      // Fast: ~half a viewport-height of scrolling plays the whole sequence.
      className="relative h-[150vh] w-full"
      aria-label="Scroll-driven RO service animation"
    >
      {/* Pinned stage */}
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black"
      >
        {framesOk ? (
          <canvas ref={canvasRef} className="absolute inset-0 z-10 h-full w-full" />
        ) : (
          <div className="relative z-10 flex h-full w-full items-center justify-center bg-black">
            <AgeingPurifier />
          </div>
        )}

        {/* Left legibility scrim */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.72) 16%, rgba(0,0,0,0.34) 34%, transparent 52%)",
          }}
        />

        {/* Left-side editorial copy */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-30 flex max-w-[86%] items-center px-6 sm:max-w-[58%] md:max-w-[42%] md:px-12 lg:max-w-[34%] lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-25% 0px -25% 0px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ textShadow: "0 2px 22px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.6)" }}
          >
            <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.32em] text-cyan-glow">
              <span className="h-1 w-1 rounded-full bg-cyan-glow shadow-[0_0_10px_2px_rgba(95,211,255,0.7)]" />
              The Cost of Waiting
            </span>
            <h2 className="font-serif text-[1.9rem] leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.9rem]">
              Skip a service,
              <br />
              <span className="text-gradient-cyan italic">and it turns on you.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-white/65 sm:text-sm">
              Left unserviced, sediment chokes the RO membrane and your TDS
              creeps back up. Carbon exhausts, tanks grow biofilm, and the flow
              slows to a trickle. Water starts tasting flat and metallic — and
              the filters your family trusts quietly stop protecting them.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** CSS purifier fallback — only shown if the frame images fail to load. */
function AgeingPurifier() {
  return (
    <div className="relative">
      <div className="animate-float">
        <div className="relative h-72 w-52 overflow-hidden rounded-[2.2rem] border border-white/20 bg-gradient-to-b from-white to-[#e7eef8] shadow-[0_50px_100px_-30px_rgba(0,92,255,0.4)]">
          <div className="absolute left-1/2 top-7 h-11 w-28 -translate-x-1/2 rounded-lg bg-brand-ink/90">
            <div className="absolute left-1/2 top-1/2 h-1.5 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow/80" />
          </div>
          <div className="absolute inset-x-6 bottom-7 top-24 overflow-hidden rounded-xl bg-gradient-to-b from-cyan-glow/25 to-brand-blue/25" />
          <div className="absolute bottom-10 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full border-4 border-amber-400/40" />
        </div>
      </div>
      <div
        aria-hidden
        className="mx-auto mt-3 h-16 w-52 rounded-[50%] bg-brand-blue/10 blur-2xl"
      />
    </div>
  );
}
