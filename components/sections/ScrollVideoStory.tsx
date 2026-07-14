"use client";

import { useEffect, useRef, useState } from "react";
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
import { STORY_VIDEO_SRC } from "@/lib/data";

/**
 * The centrepiece. A pinned, full-viewport section where the story video is
 * rendered through Three.js as a WebGL texture and scrubbed frame-by-frame by
 * scroll — forward on scroll-down, backward on scroll-up. The video fills the
 * screen ("cover" fit) and brings its own background; no overlays, no text.
 * If the video asset isn't present, a CSS purifier carries the section.
 */
export default function ScrollVideoStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const grimeRef = useRef<HTMLDivElement>(null);

  const [videoOk, setVideoOk] = useState(true);

  // Playback mode driven by scroll direction: one scroll down plays the video
  // forward; one scroll up plays it in reverse.
  const mode = useRef<"idle" | "forward" | "reverse">("idle");

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

    // --- Three.js: the video as a WebGL texture on a screen-cover plane ---
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

        // "Cover" fit — the video fills the viewport, cropping as needed,
        // so its own background is the section background.
        const aspect =
          video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9;
        const pw = Math.max(w, h * aspect);
        const ph = pw / aspect;
        plane.scale.set(pw, ph, 1);
      };
      layout();

      const resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(stage);
      video.addEventListener("loadedmetadata", layout);

      // Forward playback uses native play(); reverse playback steps
      // currentTime backwards each frame (browsers can't play() in reverse).
      let lastT = performance.now();
      const tick = (now: number) => {
        const dt = Math.min((now - lastT) / 1000, 0.1);
        lastT = now;
        if (mode.current === "reverse" && video.readyState >= 2 && !video.seeking) {
          const next = Math.max(0, video.currentTime - dt);
          video.currentTime = next;
          if (next <= 0) mode.current = "idle";
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

    // Scroll direction picks the playback direction (grime in fallback mode).
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (grimeRef.current)
          grimeRef.current.style.opacity = `${clamp(self.progress * 1.05)}`;
        if (!video) return;
        if (self.direction === 1 && mode.current !== "forward") {
          mode.current = "forward";
          video.play().catch(() => {});
        } else if (self.direction === -1 && mode.current !== "reverse") {
          mode.current = "reverse";
          video.pause();
        }
      },
      onLeave: () => {
        mode.current = "idle";
        video?.pause();
      },
      onLeaveBack: () => {
        mode.current = "idle";
        video?.pause();
      },
    });

    return () => {
      st.kill();
      disposeThree?.();
    };
  }, [videoOk]);

  return (
    <section
      ref={sectionRef}
      id="story"
      // Long enough to stay pinned while the clip plays, short enough to
      // pass with a couple of scrolls.
      className="relative h-[300vh] w-full"
      aria-label="Scroll-driven RO service video"
    >
      {/* Pinned stage — no background of its own; the video covers it */}
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black"
      >
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
              onError={() => setVideoOk(false)}
            />
          </>
        )}

        {/* CSS fallback purifier that "ages" — used when no video is present */}
        {!videoOk && (
          <div className="relative z-10 flex h-full w-full items-center justify-center bg-brand-ink">
            <AgeingPurifier grimeRef={grimeRef} />
          </div>
        )}
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
