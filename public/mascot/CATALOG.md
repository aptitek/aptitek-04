# Aptipiou Modular Mascot System Catalog

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

| Token     | Hex       | Role                                            |
| :-------- | :-------- | :---------------------------------------------- |
| `base03`  | `#002b36` | Dark outline (all components)                   |
| `base02`  | `#073642` | Deep shadow / eye pupils / oral depth           |
| `base3`   | `#fdf6e3` | Specular highlights, glints, thought cloud fill |
| `base1`   | `#93a1a1` | Landing dust cloud                              |
| `yellow`  | `#b58900` | Yellow beak & feet                              |
| `red`     | `#dc322f` | Mouth cavity & antenna tip                      |
| `magenta` | `#d33682` | Cheek blush & hearts                            |
| `blue`    | `#268bd2` | Water drops, sweat, headphones accent           |
| `green`   | `#859900` | Cybernetic implants & cyber wings               |
| `pink`    | `#e896be` | Body & wing base tone                           |

---

## 3. Body Postures (`public/mascot/body/`)

All body postures share the standardized `0 0 512 512` canvas. Beak and eye positions are left blank so that any beak and eye expression can be layered directly on top.

| File                                                  | Label                       | Description                                                                  | Tags                                  |
| :---------------------------------------------------- | :-------------------------- | :--------------------------------------------------------------------------- | :------------------------------------ |
| [`standing.svg`](./body/standing.svg)                 | **Standing / Idle**         | Default upright resting posture with legs planted firmly and wings at sides  | `standing, idle, default, rest`       |
| [`fly-glide.svg`](./body/fly-glide.svg)               | **Fly - Glide**             | Streamlined flight glide with wings spread wide horizontally and legs tucked | `flying, glide, wings-spread`         |
| [`fly-upstroke.svg`](./body/fly-upstroke.svg)         | **Fly - Upstroke**          | Flight upstroke with wingtips flapped high upward and body angled upward     | `flying, upstroke, flap`              |
| [`fly-downstroke.svg`](./body/fly-downstroke.svg)     | **Fly - Downstroke**        | Flight downstroke with powerful downward thrust pushing body forward         | `flying, downstroke, thrust`          |
| [`fly-bank.svg`](./body/fly-bank.svg)                 | **Fly - Banking Turn**      | Aerodynamic banking turn glide with asymmetrical wing angles                 | `flying, turn, bank`                  |
| [`sleep.svg`](./body/sleep.svg)                       | **Sleep / Curled**          | Curled up sleeping posture resting peacefully low on the ground              | `sleep, crouch, rest, curled`         |
| [`wakeup-crouch.svg`](./body/wakeup-crouch.svg)       | **Wakeup - Crouch**         | Ground crouch posture starting to stir and wake from sleep                   | `wakeup, crouch, stirring`            |
| [`wakeup-stretch.svg`](./body/wakeup-stretch.svg)     | **Wakeup - Stretch**        | Stretching upward from ground crouch with wings unfurling                    | `wakeup, stretch, rising`             |
| [`land-touchdown.svg`](./body/land-touchdown.svg)     | **Landing - Touchdown**     | Feet reaching downward to absorb ground contact upon landing                 | `landing, touchdown, contact`         |
| [`land-impact.svg`](./body/land-impact.svg)           | **Landing - Impact Squash** | Deep squash compression on ground absorbing touchdown momentum               | `landing, impact, squash, crouch`     |
| [`land-settle.svg`](./body/land-settle.svg)           | **Landing - Settle**        | Low settled landing crouch at ground baseline                                | `landing, settle, ground`             |
| [`land-rebound.svg`](./body/land-rebound.svg)         | **Landing - Rebound**       | Rebounding upward from landing compression recovering balance                | `landing, rebound, recovery`          |
| [`land-stand.svg`](./body/land-stand.svg)             | **Landing - Stand**         | Straightening up back to full upright standing posture                       | `landing, stand, idle`                |
| [`happy-bounce.svg`](./body/happy-bounce.svg)         | **Happy - Bounce**          | Cheerful upward hop with body bounce and left foot kicked up                 | `happy, bounce, hop, dance`           |
| [`happy-soar.svg`](./body/happy-soar.svg)             | **Happy - Soar Leap**       | Peak joy leap with wings flapped wide and both feet kicked up                | `happy, soar, leap, glee`             |
| [`happy-land.svg`](./body/happy-land.svg)             | **Happy - Landing**         | Cheerful landing with wings fluttering following joy bounce                  | `happy, landing, dance`               |
| [`action-wave.svg`](./body/action-wave.svg)           | **Action - Wave**           | Left wing raised high and waving in friendly greeting                        | `action, wave, greeting, hello`       |
| [`action-thumbsup.svg`](./body/action-thumbsup.svg)   | **Action - Thumbs Up**      | Wing extended forward giving an affirmative thumbs-up gesture                | `action, thumbsup, approval, agree`   |
| [`action-thinking.svg`](./body/action-thinking.svg)   | **Action - Thinking**       | Wing resting thoughtfully on chin in contemplation                           | `action, thinking, ponder, curious`   |
| [`action-celebrate.svg`](./body/action-celebrate.svg) | **Action - Celebrate**      | Both wings raised high overhead in celebration and triumph                   | `action, celebrate, victory, triumph` |

---

## 4. Beak Expressions (`public/mascot/beak/`)

All beak expressions are mapped to the 512×512 space and snap into place at `(x: 238..300, y: 215..270)` under the glasses bridge.

| File                                  | Label                 | Description                                                         | Tags                               |
| :------------------------------------ | :-------------------- | :------------------------------------------------------------------ | :--------------------------------- |
| [`default.svg`](./beak/default.svg)   | **Neutral / Default** | Resting, calm closed beak with upper yellow beak and red lower lip  | `neutral, calm, default, idle`     |
| [`smile.svg`](./beak/smile.svg)       | **Smile**             | Cheerful upturned smiling beak with warm curve                      | `smile, happy, friendly, cheerful` |
| [`laugh.svg`](./beak/laugh.svg)       | **Laugh / Joy**       | Wide open laughing mouth showing deep oral cavity and tongue        | `laugh, joy, glee, open`           |
| [`grin.svg`](./beak/grin.svg)         | **Grin**              | Broad cheerful beaming smile with open energy                       | `grin, beaming, happy`             |
| [`surprise.svg`](./beak/surprise.svg) | **Surprise / Gasp**   | Rounded dropped jaw 'O' gasp in surprise                            | `surprise, gasp, alert, curious`   |
| [`shocked.svg`](./beak/shocked.svg)   | **Shocked**           | Wide dropped jaw agape in disbelief and shock                       | `shocked, stunned, disbelief`      |
| [`smirk.svg`](./beak/smirk.svg)       | **Smirk / Coy**       | Asymmetric confident sly smirk tilted cheerfully                    | `smirk, coy, confident, wink`      |
| [`pout.svg`](./beak/pout.svg)         | **Pout / Sad**        | Downturned frowning lower beak with quivering pout                  | `pout, sad, cry, frown`            |
| [`dizzy.svg`](./beak/dizzy.svg)       | **Dizzy / Wavy**      | Wobbly squiggly undulating mouth line for dizziness                 | `dizzy, wavy, confused`            |
| [`grimace.svg`](./beak/grimace.svg)   | **Grimace / Tense**   | Tense horizontal wavy grimace line with slight sweat tension        | `grimace, tense, sweat, nervous`   |
| [`sleep.svg`](./beak/sleep.svg)       | **Sleep / Peaceful**  | Completely relaxed gentle resting beak with subtle peaceful parting | `sleep, peaceful, relaxed, dream`  |

---

## 5. Eye Expressions (`public/mascot/eyes/`)

All eye expressions are mapped to the 512×512 space and snap into the glasses rims (right eye at `(196, 221)`, left eye at `(338, 211)`).

| File                                    | Label                           | Description                                                        | Tags                                   |
| :-------------------------------------- | :------------------------------ | :----------------------------------------------------------------- | :------------------------------------- |
| [`open.svg`](./eyes/open.svg)           | **Open / Default**              | Standard alert open pupils with dual specular highlights           | `open, default, alert, curious`        |
| [`blink.svg`](./eyes/blink.svg)         | **Blink / Closed**              | Peaceful downward gentle curved arcs (u u)                         | `blink, closed, peaceful, sleep`       |
| [`happy.svg`](./eyes/happy.svg)         | **Happy / Joy**                 | Upward cheerful smiling anime arcs (^ ^)                           | `happy, joy, cheer, smile`             |
| [`wink.svg`](./eyes/wink.svg)           | **Wink (Right Eye Closed)**     | Left eye open with specular glints and right eye in cheerful wink  | `wink, playful, cheeky, coy`           |
| [`wink-left.svg`](./eyes/wink-left.svg) | **Wink Left (Left Eye Closed)** | Right eye open with specular glints and left eye in cheerful wink  | `wink, playful, coy`                   |
| [`squint.svg`](./eyes/squint.svg)       | **Squint**                      | Narrowed laughing or concentrated squint with visible pupils       | `squint, laugh, focused, concentrated` |
| [`laugh.svg`](./eyes/laugh.svg)         | **Laugh / Glee**                | Deeply squeezed joyous crescents celebrating with glee             | `laugh, joy, glee, celebrate`          |
| [`dizzy.svg`](./eyes/dizzy.svg)         | **Dizzy / Spiral**              | Hypnotic spiral dizzy pupils for confusion or disorientation       | `dizzy, spiral, swirl, confused`       |
| [`shocked.svg`](./eyes/shocked.svg)     | **Shocked / Pinpoint**          | Wide stare with tiny pinpoint pupils inside wide white glint disks | `shocked, pinpoint, alert, surprise`   |
| [`love.svg`](./eyes/love.svg)           | **Love / Heart Pupils**         | Glowing heart-shaped pupils with specular glint dots               | `love, heart, adoration, romance`      |
| [`sleepy.svg`](./eyes/sleepy.svg)       | **Sleepy / Drowsy**             | Heavy drooping eyelids resting half-way over relaxed pupils        | `sleepy, drowsy, tired, resting`       |
| [`cry.svg`](./eyes/cry.svg)             | **Cry / Tears**                 | Squeezed sorrowful closed eyes with teardrop wells                 | `cry, sad, tears, sorrow`              |

---

## 6. Peripheral Particles (`public/mascot/particles/`)

High-simplicity SVGs designed for the mascot particle system. Ultra-compact (< 500 bytes each).

| File                                                              | Category  | Anchor            | Motion Preset          | Tags                             |
| :---------------------------------------------------------------- | :-------- | :---------------- | :--------------------- | :------------------------------- |
| [`heart-large.svg`](./particles/hearts/heart-large.svg)           | `hearts`  | `head-right`      | `float-up-fade`        | `love, romance, blush, floating` |
| [`heart-medium.svg`](./particles/hearts/heart-medium.svg)         | `hearts`  | `cheek-right`     | `float-up-fade`        | `love, tilted, accent`           |
| [`heart-small.svg`](./particles/hearts/heart-small.svg)           | `hearts`  | `head-left`       | `float-up-fade`        | `love, mini, spark`              |
| [`heart-sparkle.svg`](./particles/hearts/heart-sparkle.svg)       | `hearts`  | `head-top-right`  | `pulse-pop`            | `love, sparkle, celebrate`       |
| [`cloud-thought.svg`](./particles/clouds/cloud-thought.svg)       | `clouds`  | `head-top-right`  | `float-hover`          | `thinking, dream, thought`       |
| [`dust-ground.svg`](./particles/clouds/dust-ground.svg)           | `clouds`  | `baseline-ground` | `puff-expand-dissolve` | `landing, dust, ground, impact`  |
| [`dust-puff-large.svg`](./particles/clouds/dust-puff-large.svg)   | `clouds`  | `foot-left`       | `puff-expand-dissolve` | `dust, puff, landing`            |
| [`dust-puff-medium.svg`](./particles/clouds/dust-puff-medium.svg) | `clouds`  | `foot-right`      | `puff-expand-dissolve` | `dust, puff, landing`            |
| [`dust-puff-small.svg`](./particles/clouds/dust-puff-small.svg)   | `clouds`  | `baseline-ground` | `scatter-fade`         | `dust, speck, particle`          |
| [`bubble-large.svg`](./particles/bubbles/bubble-large.svg)        | `bubbles` | `head-right`      | `float-drift`          | `bubble, glossy, dream`          |
| [`bubble-medium.svg`](./particles/bubbles/bubble-medium.svg)      | `bubbles` | `head-top-right`  | `float-drift`          | `bubble, floating`               |
| [`bubble-small.svg`](./particles/bubbles/bubble-small.svg)        | `bubbles` | `head-right`      | `float-drift`          | `bubble, trailing`               |
| [`sleep-z-large.svg`](./particles/bubbles/sleep-z-large.svg)      | `bubbles` | `head-top-right`  | `float-up-fade`        | `sleep, zzz, resting`            |
| [`sleep-z-medium.svg`](./particles/bubbles/sleep-z-medium.svg)    | `bubbles` | `head-top-right`  | `float-up-fade`        | `sleep, zzz`                     |
| [`sleep-z-small.svg`](./particles/bubbles/sleep-z-small.svg)      | `bubbles` | `head-top-right`  | `float-up-fade`        | `sleep, zzz`                     |
| [`bubble-question.svg`](./particles/emotes/bubble-question.svg)   | `emotes`  | `head-top-right`  | `pop-in`               | `curious, question, bubble`      |
| [`bubble-alert.svg`](./particles/emotes/bubble-alert.svg)         | `emotes`  | `head-top-right`  | `pop-in`               | `alert, exclamation, bubble`     |
| [`bubble-dizzy.svg`](./particles/emotes/bubble-dizzy.svg)         | `emotes`  | `head-top-right`  | `rotate-spin`          | `dizzy, spiral, swirl`           |
| [`sparkle.svg`](./particles/emotes/sparkle.svg)                   | `emotes`  | `head-top-right`  | `pulse-pop`            | `sparkle, star, celebrate`       |
| [`shock-lines.svg`](./particles/emotes/shock-lines.svg)           | `emotes`  | `head-left`       | `burst`                | `shock, action, surprise`        |
| [`drop-sweat-large.svg`](./particles/drops/drop-sweat-large.svg)  | `drops`   | `forehead-right`  | `fall-drip`            | `sweat, nervous, anxious`        |
| [`drop-sweat-small.svg`](./particles/drops/drop-sweat-small.svg)  | `drops`   | `forehead-right`  | `fall-drip`            | `sweat, bead, nervous`           |
| [`drop-tear.svg`](./particles/drops/drop-tear.svg)                | `drops`   | `eye-bottom-left` | `fall-drip`            | `cry, tear, sad`                 |
| [`sweat-splash.svg`](./particles/drops/sweat-splash.svg)          | `drops`   | `head-right`      | `burst`                | `sweat, splash, stress`          |

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
