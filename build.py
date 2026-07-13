#!/usr/bin/env python3
"""
Video -> Website builder.

Scans the `uploads/` folder for a video file and generates a ready-to-view
website in `website/` that plays that video.

Usage:
    python build.py                 # auto-pick the first video in uploads/
    python build.py my-video.mp4    # use a specific file from uploads/
    python build.py --title "My Site" --tagline "Welcome"

After running, open `website/index.html` in a browser.
"""
import argparse
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
UPLOADS = ROOT / "uploads"
WEBSITE = ROOT / "website"
VIDEO_EXTS = {".mp4", ".mov", ".webm", ".avi", ".mkv", ".m4v", ".ogv"}
# Browsers play these inline reliably:
WEB_FRIENDLY = {".mp4", ".webm", ".ogv"}


def find_video(name: str | None) -> Path:
    if name:
        candidate = UPLOADS / name
        if not candidate.exists():
            sys.exit(f"❌ '{name}' not found in {UPLOADS}/")
        return candidate
    videos = sorted(
        p for p in UPLOADS.iterdir()
        if p.is_file() and p.suffix.lower() in VIDEO_EXTS
    )
    if not videos:
        sys.exit(
            f"❌ No video found in {UPLOADS}/\n"
            f"   Drop a video ({', '.join(sorted(VIDEO_EXTS))}) into that folder first."
        )
    return videos[0]


def build(video: Path, title: str, tagline: str) -> None:
    WEBSITE.mkdir(exist_ok=True)
    assets = WEBSITE / "assets"
    assets.mkdir(exist_ok=True)

    dest = assets / video.name
    shutil.copy2(video, dest)
    rel = f"assets/{video.name}"
    mime = {
        ".mp4": "video/mp4", ".webm": "video/webm", ".ogv": "video/ogg",
        ".mov": "video/quicktime", ".m4v": "video/mp4",
    }.get(video.suffix.lower(), "video/mp4")

    warn = ""
    if video.suffix.lower() not in WEB_FRIENDLY:
        warn = (
            f"\n⚠️  '{video.suffix}' may not play in all browsers. "
            f"Convert to .mp4 (H.264) for best results:\n"
            f"   ffmpeg -i {video.name} output.mp4\n"
        )

    html = HTML_TEMPLATE.format(
        title=title, tagline=tagline, video_src=rel, mime=mime,
    )
    (WEBSITE / "index.html").write_text(html, encoding="utf-8")

    print(f"✅ Website built in {WEBSITE}/")
    print(f"   Video: {video.name}")
    print(f"   Open:  {WEBSITE / 'index.html'}")
    if warn:
        print(warn)


HTML_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <style>
    :root {{
      --bg: #0b0f19; --fg: #f5f7ff; --muted: #9aa4bf; --accent: #6c8cff;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: var(--bg); color: var(--fg); line-height: 1.6;
    }}
    .hero {{
      position: relative; min-height: 100vh; display: flex;
      align-items: center; justify-content: center; text-align: center;
      overflow: hidden;
    }}
    .hero video {{
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; z-index: 0; filter: brightness(0.4);
    }}
    .hero .content {{ position: relative; z-index: 1; padding: 2rem; max-width: 800px; }}
    h1 {{ font-size: clamp(2.5rem, 6vw, 5rem); letter-spacing: -0.02em; }}
    .tagline {{ font-size: clamp(1.1rem, 2.5vw, 1.5rem); color: var(--muted); margin-top: 1rem; }}
    .cta {{
      display: inline-block; margin-top: 2rem; padding: 0.9rem 2rem;
      background: var(--accent); color: #fff; text-decoration: none;
      border-radius: 999px; font-weight: 600; transition: transform .15s ease;
    }}
    .cta:hover {{ transform: translateY(-2px); }}
    section {{ max-width: 900px; margin: 0 auto; padding: 5rem 1.5rem; }}
    .player {{ width: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,.5); }}
    .player video {{ width: 100%; display: block; }}
    h2 {{ font-size: 2rem; margin-bottom: 1rem; }}
    p.lead {{ color: var(--muted); font-size: 1.15rem; }}
    footer {{ text-align: center; padding: 3rem 1rem; color: var(--muted); font-size: .9rem; }}
  </style>
</head>
<body>
  <header class="hero">
    <video autoplay muted loop playsinline>
      <source src="{video_src}" type="{mime}" />
    </video>
    <div class="content">
      <h1>{title}</h1>
      <p class="tagline">{tagline}</p>
      <a class="cta" href="#watch">Watch the video ↓</a>
    </div>
  </header>

  <section id="watch">
    <h2>Watch</h2>
    <p class="lead">Here's the full video.</p>
    <div class="player" style="margin-top:1.5rem;">
      <video controls playsinline>
        <source src="{video_src}" type="{mime}" />
        Your browser does not support the video tag.
      </video>
    </div>
  </section>

  <footer>
    Built from your uploaded video · edit <code>website/index.html</code> to customize
  </footer>
</body>
</html>
"""


def main() -> None:
    ap = argparse.ArgumentParser(description="Turn an uploaded video into a website.")
    ap.add_argument("video", nargs="?", help="video filename inside uploads/")
    ap.add_argument("--title", default="My Website")
    ap.add_argument("--tagline", default="A site built from my video.")
    args = ap.parse_args()

    video = find_video(args.video)
    build(video, args.title, args.tagline)


if __name__ == "__main__":
    main()
