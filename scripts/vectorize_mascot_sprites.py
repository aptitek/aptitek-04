#!/usr/bin/env python3
"""
Mascot Vectorization Pipeline.
Converts all mascot pixel-art PNG sprites into clean, palette-snapped vector SVGs.
Snaps all colors to the strict 8-color Solarized palette (plus dust for landing).
"""

import glob
import os
import re
import vtracer

PALETTE = [
    ('#002b36', (0, 43, 54)),      # Solarized base03 outline
    ('#f48498', (244, 132, 152)),  # Season blossomDeep body
    ('#da5780', (218, 87, 128)),   # Season blossomCore shadow
    ('#b58900', (181, 137, 0)),    # Solarized yellow beak / feet
    ('#859900', (133, 153, 0)),    # Solarized green headset
    ('#268bd2', (38, 139, 210)),   # Solarized blue accent
    ('#dc322f', (220, 50, 47)),    # Solarized red accent
    ('#fdf6e3', (253, 246, 227)),  # Solarized base3 glint
    ('#93a1a1', (147, 161, 161)),  # Solarized base1 dust cloud
]


def snap_color(hex_str: str) -> str:
    """Snaps an arbitrary hex color to the nearest Solarized palette color."""
    clean_hex = hex_str.strip().lstrip('#')
    if len(clean_hex) == 3:
        clean_hex = ''.join(c * 2 for c in clean_hex)
    if len(clean_hex) != 6:
        return '#' + clean_hex
    try:
        r = int(clean_hex[0:2], 16)
        g = int(clean_hex[2:4], 16)
        b = int(clean_hex[4:6], 16)
    except ValueError:
        return '#' + clean_hex

    best_hex = PALETTE[0][0]
    best_d = 1e9
    for target_hex, (tr, tg, tb) in PALETTE:
        d = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2
        if d < best_d:
            best_d = d
            best_hex = target_hex
    return best_hex


def vectorize_sprite(png_path: str, svg_path: str) -> None:
    """Converts a PNG sprite to a palette-quantized, transparent SVG."""
    vtracer.convert_image_to_svg_py(png_path, svg_path)
    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_text = f.read()

    def replace_hex(match: re.Match) -> str:
        attr = match.group(1)
        old_hex = match.group(2)
        new_hex = snap_color(old_hex)
        return f'{attr}="{new_hex}"'

    svg_text = re.sub(r'(fill|stroke)="([#a-fA-F0-9]+)"', replace_hex, svg_text)

    # Standardize viewBox
    if 'viewBox' not in svg_text:
        svg_text = re.sub(r'<svg\s+', '<svg viewBox="0 0 384 384" ', svg_text)

    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_text)


def main() -> None:
    output_dir = 'public/sprites/mascot'
    all_pngs = sorted(glob.glob(os.path.join(output_dir, '*.png')))
    print(f'Vectorizing {len(all_pngs)} mascot sprites to SVG...')
    for p in all_pngs:
        name = os.path.splitext(os.path.basename(p))[0]
        svg_path = os.path.join(output_dir, f'{name}.svg')
        vectorize_sprite(p, svg_path)
        print(f'Saved {name}.svg')
    print('All mascot sprites successfully vectorized!')


if __name__ == '__main__':
    main()
