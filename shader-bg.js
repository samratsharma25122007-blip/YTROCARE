/* Animated shader background — a native (vanilla Three.js) port of the
   React "background-paper-shaders" effect, in the RO Care India blue palette.

   Usage: add `data-shader-bg` to any positioned element (optionally
   data-color1 / data-color2 hex). A full-cover animated <canvas> is mounted
   behind its content. Keep the element's inner content in a z-index:1 wrapper. */
import * as THREE from './three.module.min.js';

const VERT = `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Animated flowing noise that mixes two colors, with a soft bright highlight.
const FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec3  uC1;
  uniform vec3  uC2;
  void main(){
    // aspect-corrected coords so the pattern doesn't stretch
    vec2 uv = vUv;
    float a = uRes.x / max(uRes.y, 1.0);
    vec2 p = vec2(uv.x * a, uv.y);

    float n  = sin(p.x * 5.0 + uTime * 0.55) * cos(p.y * 4.0 + uTime * 0.45);
    n += sin(p.x * 9.0 - uTime * 0.80) * cos(p.y * 7.0 + uTime * 0.65) * 0.5;
    n += sin((p.x + p.y) * 6.0 + uTime * 0.30) * 0.25;
    n = n * 0.5 + 0.5;

    vec3 col = mix(uC1, uC2, clamp(n, 0.0, 1.0));
    col = mix(col, vec3(1.0), pow(n, 3.0) * 0.28);  // white highlight (original palette)

    // gentle vignette to settle the edges
    float v = smoothstep(1.15, 0.25, length(uv - 0.5) * 1.9);
    col *= mix(0.72, 1.0, v);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRGB(hex, fallback) {
  const c = new THREE.Color(hex || fallback);
  return c;
}

function mount(host) {
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  host.style.overflow = 'hidden';

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0;';
  host.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime: { value: 0 },
    uRes:  { value: new THREE.Vector2(1, 1) },
    uC1:   { value: hexToRGB(host.dataset.color1, '#071a33') }, // dark navy
    uC2:   { value: hexToRGB(host.dataset.color2, '#1b74d1') }, // brand blue
  };
  const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

  function size() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  }
  new ResizeObserver(size).observe(host);
  size();

  // Only animate while the section is on screen (saves GPU).
  let visible = true;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; })
    .observe(host);

  let t0 = 0;
  function tick(now) {
    if (!t0) t0 = now;
    uniforms.uTime.value = (now - t0) / 1000;
    if (visible) renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.querySelectorAll('[data-shader-bg]').forEach(mount);
