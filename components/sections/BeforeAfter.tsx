"use client";

import { useCallback, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

/**
 * Satisfying before/after comparison slider. Drag the handle (or use arrow
 * keys) to wipe between a neglected and a freshly serviced purifier.
 */
export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, p)));
  }, []);

  const onDown = (clientX: number) => {
    dragging.current = true;
    setFromClientX(clientX);
  };

  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <SectionHeading
          eyebrow="See The Change"
          title="Before vs After"
          subtitle="Drag to reveal the transformation a single RO Care India service delivers."
          dark
        />

        <Reveal>
          <div
            ref={containerRef}
            className="relative mx-auto mt-16 aspect-[16/9] w-full max-w-4xl select-none overflow-hidden rounded-3xl border border-white/10 shadow-lift"
            onMouseDown={(e) => onDown(e.clientX)}
            onMouseMove={(e) => dragging.current && setFromClientX(e.clientX)}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchStart={(e) => onDown(e.touches[0].clientX)}
            onTouchMove={(e) => setFromClientX(e.touches[0].clientX)}
          >
            {/* AFTER (clean) — base layer */}
            <div className="absolute inset-0">
              <PurifierArt clean />
              <Badge className="right-5" label="After" tone="clean" />
            </div>

            {/* BEFORE (dirty) — clipped layer */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <PurifierArt clean={false} />
              <Badge className="left-5" label="Before" tone="dirty" />
            </div>

            {/* Handle */}
            <div
              className="absolute inset-y-0 z-10 w-px bg-white/80"
              style={{ left: `${pos}%` }}
            >
              <button
                aria-label="Comparison slider"
                aria-valuenow={Math.round(pos)}
                aria-valuemin={0}
                aria-valuemax={100}
                role="slider"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
                  if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
                }}
                className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-brand-ink/70 backdrop-blur-md transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
                </svg>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Badge({
  label,
  tone,
  className = "",
}: {
  label: string;
  tone: "clean" | "dirty";
  className?: string;
}) {
  return (
    <span
      className={`absolute top-5 z-[5] rounded-full border px-3 py-1 text-xs font-medium tracking-wide backdrop-blur ${className} ${
        tone === "clean"
          ? "border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow"
          : "border-amber-500/40 bg-amber-900/20 text-amber-300/90"
      }`}
    >
      {label}
    </span>
  );
}

/** Abstract, tasteful purifier art rendered with CSS — clean vs neglected. */
function PurifierArt({ clean }: { clean: boolean }) {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background: clean
          ? "radial-gradient(80% 80% at 50% 20%, #0b2a5e, #061423)"
          : "radial-gradient(80% 80% at 50% 20%, #22261b, #0b0f0a)",
      }}
    >
      <div className="absolute left-1/2 top-1/2 h-3/5 w-1/4 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-full w-full rounded-3xl border"
          style={{
            borderColor: clean ? "rgba(95,211,255,0.4)" : "rgba(120,110,70,0.5)",
            background: clean
              ? "linear-gradient(180deg, rgba(95,211,255,0.18), rgba(0,92,255,0.22))"
              : "linear-gradient(180deg, rgba(90,80,40,0.35), rgba(40,45,30,0.6))",
            boxShadow: clean
              ? "0 0 50px -10px rgba(95,211,255,0.5)"
              : "inset 0 0 40px rgba(0,0,0,0.6)",
          }}
        />
      </div>
      {/* copper coil */}
      <div
        className="absolute bottom-[22%] left-1/2 h-12 w-12 -translate-x-1/2 rounded-full border-4"
        style={{ borderColor: clean ? "rgba(251,191,36,0.8)" : "rgba(90,70,40,0.6)" }}
      />
    </div>
  );
}
