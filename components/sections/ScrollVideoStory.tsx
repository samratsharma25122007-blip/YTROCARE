"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { STORY_CAPTIONS, STORY_VIDEO_SRC } from "@/lib/data";
import Particles from "@/components/ui/Particles";

/**
 * The centrepiece. A pinned, full-viewport section whose scroll position
 * scrubs a rendered video frame-by-frame — forward on scroll-down, backward
 * on scroll-up. Captions cross-fade, the background evolves from bright white
 * to deep ink, and dust slowly appears. If the video asset isn't present yet,
 * a CSS "ageing purifier" carries the same story so the page never breaks.
 */
export default function ScrollVideoStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const grimeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [captionIndex, setCaptionIndex] = useState(0);
  const [videoOk, setVideoOk] = useState(true);

  // Live scroll progress shared between the rAF scrubber and ScrollTrigger.
  const progress = useRef(0);
  const targetTime = useRef(0);
  const duration = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const video = videoRef.current;

    // Interpolate the whole scene from a value in [0,1].
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

    const applyScene = (p: number) => {
      // Background: bright white -> deep ink.
      const r = Math.round(lerp(255, 4, p));
      const g = Math.round(lerp(255, 8, p));
      const b = Math.round(lerp(255, 14, p));
      stage.style.backgroundColor = `rgb(${r},${g},${b})`;

      // Blue glow fades as things get dirty.
      if (glowRef.current) glowRef.current.style.opacity = `${lerp(1, 0.12, p)}`;
      // Dust appears in the back half.
      if (dustRef.current)
        dustRef.current.style.opacity = `${clamp((p - 0.4) / 0.6)}`;
      // CSS fallback grime.
      if (grimeRef.current) grimeRef.current.style.opacity = `${clamp(p * 1.05)}`;

      // Caption index from progress.
      const idx = clamp(
        Math.floor(p * STORY_CAPTIONS.length),
        0,
        STORY_CAPTIONS.length - 1
      );
      setCaptionIndex((prev) => (prev === idx ? prev : idx));
    };

    // Smoothly scrub the video toward the scroll-derived target time.
    let raf = 0;
    const tick = () => {
      if (video && duration.current > 0) {
        const cur = video.currentTime;
        const diff = targetTime.current - cur;
        // Only seek when the gap is meaningful — avoids redundant seeks/jank.
        if (Math.abs(diff) > 0.01 && !video.seeking) {
          video.currentTime = cur + diff * 0.2;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        progress.current = p;
        targetTime.current = p * duration.current;
        applyScene(p);
      },
    });

    applyScene(0);

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
    };
  }, []);

  const onLoaded = () => {
    const v = videoRef.current;
    if (v && v.duration && isFinite(v.duration)) {
      duration.current = v.duration;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative h-[700vh] w-full"
      aria-label="The story of an unserviced RO"
    >
      {/* Pinned stage */}
      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Elegant blue lighting that fades out */}
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 20%, rgba(0,92,255,0.10), transparent 55%), radial-gradient(70% 60% at 50% 100%, rgba(95,211,255,0.16), transparent 60%)",
          }}
        />

        {/* The scroll-scrubbed video */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {videoOk && (
            <video
              ref={videoRef}
              className="max-h-[78vh] w-auto max-w-[92vw] object-contain"
              src={STORY_VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              disableRemotePlayback
              onLoadedMetadata={onLoaded}
              onError={() => setVideoOk(false)}
            />
          )}

          {/* CSS fallback purifier that "ages" — used when no video is present */}
          {!videoOk && <AgeingPurifier grimeRef={grimeRef} />}
        </div>

        {/* Floating dust that intensifies late in the story */}
        <div
          ref={dustRef}
          className="pointer-events-none absolute inset-0 z-20"
          style={{ opacity: 0 }}
        >
          <Particles count={70} color="150,160,175" maxSize={1.8} speed={0.12} />
        </div>

        {/* Dynamic captions */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[12%] z-30 flex justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.h2
              key={captionIndex}
              initial={{ opacity: 0, y: 26, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(14px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl text-balance text-center text-3xl font-semibold tracking-tightest sm:text-4xl md:text-5xl"
              style={{
                color: captionIndex < 3 ? "#071320" : "#ffffff",
                mixBlendMode: "normal",
              }}
            >
              {STORY_CAPTIONS[captionIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Progress rail label (Apple-style, minimal) */}
        <div className="absolute left-6 top-1/2 z-30 hidden -translate-y-1/2 md:block">
          <div className="flex flex-col items-center gap-2">
            {STORY_CAPTIONS.map((_, i) => (
              <span
                key={i}
                className="h-6 w-px rounded-full transition-colors duration-500"
                style={{
                  backgroundColor:
                    i <= captionIndex
                      ? "rgba(0,92,255,0.9)"
                      : captionIndex < 3
                        ? "rgba(7,19,32,0.15)"
                        : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** CSS purifier that transitions from pristine to dirty via a grime overlay. */
function AgeingPurifier({
  grimeRef,
}: {
  grimeRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative">
      <div className="animate-float">
        <div className="relative h-72 w-52 overflow-hidden rounded-[2.2rem] border border-white/20 bg-gradient-to-b from-white to-[#e7eef8] shadow-[0_50px_100px_-30px_rgba(0,92,255,0.4)]">
          {/* Panel */}
          <div className="absolute left-1/2 top-7 h-11 w-28 -translate-x-1/2 rounded-lg bg-brand-ink/90">
            <div className="absolute left-1/2 top-1/2 h-1.5 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow/80" />
          </div>
          {/* Water chamber */}
          <div className="absolute inset-x-6 bottom-7 top-24 overflow-hidden rounded-xl bg-gradient-to-b from-cyan-glow/25 to-brand-blue/25" />
          {/* Copper coil hint */}
          <div className="absolute bottom-10 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full border-4 border-amber-400/40" />

          {/* Grime overlay — opacity driven by scroll */}
          <div
            ref={grimeRef}
            aria-hidden
            className="absolute inset-0"
            style={{
              opacity: 0,
              background:
                "radial-gradient(60% 50% at 30% 70%, rgba(90,70,30,0.5), transparent 60%), radial-gradient(50% 40% at 70% 40%, rgba(40,55,45,0.55), transparent 60%), linear-gradient(180deg, rgba(30,35,30,0.15), rgba(20,25,20,0.6))",
            }}
          />
        </div>
      </div>
      <div
        aria-hidden
        className="mx-auto mt-3 h-16 w-52 rounded-[50%] bg-brand-blue/10 blur-2xl"
      />
    </div>
  );
}
