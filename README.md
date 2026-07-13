# 🎬 Video → Website

Upload a video, get a website.

## Quick start

1. **Put your video** in the [`uploads/`](uploads/) folder
   (e.g. `uploads/my-video.mp4`).
2. **Tell me** (Claude) the file name and what you want, e.g.
   *"I uploaded `demo.mp4` — make a landing page for my product."*
   I'll build a custom site for you in [`website/`](website/).

### Or build it yourself with one command

```bash
python build.py                          # uses the first video in uploads/
python build.py my-video.mp4 \
    --title "My Product" \
    --tagline "The future is here"
```

Then open **`website/index.html`** in a browser.

## Folder layout

```
.
├── uploads/          ← put your video file(s) here
├── website/          ← the generated website (open index.html)
│   └── assets/       ← your video gets copied here
├── build.py          ← generates the site from a video
└── README.md
```

## Notes

- Best format for the web is **`.mp4` (H.264)**. `.mov`/`.avi`/`.mkv` may not
  play in every browser — convert with `ffmpeg -i input.mov output.mp4`.
- The more detail you give me about what's in the video (or a transcript),
  the richer the copy and sections I can generate to match it.
