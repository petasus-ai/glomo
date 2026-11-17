#!/usr/bin/env python3
"""Build one self-contained HTML file from site/, for offline viewing or sending as an attachment.

The stylesheet, script, font and images are inlined (the font and images as data URIs), so the
result renders the same with no network. Uses only the standard library.

Usage:
    python3 scripts/build_standalone.py [OUTPUT]    # default: dist/petasus-ai-cloud-goat.html
"""
import base64
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
DEFAULT_OUT = ROOT / "dist" / "petasus-ai-cloud-goat.html"
MIME = {
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".webp": "image/webp",
}


def data_uri(path: Path) -> str:
    return f"data:{MIME[path.suffix]};base64," + base64.b64encode(path.read_bytes()).decode()


def inline_css(match: re.Match) -> str:
    css_path = SITE / match.group(1)
    css = css_path.read_text(encoding="utf-8")

    def inline_url(u: re.Match) -> str:
        ref = u.group(1)
        if ref.startswith(("data:", "http:", "https:", "#")):
            return u.group(0)
        return "url(" + data_uri((css_path.parent / ref).resolve()) + ")"

    css = re.sub(r'url\("?([^")]+?)"?\)', inline_url, css)
    return "<style>\n" + css + "</style>\n"


def inline_js(match: re.Match) -> str:
    return "<script>\n" + (SITE / match.group(1)).read_text(encoding="utf-8") + "</script>\n"


def build() -> str:
    html = (SITE / "index.html").read_text(encoding="utf-8")
    html = re.sub(r'<link rel="preload"[^>]*>\n', "", html)  # nothing to preload once inlined
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">\n', inline_css, html)
    html = re.sub(r'<script src="([^"]+)"></script>\n', inline_js, html)
    html = re.sub(r'src="(assets/[^"]+)"', lambda m: 'src="' + data_uri(SITE / m.group(1)) + '"', html)
    return html


def main() -> None:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUT
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(build(), encoding="utf-8")
    print(f"wrote {out} ({out.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
