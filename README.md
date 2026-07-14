# RO Care India — website

A static multi-page website for **RO Care India** ("We Care Your Water") — RO water
purifier service, repair, installation and AMC. Live at:

**https://samratsharma25122007-blip.github.io/YTROCARE/**

## Pages

| File | Page |
|---|---|
| `index.html` | Home — scroll-driven video hero (Three.js), services, plans, FAQ, testimonials |
| `services.html` | All services, industrial band, process, AMC plans |
| `about.html` | Story, stats, values |
| `contact.html` | Booking form (opens WhatsApp pre-filled) + contact cards |
| `404.html` | Not-found page (served automatically by GitHub Pages) |

## ✏️ Change your phone / WhatsApp / email (one place)

Open **`app.js`** and edit the `SITE` block at the very top:

```js
const SITE = {
  phoneDisplay: '+91 98765 43210',   // shown on the site
  phoneTel:     '+919876543210',     // used in tel: links
  whatsapp:     '919876543210',      // country code + number, digits only
  email:        'hello@rocareindia.example',
};
```

Every page updates automatically (header, footer, contact cards, WhatsApp
button and the booking form's WhatsApp message).

## 🎬 The scroll video hero

Scrolling down plays the film forward; scrolling up reverses it. Sources, in
order of preference (the page falls back down the chain automatically):

1. `kling_120fps_1080p.mp4` — 1080p, 120 fps, all-intra (desktop)
2. `kling_120fps.mp4` — 720p version (mobile / data-saver)
3. `kling_20260714_VIDEO_make_smoot_918_0.mp4` — original upload

To replace the video, replace those files (same names), or update the
`SOURCES` list in the inline script at the bottom of `index.html`.
`hero-poster.jpg` is the still shown while the video loads — regenerate it
from the first frame of the new video.

Tuning knobs in the inline script: `SCROLL_PER_VIDEO` (screens of scroll for
the whole film) and `SMOOTH` (how tightly the playhead tracks your scroll).

## 🎨 Animated shader backgrounds

`shader-bg.js` mounts an animated GLSL gradient behind any element with
`data-shader-bg` (optional `data-color1` / `data-color2`). Used on the home
CTA band and the inner-page headers.

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deployment

Every push to the `claude/video-upload-website-iss35n` branch auto-deploys to
GitHub Pages via `.github/workflows/pages.yml`.

## Still placeholder (replace before going fully live)

- Phone number & email in `app.js` (see above)
- AMC plan prices in `index.html` / `services.html`
- Testimonials & stats
- Logo (currently a 💧 emoji in the header/footer)
- Google Maps embed on the contact page
