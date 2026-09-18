#!/usr/bin/env python3
"""Generate the 1200x630 Open Graph / LINE share image."""

from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "assets" / "og-evershine-1200.png"
LOGO = ROOT / "public" / "images" / "assets" / "logo" / "白色正方形logo.png"
WORDMARK = ROOT / "public" / "images" / "assets" / "logo" / "透明底白字長條logo.png"

W, H = 1200, 630
NAVY = (2, 6, 23)
NAVY_MID = (6, 32, 58)
SKY = (76, 168, 223)
GOLD = (212, 160, 23)
GOLD_SOFT = (232, 197, 71)
WHITE = (244, 249, 255)


def lerp(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def radial_glow(size: int, color: tuple[int, int, int], alpha: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    inset = int(size * 0.18)
    draw.ellipse((inset, inset, size - inset, size - inset), fill=(*color, alpha))
    return img.filter(ImageFilter.GaussianBlur(max(24, size // 18)))


def load_font(size: int, *, latin: bool = False) -> ImageFont.FreeTypeFont:
    candidates = (
        [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]
        if latin
        else [
            "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
            "/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf",
        ]
    )
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_spaced(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, font: ImageFont.FreeTypeFont, fill, tracking: int = 4) -> None:
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking


def main() -> None:
    rng = random.Random(2026)
    base = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(base, "RGBA")

    for y in range(H):
        t = y / (H - 1)
        color = lerp(NAVY, NAVY_MID, t * 0.85)
        draw.line([(0, y), (W, y)], fill=color)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_sky = radial_glow(720, SKY, 90)
    glow_gold = radial_glow(520, GOLD, 55)
    glow_sky_sm = radial_glow(380, SKY, 50)
    overlay.paste(glow_sky, (-80, 40), glow_sky)
    overlay.paste(glow_gold, (780, -40), glow_gold)
    overlay.paste(glow_sky_sm, (860, 360), glow_sky_sm)
    base = Image.alpha_composite(base.convert("RGBA"), overlay)

    star_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    star_draw = ImageDraw.Draw(star_layer)
    for _ in range(160):
        x, y = rng.randint(12, W - 12), rng.randint(12, H - 12)
        s = rng.choice([1, 1, 1, 2])
        a = rng.randint(80, 210)
        star_draw.ellipse((x, y, x + s, y + s), fill=(255, 255, 255, a))
    base = Image.alpha_composite(base, star_layer)

    # Gold top rule
    rule = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rule_draw = ImageDraw.Draw(rule)
    rule_draw.rectangle((0, 0, W, 6), fill=(*GOLD, 230))
    rule_draw.rectangle((0, H - 6, W, H), fill=(*SKY, 160))
    base = Image.alpha_composite(base, rule)

    canvas = ImageDraw.Draw(base)

    logo = Image.open(LOGO).convert("RGBA")
    logo = logo.resize((260, 260), Image.Resampling.LANCZOS)
    # Soft circular plate behind planet
    plate = Image.new("RGBA", (320, 320), (0, 0, 0, 0))
    ImageDraw.Draw(plate).ellipse((8, 8, 312, 312), fill=(8, 28, 48, 180), outline=(*SKY, 140), width=3)
    base.paste(plate, (86, 150), plate)
    base.paste(logo, (116, 180), logo)

    wordmark = Image.open(WORDMARK).convert("RGBA")
    wordmark.thumbnail((520, 140), Image.Resampling.LANCZOS)

    font_kicker = load_font(22, latin=True)
    font_title = load_font(72)
    font_sub = load_font(32)
    font_meta = load_font(26)

    text_x = 460
    draw_spaced(canvas, (text_x, 132), "BNI  PLATINUM  CHAPTER", font_kicker, GOLD_SOFT, tracking=3)
    canvas.text((text_x, 188), "長輝白金分會", font=font_title, fill=WHITE)
    canvas.text((text_x, 286), "連結能創造價值的人", font=font_sub, fill=SKY)
    canvas.text((text_x, 352), "每週三　06:30 - 08:30　·　100% 線上例會", font=font_meta, fill=(186, 210, 230))
    canvas.text((text_x, 404), "用每週例會，把專業變成引薦", font=font_meta, fill=(168, 186, 204))

    base.paste(wordmark, (text_x, 468), wordmark)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    base.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
