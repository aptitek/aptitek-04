#!/usr/bin/env python3
"""
Build Vector Expressions Pipeline.
Generates authentic, high-fidelity SVGs for all 11 beaks and 12 eye expressions:
- Closely mirrors original sprites: cry, dizzy, alert, love, shocked, surprise, etc.
- Shocked & surprise beaks drop significantly lower to capture the authentic jaw drop.
- Cry features genuine flowing teardrop streams.
- Dizzy features concentric hypnotic spirals (@ @).
- Shocked eyes feature pinpoint pupils; Surprise eyes feature hollow ring pupils.
- All assets strictly aligned to the standardized 512x512 coordinate frame.
"""

import os

BEAK_DIR = "public/mascot/beak"
EYES_DIR = "public/mascot/eyes"

os.makedirs(BEAK_DIR, exist_ok=True)
os.makedirs(EYES_DIR, exist_ok=True)

TRANSFORM = 'transform="translate(13.165564,1.2346624)"'

# =============================================================================
# 1. BEAK EXPRESSIONS (11 SVGs)
# =============================================================================

BEAKS = {
    "default.svg": {
        "label": "Neutral / Default",
        "description": "Canonical resting closed beak from aptipiou_redone.svg",
        "tags": ["neutral", "default", "rest"],
        "bbox": "235 210 70 60",
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 238.37335,245.49172 c 5.59398,-15.85474 53.28268,-14.11077 49.39708,2.05821 -1.42667,15.22722 -17.63946,26.24808 -29.70765,21.36868 -14.70276,-5.94462 -19.72797,-21.28439 -19.68943,-23.42689 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       d="m 242.89176,235.45216 c 2.18499,-6.19281 12.05075,-28.81676 29.58678,-23.15489 9.70947,3.13491 31.00783,12.83479 27.78587,26.24221 -15.14988,18.36926 -57.44284,0.81377 -57.37265,-3.08732 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "smile.svg": {
        "label": "Cheerful Smile",
        "description": "Warm cheerful upturned beak with subtle open smile curve",
        "tags": ["smile", "happy", "friendly", "cheerful"],
        "bbox": "235 210 70 60",
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 242 c 6 -8 48 -8 54 2 c -2 16 -18 26 -27 26 c -10 0 -25 -10 -27 -28 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 236 c 4 -12 18 -26 28 -24 c 10 2 24 12 28 24 c -12 8 -44 8 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "laugh.svg": {
        "label": "Wide Laugh",
        "description": "Wide open laughing beak with red oral cavity and yellow mandible",
        "tags": ["laugh", "joy", "glee", "open-mouth"],
        "bbox": "235 210 70 70",
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 238 238 c 6 -4 52 -4 58 0 c 2 24 -12 48 -29 48 c -17 0 -31 -24 -29 -48 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#da5780;stroke:none"
       d="m 252 268 c 5 -6 20 -6 25 0 c -4 8 -21 8 -25 0 z"
       id="tongue"
       inkscape:label="tongue" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 241 234 c 4 -12 18 -24 28 -24 c 10 0 24 12 28 24 c -12 4 -44 4 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:10;stroke-linecap:round;stroke-linejoin:round"
       d="m 256 282 c 4 4 18 4 22 0"
       id="lower_beak"
       inkscape:label="lower_beak" />
"""
    },
    "grin.svg": {
        "label": "Cheeky Grin",
        "description": "Broad beaming cheeky smile with cheerful curved mandible",
        "tags": ["grin", "cheeky", "cheerful", "playful"],
        "bbox": "235 210 70 60",
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 240 c 6 -4 50 -4 56 0 c 0 16 -16 28 -28 28 c -12 0 -28 -12 -28 -28 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 236 c 4 -12 18 -24 28 -24 c 10 0 24 12 28 24 c -12 6 -44 6 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "surprise.svg": {
        "label": "Surprise / Gasp",
        "description": "Deep dropped oval gasp cavity dropping significantly lower into shock",
        "tags": ["surprise", "gasp", "astonished", "jaw-drop"],
        "bbox": "235 210 70 95",
        "content": f"""
    <!-- Deep dropped surprise mouth dropping down to Y=298 (matching original sprite Y=242) -->
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 245 234 c 5 -4 38 -4 44 0 c 4 26 4 58 -6 68 c -8 8 -24 8 -32 0 c -10 -10 -10 -42 -6 -68 z"
       id="mouth"
       inkscape:label="mouth" />
    <!-- Yellow lower mandible framing bottom of dropped gasp -->
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:10;stroke-linecap:round;stroke-linejoin:round"
       d="m 254 300 c 6 5 20 5 26 0"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <!-- Upper beak cap -->
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 244 233 c 4 -12 18 -24 28 -24 c 10 0 24 12 28 24 c -12 5 -44 5 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "shocked.svg": {
        "label": "Extreme Shock / Jaw-Drop",
        "description": "Massive elongated jaw-drop dropping all the way down to Y=325 (matching original sprite Y=255)",
        "tags": ["shocked", "jaw-drop", "disbelief", "stunned"],
        "bbox": "235 210 70 125",
        "content": f"""
    <!-- Giant elongated jaw drop cavity dropping down to Y=326 (matching sprite height 52px) -->
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 244 232 c 6 -3 40 -3 46 0 c 4 35 4 80 -4 94 c -8 10 -30 10 -38 0 c -8 -14 -8 -59 -4 -94 z"
       id="mouth"
       inkscape:label="mouth" />
    <!-- Tongue at bottom of dropped jaw -->
    <path
       style="fill:#da5780;stroke:none"
       d="m 252 316 c 6 -8 20 -8 26 0 c -4 8 -22 8 -26 0 z"
       id="tongue"
       inkscape:label="tongue" />
    <!-- Yellow lower mandible rim framing bottom of extreme dropped jaw -->
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:11;stroke-linecap:round;stroke-linejoin:round"
       d="m 252 326 c 8 6 18 6 26 0"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <!-- Small yellow upper beak hood -->
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 243 232 c 4 -11 18 -22 28 -22 c 10 0 24 11 28 22 c -12 4 -44 4 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "smirk.svg": {
        "label": "Asymmetric Smirk",
        "description": "Confident asymmetric sly smirk tilted slightly up on right",
        "tags": ["smirk", "sly", "confident", "cunning"],
        "bbox": "235 210 70 60",
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 242 c 8 -6 48 -2 54 8 c -4 14 -18 20 -28 18 c -10 -2 -24 -12 -26 -26 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 236 c 4 -12 18 -24 28 -24 c 10 0 24 10 28 20 c -12 6 -44 8 -56 4 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "pout.svg": {
        "label": "Pout / Frown",
        "description": "Downturned sulking lower beak expressing disappointment",
        "tags": ["pout", "frown", "sad", "disappointed"],
        "bbox": "235 210 70 60",
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 242 248 c 8 6 44 6 52 0 c -4 -12 -18 -18 -26 -18 c -10 0 -22 6 -26 18 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 238 c 4 -12 18 -24 28 -24 c 10 0 24 12 28 24 c -12 2 -44 2 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "dizzy.svg": {
        "label": "Wobbly Dizzy Mouth",
        "description": "Wavy squiggly undulating zigzag mouth matching original expr-dizzy.png",
        "tags": ["dizzy", "wobbly", "confused", "zigzag"],
        "bbox": "235 210 70 65",
        "content": f"""
    <!-- Squiggly wavy undulating mouth cavity matching sprite Y=[215, 230] -->
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 242 c 8 -6 16 8 24 -2 c 8 -8 18 8 26 2 c -2 16 -16 22 -26 20 c -10 -2 -20 -8 -24 -20 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 236 c 6 -10 18 -24 28 -24 c 10 0 22 14 28 24 c -10 4 -22 -4 -30 2 c -8 6 -18 2 -26 -2 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "grimace.svg": {
        "label": "Tense Grimace",
        "description": "Tense wavy horizontal grimace showing stress or anxiety",
        "tags": ["grimace", "tense", "nervous", "awkward"],
        "bbox": "235 210 70 60",
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 242 242 c 8 -4 16 6 26 -2 c 8 -6 16 4 24 0 c -4 12 -18 16 -26 14 c -8 -2 -18 -4 -24 -12 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 242 236 c 4 -12 18 -24 26 -24 c 10 0 22 12 26 24 c -12 2 -40 2 -52 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
"""
    },
    "sleep.svg": {
        "label": "Relaxed Sleep Beak",
        "description": "Completely relaxed resting beak line for sleep and deep rest",
        "tags": ["sleep", "rest", "relaxed", "peaceful"],
        "bbox": "235 210 70 50",
        "content": f"""
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:8;stroke-linecap:round;stroke-linejoin:round"
       d="m 244 242 c 12 4 36 4 46 0"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 242 236 c 4 -10 18 -22 28 -22 c 10 0 24 12 28 22 c -12 4 -44 4 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
""",
    },
    "talk-closed.svg": {
        "label": "Speech Viseme: Closed / M-B-P",
        "description": "Resting bilabial consonant beak shape with closed center seam",
        "tags": ["speech", "viseme", "closed", "m", "b", "p"],
        "bbox": "235 210 70 55",
        "content": f"""
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 246 238 c 6 12 16 20 24 20 c 8 0 18 -8 24 -20 z"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 242 236 c 4 -12 18 -24 28 -24 c 10 0 24 12 28 24 c -12 4 -44 4 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
    <path
       style="fill:none;stroke:#002b36;stroke-width:10;stroke-linecap:round"
       d="m 244 237 c 12 3 38 3 50 0"
       id="mouth"
       inkscape:label="mouth" />
""",
    },
    "talk-a.svg": {
        "label": "Speech Viseme: A / Open",
        "description": "Open vowel viseme with dropped mandible, oral cavity and visible tongue",
        "tags": ["speech", "viseme", "vowel", "open", "a", "ah"],
        "bbox": "235 210 70 75",
        "content": f"""
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 246 238 c 4 18 14 34 24 34 c 10 0 20 -16 24 -34 z"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <path
       style="fill:#dc322f;stroke:none"
       d="m 248 238 c 4 16 12 26 22 26 c 10 0 18 -10 22 -26 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#da5780;stroke:none"
       d="m 258 256 c 4 -4 16 -4 20 0 c -2 6 -18 6 -20 0 z"
       id="tongue"
       inkscape:label="tongue" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 242 236 c 4 -12 18 -24 28 -24 c 10 0 24 12 28 24 c -12 4 -44 4 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
""",
    },
    "talk-e.svg": {
        "label": "Speech Viseme: E / Stretched",
        "description": "Stretched smiling vowel viseme with horizontal oral cavity and teeth line",
        "tags": ["speech", "viseme", "vowel", "stretched", "e", "eh"],
        "bbox": "235 210 70 65",
        "content": f"""
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 238 c 8 10 20 15 30 15 c 10 0 22 -5 30 -15 z"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <path
       style="fill:#dc322f;stroke:none"
       d="m 244 239 c 8 7 16 10 26 10 c 10 0 18 -3 26 -10 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:none;stroke:#fdf6e3;stroke-width:5;stroke-linecap:round"
       d="m 248 240 c 8 3 16 4 22 4 c 6 0 14 -1 22 -4"
       id="teeth"
       inkscape:label="teeth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 236 c 4 -12 18 -24 28 -24 c 10 0 24 12 28 24 c -12 4 -44 4 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
""",
    },
    "talk-i.svg": {
        "label": "Speech Viseme: I / High",
        "description": "High front vowel viseme with taut horizontal slit aperture",
        "tags": ["speech", "viseme", "vowel", "high", "i", "ee"],
        "bbox": "235 210 70 60",
        "content": f"""
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 238 c 8 8 20 12 30 12 c 10 0 22 -4 30 -12 z"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <path
       style="fill:#dc322f;stroke:none"
       d="m 244 238 c 8 5 16 7 26 7 c 10 0 18 -2 26 -7 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:none;stroke:#fdf6e3;stroke-width:4;stroke-linecap:round"
       d="m 246 239 c 10 2 16 3 24 3 c 8 0 14 -1 24 -3"
       id="teeth"
       inkscape:label="teeth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 236 c 4 -12 18 -24 28 -24 c 10 0 24 12 28 24 c -12 4 -44 4 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
""",
    },
    "talk-o.svg": {
        "label": "Speech Viseme: O / Round",
        "description": "Open rounded vowel viseme with circular oral aperture and red cavity",
        "tags": ["speech", "viseme", "vowel", "round", "o", "oh"],
        "bbox": "235 210 70 70",
        "content": f"""
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 248 238 c 4 16 12 28 22 28 c 10 0 18 -12 22 -28 z"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:8;stroke-linecap:round;stroke-linejoin:round"
       d="m 256 244 c 0 -8 28 -8 28 0 c 0 14 -28 14 -28 0 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#da5780;stroke:none"
       d="m 262 249 c 2 -3 10 -3 12 0 c -1 3 -11 3 -12 0 z"
       id="tongue"
       inkscape:label="tongue" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 244 236 c 4 -12 16 -24 26 -24 c 10 0 22 12 26 24 c -10 4 -42 4 -52 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
""",
    },
    "talk-u.svg": {
        "label": "Speech Viseme: U / Woo",
        "description": "Tightly puckered rounded vowel viseme for U, OO, and W sounds",
        "tags": ["speech", "viseme", "vowel", "pucker", "u", "woo"],
        "bbox": "235 210 70 60",
        "content": f"""
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 252 238 c 2 10 8 18 18 18 c 10 0 16 -8 18 -18 z"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:6;stroke-linecap:round;stroke-linejoin:round"
       d="m 264 243 c 0 -5 12 -5 12 0 c 0 8 -12 8 -12 0 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 246 236 c 4 -12 14 -24 24 -24 c 10 0 20 12 24 24 c -8 4 -40 4 -48 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
""",
    },
    "talk-t.svg": {
        "label": "Speech Viseme: T-D-N / Dental",
        "description": "Alveolar consonant viseme showing tongue/teeth contact line",
        "tags": ["speech", "viseme", "consonant", "dental", "t", "d", "n", "l"],
        "bbox": "235 210 70 55",
        "content": f"""
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 246 238 c 4 8 14 14 24 14 c 10 0 20 -6 24 -14 z"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <path
       style="fill:none;stroke:#002b36;stroke-width:8;stroke-linecap:round"
       d="m 254 240 c 6 2 10 2 16 2 c 6 0 10 0 16 -2"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#da5780;stroke:none"
       d="m 266 241 c 2 -2 6 -2 8 0 c -1 3 -7 3 -8 0 z"
       id="tongue"
       inkscape:label="tongue" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 242 236 c 4 -12 18 -24 28 -24 c 10 0 24 12 28 24 c -12 4 -44 4 -56 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
""",
    },
    "talk-fv.svg": {
        "label": "Speech Viseme: F-V / Labiodental",
        "description": "Labiodental consonant viseme with tucked lower beak under upper mandible",
        "tags": ["speech", "viseme", "consonant", "f", "v"],
        "bbox": "235 210 70 55",
        "content": f"""
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 250 238 c 2 8 10 14 20 14 c 10 0 18 -6 20 -14 z"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 236 c 4 -12 18 -24 30 -24 c 12 0 26 12 30 24 c -12 6 -48 6 -60 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
""",
    },
    "talk-wide.svg": {
        "label": "Speech Viseme: Wide / Exclamation",
        "description": "Energetic wide open speech cavity for emphasis, shouts, and exclamation",
        "tags": ["speech", "viseme", "wide", "shout", "exclamation"],
        "bbox": "235 210 70 80",
        "content": f"""
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 242 238 c 4 20 16 38 28 38 c 12 0 24 -18 28 -38 z"
       id="lower_beak"
       inkscape:label="lower_beak" />
    <path
       style="fill:#dc322f;stroke:#002b36;stroke-width:8;stroke-linecap:round;stroke-linejoin:round"
       d="m 246 238 c 4 18 14 30 24 30 c 10 0 20 -12 24 -30 z"
       id="mouth"
       inkscape:label="mouth" />
    <path
       style="fill:#da5780;stroke:none"
       d="m 256 258 c 4 -6 16 -6 20 0 c -2 8 -18 8 -20 0 z"
       id="tongue"
       inkscape:label="tongue" />
    <path
       style="fill:#b58900;stroke:#002b36;stroke-width:12.7;stroke-linecap:round;stroke-linejoin:round"
       d="m 240 235 c 4 -12 18 -25 30 -25 c 12 0 26 13 30 25 c -12 4 -48 4 -60 0 z"
       id="upper_beak"
       inkscape:label="upper_beak" />
""",
    },
}


for file_name, data in BEAKS.items():
    full_path = os.path.join(BEAK_DIR, file_name)
    svg_str = f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   width="512mm"
   height="512mm"
   viewBox="0 0 512 512"
   version="1.1"
   data-bbox="{data['bbox']}"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns="http://www.w3.org/2000/svg">
  <g id="layer1" inkscape:label="Layer 1">
    <g id="mascot_beak" {TRANSFORM} inkscape:label="{data['label']}">
{data['content'].strip()}
    </g>
  </g>
</svg>"""
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(svg_str)
    print(f"Generated beak: {file_name}")

# =============================================================================
# 2. EYE EXPRESSIONS (12 SVGs)
# =============================================================================

EYES = {
    "open.svg": {
        "label": "Open / Default",
        "description": "Default open pupils with dual specular reflection glints",
        "tags": ["open", "default", "neutral"],
        "content": f"""
    <ellipse cx="195.8" cy="221.1" rx="24.4" ry="30.8" fill="#073642" id="right_eye" inkscape:label="right_eye"/>
    <ellipse cx="202.4" cy="209.4" rx="6.6" ry="7.1" fill="#fdf6e3" id="upper_right_reflection"/>
    <ellipse cx="193.8" cy="230.7" rx="3.6" ry="3.9" fill="#fdf6e3" id="lower_right_reflection"/>

    <ellipse cx="338.2" cy="211.3" rx="21.9" ry="29.3" fill="#073642" id="left_eye" inkscape:label="left_eye"/>
    <ellipse cx="331.1" cy="201.9" rx="6.6" ry="7.1" fill="#fdf6e3" id="upper_left_reflection"/>
    <ellipse cx="343.7" cy="219.9" rx="3.6" ry="3.9" fill="#fdf6e3" id="lower_left_reflection"/>
"""
    },
    "blink.svg": {
        "label": "Blink / Closed",
        "description": "Peaceful downward resting closed eye arcs (u u)",
        "tags": ["blink", "closed", "rest", "calm"],
        "content": f"""
    <path d="M 174 220 C 180 238 212 238 218 220" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="right_eye"/>
    <path d="M 316 210 C 322 228 354 228 360 210" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="left_eye"/>
"""
    },
    "happy.svg": {
        "label": "Happy / Cheerful Smile",
        "description": "Upward cheerful anime smiling eye arcs (^ ^)",
        "tags": ["happy", "cheerful", "joy", "smile"],
        "content": f"""
    <path d="M 174 224 C 182 206 210 206 218 224" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="right_eye"/>
    <path d="M 316 214 C 324 196 352 196 360 214" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="left_eye"/>
"""
    },
    "wink.svg": {
        "label": "Wink (Right Eye Closed)",
        "description": "Left eye open with glints, right eye closed in cheerful wink",
        "tags": ["wink", "playful", "cheeky"],
        "content": f"""
    <path d="M 174 224 C 182 206 210 206 218 224" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="right_eye"/>
    <ellipse cx="338.2" cy="211.3" rx="21.9" ry="29.3" fill="#073642" id="left_eye"/>
    <ellipse cx="331.1" cy="201.9" rx="6.6" ry="7.1" fill="#fdf6e3"/>
    <ellipse cx="343.7" cy="219.9" rx="3.6" ry="3.9" fill="#fdf6e3"/>
"""
    },
    "wink-left.svg": {
        "label": "Wink (Left Eye Closed)",
        "description": "Right eye open with glints, left eye closed in cheerful wink",
        "tags": ["wink", "playful", "cheeky"],
        "content": f"""
    <ellipse cx="195.8" cy="221.1" rx="24.4" ry="30.8" fill="#073642" id="right_eye"/>
    <ellipse cx="202.4" cy="209.4" rx="6.6" ry="7.1" fill="#fdf6e3"/>
    <ellipse cx="193.8" cy="230.7" rx="3.6" ry="3.9" fill="#fdf6e3"/>
    <path d="M 316 214 C 324 196 352 196 360 214" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="left_eye"/>
"""
    },
    "squint.svg": {
        "label": "Squint / Laughing",
        "description": "Narrowed laughing chevrons (> <) expressing concentrated joy",
        "tags": ["squint", "laugh", "concentrated"],
        "content": f"""
    <path d="M 176 214 L 202 222 L 176 230" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" stroke-linejoin="round" id="right_eye"/>
    <path d="M 358 204 L 332 212 L 358 220" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" stroke-linejoin="round" id="left_eye"/>
"""
    },
    "laugh.svg": {
        "label": "Laughing Eyes",
        "description": "Squeezed joyous crescents (^ ^) with subtle laughing glints",
        "tags": ["laugh", "joy", "giggle"],
        "content": f"""
    <path d="M 172 224 C 182 202 210 202 220 224" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="right_eye"/>
    <path d="M 314 214 C 324 192 352 192 362 214" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" id="left_eye"/>
"""
    },
    "shocked.svg": {
        "label": "Shocked Pinpoint Eyes",
        "description": "Authentic shocked expression from expr-shocked.png with tiny pinpoint pupils in wide empty sclera",
        "tags": ["shocked", "pinpoint", "stunned", "disbelief"],
        "content": f"""
    <!-- Tiny pinpoint pupils floating in wide shocked lenses matching expr-shocked.png -->
    <circle cx="196" cy="221" r="7" fill="#002b36" id="right_eye" inkscape:label="right_eye"/>
    <circle cx="198" cy="219" r="2.5" fill="#fdf6e3"/>

    <circle cx="338" cy="211" r="7" fill="#002b36" id="left_eye" inkscape:label="left_eye"/>
    <circle cx="340" cy="209" r="2.5" fill="#fdf6e3"/>
"""
    },
    "surprise.svg": {
        "label": "Surprise Hollow Ring Eyes",
        "description": "Authentic surprise hollow ring/doughnut pupils from expr-surprise.png",
        "tags": ["surprise", "doughnut", "ring", "wide-eyes"],
        "content": f"""
    <!-- Hollow ring/doughnut pupils matching expr-surprise.png -->
    <circle cx="196" cy="221" r="18" fill="#fdf6e3" stroke="#002b36" stroke-width="10" id="right_eye" inkscape:label="right_eye"/>
    <circle cx="192" cy="216" r="3" fill="#002b36"/>

    <circle cx="338" cy="211" r="18" fill="#fdf6e3" stroke="#002b36" stroke-width="10" id="left_eye" inkscape:label="left_eye"/>
    <circle cx="334" cy="206" r="3" fill="#002b36"/>
"""
    },
    "dizzy.svg": {
        "label": "Hypnotic Dizzy Spirals",
        "description": "Authentic concentric hypnotic spiral pupils (@ @) matching expr-dizzy.png",
        "tags": ["dizzy", "spiral", "hypnotic", "swirl"],
        "content": f"""
    <!-- Smooth Archimedean hypnotic spirals matching expr-dizzy.png -->
    <path
       d="M 196 221 C 196 216 202 214 204 218 C 208 226 198 232 190 228 C 180 222 182 208 194 204 C 210 198 222 214 218 230 C 212 248 188 252 178 238"
       fill="none"
       stroke="#002b36"
       stroke-width="7"
       stroke-linecap="round"
       id="right_eye"
       inkscape:label="right_eye"/>

    <path
       d="M 338 211 C 338 206 344 204 346 208 C 350 216 340 222 332 218 C 322 212 324 198 336 194 C 352 188 364 204 360 220 C 354 238 330 242 320 228"
       fill="none"
       stroke="#002b36"
       stroke-width="7"
       stroke-linecap="round"
       id="left_eye"
       inkscape:label="left_eye"/>
"""
    },
    "cry.svg": {
        "label": "Cry / Heavy Flowing Tears",
        "description": "Authentic squeezed crying eyes with large flowing blue teardrop streams from expr-cry.png",
        "tags": ["cry", "tears", "sad", "streaming-tears"],
        "content": f"""
    <!-- Downward squeezed tearful eye chevrons matching expr-cry.png -->
    <path d="M 174 216 L 196 226 L 218 218" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" stroke-linejoin="round" id="right_eye"/>
    <path d="M 316 206 L 338 216 L 360 208" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round" stroke-linejoin="round" id="left_eye"/>

    <!-- Flowing blue teardrop stream on right eye -->
    <path
       d="M 170 222 C 160 230 156 250 162 265 C 168 275 182 272 180 260 C 176 248 174 234 170 222 Z"
       fill="#268bd2"
       stroke="#002b36"
       stroke-width="6"
       stroke-linejoin="round"
       id="right_tear"/>
    <circle cx="166" cy="256" r="3.5" fill="#fdf6e3"/>

    <!-- Flowing blue teardrop stream on left eye -->
    <path
       d="M 364 212 C 374 220 378 240 372 255 C 366 265 352 262 354 250 C 358 238 360 224 364 212 Z"
       fill="#268bd2"
       stroke="#002b36"
       stroke-width="6"
       stroke-linejoin="round"
       id="left_tear"/>
    <circle cx="368" cy="246" r="3.5" fill="#fdf6e3"/>
"""
    },
    "love.svg": {
        "label": "Love / Heart Eyes",
        "description": "Giant glowing heart-shaped pupils (♥ ♥) with specular glints matching expr-love.png",
        "tags": ["love", "heart", "adoring", "crush"],
        "content": f"""
    <!-- Giant heart pupil in right eye matching expr-love.png -->
    <path
       d="M 196 238 C 182 226 172 216 172 206 C 172 196 182 190 192 196 C 194 198 196 200 196 200 C 196 200 198 198 200 196 C 210 190 220 196 220 206 C 220 216 210 226 196 238 Z"
       fill="#dc322f"
       stroke="#002b36"
       stroke-width="7"
       stroke-linejoin="round"
       id="right_eye"
       inkscape:label="right_eye"/>
    <circle cx="188" cy="202" r="3" fill="#fdf6e3"/>

    <!-- Giant heart pupil in left eye matching expr-love.png -->
    <path
       d="M 338 228 C 324 216 314 206 314 196 C 314 186 324 180 334 186 C 336 188 338 190 338 190 C 338 190 340 188 342 186 C 352 180 362 186 362 196 C 362 206 352 216 338 228 Z"
       fill="#dc322f"
       stroke="#002b36"
       stroke-width="7"
       stroke-linejoin="round"
       id="left_eye"
       inkscape:label="left_eye"/>
    <circle cx="330" cy="192" r="3" fill="#fdf6e3"/>
""",
    },
    "sleepy.svg": {
        "label": "Sleepy / Drowsy",
        "description": "Heavy drooping half-closed eyelids over pupils matching drowsy posture",
        "tags": ["sleepy", "drowsy", "tired", "half-closed"],
        "content": f"""
    <!-- Heavy drooping sleepy right eye -->
    <ellipse cx="195.8" cy="226" rx="22" ry="20" fill="#073642" id="right_eye" inkscape:label="right_eye"/>
    <circle cx="198" cy="224" r="4" fill="#fdf6e3"/>
    <path d="M 170 216 C 182 222 210 222 222 216" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round"/>

    <!-- Heavy drooping sleepy left eye -->
    <ellipse cx="338.2" cy="216" rx="20" ry="18" fill="#073642" id="left_eye" inkscape:label="left_eye"/>
    <circle cx="336" cy="214" r="4" fill="#fdf6e3"/>
    <path d="M 312 206 C 324 212 352 212 364 206" fill="none" stroke="#002b36" stroke-width="12.7" stroke-linecap="round"/>
""",
    }
}

for file_name, data in EYES.items():
    full_path = os.path.join(EYES_DIR, file_name)
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
    <g id="mascot_eyes" {TRANSFORM} inkscape:label="{data['label']}">
{data['content'].strip()}
    </g>
  </g>
</svg>"""
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(svg_str)
    print(f"Generated eye expression: {file_name}")

print("\nSuccessfully generated all authentic beaks and eye expressions!")
