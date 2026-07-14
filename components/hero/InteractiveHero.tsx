"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
  Vector2,
  Vector3,
  MeshPhysicalMaterial,
  Color,
  Object3D,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  Raycaster,
  Plane,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Icons } from "@/components/ui/Icons";
import { scrollTo } from "@/components/layout/SmoothScroll";

// --- Three.js Boilerplate Class (X) ---
// Handles the basic setup of a Three.js scene, camera, and renderer.
// Also manages the animation loop and resizing.
class X {
  #config: any;
  #resizeObserver?: ResizeObserver;
  #intersectionObserver?: IntersectionObserver;
  #resizeTimer?: number;
  #animationFrameId: number = 0;
  #clock: Clock = new Clock();
  #animationState = { elapsed: 0, delta: 0 };
  #isAnimating: boolean = false;
  #isVisible: boolean = false;
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  scene: Scene;
  renderer: WebGLRenderer;
  size: any = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  onBeforeRender: (state: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize: (size: any) => void = () => {};

  constructor(config: any) {
    this.#config = config;
    this.canvas = this.#config.canvas;
    this.camera = new PerspectiveCamera(50, 1, 0.1, 100);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      alpha: true,
      antialias: true,
      ...this.#config.rendererOptions,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.canvas.style.display = "block";
    this.#initObservers();
    this.resize();
  }
  #initObservers() {
    const parentEl = this.#config.size === "parent" ? (this.canvas.parentNode as Element) : null;
    if (parentEl) {
      this.#resizeObserver = new ResizeObserver(this.#onResize.bind(this));
      this.#resizeObserver.observe(parentEl);
    } else {
      window.addEventListener("resize", this.#onResize.bind(this));
    }
    this.#intersectionObserver = new IntersectionObserver(this.#onIntersection.bind(this), { threshold: 0 });
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", this.#onVisibilityChange.bind(this));
  }
  #onResize() {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = window.setTimeout(this.resize.bind(this), 100);
  }
  resize() {
    const parentEl = this.#config.size === "parent" ? (this.canvas.parentNode as HTMLElement) : null;
    const w = parentEl ? parentEl.offsetWidth : window.innerWidth;
    const h = parentEl ? parentEl.offsetHeight : window.innerHeight;
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    this.camera.aspect = this.size.ratio;
    this.camera.updateProjectionMatrix();
    const fovRad = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.z;
    this.size.wWidth = this.size.wHeight * this.camera.aspect;
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.onAfterResize(this.size);
  }
  #onIntersection(e: IntersectionObserverEntry[]) {
    this.#isAnimating = e[0].isIntersecting;
    this.#isAnimating ? this.#startAnimation() : this.#stopAnimation();
  }
  #onVisibilityChange() {
    if (this.#isAnimating) document.hidden ? this.#stopAnimation() : this.#startAnimation();
  }
  #startAnimation() {
    if (this.#isVisible) return;
    this.#isVisible = true;
    this.#clock.start();
    const f = () => {
      this.#animationFrameId = requestAnimationFrame(f);
      this.#animationState.delta = this.#clock.getDelta();
      this.#animationState.elapsed += this.#animationState.delta;
      this.onBeforeRender(this.#animationState);
      this.renderer.render(this.scene, this.camera);
    };
    f();
  }
  #stopAnimation() {
    if (this.#isVisible) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#isVisible = false;
      this.#clock.stop();
    }
  }
  dispose() {
    this.#stopAnimation();
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    window.removeEventListener("resize", this.#onResize.bind(this));
    document.removeEventListener("visibilitychange", this.#onVisibilityChange.bind(this));
    this.scene.clear();
    this.renderer.dispose();
  }
}

// --- Physics Engine Class (W) ---
// Handles the physics simulation for the spheres: gravity, collision, boundaries.
class W {
  config: any;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center: Vector3 = new Vector3();

  constructor(config: any) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count);
    this.velocityData = new Float32Array(3 * config.count);
    this.sizeData = new Float32Array(config.count);
    this.#initializePositions();
    this.setSizes();
  }
  #initializePositions() {
    const { count, maxX, maxY, maxZ } = this.config;
    this.center.toArray(this.positionData, 0);
    for (let i = 1; i < count; i++) {
      const idx = 3 * i;
      this.positionData[idx] = MathUtils.randFloatSpread(2 * maxX);
      this.positionData[idx + 1] = MathUtils.randFloatSpread(2 * maxY);
      this.positionData[idx + 2] = MathUtils.randFloatSpread(2 * maxZ);
    }
  }
  setSizes() {
    const { count, size0, minSize, maxSize } = this.config;
    this.sizeData[0] = size0;
    for (let i = 1; i < count; i++) this.sizeData[i] = MathUtils.randFloat(minSize, maxSize);
  }
  update(deltaInfo: { delta: number }) {
    const { config, center, positionData, sizeData, velocityData } = this;
    const startIdx = config.controlSphere0 ? 1 : 0;
    if (config.controlSphere0) {
      new Vector3().fromArray(positionData, 0).lerp(center, 0.1).toArray(positionData, 0);
      new Vector3(0, 0, 0).toArray(velocityData, 0);
    }
    for (let i = startIdx; i < config.count; i++) {
      const base = 3 * i;
      const pos = new Vector3().fromArray(positionData, base);
      const vel = new Vector3().fromArray(velocityData, base);
      vel.y -= deltaInfo.delta * config.gravity * sizeData[i];
      vel.multiplyScalar(config.friction);
      vel.clampLength(0, config.maxVelocity);
      pos.add(vel);
      for (let j = i + 1; j < config.count; j++) {
        const otherBase = 3 * j;
        const otherPos = new Vector3().fromArray(positionData, otherBase);
        const diff = new Vector3().subVectors(otherPos, pos);
        const dist = diff.length();
        const sumRadius = sizeData[i] + sizeData[j];
        if (dist < sumRadius) {
          const overlap = (sumRadius - dist) * 0.5;
          diff.normalize();
          pos.addScaledVector(diff, -overlap);
          otherPos.addScaledVector(diff, overlap);
          pos.toArray(positionData, base);
          otherPos.toArray(positionData, otherBase);
        }
      }
      if (Math.abs(pos.x) + sizeData[i] > config.maxX) {
        pos.x = Math.sign(pos.x) * (config.maxX - sizeData[i]);
        vel.x *= -config.wallBounce;
      }
      if (pos.y - sizeData[i] < -config.maxY) {
        pos.y = -config.maxY + sizeData[i];
        vel.y *= -config.wallBounce;
      }
      if (Math.abs(pos.z) + sizeData[i] > config.maxZ) {
        pos.z = Math.sign(pos.z) * (config.maxZ - sizeData[i]);
        vel.z *= -config.wallBounce;
      }
      pos.toArray(positionData, base);
      vel.toArray(velocityData, base);
    }
  }
}

// --- Instanced Spheres Class (Z) ---
// Manages the creation and updating of the instanced sphere mesh.
const U = new Object3D();
class Z extends InstancedMesh {
  config: any;
  physics: W;
  ambientLight: AmbientLight;
  light: PointLight;
  constructor(renderer: WebGLRenderer, params: any) {
    const pmrem = new PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment()).texture;
    pmrem.dispose();
    const geometry = new SphereGeometry(1, 24, 24);
    const material = new MeshPhysicalMaterial({ envMap: envTexture, ...params.materialParams });
    super(geometry, material, params.count);
    this.config = params;
    this.physics = new W(this.config);
    this.ambientLight = new AmbientLight(0xffffff, params.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(0xffffff, params.lightIntensity, 100, 1);
    this.add(this.light);
    this.setColors(this.config.colors);
  }
  setColors(colors: (string | Color)[]) {
    if (!Array.isArray(colors) || !colors.length) return;
    const colorObjs = colors.map((c) => (c instanceof Color ? c : new Color(c)));
    for (let i = 0; i < this.count; i++) this.setColorAt(i, colorObjs[i % colorObjs.length]);
    if (this.instanceColor) this.instanceColor.needsUpdate = true;
  }
  update(deltaInfo: { delta: number }) {
    this.physics.update(deltaInfo);
    for (let i = 0; i < this.count; i++) {
      U.position.fromArray(this.physics.positionData, 3 * i);
      U.scale.setScalar(this.physics.sizeData[i]);
      U.updateMatrix();
      this.setMatrixAt(i, U.matrix);
    }
    this.instanceMatrix.needsUpdate = true;
    if (this.config.controlSphere0) this.light.position.fromArray(this.physics.positionData, 0);
  }
}

// --- Pointer Logic ---
const pointer = new Vector2();
function onPointerMove(e: PointerEvent) {
  pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
}

// --- Default Config ---
const defaultBallpitConfig = {
  count: 200,
  materialParams: { metalness: 0.7, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2 },
  minSize: 0.3,
  maxSize: 0.8,
  size0: 1.0,
  gravity: 0.4,
  friction: 0.995,
  wallBounce: 0.2,
  maxVelocity: 0.1,
  maxX: 10,
  maxY: 10,
  maxZ: 10,
  controlSphere0: true,
  followCursor: true,
  lightIntensity: 3,
  ambientIntensity: 1.5,
};

// Original ballpit palette.
const brandColors = ["#E5E5E5", "#CCCCCC", "#B2B2B2"];

type BallpitProps = Partial<typeof defaultBallpitConfig & { colors: (string | Color)[] }>;

interface InteractiveHeroProps {
  heroTitle?: string;
  heroDescription?: string;
  className?: string;
  ballpitConfig?: BallpitProps;
}

const ease = [0.16, 1, 0.3, 1] as const;

// --- Main React Component ---
export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
  heroTitle = "Pure Water, Perfectly Serviced.",
  heroDescription = "RO Care India brings certified engineers, genuine parts and same-day doorstep RO service to homes across India.",
  className = "",
  ballpitConfig = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [phone, setPhone] = useState("");

  // Memoize config so re-renders don't re-initialize the scene.
  const config = useMemo(
    () => ({
      ...defaultBallpitConfig,
      colors: brandColors,
      ...ballpitConfig,
    }),
    [ballpitConfig]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize Three.js scene
    const three = new X({ canvas, size: "parent" });
    three.renderer.toneMapping = ACESFilmicToneMapping;
    three.camera.position.set(0, 0, 20);

    const spheres = new Z(three.renderer, config);
    three.scene.add(spheres);

    const raycaster = new Raycaster();
    const plane = new Plane(new Vector3(0, 0, 1), 0);
    const intersectionPoint = new Vector3();

    if (config.followCursor) {
      window.addEventListener("pointermove", onPointerMove);
    }

    three.onBeforeRender = (deltaInfo) => {
      if (config.followCursor) {
        raycaster.setFromCamera(pointer, three.camera);
        if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
          spheres.physics.center.copy(intersectionPoint);
        }
      }
      spheres.update(deltaInfo);
    };

    three.onAfterResize = (size) => {
      spheres.physics.config.maxX = size.wWidth / 2;
      spheres.physics.config.maxY = size.wHeight / 2;
      spheres.physics.config.maxZ = size.wWidth / 4;
    };

    three.resize();

    return () => {
      if (config.followCursor) {
        window.removeEventListener("pointermove", onPointerMove);
      }
      three.dispose();
    };
  }, [config]);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/book${phone ? `?phone=${encodeURIComponent(phone)}` : ""}`);
  };

  return (
    <section
      id="home"
      className={`relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#b7b7b7] ${className}`}
    >
      {/* Interactive ballpit background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />

      {/* Soft veil so the headline stays readable over the spheres */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 48%, rgba(183,183,183,0.82) 0%, rgba(183,183,183,0.45) 55%, rgba(183,183,183,0) 100%)",
        }}
      />

      {/* Hero content */}
      <div className="pointer-events-none relative z-10 mx-auto flex max-w-content flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mb-8"
        >
          <span className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-brand-ink/10 bg-white/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-blue backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-brand-blue" />
            RO Care India
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.15, ease }}
          className="max-w-4xl text-balance text-4xl font-bold leading-[1.03] tracking-tightest text-brand-ink sm:text-5xl md:text-6xl lg:text-[4.25rem]"
        >
          {heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="mt-7 max-w-xl text-balance text-lg text-brand-ink/60"
        >
          {heroDescription}
        </motion.p>

        <motion.form
          onSubmit={handleBookSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="pointer-events-auto mt-10 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <div className="relative w-full">
            <Icons.phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-ink/40" />
            <input
              type="tel"
              inputMode="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-full border border-brand-ink/10 bg-white/80 py-3 pl-11 pr-4 font-medium text-brand-ink placeholder-brand-ink/40 backdrop-blur transition-colors hover:border-brand-ink/20 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>
          <button
            type="submit"
            className="group flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 font-semibold text-white shadow-glow transition-colors hover:bg-brand-blue/90 sm:w-auto"
          >
            Book Service
            <Icons.arrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </button>
        </motion.form>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo("#story", 0)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-brand-ink/50 transition-colors hover:text-brand-blue"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.25em]">Scroll</span>
        <span className="relative flex h-9 w-5 justify-center rounded-full border border-brand-ink/25">
          <span className="mt-1.5 h-1.5 w-1.5 animate-scroll-hint rounded-full bg-brand-blue" />
        </span>
      </motion.button>
    </section>
  );
};

export default InteractiveHero;
