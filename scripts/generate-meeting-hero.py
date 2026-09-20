#!/usr/bin/env python3
"""Compose cinematic online-meeting hero plates from real EverShine member portraits.

長輝是 100% 線上例會：這些就是每週三在鏡頭前的真實會員。
產出：
  public/images/assets/meeting-hero.jpg           密集 Gallery（會員頁）
  public/images/assets/meeting-hero-speaker.jpg   主講畫面（認識 BNI）
  public/images/assets/meeting-hero-pair.jpg      雙人對談（引薦案例）
"""

from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MEMBERS = ROOT / "public" / "images" / "members"
OUT_DIR = ROOT / "public" / "images" / "assets"

W, H = 2400, 1080
GAP = 5
NAVY = (6, 22, 42)
NAVY_DEEP = (2, 8, 18)
SKY = (76, 168, 223)


ILLUSTRATION_NAMES = {"劉祐沁.jpg"}


def load_portraits() -> list[Image.Image]:
    files = sorted(
        [p for p in MEMBERS.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}],
        key=lambda p: p.name,
    )
    images: list[Image.Image] = []
    for path in files:
        if path.name in ILLUSTRATION_NAMES:
            continue
        try:
            im = Image.open(path).convert("RGB")
        except OSError:
            continue
        if min(im.size) < 80:
            continue
        images.append(im)
    if len(images) < 8:
        raise SystemExit(f"需要更多會員照片，目前只有 {len(images)} 張：{MEMBERS}")
    return images


def crop_head(im: Image.Image, tw: int, th: int) -> Image.Image:
    """Prefer the upper torso / face of studio portraits."""
    w, h = im.size
    target = tw / th
    if w / h > target:
        new_w = max(1, int(h * target))
        left = (w - new_w) // 2
        box = (left, 0, left + new_w, h)
    else:
        new_h = max(1, int(w / target))
        top = int(h * 0.05)
        if top + new_h > h:
            top = max(0, h - new_h)
        box = (0, top, w, top + new_h)
    return im.crop(box).resize((tw, th), Image.Resampling.LANCZOS)


def relight_tile(im: Image.Image) -> Image.Image:
    """Cool studio portraits toward a dim video-call room without crushing faces."""
    im = ImageEnhance.Brightness(im).enhance(0.9)
    im = ImageEnhance.Color(im).enhance(0.88)
    im = ImageEnhance.Contrast(im).enhance(1.08)
    overlay = Image.new("RGB", im.size, NAVY)
    im = Image.blend(im, overlay, 0.08)

    gray = im.convert("L")
    mask = gray.point(lambda p: 0 if p < 200 else min(255, int((p - 200) * 3.2)))
    mask = mask.filter(ImageFilter.GaussianBlur(4))
    im = Image.composite(Image.new("RGB", im.size, NAVY_DEEP), im, mask)

    vig = Image.radial_gradient("L").resize(im.size, Image.Resampling.BICUBIC)
    vig = ImageEnhance.Contrast(vig).enhance(0.55)
    vig = ImageOps.invert(vig)
    vig = ImageEnhance.Brightness(vig).enhance(0.22)
    dark = Image.new("RGB", im.size, NAVY_DEEP)
    im = Image.composite(dark, im, vig.filter(ImageFilter.GaussianBlur(12)))

    bar = Image.new("RGBA", im.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(bar)
    h = im.size[1]
    draw.rectangle((0, int(h * 0.88), im.size[0], h), fill=(0, 0, 0, 56))
    return Image.alpha_composite(im.convert("RGBA"), bar).convert("RGB")


def make_tile(src: Image.Image, tw: int, th: int) -> Image.Image:
    tile = crop_head(src, tw, th)
    tile = relight_tile(tile)
    # 1px inner highlight so the grid reads as screens, not a photo dump
    framed = Image.new("RGB", (tw, th), (18, 48, 72))
    inner = tile.resize((max(1, tw - 2), max(1, th - 2)), Image.Resampling.LANCZOS)
    framed.paste(inner, (1, 1))
    return framed


def blank_canvas() -> Image.Image:
    img = Image.new("RGB", (W, H), NAVY_DEEP)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        color = (
            int(NAVY_DEEP[0] + (NAVY[0] - NAVY_DEEP[0]) * t),
            int(NAVY_DEEP[1] + (NAVY[1] - NAVY_DEEP[1]) * t),
            int(NAVY_DEEP[2] + (NAVY[2] - NAVY_DEEP[2]) * t),
        )
        draw.line([(0, y), (W, y)], fill=color)
    return img


def paste_grid(
    canvas: Image.Image,
    portraits: list[Image.Image],
    *,
    cols: int,
    rows: int,
    box: tuple[int, int, int, int],
    start: int = 0,
) -> int:
    x0, y0, x1, y1 = box
    area_w = x1 - x0
    area_h = y1 - y0
    tw = (area_w - GAP * (cols + 1)) // cols
    th = (area_h - GAP * (rows + 1)) // rows
    idx = start
    n = len(portraits)
    for r in range(rows):
        for c in range(cols):
            x = x0 + GAP + c * (tw + GAP)
            y = y0 + GAP + r * (th + GAP)
            tile = make_tile(portraits[idx % n], tw, th)
            canvas.paste(tile, (x, y))
            idx += 1
    return idx


def grade_plate(img: Image.Image) -> Image.Image:
    """Keep faces readable; PageHero CSS adds the title well and bottom fade."""
    fade = Image.new("L", (W, H), 0)
    fade_draw = ImageDraw.Draw(fade)
    band = int(H * 0.16)
    for i in range(band):
        a = int(160 * (i / max(1, band - 1)) ** 1.1)
        fade_draw.line([(0, H - band + i), (W, H - band + i)], fill=a)
    img = Image.composite(Image.new("RGB", (W, H), NAVY_DEEP), img, fade)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse((W // 2 - 420, int(H * 0.28) - 180, W // 2 + 420, int(H * 0.28) + 180), fill=(*SKY, 18))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    return Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")


def save(img: Image.Image, name: str) -> Path:
    path = OUT_DIR / name
    img.save(path, "JPEG", quality=88, optimize=True, progressive=True)
    return path


def gallery(portraits: list[Image.Image]) -> Image.Image:
    canvas = blank_canvas()
    paste_grid(canvas, portraits, cols=8, rows=3, box=(0, 0, W, H), start=0)
    return grade_plate(canvas)


def speaker(portraits: list[Image.Image]) -> Image.Image:
    canvas = blank_canvas()
    # Featured speaker occupies the left 42%
    split = int(W * 0.46)
    paste_grid(canvas, portraits, cols=1, rows=1, box=(0, 0, split, H), start=0)
    paste_grid(canvas, portraits, cols=4, rows=3, box=(split, 0, W, H), start=1)
    return grade_plate(canvas)


def pair(portraits: list[Image.Image]) -> Image.Image:
    canvas = blank_canvas()
    paste_grid(canvas, portraits, cols=2, rows=1, box=(0, 0, W, H), start=0)
    return grade_plate(canvas)


def main() -> None:
    rng = random.Random(2026)
    portraits = load_portraits()
    rng.shuffle(portraits)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    paths = [
        save(gallery(portraits), "meeting-hero.jpg"),
        save(speaker(portraits), "meeting-hero-speaker.jpg"),
        save(pair(portraits), "meeting-hero-pair.jpg"),
    ]
    for path in paths:
        kb = path.stat().st_size / 1024
        print(f"{path.relative_to(ROOT)}  {kb:.0f} KB")


if __name__ == "__main__":
    main()
