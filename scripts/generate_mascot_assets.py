#!/usr/bin/env python3
"""
Mascot Asset Generation Pipeline.
Generates all high-quality, high-simplicity SVGs for:
1. public/mascot/particles/ (hearts, clouds, bubbles, emotes, drops)
2. public/mascot/beak/ (emotional beak expressions)
3. public/mascot/eyes/ (emotional eye expressions)
4. public/mascot/body/ (body postures and movements)
5. public/mascot/catalog.json (machine-readable metadata)
6. public/mascot/CATALOG.md (visual reference documentation)
"""

import os
import json
import xml.etree.ElementTree as ET

BASE_DIR = "public/mascot"

# Solarized & Aptitek Color Palette
COLORS = {
    "base03": "#002b36",  # Dark outline
    "base02": "#073642",  # Pupil / deep shadow
    "base1":  "#93a1a1",  # Dust cloud
    "base3":  "#fdf6e3",  # Highlight / glint / cream
    "yellow": "#b58900",  # Beak / legs
    "red":    "#dc322f",  # Mouth cavity / red accent
    "magenta":"#d33682",  # Heart / blush
    "blue":   "#268bd2",  # Headphone / water / accent
    "green":  "#859900",  # Cybernetics
    "pink":   "#e896be",  # Body / wing fill
    "blossomCore": "#da5780", # Shadow pink
    "blossomDeep": "#f48498", # Bright pink
}

os.makedirs(f"{BASE_DIR}/body", exist_ok=True)
os.makedirs(f"{BASE_DIR}/beak", exist_ok=True)
os.makedirs(f"{BASE_DIR}/eyes", exist_ok=True)
os.makedirs(f"{BASE_DIR}/particles/hearts", exist_ok=True)
os.makedirs(f"{BASE_DIR}/particles/clouds", exist_ok=True)
os.makedirs(f"{BASE_DIR}/particles/bubbles", exist_ok=True)
os.makedirs(f"{BASE_DIR}/particles/emotes", exist_ok=True)
os.makedirs(f"{BASE_DIR}/particles/drops", exist_ok=True)

manifest = {
    "$schema": "./catalog.schema.json",
    "version": "2.0.0",
    "description": "Modular Mascot Asset Catalog for Aptipiou (Body, Beak, Eyes, Particles)",
    "palette": COLORS,
    "categories": {
        "particles": {},
        "beak": {},
        "eyes": {},
        "body": {}
    }
}

# =============================================================================
# 1. PARTICLES GENERATION
# =============================================================================

PARTICLES = {
    "hearts/heart-large.svg": {
        "viewBox": "0 0 64 64",
        "category": "hearts",
        "tags": ["love", "romance", "blush", "floating"],
        "defaultAnchor": "head-right",
        "motion": "float-up-fade",
        "content": """
  <path d="M 32 56 C 20 44 6 34 6 20 C 6 10 14 4 24 4 C 28.5 4 31 7 32 9 C 33 7 35.5 4 40 4 C 50 4 58 10 58 20 C 58 34 44 44 32 56 Z" fill="#da5780" stroke="#002b36" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 23 10 C 17 10 12 15 12 21 C 12 24 14 27 16 29" fill="none" stroke="#f48498" stroke-width="3" stroke-linecap="round"/>
  <circle cx="20" cy="16" r="2.5" fill="#fdf6e3"/>
"""
    },
    "hearts/heart-medium.svg": {
        "viewBox": "0 0 48 48",
        "category": "hearts",
        "tags": ["love", "tilted", "accent"],
        "defaultAnchor": "cheek-right",
        "motion": "float-up-fade",
        "content": """
  <g transform="rotate(-12 24 24)">
    <path d="M 24 42 C 15 33 4 25 4 15 C 4 7 10 3 18 3 C 21.5 3 23.5 5.5 24 7 C 24.5 5.5 26.5 3 30 3 C 38 3 44 7 44 15 C 44 25 33 33 24 42 Z" fill="#d33682" stroke="#002b36" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="15" cy="12" r="2" fill="#fdf6e3"/>
  </g>
"""
    },
    "hearts/heart-small.svg": {
        "viewBox": "0 0 32 32",
        "category": "hearts",
        "tags": ["love", "mini", "spark"],
        "defaultAnchor": "head-left",
        "motion": "float-up-fade",
        "content": """
  <path d="M 16 28 C 10 22 3 17 3 10 C 3 5 7 2 12 2 C 14.5 2 15.5 3.8 16 4.8 C 16.5 3.8 17.5 2 20 2 C 25 2 29 5 29 10 C 29 17 22 22 16 28 Z" fill="#dc322f" stroke="#002b36" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
"""
    },
    "hearts/heart-sparkle.svg": {
        "viewBox": "0 0 64 64",
        "category": "hearts",
        "tags": ["love", "sparkle", "celebrate"],
        "defaultAnchor": "head-top-right",
        "motion": "pulse-pop",
        "content": """
  <path d="M 28 50 C 18 40 6 31 6 19 C 6 10 13 5 22 5 C 26 5 27.5 7.5 28 9 C 28.5 7.5 30 5 34 5 C 43 5 50 10 50 19 C 50 31 38 40 28 50 Z" fill="#da5780" stroke="#002b36" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 48 10 Q 48 18 56 18 Q 48 18 48 26 Q 48 18 40 18 Q 48 18 48 10 Z" fill="#b58900" stroke="#002b36" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="48" cy="18" r="1.5" fill="#fdf6e3"/>
  <circle cx="18" cy="14" r="2.5" fill="#fdf6e3"/>
"""
    },
    "clouds/cloud-thought.svg": {
        "viewBox": "0 0 96 72",
        "category": "clouds",
        "tags": ["thinking", "dream", "thought"],
        "defaultAnchor": "head-top-right",
        "motion": "float-hover",
        "content": """
  <path d="M 32 46 C 24 46 18 40 18 32 C 18 24 24 18 32 18 C 34 10 42 4 52 4 C 64 4 72 12 72 22 C 80 22 86 28 86 36 C 86 44 80 50 72 50 C 68 50 56 50 32 46 Z" fill="#fdf6e3" stroke="#002b36" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="16" cy="56" r="6" fill="#fdf6e3" stroke="#002b36" stroke-width="4"/>
  <circle cx="8" cy="66" r="3.5" fill="#fdf6e3" stroke="#002b36" stroke-width="3"/>
"""
    },
    "clouds/dust-ground.svg": {
        "viewBox": "0 0 160 64",
        "category": "clouds",
        "tags": ["landing", "dust", "ground", "impact"],
        "defaultAnchor": "baseline-ground",
        "motion": "puff-expand-dissolve",
        "content": """
  <path d="M 10 56 C 8 46 16 36 28 36 C 32 26 44 18 58 18 C 72 18 84 26 88 36 C 96 28 110 28 118 36 C 126 32 138 34 144 42 C 150 48 148 56 142 56 Z" fill="#93a1a1" stroke="#002b36" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 32 42 C 40 32 54 26 66 26 C 76 26 86 32 90 38" fill="none" stroke="#fdf6e3" stroke-width="3" stroke-linecap="round"/>
  <line x1="4" y1="56" x2="156" y2="56" stroke="#002b36" stroke-width="5" stroke-linecap="round"/>
"""
    },
    "clouds/dust-puff-large.svg": {
        "viewBox": "0 0 64 64",
        "category": "clouds",
        "tags": ["dust", "puff", "landing"],
        "defaultAnchor": "foot-left",
        "motion": "puff-expand-dissolve",
        "content": """
  <path d="M 16 48 C 8 44 6 32 14 26 C 14 16 26 10 36 14 C 44 8 54 14 56 22 C 62 28 60 40 52 46 C 46 52 24 52 16 48 Z" fill="#93a1a1" stroke="#002b36" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 22 24 C 26 18 34 16 40 18" fill="none" stroke="#fdf6e3" stroke-width="3" stroke-linecap="round"/>
"""
    },
    "clouds/dust-puff-medium.svg": {
        "viewBox": "0 0 48 48",
        "category": "clouds",
        "tags": ["dust", "puff", "landing"],
        "defaultAnchor": "foot-right",
        "motion": "puff-expand-dissolve",
        "content": """
  <path d="M 12 36 C 6 32 5 24 11 19 C 11 12 20 7 27 10 C 33 6 40 10 42 16 C 46 21 44 30 38 34 C 33 38 18 39 12 36 Z" fill="#93a1a1" stroke="#002b36" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="18" r="2" fill="#fdf6e3"/>
"""
    },
    "clouds/dust-puff-small.svg": {
        "viewBox": "0 0 32 32",
        "category": "clouds",
        "tags": ["dust", "speck", "particle"],
        "defaultAnchor": "baseline-ground",
        "motion": "scatter-fade",
        "content": """
  <ellipse cx="16" cy="16" rx="12" ry="9" fill="#93a1a1" stroke="#002b36" stroke-width="3"/>
  <ellipse cx="14" cy="14" rx="4" ry="2.5" fill="#fdf6e3"/>
"""
    },
    "bubbles/bubble-large.svg": {
        "viewBox": "0 0 64 64",
        "category": "bubbles",
        "tags": ["bubble", "glossy", "dream"],
        "defaultAnchor": "head-right",
        "motion": "float-drift",
        "content": """
  <circle cx="32" cy="32" r="26" fill="#fdf6e3" stroke="#002b36" stroke-width="4.5"/>
  <path d="M 14 32 A 18 18 0 0 0 46 44 A 22 22 0 0 1 14 32 Z" fill="#268bd2" opacity="0.4"/>
  <path d="M 18 24 A 16 16 0 0 1 34 14" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="42" cy="38" r="2" fill="#ffffff"/>
"""
    },
    "bubbles/bubble-medium.svg": {
        "viewBox": "0 0 48 48",
        "category": "bubbles",
        "tags": ["bubble", "floating"],
        "defaultAnchor": "head-top-right",
        "motion": "float-drift",
        "content": """
  <circle cx="24" cy="24" r="19" fill="#fdf6e3" stroke="#002b36" stroke-width="3.5"/>
  <path d="M 11 24 A 13 13 0 0 0 34 33 A 16 16 0 0 1 11 24 Z" fill="#268bd2" opacity="0.4"/>
  <path d="M 14 18 A 12 12 0 0 1 26 11" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
"""
    },
    "bubbles/bubble-small.svg": {
        "viewBox": "0 0 32 32",
        "category": "bubbles",
        "tags": ["bubble", "trailing"],
        "defaultAnchor": "head-right",
        "motion": "float-drift",
        "content": """
  <circle cx="16" cy="16" r="12" fill="#fdf6e3" stroke="#002b36" stroke-width="2.8"/>
  <path d="M 9 12 A 8 8 0 0 1 18 7" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
"""
    },
    "bubbles/sleep-z-large.svg": {
        "viewBox": "0 0 48 48",
        "category": "bubbles",
        "tags": ["sleep", "zzz", "resting"],
        "defaultAnchor": "head-top-right",
        "motion": "float-up-fade",
        "content": """
  <path d="M 10 12 L 36 12 C 38 12 39 13 37 15 L 14 36 L 38 36" fill="none" stroke="#002b36" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
"""
    },
    "bubbles/sleep-z-medium.svg": {
        "viewBox": "0 0 36 36",
        "category": "bubbles",
        "tags": ["sleep", "zzz"],
        "defaultAnchor": "head-top-right",
        "motion": "float-up-fade",
        "content": """
  <path d="M 8 9 L 28 9 C 29.5 9 30 10 28.5 11.5 L 11 27 L 29 27" fill="none" stroke="#002b36" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
"""
    },
    "bubbles/sleep-z-small.svg": {
        "viewBox": "0 0 24 24",
        "category": "bubbles",
        "tags": ["sleep", "zzz"],
        "defaultAnchor": "head-top-right",
        "motion": "float-up-fade",
        "content": """
  <path d="M 5 6 L 19 6 C 20 6 20.5 6.8 19.5 7.8 L 7.5 18 L 20 18" fill="none" stroke="#002b36" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
"""
    },
    "emotes/bubble-question.svg": {
        "viewBox": "0 0 72 72",
        "category": "emotes",
        "tags": ["curious", "question", "bubble"],
        "defaultAnchor": "head-top-right",
        "motion": "pop-in",
        "content": """
  <circle cx="36" cy="36" r="30" fill="#fdf6e3" stroke="#002b36" stroke-width="5"/>
  <path d="M 28 26 C 28 20 32 16 37 16 C 42 16 46 20 46 25 C 46 30 41 33 37 36 L 37 42" fill="none" stroke="#002b36" stroke-width="5" stroke-linecap="round"/>
  <circle cx="37" cy="50" r="3.5" fill="#002b36"/>
"""
    },
    "emotes/bubble-alert.svg": {
        "viewBox": "0 0 72 72",
        "category": "emotes",
        "tags": ["alert", "exclamation", "bubble"],
        "defaultAnchor": "head-top-right",
        "motion": "pop-in",
        "content": """
  <circle cx="36" cy="36" r="30" fill="#fdf6e3" stroke="#002b36" stroke-width="5"/>
  <line x1="36" y1="18" x2="36" y2="39" stroke="#dc322f" stroke-width="6.5" stroke-linecap="round"/>
  <circle cx="36" cy="50" r="4" fill="#dc322f"/>
"""
    },
    "emotes/bubble-dizzy.svg": {
        "viewBox": "0 0 72 72",
        "category": "emotes",
        "tags": ["dizzy", "spiral", "swirl"],
        "defaultAnchor": "head-top-right",
        "motion": "rotate-spin",
        "content": """
  <circle cx="36" cy="36" r="30" fill="#fdf6e3" stroke="#002b36" stroke-width="5"/>
  <path d="M 36 36 A 4 4 0 0 1 36 32 A 8 8 0 0 1 42 36 A 12 12 0 0 1 34 46 A 16 16 0 0 1 20 34 A 20 20 0 0 1 40 18" fill="none" stroke="#002b36" stroke-width="4" stroke-linecap="round"/>
"""
    },
    "emotes/sparkle.svg": {
        "viewBox": "0 0 48 48",
        "category": "emotes",
        "tags": ["sparkle", "star", "celebrate"],
        "defaultAnchor": "head-top-right",
        "motion": "pulse-pop",
        "content": """
  <path d="M 24 4 Q 24 24 44 24 Q 24 24 24 44 Q 24 24 4 24 Q 24 24 24 4 Z" fill="#b58900" stroke="#002b36" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="24" cy="24" r="3" fill="#fdf6e3"/>
"""
    },
    "emotes/shock-lines.svg": {
        "viewBox": "0 0 64 64",
        "category": "emotes",
        "tags": ["shock", "action", "surprise"],
        "defaultAnchor": "head-left",
        "motion": "burst",
        "content": """
  <line x1="8" y1="20" x2="26" y2="28" stroke="#002b36" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="12" y1="36" x2="30" y2="36" stroke="#002b36" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="10" y1="52" x2="26" y2="44" stroke="#002b36" stroke-width="4.5" stroke-linecap="round"/>
"""
    },
    "drops/drop-sweat-large.svg": {
        "viewBox": "0 0 48 64",
        "category": "drops",
        "tags": ["sweat", "nervous", "anxious"],
        "defaultAnchor": "forehead-right",
        "motion": "fall-drip",
        "content": """
  <g transform="rotate(-20 24 32)">
    <path d="M 24 8 C 24 8 10 26 10 38 C 10 48 16 56 24 56 C 32 56 38 48 38 38 C 38 26 24 8 24 8 Z" fill="#268bd2" stroke="#002b36" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 18 36 C 18 30 20 24 22 20" fill="none" stroke="#fdf6e3" stroke-width="2.5" stroke-linecap="round"/>
  </g>
"""
    },
    "drops/drop-sweat-small.svg": {
        "viewBox": "0 0 32 40",
        "category": "drops",
        "tags": ["sweat", "bead", "nervous"],
        "defaultAnchor": "forehead-right",
        "motion": "fall-drip",
        "content": """
  <path d="M 16 4 C 16 4 6 16 6 24 C 6 30 10 35 16 35 C 22 35 26 30 26 24 C 26 16 16 4 16 4 Z" fill="#268bd2" stroke="#002b36" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="13" cy="22" r="1.8" fill="#fdf6e3"/>
"""
    },
    "drops/drop-tear.svg": {
        "viewBox": "0 0 40 56",
        "category": "drops",
        "tags": ["cry", "tear", "sad"],
        "defaultAnchor": "eye-bottom-left",
        "motion": "fall-drip",
        "content": """
  <path d="M 20 6 C 20 6 7 22 7 34 C 7 43 13 49 20 49 C 27 49 33 43 33 34 C 33 22 20 6 20 6 Z" fill="#268bd2" opacity="0.85" stroke="#002b36" stroke-width="3.5" stroke-linejoin="round"/>
  <ellipse cx="16" cy="32" rx="3" ry="5" fill="#fdf6e3"/>
"""
    },
    "drops/sweat-splash.svg": {
        "viewBox": "0 0 48 48",
        "category": "drops",
        "tags": ["sweat", "splash", "stress"],
        "defaultAnchor": "head-right",
        "motion": "burst",
        "content": """
  <ellipse cx="12" cy="14" rx="5" ry="3.5" transform="rotate(-30 12 14)" fill="#268bd2" stroke="#002b36" stroke-width="2.5"/>
  <ellipse cx="28" cy="10" rx="7" ry="4.5" transform="rotate(20 28 10)" fill="#268bd2" stroke="#002b36" stroke-width="2.5"/>
  <ellipse cx="38" cy="26" rx="5.5" ry="3.5" transform="rotate(45 38 26)" fill="#268bd2" stroke="#002b36" stroke-width="2.5"/>
  <ellipse cx="22" cy="34" rx="8" ry="5.5" transform="rotate(-15 22 34)" fill="#268bd2" stroke="#002b36" stroke-width="3"/>
"""
    }
}

for rel_path, data in PARTICLES.items():
    full_path = f"{BASE_DIR}/particles/{rel_path}"
    svg_str = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="{data['viewBox']}" width="100%" height="100%">
{data['content'].strip()}
</svg>"""
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(svg_str)
    
    file_id = os.path.splitext(os.path.basename(rel_path))[0]
    manifest["categories"]["particles"][file_id] = {
        "path": f"/mascot/particles/{rel_path}",
        "category": data["category"],
        "viewBox": data["viewBox"],
        "tags": data["tags"],
        "defaultAnchor": data["defaultAnchor"],
        "motionPreset": data["motion"]
    }

print(f"Generated {len(PARTICLES)} particle SVGs.")

# =============================================================================
# 2. BEAK EXPRESSIONS GENERATION
# =============================================================================

# Authentic baseline upper beak from aptipiou_redone.svg
BASE_UPPER_BEAK = 'm 242.89176,235.45216 c 2.18499,-6.19281 12.05075,-28.81676 29.58678,-23.15489 9.70947,3.13491 31.00783,12.83479 27.78587,26.24221 -15.14988,18.36926 -57.44284,0.81377 -57.37265,-3.08732 z'

BEAKS = {
    "default.svg": {
        "label": "Neutral / Default",
        "description": "Resting, calm closed beak with upper yellow beak and red lower lip",
        "tags": ["neutral", "calm", "default", "idle"],
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 238.37335,245.49172 c 5.59398,-15.85474 53.28268,-14.11077 49.39708,2.05821 -1.42667,15.22722 -17.63946,26.24808 -29.70765,21.36868 -14.70276,-5.94462 -19.72797,-21.28439 -19.68943,-23.42689 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="{BASE_UPPER_BEAK}"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "smile.svg": {
        "label": "Smile",
        "description": "Cheerful upturned smiling beak with warm curve",
        "tags": ["smile", "happy", "friendly", "cheerful"],
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 240 242 c 4 -4 56 -4 60 0 c -4 16 -24 24 -30 24 c -6 0 -26 -8 -30 -24 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="{BASE_UPPER_BEAK}"
       id="upper_beak"
       inkscape:label="upper_beak" />
    <path
       style="fill:none;stroke:#002b36;stroke-width:10;stroke-linecap:round"
       d="m 244 240 q 26 8 52 -1"
       id="smile_crease"
       inkscape:label="smile_crease" />
"""
    },
    "laugh.svg": {
        "label": "Laugh / Joy",
        "description": "Wide open laughing mouth showing deep oral cavity and tongue",
        "tags": ["laugh", "joy", "glee", "open"],
        "content": f"""
    <path
       style="fill:#073642;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 238 238 c 4 38 60 38 64 0 c 0 -8 -64 -8 -64 0 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#dc322f;stroke:none"
       d="m 246 252 c 8 -8 32 -8 40 0 c -6 12 -34 12 -40 0 z"
       id="tongue"
       inkscape:label="tongue" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="{BASE_UPPER_BEAK}"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "grin.svg": {
        "label": "Grin",
        "description": "Broad cheerful beaming smile with open energy",
        "tags": ["grin", "beaming", "happy"],
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 236 240 c 8 20 54 20 64 0 c -8 -4 -56 -4 -64 0 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="{BASE_UPPER_BEAK}"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "surprise.svg": {
        "label": "Surprise / Gasp",
        "description": "Rounded dropped jaw 'O' gasp in surprise",
        "tags": ["surprise", "gasp", "alert", "curious"],
        "content": f"""
    <path
       style="fill:#073642;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 254 234 c 18 0 22 26 12 34 c -10 8 -22 6 -24 -8 c -2 -14 6 -26 12 -26 z"
       id="mouth"
       inkscape:label="mouth" />
    <ellipse cx="266" cy="254" rx="6" ry="6" fill="#dc322f" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 244 232 c 4 -12 18 -26 32 -20 c 8 3 24 12 22 24 c -14 6 -48 2 -54 -4 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "shocked.svg": {
        "label": "Shocked",
        "description": "Wide dropped jaw agape in disbelief and shock",
        "tags": ["shocked", "stunned", "disbelief"],
        "content": f"""
    <path
       style="fill:#073642;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 250 236 c 26 -2 28 38 12 42 c -16 4 -28 -14 -24 -42 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 244 232 c 4 -12 18 -26 32 -20 c 8 3 24 12 22 24 c -14 6 -48 2 -54 -4 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "smirk.svg": {
        "label": "Smirk / Coy",
        "description": "Asymmetric confident sly smirk tilted cheerfully",
        "tags": ["smirk", "coy", "confident", "wink"],
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 244 246 c 12 -2 46 -14 56 -2 c -8 18 -44 14 -56 2 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="{BASE_UPPER_BEAK}"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "pout.svg": {
        "label": "Pout / Sad",
        "description": "Downturned frowning lower beak with quivering pout",
        "tags": ["pout", "sad", "cry", "frown"],
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 242 248 c 12 8 46 8 58 -2 c -12 -12 -46 -12 -58 2 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="{BASE_UPPER_BEAK}"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "dizzy.svg": {
        "label": "Dizzy / Wavy",
        "description": "Wobbly squiggly undulating mouth line for dizziness",
        "tags": ["dizzy", "wavy", "confused"],
        "content": f"""
    <path
       style="fill:none;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 242 244 c 8 8 16 -8 24 4 c 8 8 16 -8 24 2"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="{BASE_UPPER_BEAK}"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "grimace.svg": {
        "label": "Grimace / Tense",
        "description": "Tense horizontal wavy grimace line with slight sweat tension",
        "tags": ["grimace", "tense", "sweat", "nervous"],
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 240 244 c 14 -2 46 -2 60 0 c -4 8 -56 8 -60 0 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="{BASE_UPPER_BEAK}"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "sleep.svg": {
        "label": "Sleep / Peaceful",
        "description": "Completely relaxed gentle resting beak with subtle peaceful parting",
        "tags": ["sleep", "peaceful", "relaxed", "dream"],
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:10;stroke-linecap:round;stroke-linejoin:round"
       d="m 244 246 c 12 4 44 4 54 0 c -10 4 -44 4 -54 0 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="{BASE_UPPER_BEAK}"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    }
}

for file_name, data in BEAKS.items():
    full_path = f"{BASE_DIR}/beak/{file_name}"
    svg_str = f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   width="512mm"
   height="512mm"
   viewBox="0 0 512 512"
   version="1.1"
   data-bbox="235 210 70 60"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns="http://www.w3.org/2000/svg">
  <g id="layer1" inkscape:label="Layer 1">
    <g id="mascot_beak" transform="translate(13.165564,1.2346624)" inkscape:label="{data['label']}">
{data['content'].strip()}
    </g>
  </g>
</svg>"""
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(svg_str)
    
    file_id = os.path.splitext(file_name)[0]
    manifest["categories"]["beak"][file_id] = {
        "path": f"/mascot/beak/{file_name}",
        "label": data["label"],
        "description": data["description"],
        "tags": data["tags"],
        "viewBox": "0 0 512 512",
        "bboxTight": "235 210 70 60"
    }

print(f"Generated {len(BEAKS)} beak expression SVGs.")

# =============================================================================
# 3. EYE EXPRESSIONS GENERATION
# =============================================================================

# Canonical open eye elements from aptipiou_redone.svg
RIGHT_EYE_PUPIL = """
    <ellipse cx="195.84572" cy="221.08878" rx="24.415411" ry="30.78219" fill="#073642" id="right_eye" inkscape:label="right_eye"/>
    <ellipse cx="202.43822" cy="209.3676" rx="6.5605512" ry="7.0751042" fill="#fdf6e3" id="upper_right_reflection" inkscape:label="upper_right_reflection"/>
    <ellipse cx="193.81396" cy="230.65387" rx="3.6392932" ry="3.9247279" fill="#fdf6e3" id="lower_right_reflection" inkscape:label="lower_right_reflection"/>
"""

LEFT_EYE_PUPIL = """
    <ellipse cx="338.15738" cy="211.28951" rx="21.868504" ry="29.326815" fill="#073642" id="left_eye" inkscape:label="left_eye"/>
    <ellipse cx="331.05725" cy="201.90196" rx="6.5605512" ry="7.0751042" fill="#fdf6e3" id="upper_left_reflection" inkscape:label="upper_left_reflection"/>
    <ellipse cx="343.68375" cy="219.94017" rx="3.6392932" ry="3.9247279" fill="#fdf6e3" id="lower_left_reflection" inkscape:label="lower_left_reflection"/>
"""

RIGHT_HAPPY_ARC = """
    <path d="M 172 226 Q 196 200 220 226" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="right_eye_happy" inkscape:label="right_eye"/>
"""

LEFT_HAPPY_ARC = """
    <path d="M 316 216 Q 338 190 360 216" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="left_eye_happy" inkscape:label="left_eye"/>
"""

RIGHT_BLINK_ARC = """
    <path d="M 172 220 Q 196 238 220 220" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="right_eye_blink" inkscape:label="right_eye"/>
"""

LEFT_BLINK_ARC = """
    <path d="M 316 210 Q 338 228 360 210" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="left_eye_blink" inkscape:label="left_eye"/>
"""

EYES = {
    "open.svg": {
        "label": "Open / Default",
        "description": "Standard alert open pupils with dual specular highlights",
        "tags": ["open", "default", "alert", "curious"],
        "content": RIGHT_EYE_PUPIL + LEFT_EYE_PUPIL
    },
    "blink.svg": {
        "label": "Blink / Closed",
        "description": "Peaceful downward gentle curved arcs (u u)",
        "tags": ["blink", "closed", "peaceful", "sleep"],
        "content": RIGHT_BLINK_ARC + LEFT_BLINK_ARC
    },
    "happy.svg": {
        "label": "Happy / Joy",
        "description": "Upward cheerful smiling anime arcs (^ ^)",
        "tags": ["happy", "joy", "cheer", "smile"],
        "content": RIGHT_HAPPY_ARC + LEFT_HAPPY_ARC
    },
    "wink.svg": {
        "label": "Wink (Right Eye Closed)",
        "description": "Left eye open with specular glints and right eye in cheerful wink",
        "tags": ["wink", "playful", "cheeky", "coy"],
        "content": RIGHT_HAPPY_ARC + LEFT_EYE_PUPIL
    },
    "wink-left.svg": {
        "label": "Wink Left (Left Eye Closed)",
        "description": "Right eye open with specular glints and left eye in cheerful wink",
        "tags": ["wink", "playful", "coy"],
        "content": RIGHT_EYE_PUPIL + LEFT_HAPPY_ARC
    },
    "squint.svg": {
        "label": "Squint",
        "description": "Narrowed laughing or concentrated squint with visible pupils",
        "tags": ["squint", "laugh", "focused", "concentrated"],
        "content": f"""
    <path d="M 172 220 Q 196 226 220 216" fill="none" stroke="#002b36" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="196" cy="222" rx="14" ry="10" fill="#073642"/>
    <ellipse cx="200" cy="220" rx="4" ry="3" fill="#fdf6e3"/>
    <path d="M 316 210 Q 338 216 360 206" fill="none" stroke="#002b36" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="338" cy="212" rx="14" ry="10" fill="#073642"/>
    <ellipse cx="342" cy="210" rx="4" ry="3" fill="#fdf6e3"/>
"""
    },
    "laugh.svg": {
        "label": "Laugh / Glee",
        "description": "Deeply squeezed joyous crescents celebrating with glee",
        "tags": ["laugh", "joy", "glee", "celebrate"],
        "content": f"""
    <path d="M 174 222 L 194 214 L 218 222" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 318 212 L 338 204 L 358 212" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" stroke-linejoin="round"/>
"""
    },
    "dizzy.svg": {
        "label": "Dizzy / Spiral",
        "description": "Hypnotic spiral dizzy pupils for confusion or disorientation",
        "tags": ["dizzy", "spiral", "swirl", "confused"],
        "content": f"""
    <g transform="translate(196, 221)">
      <circle cx="0" cy="0" r="24" fill="#fdf6e3" stroke="#002b36" stroke-width="5"/>
      <path d="M 0 0 A 4 4 0 0 1 0 -4 A 8 8 0 0 1 6 0 A 12 12 0 0 1 -2 10 A 16 16 0 0 1 -14 -2 A 20 20 0 0 1 4 -18" fill="none" stroke="#002b36" stroke-width="4.5" stroke-linecap="round"/>
    </g>
    <g transform="translate(338, 211)">
      <circle cx="0" cy="0" r="22" fill="#fdf6e3" stroke="#002b36" stroke-width="5"/>
      <path d="M 0 0 A 4 4 0 0 1 0 -4 A 8 8 0 0 1 6 0 A 12 12 0 0 1 -2 10 A 16 16 0 0 1 -14 -2 A 20 20 0 0 1 4 -18" fill="none" stroke="#002b36" stroke-width="4.5" stroke-linecap="round"/>
    </g>
"""
    },
    "shocked.svg": {
        "label": "Shocked / Pinpoint",
        "description": "Wide stare with tiny pinpoint pupils inside wide white glint disks",
        "tags": ["shocked", "pinpoint", "alert", "surprise"],
        "content": f"""
    <circle cx="196" cy="221" r="25" fill="#fdf6e3" stroke="#002b36" stroke-width="6"/>
    <circle cx="196" cy="221" r="5.5" fill="#002b36"/>
    <circle cx="338" cy="211" r="23" fill="#fdf6e3" stroke="#002b36" stroke-width="6"/>
    <circle cx="338" cy="211" r="5.5" fill="#002b36"/>
"""
    },
    "love.svg": {
        "label": "Love / Heart Pupils",
        "description": "Glowing heart-shaped pupils with specular glint dots",
        "tags": ["love", "heart", "adoration", "romance"],
        "content": f"""
    <g transform="translate(196, 221)">
      <circle cx="0" cy="0" r="25" fill="#073642"/>
      <path d="M 0 12 C -6 6 -14 0 -14 -6 C -14 -12 -8 -15 -2 -13 C 0 -11 0 -11 0 -11 C 0 -11 0 -11 2 -13 C 8 -15 14 -12 14 -6 C 14 0 6 6 0 12 Z" fill="#d33682" stroke="#dc322f" stroke-width="2"/>
      <circle cx="-3" cy="-7" r="2" fill="#fdf6e3"/>
    </g>
    <g transform="translate(338, 211)">
      <circle cx="0" cy="0" r="23" fill="#073642"/>
      <path d="M 0 12 C -6 6 -14 0 -14 -6 C -14 -12 -8 -15 -2 -13 C 0 -11 0 -11 0 -11 C 0 -11 0 -11 2 -13 C 8 -15 14 -12 14 -6 C 14 0 6 6 0 12 Z" fill="#d33682" stroke="#dc322f" stroke-width="2"/>
      <circle cx="-3" cy="-7" r="2" fill="#fdf6e3"/>
    </g>
"""
    },
    "sleepy.svg": {
        "label": "Sleepy / Drowsy",
        "description": "Heavy drooping eyelids resting half-way over relaxed pupils",
        "tags": ["sleepy", "drowsy", "tired", "resting"],
        "content": f"""
    {RIGHT_EYE_PUPIL}
    <path d="M 170 216 Q 196 230 222 216 C 220 200 172 200 170 216 Z" fill="#e896be" stroke="#002b36" stroke-width="6"/>
    {LEFT_EYE_PUPIL}
    <path d="M 314 206 Q 338 220 362 206 C 360 190 316 190 314 206 Z" fill="#e896be" stroke="#002b36" stroke-width="6"/>
"""
    },
    "cry.svg": {
        "label": "Cry / Tears",
        "description": "Squeezed sorrowful closed eyes with teardrop wells",
        "tags": ["cry", "sad", "tears", "sorrow"],
        "content": f"""
    <path d="M 172 222 Q 196 238 220 222" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round"/>
    <ellipse cx="170" cy="230" rx="8" ry="6" fill="#268bd2" stroke="#002b36" stroke-width="3"/>
    <circle cx="168" cy="228" r="2" fill="#fdf6e3"/>
    <path d="M 316 210 Q 338 228 360 210" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round"/>
    <ellipse cx="362" cy="218" rx="8" ry="6" fill="#268bd2" stroke="#002b36" stroke-width="3"/>
    <circle cx="360" cy="216" r="2" fill="#fdf6e3"/>
"""
    }
}

for file_name, data in EYES.items():
    full_path = f"{BASE_DIR}/eyes/{file_name}"
    svg_str = f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   width="512mm"
   height="512mm"
   viewBox="0 0 512 512"
   version="1.1"
   data-bbox="160 175 220 85"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns="http://www.w3.org/2000/svg">
  <g id="layer1" inkscape:label="Layer 1">
    <g id="mascot_eyes" transform="translate(13.165564,1.2346624)" inkscape:label="{data['label']}">
{data['content'].strip()}
    </g>
  </g>
</svg>"""
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(svg_str)
    
    file_id = os.path.splitext(file_name)[0]
    manifest["categories"]["eyes"][file_id] = {
        "path": f"/mascot/eyes/{file_name}",
        "label": data["label"],
        "description": data["description"],
        "tags": data["tags"],
        "viewBox": "0 0 512 512",
        "bboxTight": "160 175 220 85"
    }

print(f"Generated {len(EYES)} eye expression SVGs.")

# =============================================================================
# 4. BODY POSTURES & MOVEMENTS GENERATION
# =============================================================================

# Extract raw element snippets from aptipiou_redone.svg
with open("public/aptipiou_redone.svg", "r", encoding="utf-8") as f:
    svg_raw = f.read()

def extract_element_by_id(raw, elem_id):
    import re
    m = re.search(r'(<(?:path|ellipse)[^>]*id="' + elem_id + r'"[^>]*/>)', raw)
    if m:
        return m.group(1)
    m = re.search(r'(<(?:path|ellipse)[^>]*id="' + elem_id + r'"[^>]*>.*?</(?:path|ellipse)>)', raw, re.DOTALL)
    if m:
        return m.group(1)
    return ""

RAW_BODY = extract_element_by_id(svg_raw, "path1")
RAW_LEFT_WING = extract_element_by_id(svg_raw, "path3")
RAW_RIGHT_WING = extract_element_by_id(svg_raw, "path3-3")
RAW_CYBER_WING1 = extract_element_by_id(svg_raw, "path4")
RAW_CYBER_WING2 = extract_element_by_id(svg_raw, "path5")
RAW_CYBER_IMPLANT = extract_element_by_id(svg_raw, "path6")
RAW_CYBER_EAR = extract_element_by_id(svg_raw, "path7")
RAW_HEADPHONES = extract_element_by_id(svg_raw, "ellipse7")
RAW_ANTENNA = extract_element_by_id(svg_raw, "path8")
RAW_CYBER1 = extract_element_by_id(svg_raw, "path9")
RAW_CYBER2 = extract_element_by_id(svg_raw, "path9-2")
RAW_GLASS_BRIDGE = extract_element_by_id(svg_raw, "path11")
RAW_GLASSES = extract_element_by_id(svg_raw, "path10")
RAW_BLUSH_RIGHT = extract_element_by_id(svg_raw, "path14")
RAW_BLUSH_LEFT = extract_element_by_id(svg_raw, "path15")
RAW_RIGHT_LEG = extract_element_by_id(svg_raw, "path16")
RAW_LEFT_LEG = extract_element_by_id(svg_raw, "path16-3")

BODY_POSES = {
    "standing.svg": {
        "label": "Standing / Idle",
        "description": "Default upright resting posture with legs planted firmly and wings at sides",
        "tags": ["standing", "idle", "default", "rest"],
        "left_wing_xf": "",
        "right_wing_xf": "",
        "body_xf": "",
        "legs_xf": "",
    },
    "fly-glide.svg": {
        "label": "Fly - Glide",
        "description": "Streamlined flight glide with wings spread wide horizontally and legs tucked",
        "tags": ["flying", "glide", "wings-spread"],
        "left_wing_xf": 'transform="rotate(-25 360 300) scale(1.1 0.9)"',
        "right_wing_xf": 'transform="rotate(30 140 350)"',
        "body_xf": 'transform="rotate(-4 256 256)"',
        "legs_xf": 'transform="translate(0, -60) scale(0.65 0.5)"',
    },
    "fly-upstroke.svg": {
        "label": "Fly - Upstroke",
        "description": "Flight upstroke with wingtips flapped high upward and body angled upward",
        "tags": ["flying", "upstroke", "flap"],
        "left_wing_xf": 'transform="rotate(-60 360 300) scale(1.05 1.15)"',
        "right_wing_xf": 'transform="rotate(65 140 350)"',
        "body_xf": 'transform="rotate(-8 256 256) translate(0, -10)"',
        "legs_xf": 'transform="translate(0, -65) scale(0.6 0.5)"',
    },
    "fly-downstroke.svg": {
        "label": "Fly - Downstroke",
        "description": "Flight downstroke with powerful downward thrust pushing body forward",
        "tags": ["flying", "downstroke", "thrust"],
        "left_wing_xf": 'transform="rotate(25 360 300) scale(1.05 0.95)"',
        "right_wing_xf": 'transform="rotate(-20 140 350)"',
        "body_xf": 'transform="rotate(2 256 256) translate(0, 10)"',
        "legs_xf": 'transform="translate(0, -55) scale(0.65 0.55)"',
    },
    "fly-bank.svg": {
        "label": "Fly - Banking Turn",
        "description": "Aerodynamic banking turn glide with asymmetrical wing angles",
        "tags": ["flying", "turn", "bank"],
        "left_wing_xf": 'transform="rotate(-15 360 300)"',
        "right_wing_xf": 'transform="rotate(45 140 350)"',
        "body_xf": 'transform="rotate(-10 256 256)"',
        "legs_xf": 'transform="translate(0, -60) scale(0.65 0.5)"',
    },
    "sleep.svg": {
        "label": "Sleep / Curled",
        "description": "Curled up sleeping posture resting peacefully low on the ground",
        "tags": ["sleep", "crouch", "rest", "curled"],
        "left_wing_xf": 'transform="rotate(10 360 300) translate(-15, 10)"',
        "right_wing_xf": 'transform="rotate(-10 140 350)"',
        "body_xf": 'transform="translate(0, 48) scale(1.05 0.88)"',
        "legs_xf": 'transform="translate(0, -45) scale(0.7 0.55)"',
    },
    "wakeup-crouch.svg": {
        "label": "Wakeup - Crouch",
        "description": "Ground crouch posture starting to stir and wake from sleep",
        "tags": ["wakeup", "crouch", "stirring"],
        "left_wing_xf": 'transform="translate(-8, 5)"',
        "right_wing_xf": 'transform="translate(5, 5)"',
        "body_xf": 'transform="translate(0, 32) scale(1.03 0.92)"',
        "legs_xf": 'transform="translate(0, -30) scale(0.8 0.7)"',
    },
    "wakeup-stretch.svg": {
        "label": "Wakeup - Stretch",
        "description": "Stretching upward from ground crouch with wings unfurling",
        "tags": ["wakeup", "stretch", "rising"],
        "left_wing_xf": 'transform="rotate(-30 360 300)"',
        "right_wing_xf": 'transform="rotate(20 140 350)"',
        "body_xf": 'transform="translate(0, -10) scale(0.98 1.04)"',
        "legs_xf": 'transform="translate(0, -5) scale(0.95 0.95)"',
    },
    "land-touchdown.svg": {
        "label": "Landing - Touchdown",
        "description": "Feet reaching downward to absorb ground contact upon landing",
        "tags": ["landing", "touchdown", "contact"],
        "left_wing_xf": 'transform="rotate(-35 360 300)"',
        "right_wing_xf": 'transform="rotate(35 140 350)"',
        "body_xf": 'transform="translate(0, -15) scale(0.97 1.05)"',
        "legs_xf": 'transform="translate(0, 15) scale(0.95 1.1)"',
    },
    "land-impact.svg": {
        "label": "Landing - Impact Squash",
        "description": "Deep squash compression on ground absorbing touchdown momentum",
        "tags": ["landing", "impact", "squash", "crouch"],
        "left_wing_xf": 'transform="rotate(15 360 300)"',
        "right_wing_xf": 'transform="rotate(-15 140 350)"',
        "body_xf": 'transform="translate(0, 42) scale(1.08 0.88)"',
        "legs_xf": 'transform="translate(0, 8) scale(1.2 0.7)"',
    },
    "land-settle.svg": {
        "label": "Landing - Settle",
        "description": "Low settled landing crouch at ground baseline",
        "tags": ["landing", "settle", "ground"],
        "left_wing_xf": 'transform="rotate(8 360 300)"',
        "right_wing_xf": 'transform="rotate(-8 140 350)"',
        "body_xf": 'transform="translate(0, 26) scale(1.04 0.93)"',
        "legs_xf": 'transform="translate(0, -5) scale(1.1 0.85)"',
    },
    "land-rebound.svg": {
        "label": "Landing - Rebound",
        "description": "Rebounding upward from landing compression recovering balance",
        "tags": ["landing", "rebound", "recovery"],
        "left_wing_xf": 'transform="rotate(-15 360 300)"',
        "right_wing_xf": 'transform="rotate(15 140 350)"',
        "body_xf": 'transform="translate(0, -12) scale(0.98 1.04)"',
        "legs_xf": 'transform="translate(0, -5) scale(1.0 0.95)"',
    },
    "land-stand.svg": {
        "label": "Landing - Stand",
        "description": "Straightening up back to full upright standing posture",
        "tags": ["landing", "stand", "idle"],
        "left_wing_xf": '',
        "right_wing_xf": '',
        "body_xf": '',
        "legs_xf": '',
    },
    "happy-bounce.svg": {
        "label": "Happy - Bounce",
        "description": "Cheerful upward hop with body bounce and left foot kicked up",
        "tags": ["happy", "bounce", "hop", "dance"],
        "left_wing_xf": 'transform="rotate(-25 360 300)"',
        "right_wing_xf": 'transform="rotate(20 140 350)"',
        "body_xf": 'transform="translate(0, -25) rotate(-3 256 256)"',
        "legs_xf": 'transform="translate(0, -20)"',
    },
    "happy-soar.svg": {
        "label": "Happy - Soar Leap",
        "description": "Peak joy leap with wings flapped wide and both feet kicked up",
        "tags": ["happy", "soar", "leap", "glee"],
        "left_wing_xf": 'transform="rotate(-50 360 300)"',
        "right_wing_xf": 'transform="rotate(45 140 350)"',
        "body_xf": 'transform="translate(0, -45) scale(1.02 0.98)"',
        "legs_xf": 'transform="translate(0, -35) rotate(10 280 450)"',
    },
    "happy-land.svg": {
        "label": "Happy - Landing",
        "description": "Cheerful landing with wings fluttering following joy bounce",
        "tags": ["happy", "landing", "dance"],
        "left_wing_xf": 'transform="rotate(-15 360 300)"',
        "right_wing_xf": 'transform="rotate(10 140 350)"',
        "body_xf": 'transform="translate(0, 8) scale(1.03 0.96)"',
        "legs_xf": 'transform="translate(0, 2)"',
    },
    "action-wave.svg": {
        "label": "Action - Wave",
        "description": "Left wing raised high and waving in friendly greeting",
        "tags": ["action", "wave", "greeting", "hello"],
        "left_wing_xf": 'transform="rotate(-55 360 300)"',
        "right_wing_xf": '',
        "body_xf": '',
        "legs_xf": '',
    },
    "action-thumbsup.svg": {
        "label": "Action - Thumbs Up",
        "description": "Wing extended forward giving an affirmative thumbs-up gesture",
        "tags": ["action", "thumbsup", "approval", "agree"],
        "left_wing_xf": 'transform="rotate(-20 360 300) scale(1.08 0.95)"',
        "right_wing_xf": '',
        "body_xf": '',
        "legs_xf": '',
    },
    "action-thinking.svg": {
        "label": "Action - Thinking",
        "description": "Wing resting thoughtfully on chin in contemplation",
        "tags": ["action", "thinking", "ponder", "curious"],
        "left_wing_xf": 'transform="rotate(-40 360 300) translate(-35, -45)"',
        "right_wing_xf": '',
        "body_xf": '',
        "legs_xf": '',
    },
    "action-celebrate.svg": {
        "label": "Action - Celebrate",
        "description": "Both wings raised high overhead in celebration and triumph",
        "tags": ["action", "celebrate", "victory", "triumph"],
        "left_wing_xf": 'transform="rotate(-75 360 300)"',
        "right_wing_xf": 'transform="rotate(65 140 350)"',
        "body_xf": 'transform="translate(0, -10)"',
        "legs_xf": '',
    },
}

for file_name, data in BODY_POSES.items():
    full_path = f"{BASE_DIR}/body/{file_name}"
    
    # Wrap elements with their posture transforms
    lw_str = f'<g id="g_left_wing" {data["left_wing_xf"]}>{RAW_LEFT_WING}</g>' if data["left_wing_xf"] else RAW_LEFT_WING
    rw_str = f'<g id="g_right_wing" {data["right_wing_xf"]}>{RAW_RIGHT_WING}</g>' if data["right_wing_xf"] else RAW_RIGHT_WING
    legs_str = f'<g id="g_legs" {data["legs_xf"]}>{RAW_RIGHT_LEG}\n{RAW_LEFT_LEG}</g>' if data["legs_xf"] else f'{RAW_RIGHT_LEG}\n{RAW_LEFT_LEG}'
    
    body_core = f"""
      {lw_str}
      {RAW_BODY}
      {RAW_BLUSH_RIGHT}
      {RAW_BLUSH_LEFT}
      {RAW_GLASSES}
      {rw_str}
      {RAW_CYBER_WING1}
      {RAW_CYBER_WING2}
      {RAW_CYBER_IMPLANT}
      {RAW_CYBER_EAR}
      {RAW_HEADPHONES}
      {RAW_ANTENNA}
      {RAW_CYBER1}
      {RAW_CYBER2}
      {RAW_GLASS_BRIDGE}
      {legs_str}
"""
    if data["body_xf"]:
        body_content = f'<g id="g_posture_torso" {data["body_xf"]}>{body_core.strip()}</g>'
    else:
        body_content = body_core.strip()

    svg_str = f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   width="512mm"
   height="512mm"
   viewBox="0 0 512 512"
   version="1.1"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg">
  <g id="layer1" inkscape:label="Layer 1">
    <g id="mascot_body" transform="translate(13.165564,1.2346624)" inkscape:label="{data['label']}">
      {body_content}
    </g>
  </g>
</svg>"""
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(svg_str)
    
    file_id = os.path.splitext(file_name)[0]
    manifest["categories"]["body"][file_id] = {
        "path": f"/mascot/body/{file_name}",
        "label": data["label"],
        "description": data["description"],
        "tags": data["tags"],
        "viewBox": "0 0 512 512"
    }

print(f"Generated {len(BODY_POSES)} body posture SVGs.")

# Write catalog.json
with open(f"{BASE_DIR}/catalog.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

print("Saved catalog.json.")

# =============================================================================
# 5. CATALOG.MD DOCUMENTATION GENERATION
# =============================================================================

catalog_md = f"""# Aptipiou Modular Mascot System Catalog

This directory contains the completely decoupled, vector-first mascot system for Aptitek. Built around `aptipiou_redone.svg`, every asset is organized into high-quality, high-simplicity SVGs adhering strictly to the Solarized and Season color palettes.

---

## 1. Directory Structure

- **[`body/`](/mascot/body/)**: 20 complete body postures and movements (standing, flying, sleeping, landing, happy dance, actions).
- **[`beak/`](/mascot/beak/)**: 11 emotional beak states (neutral, smile, laugh, surprise, shocked, smirk, etc., excluding speech visemes).
- **[`eyes/`](/mascot/eyes/)**: 12 eye expressions and gazes (open, blink, happy, wink, squint, laugh, dizzy, shocked, love, cry).
- **[`particles/`](/mascot/particles/)**: 24 peripheral particle effects (hearts, clouds, bubbles, emotes, drops).
- **[`catalog.json`](/mascot/catalog.json)**: Machine-readable JSON manifest with bounding boxes, motion presets, and anchor coordinates.

---

## 2. Color Palette Tokens

| Token | Hex | Role |
| :--- | :--- | :--- |
| `base03` | `{COLORS['base03']}` | Dark outline (all components) |
| `base02` | `{COLORS['base02']}` | Deep shadow / eye pupils / oral depth |
| `base3` | `{COLORS['base3']}` | Specular highlights, glints, thought cloud fill |
| `base1` | `{COLORS['base1']}` | Landing dust cloud |
| `yellow` | `{COLORS['yellow']}` | Yellow beak & feet |
| `red` | `{COLORS['red']}` | Mouth cavity & antenna tip |
| `magenta` | `{COLORS['magenta']}` | Cheek blush & hearts |
| `blue` | `{COLORS['blue']}` | Water drops, sweat, headphones accent |
| `green` | `{COLORS['green']}` | Cybernetic implants & cyber wings |
| `pink` | `{COLORS['pink']}` | Body & wing base tone |

---

## 3. Body Postures (`public/mascot/body/`)

All body postures share the standardized `0 0 512 512` canvas. Beak and eye positions are left blank so that any beak and eye expression can be layered directly on top.

| File | Label | Description | Tags |
| :--- | :--- | :--- | :--- |
"""

for bid, binfo in manifest["categories"]["body"].items():
    catalog_md += f"| [`{bid}.svg`](./body/{bid}.svg) | **{binfo['label']}** | {binfo['description']} | `{', '.join(binfo['tags'])}` |\n"

catalog_md += """
---

## 4. Beak Expressions (`public/mascot/beak/`)

All beak expressions are mapped to the 512×512 space and snap into place at `(x: 238..300, y: 215..270)` under the glasses bridge.

| File | Label | Description | Tags |
| :--- | :--- | :--- | :--- |
"""

for kid, kinfo in manifest["categories"]["beak"].items():
    catalog_md += f"| [`{kid}.svg`](./beak/{kid}.svg) | **{kinfo['label']}** | {kinfo['description']} | `{', '.join(kinfo['tags'])}` |\n"

catalog_md += """
---

## 5. Eye Expressions (`public/mascot/eyes/`)

All eye expressions are mapped to the 512×512 space and snap into the glasses rims (right eye at `(196, 221)`, left eye at `(338, 211)`).

| File | Label | Description | Tags |
| :--- | :--- | :--- | :--- |
"""

for eid, einfo in manifest["categories"]["eyes"].items():
    catalog_md += f"| [`{eid}.svg`](./eyes/{eid}.svg) | **{einfo['label']}** | {einfo['description']} | `{', '.join(einfo['tags'])}` |\n"

catalog_md += """
---

## 6. Peripheral Particles (`public/mascot/particles/`)

High-simplicity SVGs designed for the mascot particle system. Ultra-compact (< 500 bytes each).

| File | Category | Anchor | Motion Preset | Tags |
| :--- | :--- | :--- | :--- | :--- |
"""

for pid, pinfo in manifest["categories"]["particles"].items():
    catalog_md += f"| [`{pid}.svg`](./particles/{pinfo['category']}/{os.path.basename(pinfo['path'])}) | `{pinfo['category']}` | `{pinfo['defaultAnchor']}` | `{pinfo['motionPreset']}` | `{', '.join(pinfo['tags'])}` |\n"

catalog_md += """
---

## 7. Modular Composition Example

Because all body, beak, and eye assets share the exact same `0 0 512 512` coordinate frame, composing a custom mascot pose is as simple as layering the SVGs:

```html
<svg viewBox="0 0 512 512" width="256" height="256" class="aptipiou-mascot">
  <!-- 1. Body Posture -->
  <image href="/mascot/body/action-wave.svg" width="512" height="512" />
  
  <!-- 2. Eye Expression -->
  <image href="/mascot/eyes/happy.svg" width="512" height="512" />
  
  <!-- 3. Beak Expression -->
  <image href="/mascot/beak/smile.svg" width="512" height="512" />
</svg>
```

Or within React / TypeScript with inline SVGs or dynamic image sources.
"""

with open(f"{BASE_DIR}/CATALOG.md", "w", encoding="utf-8") as f:
    f.write(catalog_md)

print("Saved CATALOG.md.")
