# Story video

Place your rendered scroll-story clip here as:

```
public/videos/ro-story.mp4
```

The homepage scrubs this video's timeline directly from the scroll position
(forward on scroll-down, backward on scroll-up) inside the pinned
`ScrollVideoStory` section.

## Encoding for smooth frame-accurate scrubbing

Scroll-scrubbing seeks to arbitrary timestamps every frame, so the video needs
**dense keyframes** (a short GOP). Re-encode your render like this:

```bash
ffmpeg -i your-render.mov \
  -an \
  -vcodec libx264 \
  -pix_fmt yuv420p \
  -profile:v high \
  -crf 20 \
  -g 4 -keyint_min 4 \        # keyframe every ~4 frames = buttery scrubbing
  -movflags +faststart \
  public/videos/ro-story.mp4
```

Guidelines:
- Keep it **muted / audio-stripped** (`-an`) — it never plays with sound.
- 1080p (or square) is plenty; smaller files scrub more smoothly on mobile.
- Aim for a short clip (10–25s of real footage); scroll length is decoupled
  from real duration, so a short, keyframe-dense file feels best.

## No video yet?

The site still works. Until `ro-story.mp4` exists, `ScrollVideoStory` falls back
to a CSS "ageing purifier" that tells the same pristine → dirty story on scroll,
with the captions and background evolution intact.

You can also change the path in `lib/data.ts` → `STORY_VIDEO_SRC`.
