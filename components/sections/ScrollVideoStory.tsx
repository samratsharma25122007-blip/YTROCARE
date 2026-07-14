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

  // Live scroll target shared between the rAF scrubber and ScrollTrigger:
  // the video's timeline follows the scroll position, so it plays forward
  // on scroll-down and reverses on scroll-up.
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

    // --- Three.js: the video as a WebGL texture on a screen-cover plane ---
    let raf = 0;
    let disposeThree: (() => void) | undefined;
    let videoMaterial: MeshBasicMaterial | undefined;

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

      // Starts fully transparent over the black stage: the section blends
      // seamlessly out of the black hero, then the video fades in on scroll.
      videoMaterial = new MeshBasicMaterial({
        map: texture,
        toneMapped: false,
        transparent: true,
        opacity: 0,
      });
      const plane = new Mesh(new PlaneGeometry(1, 1), videoMaterial);
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

      // Metadata may already be loaded before this effect runs (the element
      // starts fetching during SSR HTML parse), so read it directly AND
      // listen — otherwise duration stays 0 and the scrub never moves.
      const onMeta = () => {
        if (video.duration && isFinite(video.duration)) {
          duration.current = video.duration;
        }
        layout();
      };
      if (video.readyState >= 1) onMeta();
      video.addEventListener("loadedmetadata", onMeta);

      // Smoothly scrub the video toward the scroll-derived target time.
      const tick = () => {
        if (duration.current > 0) {
          const cur = video.currentTime;
          const diff = targetTime.current - cur;
          // Only seek when the gap is meaningful — avoids redundant seeks/jank.
          if (Math.abs(diff) > 0.01 && !video.seeking) {
            video.currentTime = cur + diff * 0.35;
          }
        }
        // Re-upload the current frame every tick: the hidden video never
        // "presents" frames to the compositor, so three.js's automatic
        // requestVideoFrameCallback path never fires and the texture would
        // stay black without this.
        if (video.readyState >= 2) texture.needsUpdate = true;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      disposeThree = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        video.removeEventListener("loadedmetadata", onMeta);
        texture.dispose();
        plane.geometry.dispose();
        (plane.material as MeshBasicMaterial).dispose();
        renderer.dispose();
      };
    }

    // Scroll position drives the video's target time (grime in fallback mode).
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        targetTime.current = p * duration.current;
        // Fade the video in from black over the first 10% of the scroll and
        // back to black over the last 6% — both page seams become invisible.
        if (videoMaterial) {
          videoMaterial.opacity = Math.min(1, clamp(p / 0.1), clamp((1 - p) / 0.06));
        }
        if (grimeRef.current) grimeRef.current.style.opacity = `${clamp(p * 1.05)}`;
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
      // Two viewport-heights of scrubbing — the clip finishes in ~2 scrolls.
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
