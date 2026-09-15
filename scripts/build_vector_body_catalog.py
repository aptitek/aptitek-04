import os, sys, cv2, numpy as np, subprocess
import xml.etree.ElementTree as ET

sys.path.append('/home/aptitek/.gemini/antigravity-ide/brain/ccdcd527-c2a7-4866-b601-0be3b0ee1200/scratch/venv/lib/python3.14/site-packages')
import vtracer

OUTPUT_DIR = "public/mascot/body"
BRAIN_DIR = "/home/aptitek/.gemini/antigravity-ide/brain/c5ee765e-ea96-4172-a310-b213290a59e1"
SCRATCH_DIR = "scratch/vector_body_build"

SHEET_FLIGHT = os.path.join(BRAIN_DIR, "mascot_flight_poses_1789491808623.jpg")
SHEET_LANDING = os.path.join(BRAIN_DIR, "mascot_landing_poses_1789491844753.jpg")
SHEET_ACTION = os.path.join(BRAIN_DIR, "mascot_action_poses_1789491881137.jpg")
SHEET_SUPP = os.path.join(BRAIN_DIR, "mascot_supplemental_poses_1789491990406.jpg")

SVG_NS = "http://www.w3.org/2000/svg"
INKSCAPE_NS = "http://www.inkscape.org/namespaces/inkscape"
ET.register_namespace("", SVG_NS)
ET.register_namespace("inkscape", INKSCAPE_NS)

PALETTE_BGR = np.array([
    [255, 255, 255],  # 0: Pure white background
    [54, 43, 0],      # 1: #002b36 dark outline
    [152, 132, 244],  # 2: #f48498 pink body
    [128, 87, 218],   # 3: #da5780 pink shadow
    [0, 137, 181],    # 4: #b58900 yellow feet
    [0, 153, 133],    # 5: #859900 green cyber headset
    [210, 139, 38],   # 6: #268bd2 blue cyber dome
    [47, 50, 220],    # 7: #dc322f red antenna tip
    [233, 193, 136],  # 8: #88c1e9 light-blue glasspane
    [227, 246, 253],  # 9: #fdf6e3 base3 glint
], dtype=np.float32)

def quantize_cell(bgr_cell):
    h, w, _ = bgr_cell.shape
    flat = bgr_cell.reshape(-1, 3).astype(np.float32)
    dists = np.sum((flat[:, None, :] - PALETTE_BGR[None, :, :]) ** 2, axis=2)
    best_idx = np.argmin(dists, axis=1)
    return PALETTE_BGR[best_idx].reshape(h, w, 3).astype(np.uint8)

def prepare_cell(cell, pid, has_pane):
    clean = cell.copy()
    # Clear 14px border around cell to eliminate any sheet dividers/artifacts
    clean[:14, :] = [255, 255, 255]
    clean[-14:, :] = [255, 255, 255]
    clean[:, :14] = [255, 255, 255]
    clean[:, -14:] = [255, 255, 255]

    gray = cv2.cvtColor(clean, cv2.COLOR_BGR2GRAY)
    dark = gray < 85
    h, w = gray.shape
    bg_mask = np.zeros((h+2, w+2), np.uint8)
    cv2.floodFill(gray.copy(), bg_mask, (0, 0), 255, 12, 12, cv2.FLOODFILL_MASK_ONLY | (255 << 8))
    bg = bg_mask[1:-1, 1:-1] == 255
    interior = (~bg) & (~dark)
    num_lbl, lbls, stats, centroids = cv2.connectedComponentsWithStats(interior.astype(np.uint8), 8)

    if has_pane:
        if pid.startswith("fly-"):
            for i in range(1, num_lbl):
                area = stats[i, cv2.CC_STAT_AREA]
                cx, cy = centroids[i]
                if 3000 <= area <= 4200 and 290 <= cx <= 350 and 180 <= cy <= 220:
                    clean[lbls == i] = [233, 193, 136]
                elif 1200 <= area <= 1800 and 380 <= cx <= 430 and 195 <= cy <= 230:
                    clean[lbls == i] = [233, 193, 136]
        elif pid in ["action-celebrate", "action-wave", "wakeup-crouch"]:
            for i in range(1, num_lbl):
                area = stats[i, cv2.CC_STAT_AREA]
                cx, cy = centroids[i]
                w_box = stats[i, cv2.CC_STAT_WIDTH]
                h_box = stats[i, cv2.CC_STAT_HEIGHT]
                aspect = w_box / max(1, h_box)
                if 3800 <= area <= 5500 and 215 <= cy <= 255 and (170 <= cx <= 270 or 300 <= cx <= 390) and 0.85 <= aspect <= 1.05:
                    clean[lbls == i] = [233, 193, 136]
    else:
        # Squash or sleep pose: ensure no glasspane blue
        blue_mask = (clean[:, :, 0] > 180) & (clean[:, :, 1] > 140) & (clean[:, :, 2] < 160)
        clean[blue_mask] = [152, 132, 244]

    quant = quantize_cell(clean)
    quant[bg] = [255, 255, 255]
    rgba = cv2.cvtColor(quant, cv2.COLOR_BGR2BGRA)
    rgba[bg, 3] = 0
    return rgba

def hex_to_rgb(hex_str):
    hex_clean = hex_str.lstrip('#')
    if len(hex_clean) != 6:
        return (0, 0, 0)
    return (int(hex_clean[0:2], 16), int(hex_clean[2:4], 16), int(hex_clean[4:6], 16))

def is_glasspane_color(hex_str):
    r, g, b = hex_to_rgb(hex_str)
    return (110 <= r <= 160) and (160 <= g <= 215) and (205 <= b <= 245)

def is_outline_color(hex_str):
    r, g, b = hex_to_rgb(hex_str)
    return r < 40 and g < 65 and b < 85

def is_green_implant(hex_str):
    r, g, b = hex_to_rgb(hex_str)
    return (100 <= r <= 165) and (130 <= g <= 180) and b < 50

def is_blue_dome(hex_str):
    r, g, b = hex_to_rgb(hex_str)
    return r < 70 and (100 <= g <= 170) and (175 <= b <= 240)

def is_yellow_legs(hex_str):
    r, g, b = hex_to_rgb(hex_str)
    return (150 <= r <= 205) and (115 <= g <= 165) and b < 60

def is_pink_shadow(hex_str):
    r, g, b = hex_to_rgb(hex_str)
    return (195 <= r <= 240) and (60 <= g <= 110) and (100 <= b <= 150)

def trace_pose(rgba, pid, title, has_pane):
    tmp_png = os.path.join(SCRATCH_DIR, f"{pid}.png")
    tmp_svg = os.path.join(SCRATCH_DIR, f"{pid}_raw.svg")
    cv2.imwrite(tmp_png, rgba)
    vtracer.convert_image_to_svg_py(tmp_png, tmp_svg)

    tree = ET.parse(tmp_svg)
    root = tree.getroot()

    new_root = ET.Element("{%s}svg" % SVG_NS, {
        "width": "512mm",
        "height": "512mm",
        "viewBox": "0 0 512 512",
        "version": "1.1",
        "{%s}label" % INKSCAPE_NS: f"Mascot Body - {title}",
    })
    layer1 = ET.SubElement(new_root, "{%s}g" % SVG_NS, {
        "id": "layer1",
        "{%s}label" % INKSCAPE_NS: "Layer 1",
    })
    mascot_group = ET.SubElement(layer1, "{%s}g" % SVG_NS, {
        "id": "mascot_body",
        "{%s}label" % INKSCAPE_NS: title,
    })

    paths_in_order = []
    seen_body = False
    seen_left_wing = False
    seen_frame = False
    seen_pane = False

    raw_paths = root.findall(".//{%s}path" % SVG_NS)
    for idx, path in enumerate(raw_paths):
        fill = path.attrib.get("fill", "").upper()
        # Skip pure white background rect if any
        if fill in ["#FEFEFE", "#FFFFFF", "#FDFDFD", "#FDF6E3"]:
            continue

        d = path.attrib.get("d", "")
        transform = path.attrib.get("transform", "")
        attrib = {"d": d}
        if transform:
            attrib["transform"] = transform

        if is_glasspane_color(fill):
            seen_pane = True
            attrib["id"] = "glasspane"
            attrib["{%s}label" % INKSCAPE_NS] = "glasspane"
            attrib["style"] = "fill:#88c1e9;stroke:none" if has_pane else "fill:none;stroke:none"
        elif is_outline_color(fill):
            if not seen_frame:
                seen_frame = True
                attrib["id"] = "glasses_frame"
                attrib["{%s}label" % INKSCAPE_NS] = "glasses_frame"
            else:
                attrib["id"] = f"outline_{idx}"
                attrib["{%s}label" % INKSCAPE_NS] = "glasses_frame"
            attrib["style"] = "fill:#002b36;stroke:none"
        elif is_green_implant(fill):
            attrib["id"] = f"cyber_implant_{idx}"
            attrib["{%s}label" % INKSCAPE_NS] = "cyber_implant"
            attrib["style"] = "fill:#859900;stroke:none"
        elif is_blue_dome(fill):
            attrib["id"] = f"cyber_dome_{idx}"
            attrib["{%s}label" % INKSCAPE_NS] = "cyber_dome"
            attrib["style"] = "fill:#268bd2;stroke:none"
        elif is_yellow_legs(fill):
            attrib["id"] = f"legs_{idx}"
            attrib["{%s}label" % INKSCAPE_NS] = "legs"
            attrib["style"] = "fill:#b58900;stroke:none"
        elif is_pink_shadow(fill):
            attrib["id"] = f"body_shadow_{idx}"
            attrib["{%s}label" % INKSCAPE_NS] = "body_shadow"
            attrib["style"] = "fill:#da5780;stroke:none"
        else:
            if not seen_body:
                seen_body = True
                attrib["id"] = "body"
                attrib["{%s}label" % INKSCAPE_NS] = "body"
            elif not seen_left_wing:
                seen_left_wing = True
                attrib["id"] = "left_wing"
                attrib["{%s}label" % INKSCAPE_NS] = "left_wing"
            else:
                attrib["id"] = f"body_part_{idx}"
                attrib["{%s}label" % INKSCAPE_NS] = "body"
            attrib["style"] = "fill:#f48498;stroke:none"

        paths_in_order.append(attrib)

    if not seen_left_wing:
        paths_in_order.append({
            "id": "left_wing",
            "{%s}label" % INKSCAPE_NS: "left_wing",
            "style": "fill:#f48498;stroke:none",
            "d": "M 0 0",
        })
    if not seen_frame:
        paths_in_order.append({
            "id": "glasses_frame",
            "{%s}label" % INKSCAPE_NS: "glasses_frame",
            "style": "fill:#002b36;stroke:none",
            "d": "M 0 0",
        })
    if not seen_pane:
        paths_in_order.append({
            "id": "glasspane",
            "{%s}label" % INKSCAPE_NS: "glasspane",
            "style": "fill:#88c1e9;stroke:none" if has_pane else "fill:none;stroke:none",
            "d": "M 0 0",
        })

    for p in paths_in_order:
        ET.SubElement(mascot_group, "{%s}path" % SVG_NS, p)

    out_svg = os.path.join(OUTPUT_DIR, f"{pid}.svg")
    ET.ElementTree(new_root).write(out_svg, encoding="utf-8", xml_declaration=True)
    return out_svg

def build_standing_svg():
    tree = ET.parse("public/aptipiou_redone.svg")
    root = tree.getroot()

    new_svg = ET.Element("{%s}svg" % SVG_NS, {
        "width": "512mm",
        "height": "512mm",
        "viewBox": "0 0 512 512",
        "version": "1.1",
        "{%s}label" % INKSCAPE_NS: "Mascot Body - Standing",
    })
    layer1 = ET.SubElement(new_svg, "{%s}g" % SVG_NS, {
        "id": "layer1",
        "{%s}label" % INKSCAPE_NS: "Layer 1",
    })
    mascot_body = ET.SubElement(layer1, "{%s}g" % SVG_NS, {
        "id": "mascot_body",
        "{%s}label" % INKSCAPE_NS: "Standing Stance",
    })

    g21 = root.find(".//{%s}g[@id='g21']" % SVG_NS)
    omitted = ["mouth", "upper_beak", "left_eye", "right_eye"]

    for elem in g21:
        label = elem.attrib.get("{%s}label" % INKSCAPE_NS, "")
        if label in omitted:
            continue
        if label == "glasses":
            pane = ET.Element("{%s}path" % SVG_NS, {
                "id": "glasspane",
                "{%s}label" % INKSCAPE_NS: "glasspane",
                "style": "fill:#88c1e9;stroke:none",
                "d": elem.attrib.get("d", ""),
            })
            mascot_body.append(pane)
            frame = ET.Element("{%s}path" % SVG_NS, {
                "id": "glasses_frame",
                "{%s}label" % INKSCAPE_NS: "glasses_frame",
                "style": "fill:none;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round",
                "d": elem.attrib.get("d", ""),
            })
            mascot_body.append(frame)
        else:
            mascot_body.append(elem)

    out_path = os.path.join(OUTPUT_DIR, "standing.svg")
    ET.ElementTree(new_svg).write(out_path, encoding="utf-8", xml_declaration=True)
    print("Generated standing.svg (canonical from aptipiou_redone.svg)")

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(SCRATCH_DIR, exist_ok=True)

    print("Building Vector Mascot Body Catalog...")
    build_standing_svg()

    img_flight = cv2.imread(SHEET_FLIGHT)
    img_landing = cv2.imread(SHEET_LANDING)
    img_action = cv2.imread(SHEET_ACTION)
    img_supp = cv2.imread(SHEET_SUPP)

    pose_definitions = [
        # Flight Sequence (Sheet 1)
        (img_flight[0:512, 0:512], "fly-glide", "Flying Glide", True),
        (img_flight[0:512, 512:1024], "fly-upstroke", "Flying Upstroke", True),
        (img_flight[512:1024, 0:512], "fly-downstroke", "Flying Downstroke", True),
        (img_flight[512:1024, 512:1024], "fly-bank", "Flying Bank", True),

        # Landing Sequence (Sheet 2)
        (img_landing[0:512, 0:512], "land-touchdown", "Landing Touchdown", True),
        (img_landing[0:512, 512:1024], "land-impact", "Landing Impact", True),
        (img_landing[512:1024, 0:512], "land-settle", "Landing Settle (Squash)", False),
        (img_landing[512:1024, 512:1024], "land-rebound", "Landing Rebound (Spring)", False),

        # Action & Sleep Sequence (Sheet 3)
        (img_action[0:512, 0:512], "sleep", "Sleeping Curled (Ground)", False),
        (img_action[0:512, 512:1024], "wakeup-crouch", "Wakeup Crouch", True),
        (img_action[512:1024, 0:512], "action-wave", "Action Wave", True),
        (img_action[512:1024, 512:1024], "action-celebrate", "Action Celebrate", True),

        # Supplemental Actions & Joy (Sheet 4)
        (img_supp[0:512, 0:512], "action-thumbsup", "Action Thumbs Up", True),
        (img_supp[0:512, 512:1024], "action-thinking", "Action Thinking", True),
        (img_supp[512:1024, 0:512], "happy-bounce", "Happy Joy Bounce", True),
        (img_supp[512:1024, 512:1024], "happy-soar", "Happy Joy Soar", True),
    ]

    for cell, pid, title, has_pane in pose_definitions:
        rgba = prepare_cell(cell, pid, has_pane)
        trace_pose(rgba, pid, title, has_pane)
        print(f"Generated {pid}.svg ({title}, glasspane={has_pane})")

    # 3 Transition Poses
    transitions = [
        ("land-stand", "Landing Stand Recovery", "land-touchdown", True),
        ("wakeup-stretch", "Wakeup Stretch", "wakeup-crouch", True),
        ("happy-land", "Happy Landing Settle", "happy-bounce", True),
    ]
    for tid, title, source_id, has_pane in transitions:
        src_path = os.path.join(OUTPUT_DIR, f"{source_id}.svg")
        tree = ET.parse(src_path)
        root = tree.getroot()
        root.attrib["{%s}label" % INKSCAPE_NS] = f"Mascot Body - {title}"
        g = root.find(".//{%s}g[@id='mascot_body']" % SVG_NS)
        if g is not None:
            g.attrib["{%s}label" % INKSCAPE_NS] = title
        dst_path = os.path.join(OUTPUT_DIR, f"{tid}.svg")
        tree.write(dst_path, encoding="utf-8", xml_declaration=True)
        print(f"Generated {tid}.svg ({title})")

    print("\nSuccessfully generated all 20 vector body postures in public/mascot/body/!")

if __name__ == "__main__":
    main()
