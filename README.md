# AutoCare — Premium RO Servicing Website

An award-winning-grade, cinematic marketing site for **AutoCare**, an RO water
purifier servicing company. Built to feel like the launch of a luxury technology
product — Apple × Nothing × Dyson × Tesla — not a typical service business site.

## ✨ Highlights

- **Scroll-controlled video story** — the hero story video's timeline is scrubbed
  directly by scroll (forward on scroll-down, reverse on scroll-up) inside a
  pinned section. No autoplay, no play button, no loop. Captions cross-fade and
  the background evolves from bright white to deep ink as the purifier ages.
- **Buttery smooth** — Lenis smooth scroll wired into a single GSAP ticker so
  ScrollTrigger, the video scrubber and every pinned section stay in sync at ~60fps.
- **Handcrafted sections** — interactive exploded purifier, before/after
  comparison slider, animated service timeline, glassmorphism review carousel,
  accordion FAQ, and a staged final CTA.
- **Book Service page** — full booking form with an elegant success animation.
- Fully **responsive** and **reduced-motion aware**.

## 🧱 Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS**
- **GSAP + ScrollTrigger** (scroll scrubbing & pinning)
- **Framer Motion** (micro-interactions & reveals)
- **Lenis** (smooth scroll)
- **Inter** via `next/font`

No unnecessary libraries.

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build && npm start
```

## 🎬 Add your story video

Drop your rendered clip at **`public/videos/ro-story.mp4`**.
See [`public/videos/README.md`](public/videos/README.md) for the exact ffmpeg
encoding (dense keyframes) that makes scroll-scrubbing perfectly smooth.

> Until the video is added, the story section gracefully falls back to a
> CSS-animated "ageing purifier" so the site is fully functional out of the box.

## 📁 Structure

```
app/
  layout.tsx            # fonts, smooth scroll, navbar, footer, progress rail
  page.tsx              # home — assembles every section
  book/page.tsx         # Book Service page
components/
  layout/               # SmoothScroll (Lenis+GSAP), Navbar, Footer
  hero/                 # Hero
  sections/             # ScrollVideoStory + sections 2–9 + FinalCTA
  book/                 # BookForm
  ui/                   # Button, Reveal, ScrollProgress, Particles, Icons, Logo…
lib/
  data.ts               # all copy/content in one place
  gsap.ts               # GSAP + ScrollTrigger registration
```

## 🎨 Design tokens

| Token | Value |
|-------|-------|
| Brand blue | `#005CFF` |
| Ink | `#071320` |
| Black | `#111111` |
| White | `#FFFFFF` |
| Cyan glow | `#5FD3FF` |

Typography: **Inter**, large scale, tight tracking, generous whitespace.
