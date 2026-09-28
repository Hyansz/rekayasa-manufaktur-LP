#!/usr/bin/env python3
"""
Generate offline SVG placeholder assets ("engineering blueprint" style) for
Rekayasa Manufaktur.

This is a temporary stand-in until real product photos exist. Each generated
file is a standalone SVG with:
  - a gradient navy -> brand-blue background
  - a fine engineering grid pattern overlay
  - a line-style icon matching the product category
  - the product name as a caption

Output layout (under `public/`):
  products/{slug}.svg, {slug}-v1.svg, {slug}-v2.svg
  avatars/{id}.svg
  clients/{slug}.svg
  craft/process.svg

To swap in real photos later, just replace the image URL in the JSON data —
no component code changes needed.
"""

import json
import os
import re
import sys
from html import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(ROOT, "data", "products.json")
PUBLIC_PATH = os.path.join(ROOT, "public")

W = 600
H = 750

# Brand palette
NAVY_900 = "#0A1929"
NAVY_700 = "#1E3A5F"
BRAND_BLUE = "#2563EB"
BRAND_BLUE_LIGHT = "#3B82F6"

# ---------------------------------------------------------------------------
# Line-art category icons (stroke-based, drawn on a 0..96 coordinate box)
# ---------------------------------------------------------------------------

def icon_chair():
    # classic side-chair profile
    return "".join([
        '<path d="M16 62 v-22 a12 12 0 0 1 24 0 v14" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>',
        '<path d="M40 62 h34 a10 10 0 0 1 10 10 v2 h-44 z" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/>',
        '<line x1="20" y1="78" x2="16" y2="62" stroke="white" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="44" y1="78" x2="84" y2="78" stroke="white" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="84" y1="78" x2="80" y2="64" stroke="white" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="52" y1="50" x2="52" y2="40" stroke="white" stroke-width="3" stroke-linecap="round"/>',
    ])


def icon_table():
    # desk / table with legs
    return "".join([
        '<path d="M16 40 h64" stroke="white" stroke-width="3" stroke-linecap="round"/>',
        '<path d="M22 40 v-10 a6 6 0 0 1 6 -6 h40 a6 6 0 0 1 6 6 v10" fill="none" stroke="white" stroke-width="3"/>',
        '<line x1="34" y1="40" x2="30" y2="80" stroke="white" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="62" y1="40" x2="66" y2="80" stroke="white" stroke-width="3" stroke-linecap="round"/>',
    ])


def icon_shelf():
    # modular shelving unit
    return "".join([
        '<rect x="22" y="18" width="52" height="60" fill="none" stroke="white" stroke-width="3"/>',
        '<line x1="24" y1="38" x2="72" y2="38" stroke="white" stroke-width="3"/>',
        '<line x1="24" y1="58" x2="72" y2="58" stroke="white" stroke-width="3"/>',
        '<line x1="22" y1="18" x2="72" y2="18" stroke="white" stroke-width="3"/>',
        '<rect x="30" y="24" width="14" height="12" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>',
        '<rect x="52" y="44" width="14" height="12" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>',
    ])


def icon_accessory():
    # table lamp
    return "".join([
        '<path d="M48 78 v-20" stroke="white" stroke-width="3" stroke-linecap="round"/>',
        '<rect x="32" y="20" width="32" height="26" rx="4" fill="none" stroke="white" stroke-width="3"/>',
        '<path d="M28 78 h40" stroke="white" stroke-width="3" stroke-linecap="round"/>',
        '<path d="M44 46 v6" stroke="white" stroke-width="3" stroke-linecap="round"/>',
    ])


ICONS = {
    "kursi": icon_chair,
    "meja": icon_table,
    "rak": icon_shelf,
    "aksesoris": icon_accessory,
}


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s


def grid_pattern(dark: bool = True):
    stroke = "#FFFFFF" if dark else BRAND_BLUE
    return (
        '<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">'
        f'<path d="M 40 0 L 0 0 0 40" fill="none" stroke="{stroke}" '
        'stroke-width="1" opacity="0.12"/>'
        "</pattern>"
    )


def background(seed: str):
    """Deterministic two-stop gradient per seed."""
    h = hash(seed) & 0xFFFF
    r1 = 30 + (h % 24)
    r2 = 60 + ((h >> 4) % 30)
    return f"""
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="{NAVY_900}"/>
          <stop offset="55%" stop-color="{NAVY_700}"/>
          <stop offset="100%" stop-color="{BRAND_BLUE}"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stop-color="{BRAND_BLUE_LIGHT}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="{BRAND_BLUE_LIGHT}" stop-opacity="0"/>
        </radialGradient>
        {grid_pattern(True)}
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="{W}" height="{H}" fill="url(#bg)"/>
      <rect width="{W}" height="{H}" fill="url(#glow)"/>
      <rect width="{W}" height="{H}" fill="url(#grid)"/>
      <rect width="{W}" height="{H}" fill="url(#shade)"/>
      <rect x="20" y="20" width="{W-40}" height="{H-40}" fill="none"
            stroke="#fff" stroke-width="1" opacity="0.15"/>
    """


def product_svg(slug: str, name: str, category: str, variant: int = 0):
    icon = ICONS.get(category, icon_accessory)()
    # slight per-variant icon offset so gallery images differ
    dx = (variant % 3 - 1) * 4
    dy = (variant % 2) * -4
    fig = (
        f'<g transform="translate({dx},{dy})">'
        f'<g transform="translate({W/2-48},{H/2-48})">{icon}</g></g>'
    )
    label = f"Variant {variant+1}" if variant else name
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{escape(name)}">
  {background(slug + str(variant))}
  {fig}
  <text x="32" y="56" font-family="ui-sans-serif, system-ui, sans-serif" font-size="15"
        font-weight="600" fill="#fff" opacity="0.55" letter-spacing="2">REKAYASA MANUFAKTUR</text>
  <text x="32" y="{H-40}" font-family="ui-sans-serif, system-ui, sans-serif"
        font-size="22" font-weight="700" fill="#fff">{escape(label)}</text>
  <text x="32" y="{H-14}" font-family="ui-sans-serif, system-ui, sans-serif"
        font-size="13" fill="#fff" opacity="0.5">Engineering placeholder — {escape(category)}</text>
</svg>"""


def avatar_svg(avatar_id: int, initials: str):
    r = W // 2
    cx = W / 2
    cy = H / 2
    x0 = min(40.0, r * 0.7)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{NAVY_700}"/>
      <stop offset="100%" stop-color="{BRAND_BLUE}"/>
    </linearGradient>
  </defs>
  <rect width="{W}" height="{H}" fill="#fff"/>
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#g)"/>
  <circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="#fff" stroke-width="6"/>
  <text x="{cx}" y="{cy+x0}" font-family="ui-sans-serif, system-ui, sans-serif"
        font-size="{x0}" font-weight="700" fill="#fff" text-anchor="middle"
        letter-spacing="{max(1, x0*0.06)}">{escape(initials)}</text>
</svg>"""


def client_svg(name: str):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="220" height="88" viewBox="0 0 220 88" role="img">
  <rect width="220" height="88" fill="transparent"/>
  <text x="110" y="54" font-family="ui-sans-serif, system-ui, sans-serif"
        font-size="26" font-weight="700" fill="#fff" text-anchor="middle">{escape(name)}</text>
</svg>"""


def process_svg():
    steps = ["BILET", "EXTRUSION", "CNC MACHINING", "FINISHING"]
    icons = [icon_chair, icon_table, icon_shelf, icon_accessory]
    n = len(steps)
    cw = 540 / n
    cy = 190
    parts = []
    for i, (label, ic) in enumerate(zip(steps, icons)):
        x = 30 + i * cw + cw * 0.5
        parts.append(
            f'<circle cx="{x}" cy="{cy}" r="58" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.9"/>'
        )
        # number badge
        parts.append(
            f'<circle cx="{x-70}" cy="{cy-70}" r="14" fill="{BRAND_BLUE_LIGHT}"/>'
            f'<text x="{x-70}" y="{cy-70+5}" font-family="ui-sans-serif,sans-serif" font-size="13" '
            f'font-weight="700" fill="#fff" text-anchor="middle">{i+1}</text>'
        )
        # icon
        ic_g = ic().replace('stroke="white"', 'stroke="#fff"')
        parts.append(f'<g transform="translate({x-32},{cy-44}) scale(0.66)">{ic_g}</g>')
        # label
        parts.append(
            f'<text x="{x}" y="{cy+92}" font-family="ui-sans-serif,sans-serif" font-size="13" '
            f'font-weight="600" fill="#fff" text-anchor="middle" letter-spacing="1">{label}</text>'
        )
        # arrow between steps
        if i < n - 1:
            ax = x + cw * 0.5 - 6
            parts.append(
                f'<line x1="{ax}" y1="{cy}" x2="{ax + 12}" y2="{cy}" stroke="#fff" '
                'stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 5"/>'
            )
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400" role="img" aria-label="Alur produksi aluminium">
  <defs>
    <linearGradient id="pb" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{NAVY_900}"/>
      <stop offset="55%" stop-color="{NAVY_700}"/>
      <stop offset="100%" stop-color="{BRAND_BLUE}"/>
    </linearGradient>
    {grid_pattern(True)}
  </defs>
  <rect width="1200" height="400" fill="url(#pb)"/>
  <rect width="1200" height="400" fill="url(#grid)"/>
  {' '.join(parts)}
</svg>"""


def write(path: str, content: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  wrote {os.path.relpath(path, ROOT)}")


def main() -> None:
    with open(DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)

    products_dir = os.path.join(PUBLIC_PATH, "products")
    avatars_dir = os.path.join(PUBLIC_PATH, "avatars")
    clients_dir = os.path.join(PUBLIC_PATH, "clients")
    craft_dir = os.path.join(PUBLIC_PATH, "craft")
    for d in (products_dir, avatars_dir, clients_dir, craft_dir):
        os.makedirs(d, exist_ok=True)

    for p in data["products"]:
        slug = p["slug"]
        cat = p["category"]
        name = p["name"]
        # Always produce a main image + 2 gallery variants (3 SVGs per product)
        for v in range(3):
            suffix = "-v" + str(v + 1) if v > 0 else ""
            write(
                os.path.join(products_dir, f"{slug}{suffix}.svg"),
                product_svg(slug, name, cat, v),
            )

    for t in data["testimonials"]:
        initials = "".join(w[0] for w in t["author"].split()[:2]).upper()
        write(
            os.path.join(avatars_dir, f"{t['id']}.svg"),
            avatar_svg(t["id"], initials),
        )

    for c in data["clients"]:
        write(
            os.path.join(clients_dir, f"{slugify(c['name'])}.svg"),
            client_svg(c["name"]),
        )

    write(os.path.join(craft_dir, "process.svg"), process_svg())

    print("Done.")


if __name__ == "__main__":
    sys.exit(main())
