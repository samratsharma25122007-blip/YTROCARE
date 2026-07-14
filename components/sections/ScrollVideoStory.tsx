"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  VideoTexture,
  LinearFilter,
  SRGBColorSpace,
} from "three";
import { ScrollTrigger } from "@/lib/gsap";
import { STORY_CAPTIONS, STORY_VIDEO_SRC } from "@/lib/data";
import Particles from "@/components/ui/Particles";

/**
 * The centrepiece. A pinned, full-viewport section where the story video is
 * rendered through Three.js as a WebGL texture and scrubbed frame-by-frame by
 * scroll — forward on scroll-down, backward on scroll-up. The headline sits
 * center-left with a subtle scroll parallax, over a clean dark gradient.
 * If the video asset isn't present, a CSS "ageing purifier" carries the story.
 */
export default function ScrollVideoStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const grimeRef = useRef<HTMLDivElement>(null);

  const [captionIndex, setCaptionIndex] = useState(0);
  const [videoOk, setVideoOk] = useState(true);

  // Live scroll progress shared between the rAF scrubber and ScrollTrigger.
  const targetTime = useRef(0);
  const duration = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // The error event can fire before hydration attaches onError — check the
    // property directly so the CSS fallback still kicks in.
    if (videoOk && video?.error) {
      setVideoOk(false);
      return;
    }

    const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

    // --- Three.js: the video as a WebGL texture on a screen-fit plane ---
    // Only when the video decodes; the CSS fallback needs no WebGL.
    let raf = 0;
    let disposeThree: (() => void) | undefined;

    if (videoOk && canvas && video) {
      const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const scene = new Scene();
      const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const texture = new VideoTexture(video);
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.colorSpace = SRGBColorSpace;

      const plane = new Mesh(
        new PlaneGeometry(1, 1),
        new MeshBasicMaterial({ map: texture, toneMapped: false })
      );
      scene.add(plane);

      const layout = () => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        renderer.setSize(w, h);
        camera.left = -w / 2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = -h / 2;
        camera.updateProjectionMatrix();

        // "Contain" fit, capped like the previous design (78vh / 92vw).
        const aspect =
          video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9;
        const maxW = 0.92 * w;
        const maxH = 0.78 * h;
        const pw = Math.min(maxW, maxH * aspect);
        const ph = pw / aspect;
        plane.scale.set(pw, ph, 1);
        // Nudge the video right on wide screens so the center-left headline breathes.
        plane.position.x = w >= 1024 ? w * 0.1 : 0;
      };
      layout();

      const resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(stage);
      video.addEventListener("loadedmetadata", layout);

      // Smoothly scrub the video toward the scroll-derived target time.
      const tick = () => {
        if (duration.current > 0) {
          const cur = video.currentTime;
          const diff = targetTime.current - cur;
          // Only seek when the gap is meaningful — avoids redundant seeks/jank.
          if (Math.abs(diff) > 0.01 && !video.seeking) {
            video.currentTime = cur + diff * 0.2;
          }
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      disposeThree = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        video.removeEventListener("loadedmetadata", layout);
        texture.dispose();
        plane.geometry.dispose();
        (plane.material as MeshBasicMaterial).dispose();
        renderer.dispose();
      };
    }

    // Scroll drives captions, parallax, dust and grime in both modes.
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        targetTime.current = p * duration.current;

        // Subtle headline parallax — drifts ~80px against the scroll.
        if (headlineRef.current) {
          headlineRef.current.style.transform = `translate3d(0, ${(0.5 - p) * 80}px, 0)`;
        }
        // Dust appears in the back half.
        if (dustRef.current) dustRef.current.style.opacity = `${clamp((p - 0.4) / 0.6)}`;
        // CSS fallback grime.
        if (grimeRef.current) grimeRef.current.style.opacity = `${clamp(p * 1.05)}`;

        const idx = clamp(Math.floor(p * STORY_CAPTIONS.length), 0, STORY_CAPTIONS.length - 1);
        setCaptionIndex((prev) => (prev === idx ? prev : idx));
      },
    });

    return () => {
      st.kill();
      disposeThree?.();
    };
  }, [videoOk]);

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
      // 1200vh (was 700vh) — ~40% slower scrub per scrolled pixel.
      className="relative h-[1200vh] w-full"
      aria-label="The story of an unserviced RO"
    >
      {/* Pinned stage — clean dark gradient */}
      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(165deg, #0B1428 0%, #071320 45%, #10223F 100%)",
        }}
      >
        {/* Soft blue lighting */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 15%, rgba(0,92,255,0.14), transparent 55%), radial-gradient(70% 60% at 85% 100%, rgba(95,211,255,0.10), transparent 60%)",
          }}
        />

        {/* The scroll-scrubbed video, rendered via Three.js */}
        {videoOk && (
          <>
            <canvas ref={canvasRef} className="absolute inset-0 z-10 h-full w-full" />
            <video
              ref={videoRef}
              className="pointer-events-none absolute h-px w-px opacity-0"
              src={STORY_VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              disableRemotePlayback
              crossOrigin="anonymous"
              onLoadedMetadata={onLoaded}
              onError={() => setVideoOk(false)}
            />
          </>
        )}

        {/* CSS fallback purifier that "ages" — used when no video is present */}
        {!videoOk && (
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <AgeingPurifier grimeRef={grimeRef} />
          </div>
        )}

        {/* Floating dust that intensifies late in the story */}
        <div
          ref={dustRef}
          className="pointer-events-none absolute inset-0 z-20"
          style={{ opacity: 0 }}
        >
          <Particles count={70} color="150,160,175" maxSize={1.8} speed={0.12} />
        </div>

        {/* Headline — center-left, parallaxed against the scroll */}
        <div
          ref={headlineRef}
          className="pointer-events-none absolute left-6 top-1/2 z-30 -translate-y-1/2 md:left-14 lg:left-20"
          style={{ willChange: "transform" }}
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={captionIndex}
              initial={{ opacity: 0, y: 26, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(14px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md text-balance text-left text-3xl font-semibold tracking-tightest text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] sm:text-4xl md:max-w-lg md:text-5xl"
            >
              {STORY_CAPTIONS[captionIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Progress rail (Apple-style, minimal) — right side, away from the headline */}
        <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 md:block">
          <div className="flex flex-col items-center gap-2">
            {STORY_CAPTIONS.map((_, i) => (
              <span
                key={i}
                className="h-6 w-px rounded-full transition-colors duration-500"
                style={{
                  backgroundColor:
                    i <= captionIndex ? "rgba(95,211,255,0.9)" : "rgba(255,255,255,0.2)",
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
