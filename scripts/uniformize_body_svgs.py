#!/usr/bin/env python3
"""
Clean, uniformize, and align all 20 mascot body SVGs.
Ensures identical 4-layer structure:
  <g id="mascot_character" transform="translate(dx, dy)">
    <g id="mascot_body" class="mascot-body-group">...</g>
    <g id="mascot_particles" class="mascot-particles-group" transform="...">...</g>
    <g id="mascot_beaks" class="mascot-beaks-group" transform="...">...</g>
    <g id="mascot_eyes" class="mascot-eyes-group" transform="...">...</g>
  </g>
With semantic IDs, classes, data-* attributes, and embedded visibility stylesheet.
"""

import os
import glob
import xml.etree.ElementTree as ET

# Namespaces
INKSCAPE_NS = "http://www.inkscape.org/namespaces/inkscape"
SODIPODI_NS = "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
SVG_NS = "http://www.w3.org/2000/svg"

ET.register_namespace("", SVG_NS)
ET.register_namespace("inkscape", INKSCAPE_NS)
ET.register_namespace("sodipodi", SODIPODI_NS)

ALIGNMENT_OFFSETS = {
    # Format: (scale, dx, dy)
    # Standing & Actions (normalized to consistent ~420-440px body scale)
    "standing.svg": (1.00, 0.0, 0.0),
    "action-wave.svg": (1.20, -40.0, -65.0),
    "action-celebrate.svg": (1.22, -45.0, -75.0),
    "action-thinking.svg": (1.00, -6.2, -12.2),
    "action-thumbsup.svg": (1.00, -7.3, -14.4),

    # Flight (normalized consistent head/wing geometry)
    "fly-upstroke.svg": (1.10, 5.0, -65.0),
    "fly-glide.svg": (1.05, -20.0, 15.0),
    "fly-downstroke.svg": (1.10, 0.0, -45.0),
    "fly-bank.svg": (1.10, -45.0, 35.0),

    # Landing (ground touchdown centered squash and rebound normalized to 400-430px body scale)
    "land-touchdown.svg": (1.00, 0.0, 0.0),
    "land-impact.svg": (1.30, -75.0, -118.0),
    "land-settle.svg": (1.22, -80.0, -95.0),
    "land-rebound.svg": (1.20, -60.0, -45.0),
    "land-stand.svg": (1.00, 4.0, 0.0),

    # Happy Poses (normalized consistent scale with standing)
    "happy-bounce.svg": (1.20, -50.0, -45.0),
    "happy-soar.svg": (1.12, -5.0, -30.0),
    "happy-land.svg": (1.20, -60.0, -45.0),

    # Wakeup & Sleep
    "sleep.svg": (1.25, -45.0, -120.0),
    "wakeup-crouch.svg": (1.28, -90.0, -80.0),
    "wakeup-stretch.svg": (1.28, -95.0, -80.0),
}

BEAK_SPECS = [
    # (id, class_names, data_id)
    ("beak-dizzy", "mascot-beak beak-dizzy", "dizzy"),
    ("beak-grimace", "mascot-beak beak-grimace", "grimace"),
    ("beak-grin", "mascot-beak beak-grin", "grin"),
    ("beak-laugh", "mascot-beak beak-laugh", "laugh"),
    ("beak-pout", "mascot-beak beak-pout", "pout"),
    ("beak-shocked", "mascot-beak beak-shocked", "shocked"),
    ("beak-sleep", "mascot-beak beak-sleep", "sleep"),
    ("beak-smile", "mascot-beak beak-smile", "smile"),
    ("beak-smirk", "mascot-beak beak-smirk", "smirk"),
    ("beak-surprise", "mascot-beak beak-surprise", "surprise"),
    ("beak-talk-a", "mascot-beak beak-talk-a", "talk-a"),
    ("beak-talk-closed", "mascot-beak beak-talk-closed beak-default", "default"),
    ("beak-talk-e", "mascot-beak beak-talk-e", "talk-e"),
    ("beak-talk-fv", "mascot-beak beak-talk-fv", "talk-fv"),
    ("beak-talk-i", "mascot-beak beak-talk-i", "talk-i"),
    ("beak-talk-o", "mascot-beak beak-talk-o", "talk-o"),
    ("beak-talk-t", "mascot-beak beak-talk-t", "talk-t"),
    ("beak-talk-u", "mascot-beak beak-talk-u", "talk-u"),
    ("beak-talk-wide", "mascot-beak beak-talk-wide", "talk-wide"),
]

EYES_SPECS = [
    ("eyes-cry", "mascot-eye eyes-cry", "cry"),
    ("eyes-surprise", "mascot-eye eyes-surprise", "surprise"),
    ("eyes-wink", "mascot-eye eyes-wink eyes-wink-right", "wink"),
    ("eyes-wink-left", "mascot-eye eyes-wink-left", "wink-left"),
    ("eyes-sparkle", "mascot-eye eyes-sparkle", "sparkle"),
    ("eyes-heart", "mascot-eye eyes-heart", "heart"),
    ("eyes-happy", "mascot-eye eyes-happy", "happy"),
    ("eyes-laugh", "mascot-eye eyes-laugh", "laugh"),
    ("eyes-love", "mascot-eye eyes-love", "love"),
    ("eyes-open", "mascot-eye eyes-open eyes-default", "open"),
    ("eyes-shocked", "mascot-eye eyes-shocked", "shocked"),
    ("eyes-sleepy", "mascot-eye eyes-sleepy", "sleepy"),
    ("eyes-squint", "mascot-eye eyes-squint", "squint"),
    ("eyes-blink", "mascot-eye eyes-blink", "blink"),
]

PARTICLE_SPECS = [
    ("particle-sleep-z-small", "mascot-particle particle-sleep-z-small particle-sleep-z", "sleep-z-small"),
    ("particle-sleep-z-medium", "mascot-particle particle-sleep-z-medium particle-sleep-z", "sleep-z-medium"),
    ("particle-sleep-z-large", "mascot-particle particle-sleep-z-large particle-sleep-z", "sleep-z-large"),
    ("particle-bubbles", "mascot-particle particle-bubbles", "bubbles"),
    ("particle-cloud-thought", "mascot-particle particle-cloud-thought", "cloud-thought"),
    ("particle-sweat-drop-right", "mascot-particle particle-sweat-drop-right particle-drop-sweat-large particle-drop-tear", "sweat-drop-right"),
    ("particle-sweat-drop-left", "mascot-particle particle-sweat-drop-left", "sweat-drop-left"),
    ("particle-alert", "mascot-particle particle-alert particle-bubble-alert", "alert"),
    ("particle-dizzy", "mascot-particle particle-dizzy particle-shock-lines particle-bubble-dizzy", "dizzy"),
    ("particle-question", "mascot-particle particle-question particle-bubble-question", "question"),
]

STYLE_CONTENT = """
    .mascot-beak, .mascot-eye, .mascot-particle { display: none; }

    /* Default fallback for standalone viewing & unset attributes */
    .beak-default,
    .eyes-open { display: inline; }

    [data-beak] .beak-default { display: none; }
    [data-eyes] .eyes-open { display: none; }

    /* Beak visibility controls */
    [data-beak="default"] .beak-default,
    [data-beak="talk-closed"] .beak-talk-closed,
    [data-beak="talk-a"] .beak-talk-a,
    [data-beak="talk-e"] .beak-talk-e,
    [data-beak="talk-i"] .beak-talk-i,
    [data-beak="talk-o"] .beak-talk-o,
    [data-beak="talk-u"] .beak-talk-u,
    [data-beak="talk-t"] .beak-talk-t,
    [data-beak="talk-fv"] .beak-talk-fv,
    [data-beak="talk-wide"] .beak-talk-wide,
    [data-beak="smile"] .beak-smile,
    [data-beak="grin"] .beak-grin,
    [data-beak="smirk"] .beak-smirk,
    [data-beak="laugh"] .beak-laugh,
    [data-beak="pout"] .beak-pout,
    [data-beak="surprise"] .beak-surprise,
    [data-beak="shocked"] .beak-shocked,
    [data-beak="grimace"] .beak-grimace,
    [data-beak="dizzy"] .beak-dizzy,
    [data-beak="sleep"] .beak-sleep { display: inline; }

    /* Eyes visibility controls */
    [data-eyes="open"] .eyes-open,
    [data-eyes="default"] .eyes-open,
    [data-eyes="happy"] .eyes-happy,
    [data-eyes="laugh"] .eyes-laugh,
    [data-eyes="love"] .eyes-love,
    [data-eyes="heart"] .eyes-heart,
    [data-eyes="blink"] .eyes-blink,
    [data-eyes="sleepy"] .eyes-sleepy,
    [data-eyes="wink"] .eyes-wink,
    [data-eyes="wink-right"] .eyes-wink-right,
    [data-eyes="wink-left"] .eyes-wink-left,
    [data-eyes="squint"] .eyes-squint,
    [data-eyes="dizzy"] .eyes-dizzy,
    [data-eyes="shocked"] .eyes-shocked,
    [data-eyes="cry"] .eyes-cry,
    [data-eyes="sparkle"] .eyes-sparkle,
    [data-eyes="surprise"] .eyes-surprise { display: inline; }

    /* Particle visibility controls */
    [data-particle="cloud-thought"] .particle-cloud-thought,
    [data-particle="alert"] .particle-alert,
    [data-particle="bubble-alert"] .particle-alert,
    [data-particle="question"] .particle-question,
    [data-particle="bubble-question"] .particle-question,
    [data-particle="dizzy"] .particle-dizzy,
    [data-particle="bubble-dizzy"] .particle-dizzy,
    [data-particle="shock-lines"] .particle-dizzy,
    [data-particle="sweat-drop-right"] .particle-sweat-drop-right,
    [data-particle="drop-sweat-large"] .particle-sweat-drop-right,
    [data-particle="drop-tear"] .particle-sweat-drop-right,
    [data-particle="sweat-drop-left"] .particle-sweat-drop-left,
    [data-particle="bubbles"] .particle-bubbles,
    [data-particle="sleep-z"] .particle-sleep-z,
    [data-particle="sleep-z-large"] .particle-sleep-z-large,
    [data-particle="sleep-z-medium"] .particle-sleep-z-medium,
    [data-particle="sleep-z-small"] .particle-sleep-z-small { display: inline; }
"""

def uniformize_file(filepath):
    filename = os.path.basename(filepath)
    cfg = ALIGNMENT_OFFSETS.get(filename, (1.0, 0.0, 0.0))
    if len(cfg) == 3:
        s, dx, dy = cfg
    else:
        s, (dx, dy) = 1.0, cfg

    tree = ET.parse(filepath)
    root = tree.getroot()

    parent_map = {c: p for p in tree.iter() for c in p}

    # Locate the 3 modular groups
    beaks_group = None
    eyes_group = None
    part_group = None

    for elem in tree.iter():
        lbl = elem.attrib.get(f"{{{INKSCAPE_NS}}}label", "")
        id_ = elem.attrib.get("id", "")
        if (lbl == "Beaks" or id_ in ("g13", "mascot_beaks")) and beaks_group is None:
            beaks_group = elem
        elif (lbl == "Eyes" or id_ in ("g17", "mascot_eyes")) and eyes_group is None:
            eyes_group = elem
        elif (lbl == "Particules" or id_ in ("g14", "mascot_particles")) and part_group is None:
            part_group = elem

    assert beaks_group is not None, f"Beaks group not found in {filename}"
    assert eyes_group is not None, f"Eyes group not found in {filename}"
    assert part_group is not None, f"Particules group not found in {filename}"
    assert len(beaks_group) == 19, f"Expected 19 beaks in {filename}, got {len(beaks_group)}"
    assert len(eyes_group) == 14, f"Expected 14 eyes in {filename}, got {len(eyes_group)}"
    assert len(part_group) == 10, f"Expected 10 particles in {filename}, got {len(part_group)}"

    # Detach them from their parent
    for g in [beaks_group, eyes_group, part_group]:
        p = parent_map.get(g)
        if p is not None:
            p.remove(g)

    # Retain defs and markers
    defs = root.find(f"{{{SVG_NS}}}defs")
    if defs is None:
        defs = ET.Element(f"{{{SVG_NS}}}defs", {"id": "defs1"})
        root.insert(0, defs)

    # Clean existing style and add standard stylesheet
    for old_st in defs.findall(f"{{{SVG_NS}}}style"):
        defs.remove(old_st)
    style_el = ET.Element(f"{{{SVG_NS}}}style")
    style_el.text = STYLE_CONTENT
    defs.append(style_el)

    # Standardize Beaks Group
    beaks_transform = beaks_group.attrib.get("transform", "")
    new_beaks = ET.Element(
        f"{{{SVG_NS}}}g",
        {
            "id": "mascot_beaks",
            "class": "mascot-beaks-group",
            f"{{{INKSCAPE_NS}}}label": "Beaks",
        }
    )
    if beaks_transform:
        new_beaks.attrib["transform"] = beaks_transform

    for child, (b_id, b_cls, b_data) in zip(beaks_group, BEAK_SPECS):
        child.attrib["id"] = b_id
        child.attrib["class"] = b_cls
        child.attrib["data-beak"] = b_data
        new_beaks.append(child)

    # Standardize Eyes Group
    eyes_transform = eyes_group.attrib.get("transform", "")
    new_eyes = ET.Element(
        f"{{{SVG_NS}}}g",
        {
            "id": "mascot_eyes",
            "class": "mascot-eyes-group",
            f"{{{INKSCAPE_NS}}}label": "Eyes",
        }
    )
    if eyes_transform:
        new_eyes.attrib["transform"] = eyes_transform

    for child, (e_id, e_cls, e_data) in zip(eyes_group, EYES_SPECS):
        child.attrib["id"] = e_id
        child.attrib["class"] = e_cls
        child.attrib["data-eyes"] = e_data
        new_eyes.append(child)

    # Standardize Particles Group
    part_transform = part_group.attrib.get("transform", "")
    new_particles = ET.Element(
        f"{{{SVG_NS}}}g",
        {
            "id": "mascot_particles",
            "class": "mascot-particles-group",
            f"{{{INKSCAPE_NS}}}label": "Particules",
        }
    )
    if part_transform:
        new_particles.attrib["transform"] = part_transform

    for child, (p_id, p_cls, p_data) in zip(part_group, PARTICLE_SPECS):
        child.attrib["id"] = p_id
        child.attrib["class"] = p_cls
        child.attrib["data-particle"] = p_data
        new_particles.append(child)

    # If mascot_character already exists, find its mascot_body or remove wrapper
    existing_char = root.find(f"{{{SVG_NS}}}g[@id='mascot_character']")
    if existing_char is not None:
        root.remove(existing_char)
        body_container = existing_char.find(f"{{{SVG_NS}}}g[@id='mascot_body']")
        if body_container is None:
            body_container = ET.Element(
                f"{{{SVG_NS}}}g",
                {"id": "mascot_body", "class": "mascot-body", f"{{{INKSCAPE_NS}}}label": "Body"}
            )
            for c in list(existing_char):
                if c.attrib.get("id") not in ("mascot_beaks", "mascot_eyes", "mascot_particles"):
                    body_container.append(c)
    else:
        body_container = ET.Element(
            f"{{{SVG_NS}}}g",
            {
                "id": "mascot_body",
                "class": "mascot-body",
                f"{{{INKSCAPE_NS}}}label": "Body",
            }
        )
        remaining_children = [
            c for c in list(root)
            if not c.tag.endswith("defs") and not c.tag.endswith("namedview")
        ]
        for c in remaining_children:
            root.remove(c)
            body_container.append(c)

    # Clean any residual eye or reflection paths from the body layer
    parent_map_body = {c: p for p in body_container.iter() for c in p}
    for elem in list(body_container.iter()):
        lbl = elem.attrib.get(f"{{{INKSCAPE_NS}}}label", "").lower()
        id_ = elem.attrib.get("id", "").lower()
        if any(k in lbl or k in id_ for k in ("left_eye", "right_eye", "reflection", "path12-", "path17-")):
            p = parent_map_body.get(elem)
            if p is not None and elem in list(p):
                p.remove(elem)

    # Root Character Wrapper with translation and scale offset
    char_wrapper = ET.Element(
        f"{{{SVG_NS}}}g",
        {
            "id": "mascot_character",
            "class": "mascot-character",
            f"{{{INKSCAPE_NS}}}label": "Mascot Character",
        }
    )
    if s != 1.0:
        char_wrapper.attrib["transform"] = f"translate({dx:.2f}, {dy:.2f}) scale({s:.4f})"
    elif dx != 0.0 or dy != 0.0:
        char_wrapper.attrib["transform"] = f"translate({dx:.2f}, {dy:.2f})"

    # Order layers cleanly: Body -> Particles -> Beaks -> Eyes
    char_wrapper.append(body_container)
    char_wrapper.append(new_particles)
    char_wrapper.append(new_beaks)
    char_wrapper.append(new_eyes)

    root.append(char_wrapper)

    # Ensure root viewBox is 0 0 512 512
    root.attrib["viewBox"] = "0 0 512 512"
    root.attrib["width"] = "100%"
    root.attrib["height"] = "100%"

    # Write output
    ET.indent(tree, space="  ")
    tree.write(filepath, encoding="utf-8", xml_declaration=True)
    print(f"Uniformized {filename}: offset=({dx:+.2f}, {dy:+.2f})")

def main():
    target_dir = os.path.abspath("public/mascot/body")
    files = sorted(glob.glob(os.path.join(target_dir, "*.svg")))
    print(f"Processing {len(files)} body SVGs in {target_dir}...")
    for f in files:
        uniformize_file(f)
    print("All 20 mascot body SVGs successfully uniformized and aligned!")

if __name__ == "__main__":
    main()
