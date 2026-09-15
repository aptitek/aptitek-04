#!/usr/bin/env python3
"""
Mascot Sprite Cutting & Optimization Pipeline.
- Uses indexed Solarized color palette for 100% pixel-art uniformity.
- Eliminates light fringe on outlines so sprites render cleanly on dark backgrounds.
- Preserves full landing dust cloud on land-3 right down to the ground.
- Completely removes M,P,B and other AI text labels.
- Standardizes all sprites on 384x384 canvas anchored at ground baseline without interpolation.
- Organizes clean speech visemes (open eyes for natural speaking; squint-grin as dedicated expression).
- Generates transparent PNGs + manifest.json.
"""

import os
import json
import cv2
import numpy as np
from PIL import Image

OUTPUT_DIR = "public/sprites/mascot"
IMG1_PATH = "src/assets/mascot/mascot-sheet-actions-speech.jpg"
IMG2_PATH = "src/assets/mascot/mascot-sheet-expressions.jpg"
IMG_TRU_EYES = "src/assets/mascot/mascot-pose-eyes-closed.jpg"

CANVAS_SIZE = 384
GROUND_BASELINE = 360
CENTER_X = 192
TARGET_BEAK_X = 192
TARGET_BEAK_Y = 191

# Base Solarized & Season Color Palette for Mascot (Strictly 8 indexed colors)
PALETTE_STANDARD = [
    ("OUTLINE",        [0, 43, 54]),     # Solarized base03 (#002b36) dark outline
    ("PINK_BODY",      [244, 132, 152]), # Season blossomDeep (#f48498)
    ("PINK_SHADOW",    [218, 87, 128]),  # Season blossomCore (#da5780)
    ("YELLOW_BEAK",    [181, 137, 0]),   # Solarized yellow (#b58900)
    ("GREEN_HEADSET",  [133, 153, 0]),   # Solarized green (#859900)
    ("BLUE_ACCENT",    [38, 139, 210]),  # Solarized blue (#268bd2)
    ("RED_ACCENT",     [220, 50, 47]),   # Solarized red (#dc322f)
    ("BASE3_GLINT",    [253, 246, 227]), # Solarized base3 (#fdf6e3) highlight / eye glint
]

# Palette with dust color strictly for land-3 and land-4 (Strictly 9 indexed colors)
PALETTE_WITH_DUST = PALETTE_STANDARD + [
    ("DUST",           [147, 161, 161]), # Solarized base1 (#93a1a1) dust cloud
]

PALETTE_STD_ARR = np.array([c[1] for c in PALETTE_STANDARD], dtype=np.float32)
PALETTE_DUST_ARR = np.array([c[1] for c in PALETTE_WITH_DUST], dtype=np.float32)


def quantize_to_palette(rgb, fg_mask, use_dust=False):
    """Maps every foreground pixel to its nearest Solarized indexed palette color."""
    out = np.zeros_like(rgb)
    fg_px = rgb[fg_mask].astype(np.float32)
    if len(fg_px) == 0:
        return out
    palette_arr = PALETTE_DUST_ARR if use_dust else PALETTE_STD_ARR
    dists = np.sum((fg_px[:, None, :] - palette_arr[None, :, :]) ** 2, axis=2)
    best_indices = np.argmin(dists, axis=1)
    out[fg_mask] = palette_arr[best_indices].astype(np.uint8)
    return out


def extract_sprite_cell(
    img,
    cell_id,
    y1,
    y2,
    x1,
    x2,
    is_img2=False,
    keep_effects_right=False,
    keep_effects_left=False,
):
    """
    Cuts a cell, clears borders and labels, flood-fills background without leaking,
    cleans edge fringe for crisp dark outlines, and quantizes to Solarized palette.
    """
    sub = img[y1:y2, x1:x2]
    rgb = cv2.cvtColor(sub, cv2.COLOR_BGR2RGB)
    h, w, _ = rgb.shape

    # Detect background color
    bg_sample = rgb[4:12, 4:12]
    bg_color = np.median(bg_sample, axis=(0, 1)).astype(np.uint8)

    # 1. Erase outer vertical grid lines
    rgb[:, :4] = bg_color
    rgb[:, -4:] = bg_color
    # Erase top border grid line
    rgb[:4, :] = bg_color

    # Bottom border: NEVER erase on land-3, land-4 to preserve dust clouds
    if cell_id not in ["land-3", "land-4"]:
        rgb[-4:, :] = bg_color

    # 2. Erase top-left label (e.g. '1', '2', '3', 'A')
    if not keep_effects_left:
        rgb[:52, :52] = bg_color
    elif cell_id == "expr-love":
        # Erase number '5' while preserving the upper-left heart
        rgb[:50, :48] = bg_color

    # 3. Erase top-right label
    if cell_id in ["talk-closed", "idle"]:
        # M,P,B label is wide; clear thoroughly without touching the bird's head
        rgb[:38, 260:] = bg_color
        rgb[:45, 266:] = bg_color
        rgb[:58, 285:] = bg_color
    elif cell_id == "expr-love":
        # Erase stray label artifact at top-right without touching the right heart below y=48
        rgb[:48, 280:] = bg_color
    elif cell_id == "expr-blush-hearts":
        # Erase letter 'V' at top-right without touching the hearts below y=55
        rgb[:55, 350:] = bg_color
    elif not keep_effects_right:
        # Standard right-hand labels (e.g. letters A, E, I, O, U, L, T, 5)
        rgb[:52, -80:] = bg_color

    # Flood fill exterior background using FIXED_RANGE starting ONLY on background pixels
    flood_mask = np.zeros((h + 2, w + 2), np.uint8)
    diff = (18, 18, 18) if not is_img2 else (16, 16, 16)
    flags = cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | (255 << 8)
    bg_f32 = bg_color.astype(np.float32)

    # Seed strictly on border pixels matching the background
    for x in [0, w - 1]:
        for y in range(h):
            if np.all(np.abs(rgb[y, x].astype(np.float32) - bg_f32) < 20):
                cv2.floodFill(
                    rgb, flood_mask, (x, y), 0, loDiff=diff, upDiff=diff, flags=flags
                )
    for y in [0, h - 1]:
        for x in range(w):
            if np.all(np.abs(rgb[y, x].astype(np.float32) - bg_f32) < 20):
                cv2.floodFill(
                    rgb, flood_mask, (x, y), 0, loDiff=diff, upDiff=diff, flags=flags
                )

    bg = flood_mask[1:-1, 1:-1] == 255
    gray = cv2.cvtColor(rgb, cv2.COLOR_BGR2GRAY)

    use_dust = cell_id in ["land-3", "land-4"]

    if use_dust:
        # For dust frames: only remove near-neutral background pixels adjacent to bg
        # NEVER remove warm/tan dust pixels (which have r_minus_b >= 6)
        r_minus_b = np.abs(rgb[:, :, 0].astype(np.int16) - rgb[:, :, 2].astype(np.int16))
        bg_dil = cv2.dilate(bg.astype(np.uint8), np.ones((3, 3), np.uint8)) == 1
        fringe = bg_dil & (~bg) & (gray > 240) & (r_minus_b < 6)
        clean_bg = bg | fringe
    else:
        # For all mascot characters: iterative neutral defringing to remove any light background fringe/trapped background
        clean_bg = bg.copy()
        for _ in range(4):
            dil = cv2.dilate(clean_bg.astype(np.uint8), np.ones((3, 3), np.uint8)) == 1
            r_minus_g = np.abs(rgb[:, :, 0].astype(np.int16) - rgb[:, :, 1].astype(np.int16))
            r_minus_b = np.abs(rgb[:, :, 0].astype(np.int16) - rgb[:, :, 2].astype(np.int16))
            is_neutral = (r_minus_g < 25) & (r_minus_b < 25)
            fringe = dil & (~clean_bg) & (gray > 125) & is_neutral
            if not np.any(fringe):
                break
            clean_bg = clean_bg | fringe

    fg = ~clean_bg

    # Quantize foreground to Solarized indexed palette
    quant_rgb = quantize_to_palette(rgb, fg, use_dust=use_dust)

    # Force solid Solarized base03 dark outline on boundary pixels
    if not use_dust:
        dil_bg_1 = cv2.dilate(clean_bg.astype(np.uint8), np.ones((3, 3), np.uint8)) == 1
        edge_1 = fg & dil_bg_1
        dil_bg_2 = cv2.dilate(clean_bg.astype(np.uint8), np.ones((5, 5), np.uint8)) == 1
        edge_2 = fg & dil_bg_2 & (~edge_1)

        # Identify intentional colored accents that touch transparency
        is_red = (rgb[:, :, 0] > 180) & (rgb[:, :, 1] < 80) & (rgb[:, :, 2] < 80)
        is_pink = (rgb[:, :, 0] > 190) & (rgb[:, :, 1] < 140) & (rgb[:, :, 2] > 120)
        is_water = (rgb[:, :, 2] > 170) & (rgb[:, :, 0] < 120) & (rgb[:, :, 1] > 140)
        accent = is_red | (is_pink if ("love" in cell_id or "blush" in cell_id) else False) | is_water

        # Outermost 1px boundary MUST be base03 OUTLINE unless an intentional colored accent
        quant_rgb[edge_1 & ~accent] = [0, 43, 54]

        # 1px inside boundary: if any pixel was mapped to a light highlight or glass color,
        # but the original image was dark/grayish (transition pixel), snap it to base03 OUTLINE!
        is_light = np.all(quant_rgb == [253, 246, 227], axis=-1)
        quant_rgb[edge_2 & is_light & (gray < 160) & ~accent] = [0, 43, 54]

    # Create crisp RGBA
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[:, :, :3] = quant_rgb
    rgba[:, :, 3] = np.where(fg, 255, 0)

    # Find tight bounding box
    coords = np.argwhere(fg)
    if len(coords) == 0:
        return None, (0, 0, 0, 0)

    ymin, xmin = coords.min(axis=0)
    ymax, xmax = coords.max(axis=0)
    cropped = rgba[ymin : ymax + 1, xmin : xmax + 1]

    return cropped, (int(ymin), int(ymax), int(xmin), int(xmax))


def find_beak_in_sprite(sprite_rgba):
    """Finds yellow beak centroid in upper 68% of the sprite."""
    sh, sw, _ = sprite_rgba.shape
    alpha = sprite_rgba[:, :, 3]
    rgb = sprite_rgba[:, :, :3]
    beak_y_limit = int(0.68 * sh)
    is_yellow = (
        (alpha > 0)
        & (rgb[:, :, 0] == 181)
        & (rgb[:, :, 1] == 137)
        & (rgb[:, :, 2] == 0)
        & (np.arange(sh)[:, None] <= beak_y_limit)
    )
    y_coords, x_coords = np.where(is_yellow)
    if len(y_coords) > 0:
        return float(np.mean(x_coords)), float(np.mean(y_coords))
    return None


def place_on_canvas(sprite_rgba, anchor_mode="ground", custom_offset=(0, 0)):
    """Places cropped sprite onto 384x384 canvas using integer pixel alignment."""
    sh, sw, _ = sprite_rgba.shape
    canvas = np.zeros((CANVAS_SIZE, CANVAS_SIZE, 4), dtype=np.uint8)

    beak_pos = find_beak_in_sprite(sprite_rgba)

    if anchor_mode == "beak" and beak_pos is not None:
        bx, by = beak_pos
        dst_x = TARGET_BEAK_X - int(round(bx)) + custom_offset[0]
        dst_y = TARGET_BEAK_Y - int(round(by)) + custom_offset[1]
    elif anchor_mode == "happy_bounce" and beak_pos is not None:
        bx, _ = beak_pos
        dst_x = TARGET_BEAK_X - int(round(bx)) + custom_offset[0]
        dst_y = GROUND_BASELINE - sh + custom_offset[1]
    elif anchor_mode == "ground":
        dst_x = CENTER_X - (sw // 2) + custom_offset[0]
        dst_y = GROUND_BASELINE - sh + custom_offset[1]
    elif anchor_mode == "center":
        dst_x = CENTER_X - (sw // 2) + custom_offset[0]
        dst_y = (CANVAS_SIZE // 2) - (sh // 2) + custom_offset[1]
    elif anchor_mode == "fly":
        dst_x = CENTER_X - (sw // 2) + custom_offset[0]
        dst_y = 150 - (sh // 2) + custom_offset[1]
    else:
        dst_x = CENTER_X - (sw // 2)
        dst_y = GROUND_BASELINE - sh

    # Clamp coordinates safely
    src_x1 = max(0, -dst_x)
    src_y1 = max(0, -dst_y)
    dst_x1 = max(0, dst_x)
    dst_y1 = max(0, dst_y)

    src_x2 = min(sw, CANVAS_SIZE - dst_x)
    src_y2 = min(sh, CANVAS_SIZE - dst_y)
    dst_x2 = dst_x1 + (src_x2 - src_x1)
    dst_y2 = dst_y1 + (src_y2 - src_y1)

    if dst_x2 > dst_x1 and dst_y2 > dst_y1:
        canvas[dst_y1:dst_y2, dst_x1:dst_x2] = sprite_rgba[
            src_y1:src_y2, src_x1:src_x2
        ]

    return canvas


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    img1 = cv2.imread(IMG1_PATH)
    img2 = cv2.imread(IMG2_PATH)

    manifest = {
        "name": "Robo-Bird Mascot",
        "description": "Pixel-art animated mascot in Solarized indexed palette with flydown, acrobatic landing, expressions, and speech visemes",
        "frameSize": {"width": CANVAS_SIZE, "height": CANVAS_SIZE},
        "groundBaseline": GROUND_BASELINE,
        "palette": {name: f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}" for name, rgb in PALETTE_STANDARD},
        "animations": {},
        "visemes": {},
        "expressions": {},
        "files": {},
    }

    sprites_to_extract = []

    # 1. Fly Down Sequence (Sheet 1, Row 2: y: 608..894)
    fly_divs = [39, 515, 1023, 1531, 2007]
    for i in range(4):
        sprites_to_extract.append({
            "id": f"fly-{i+1}",
            "sheet": 1,
            "box": (608, 894, fly_divs[i] + 4, fly_divs[i + 1] - 4),
            "anchor": "fly",
            "offset": (0, 0),
        })

    # 2. Acrobatic Landing Sequence (Sheet 1, Row 3: y: 973..1273)
    # y2 = 1273 ends right before divider line at 1274, preserving full bottom cloud!
    land_divs = [3, 412, 819, 1227, 1634, 2007]
    land_configs = [
        ("land-1", "center", (0, -30)),  # airborne dive
        ("land-2", "ground", (0, -20)),  # feet reaching down
        ("land-3", "ground", (0, 0)),    # touchdown dust skid (full bottom cloud preserved!)
        ("land-4", "ground", (0, 0)),    # cushion squish
        ("land-5", "ground", (0, 0)),    # upright pop
    ]
    for i in range(5):
        sprites_to_extract.append({
            "id": land_configs[i][0],
            "sheet": 1,
            "box": (973, 1273, land_divs[i] + 4, land_divs[i + 1] - 4),
            "anchor": land_configs[i][1],
            "offset": land_configs[i][2],
        })

    # 3. Happy Joy Dance (Sheet 1, Row 1: y: 242..530)
    happy_divs = [39, 413, 819, 1225]
    for i in range(3):
        sprites_to_extract.append({
            "id": f"happy-{i+1}",
            "sheet": 1,
            "box": (242, 530, happy_divs[i] + 4, happy_divs[i + 1] - 4),
            "anchor": "happy_bounce",
            "offset": (0, 0),
        })

    # 4. Speaking Vowels (Sheet 1, Row 4: y: 1351..1656)
    vowel_divs = [3, 412, 819, 1227, 1634, 2007]
    vowel_ids = ["talk-a", "talk-e", "talk-grin", "talk-o", "talk-u"]
    for i in range(5):
        sprites_to_extract.append({
            "id": vowel_ids[i],
            "sheet": 1,
            "box": (1351, 1656, vowel_divs[i] + 4, vowel_divs[i + 1] - 4),
            "anchor": "beak",
            "offset": (0, 0),
        })

    # Natural speech viseme for 'I' / 'ee' with open eyes (Sheet 2, Row 3, Cell 1)
    sprites_to_extract.append({
        "id": "talk-i",
        "sheet": 2,
        "box": (973, 1274, 3 + 10, 413 - 10),
        "anchor": "beak",
        "offset": (0, 0),
    })

    # 5. Speaking Consonants (Sheet 1, Row 5: y: 1728..2038)
    # Consonant 4 (lipstick lips) is OMITTED as instructed!
    consonant_divs = [3, 412, 819, 1227, 1634, 2007]
    consonant_configs = [
        (0, "talk-closed"),  # M, P, B - closed beak (M,P,B label completely erased)
        (1, "talk-wide"),    # L - wide open excited beak
        (2, "talk-t"),       # T - concentrated slight opening
        (4, "talk-smile"),   # 5 - cheerful talking smile with open eyes
    ]
    for idx, cid in consonant_configs:
        sprites_to_extract.append({
            "id": cid,
            "sheet": 1,
            "box": (1728, 2038, consonant_divs[idx] + 4, consonant_divs[idx + 1] - 4),
            "anchor": "beak",
            "offset": (0, 0),
        })

    # Default idle standing sprite (clean closed beak, centered on beak)
    sprites_to_extract.append({
        "id": "idle",
        "sheet": 1,
        "box": (1728, 2038, consonant_divs[0] + 4, consonant_divs[1] - 4),
        "anchor": "beak",
        "offset": (0, 0),
    })

    # 6. Eye States & Wakeup Frames (Sheet 2, Row 2: y: 608..894)
    # Wakeup and sleep frames preserve their natural crouching/ground offsets
    eye_divs = [39, 515, 1023, 1532, 2007]
    sprites_to_extract.append({
        "id": "eye-open",
        "sheet": 2,
        "box": (608, 894, eye_divs[0] + 4, eye_divs[1] - 4),
        "anchor": "beak",
        "offset": (0, 0),
    })
    sprites_to_extract.append({
        "id": "wakeup-2",
        "sheet": 2,
        "box": (608, 894, eye_divs[1] + 4, eye_divs[2] - 4),
        "anchor": "ground",
        "offset": (0, 0),
    })
    sprites_to_extract.append({
        "id": "wakeup-1",
        "sheet": 2,
        "box": (608, 894, eye_divs[2] + 4, eye_divs[3] - 4),
        "anchor": "ground",
        "offset": (0, 0),
    })
    sprites_to_extract.append({
        "id": "eye-sleep",
        "sheet": 2,
        "box": (608, 894, eye_divs[3] + 4, eye_divs[4] - 4),
        "anchor": "ground",
        "offset": (0, 0),
        "keep_effects_right": True,  # keep zzz bubbles on right
    })

    # 7. Speech Visuals / Reactions (Sheet 2, Row 3: y: 973..1274)
    sv_divs = [3, 413, 819, 1227, 1634, 2007]
    sv_configs = [
        (1, "expr-curious", True, False),  # question bubble ?
        (2, "expr-alert", True, False),    # alert bubble !
        (3, "expr-cry", False, False),     # tears
        (4, "expr-sweat", False, False),   # sweat drops
    ]
    for idx, sid, kr, kl in sv_configs:
        sprites_to_extract.append({
            "id": sid,
            "sheet": 2,
            "box": (973, 1274, sv_divs[idx] + 4, sv_divs[idx + 1] - 4),
            "anchor": "beak",
            "offset": (0, 0),
            "keep_effects_right": kr,
            "keep_effects_left": kl,
        })

    # 8. Dialogue Expressions (Sheet 2, Row 4: y: 1351..1656)
    de_divs = [3, 413, 819, 1227, 1634, 2007]
    de_configs = [
        (0, "expr-laugh", False, False),
        (1, "expr-shocked", False, False),
        (2, "expr-surprise", False, False),
        (3, "expr-dizzy", True, False),   # swirl thought bubble on right
        (4, "expr-love", True, True),     # hearts on both sides
    ]
    for idx, did, kr, kl in de_configs:
        sprites_to_extract.append({
            "id": did,
            "sheet": 2,
            "box": (1351, 1656, de_divs[idx] + 4, de_divs[idx + 1] - 4),
            "anchor": "beak",
            "offset": (0, 0),
            "keep_effects_right": kr,
            "keep_effects_left": kl,
        })

    # 9. Extra Special Poses (Sheet 2, Row 5: y: 1728..2038)
    ui_divs = [3, 413, 819, 1227, 1634, 2007]
    sprites_to_extract.append({
        "id": "expr-blush-hearts",
        "sheet": 2,
        "box": (1728, 2038, ui_divs[0] + 4, ui_divs[1] - 4),
        "anchor": "beak",
        "offset": (0, 0),
        "keep_effects_right": True,
    })
    sprites_to_extract.append({
        "id": "expr-wink",
        "sheet": 2,
        "box": (1728, 2038, ui_divs[1] + 4, ui_divs[2] - 4),
        "anchor": "beak",
        "offset": (0, 0),
    })

    print(f"Extracting {len(sprites_to_extract)} sprites with Solarized indexed palette & clean dark outlines...")

    processed_files = {}
    for item in sprites_to_extract:
        sid = item["id"]
        source_img = img1 if item["sheet"] == 1 else img2
        y1, y2, x1, x2 = item["box"]

        cropped, bbox = extract_sprite_cell(
            source_img,
            cell_id=sid,
            y1=y1,
            y2=y2,
            x1=x1,
            x2=x2,
            is_img2=(item["sheet"] == 2),
            keep_effects_right=item.get("keep_effects_right", False),
            keep_effects_left=item.get("keep_effects_left", False),
        )

        if cropped is None:
            print(f"ERROR: Failed to extract sprite {sid}")
            continue

        canvas = place_on_canvas(
            cropped,
            anchor_mode=item["anchor"],
            custom_offset=item.get("offset", (0, 0)),
        )

        out_path = os.path.join(OUTPUT_DIR, f"{sid}.png")
        pil_img = Image.fromarray(canvas, "RGBA")
        pil_img.save(out_path)
        processed_files[sid] = f"/sprites/mascot/{sid}.png"
        print(f"Saved {sid}.png ({canvas.shape[1]}x{canvas.shape[0]})")

    # Process true eye-closed sprite provided by user
    if os.path.exists(IMG_TRU_EYES):
        tru_img = cv2.imread(IMG_TRU_EYES)
        cropped_tru, _ = extract_sprite_cell(
            tru_img,
            "eye-closed",
            0,
            tru_img.shape[0],
            0,
            tru_img.shape[1],
            is_img2=True,
            keep_effects_right=True,
            keep_effects_left=True,
        )
        if cropped_tru is not None:
            canvas_tru = place_on_canvas(cropped_tru, anchor_mode="beak")
            out_path = os.path.join(OUTPUT_DIR, "eye-closed.png")
            Image.fromarray(canvas_tru, "RGBA").save(out_path)
            processed_files["eye-closed"] = "/sprites/mascot/eye-closed.png"
            print("Saved eye-closed.png from mascot-pose-eyes-closed.jpg (beak centered at (192, 191))")

    manifest["files"] = processed_files

    # Animation Definitions
    manifest["animations"] = {
        "flydown": {
            "frames": ["fly-1", "fly-2", "fly-3", "fly-4"],
            "fps": 8,
            "loop": True,
        },
        "landing": {
            "frames": ["land-1", "land-2", "land-3", "land-4", "land-5"],
            "fps": 12,
            "loop": False,
        },
        "happy": {
            "frames": ["happy-1", "happy-2", "happy-3", "happy-2"],
            "fps": 8,
            "loop": True,
        },
        "wakeup": {
            "frames": ["wakeup-1", "wakeup-2", "eye-open"],
            "fps": 8,
            "loop": False,
        },
        "blink": {
            "frames": ["idle", "eye-closed", "idle"],
            "fps": 10,
            "loop": False,
        },
        "sleep": {
            "frames": ["eye-sleep"],
            "fps": 1,
            "loop": True,
        },
    }

    # Speech Visemes Definition (all standard speech visemes have open eyes for natural face sync)
    manifest["visemes"] = {
        "default": "idle",
        "closed": "talk-closed",
        "shapes": {
            "A": "talk-a",
            "E": "talk-e",
            "I": "talk-i",
            "O": "talk-o",
            "U": "talk-u",
            "WIDE": "talk-wide",
            "SMILE": "talk-smile",
            "GRIN": "talk-grin",
            "T": "talk-t",
            "CLOSED": "talk-closed",
        },
        "charMap": {
            "a": "talk-a",
            "h": "talk-a",
            "k": "talk-a",
            "g": "talk-a",
            "e": "talk-e",
            "c": "talk-e",
            "d": "talk-e",
            "n": "talk-e",
            "i": "talk-i",
            "y": "talk-i",
            "o": "talk-o",
            "u": "talk-u",
            "w": "talk-u",
            "q": "talk-o",
            "l": "talk-wide",
            "r": "talk-wide",
            "t": "talk-smile",
            "s": "talk-smile",
            "z": "talk-smile",
            "j": "talk-smile",
            "f": "talk-smile",
            "v": "talk-smile",
            "m": "talk-closed",
            "p": "talk-closed",
            "b": "talk-closed",
            " ": "talk-closed",
            ".": "talk-closed",
            ",": "talk-closed",
            "!": "talk-wide",
            "?": "talk-smile",
        },
    }

    # Expression Mappings
    manifest["expressions"] = {
        "idle": "idle",
        "happy": "happy-1",
        "grin": "talk-grin",
        "curious": "expr-curious",
        "alert": "expr-alert",
        "cry": "expr-cry",
        "sweat": "expr-sweat",
        "shocked": "expr-shocked",
        "surprise": "expr-surprise",
        "dizzy": "expr-dizzy",
        "love": "expr-love",
        "blush": "expr-blush-hearts",
        "wink": "expr-wink",
        "laugh": "expr-laugh",
        "sleep": "eye-sleep",
    }

    manifest["files"] = processed_files

    manifest_path = os.path.join(OUTPUT_DIR, "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nManifest successfully written to {manifest_path}")
    print(f"Total exported Solarized pixel-art sprites: {len(processed_files)}")


if __name__ == "__main__":
    main()
