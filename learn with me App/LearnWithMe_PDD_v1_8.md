# Learn With Me — למד איתי
## Product Design Document · v1.9

| Field | Value |
|---|---|
| Owner | Oren Elimelech · Petach Tikva, Israel |
| Platform | Single HTML file / PWA — runs offline, no server |
| Target Learner | Israeli children ages 3–6 (two active bands: 3–4 and 5–6) |
| Language | Hebrew-first (RTL), English toggle |
| Status | v0.9 stable · Phase 13 (Immersive Worlds) complete · Phase 10 (Child Profiles) next |
| Doc Purpose | Living design reference for Codi. Read before every session. Update after every session. |

> **v1.9 changes (2026-03-11):** Phase 13 Immersive Worlds complete (GAP-03–06 all fixed). BUG-01, BUG-02, AUDIO-01 all resolved. All 9 missing engine/module JS files recovered (were never in git). 7–8 age option removed from onboarding + home screen (Locked Decision #12 enforced). App separated into its own standalone repository.

---

# 1. Education Philosophy

## 1.1 Research Basis

- "Design of Embedded Visual Image Teaching Aids to Assist Young Children's Cognitive and Fine Motor Development" (ResearchGate, 2024)
- Bar-Ilan University "Multi" app research — target: >30% improvement in language acquisition
- Israeli Ministry of Education Pre-school Hebrew Language Curriculum

**Key findings applied:**
- 75–85% of sensory input in preschoolers is visual → large stimuli (130–160px letters)
- Immediate feedback loops reinforce memory and positive behavior
- Physical manipulation > passive observation → embodied cognition input methods
- Commercial toys lack conceptual understanding of abstract symbols — this is the gap we fill
- Fine motor + visual recognition combined = strongest learning outcomes

## 1.2 Core Principles

- Free, always. No ads, no accounts, no paywalls
- Offline-first — single HTML file, no server required
- Hebrew-first, English is a toggle (not the default)
- Simple enough for a 5-year-old to navigate alone
- Visually rich, audio-driven, touch-native
- Socratic AI — guide toward answers, never give them directly

## 1.3 Age Bands

> ⚠ **Ages 7–8 are OUT OF SCOPE.** All content, modules, and parameters target ages 3–4 and 5–6 only.

| Age Group | Cognitive Focus | Interaction Style |
|---|---|---|
| 3–4 years | Shape recognition, colour naming, counting 1–20, addition up to 10, all 22 Hebrew letters (Move 1 nikud) | Large tap targets, 2-choice grid, voice & swipe, emoji-anchored math |
| 5–6 years | Letter + word recognition, numbers 1–200 (dynamic ceiling), addition + subtraction, subitizing groups | Touch + optional voice, 3-choice grid, tracing, symbolic equations |

Age group selected on the dashboard applies globally — filters content difficulty, choice count, and available modules.

## 1.4 The 3-Round System

Every quiz-based module uses a consistent 3-round progression. Rounds unlock sequentially — child cannot skip ahead.

| Round | Challenge Level | Modules |
|---|---|---|
| Round 1 — Standard | Full visual + age-appropriate choice count. Audio auto-plays. | Letters, Numbers, Shapes, Colors, Math |
| Round 2 — Audio Only | No main visual. Audio prompt only. | Letters, Numbers (age 5–6 only) |
| Round 3 — Hard Distractors | Audio prompt only; distractors are visually similar variants. | Letters, Numbers (age 5–6 only) |

> ⚠ Round 2 and Round 3 are **NOT available for age 3–4**. Audio-only decoding is not developmentally appropriate at this age.

**Adaptive Learning System — age-specific parameters:**

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Accuracy threshold for 2× re-injection | < 80% | < 70% |
| Hesitation → audio hint | 3 seconds | 5 seconds |
| Wrong answers before reveal | 1 | 2 |
| Journey bar steps per module | 4 | 6 |
| Session length | 8–10 questions | 12–15 questions |

## 1.5 The 3-Move Phonics Engine (Ministry Curriculum Alignment)

Hebrew literacy follows the Israeli Ministry of Education's staged vowel introduction. Respect this order — do not skip moves.

| Move | Curriculum Content | Nikud Introduced | Age Band |
|---|---|---|---|
| Move 1 | Consonants + "Aa" sound only | Kamatz (ָ) and Patach (ַ) | 3–4 |
| Move 2 | Add "Ee" sound | Segol (ֶ) and Tsere (ֵ) | 5–6 |
| Move 3 | Full Nikud decoding + block print → cursive | All vowel marks. Cursive introduced. | OUT OF SCOPE |

> ⚠ Move gating: >80% accuracy required before next Move unlocks. Move 3 is out of scope (ages 7–8 removed).

## 1.6 Subitizing — Gestalt Quantity Recognition

Subitizing = instantly recognising quantity without counting. Core early numeracy skill built into Numbers and Math modules.

- Flash emoji clusters grouped by Gestalt Similarity — e.g. 3 red stars + 2 blue stars
- Groups use colour AND proximity (Gestalt: Similarity + Proximity)
- Clusters must be visually large and spread out — easy to count at a glance

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Cluster size | 2–5 (single group) | 2–10 (two Gestalt groups) |
| Flash duration | 2.5 seconds | 2.0 seconds |
| Layout | Single row, one-by-one | Two grouped rows, colour-coded |

> ⚠ Subitizing trains pre-verbal number sense. It is **NOT** the same as counting. Do not replace with counting tasks.

## 1.7 Embodied Cognition — Physical-to-Digital Bridge

| Digital Activity | Physical/Embodied Grounding |
|---|---|
| Answer a number question | Hold up N fingers — MediaPipe reads the count |
| Camera PBE mission | "Find something blue and circular in your room" — real-world object scan |
| Physics & Nature module | Observe gravity, weight, light, flow — predict animated outcome |
| Letter tracing (Free mode) | Child draws with finger on touchscreen — not stylus |
| Socratic Story Architect (planned) | Child speaks answer aloud — Mic API — not tapping |

Goal: device feels like a responsive mirror of the physical world, not a replacement for it.

---

# 2. UX Design

## 2.1 Core UX Rules

| Rule | Detail |
|---|---|
| One task per screen | No multi-question pages. One stimulus, one response, one feedback. |
| Minimum touch target | 96 × 96px on all interactive elements. Never smaller. |
| Back button size | ≥ 64 × 64px — enlarged for easy press with small hands. |
| Spacing between targets | 12–14px minimum gap between all tappable elements. |
| Feedback latency | All feedback appears within 100ms of input. |
| Gestalt figure-ground | Main letter/number must always dominate visual hierarchy. |
| RTL — full layout flip | `dir="rtl"` on `<html>`. Progress bars fill R→L. All directional animations reverse. |
| No reading required | Navigation works entirely through icons, audio, and large touch targets. |
| Nikud always on by default | Hebrew letters show full vowel marks. Toggle to hide for older kids (planned). |
| Socratic AI | AI hints guide the child. Never gives the answer directly. After N wrong attempts (age-dependent), system reveals it. |
| Second try before advance | On first wrong answer, the question stays. Child gets one retry. Screen must NOT advance on first wrong. ← Locked Decision #11 |

## 2.2 Triple Reinforcement — Numbers Pattern

Numbers module shows three layers simultaneously. All three must be visually large and clearly readable.

| Layer | Element | Age 3–4 Size | Age 5–6 Size |
|---|---|---|---|
| Symbolic | Large numeral (teal, Varela Round) | clamp 6–9rem | clamp 5–8rem |
| Visual count | Emoji objects, grouped for subitizing | clamp 1.8–2.2rem | clamp 1.5–1.8rem |
| Linguistic | Hebrew word with full nikud | min 1.4rem | min 1.2rem |

## 2.3 Journey Bar — Shared Component

- Linear dot path: 🏆 (left) → N step dots → 🏆 goal (right)
- Age 3–4: 4 steps. Age 5–6: 6 steps.
- Done steps: green fill + ★
- Current step: yellow fill + theme avatar, bouncing animation
- Connectors fill green as steps complete
- On completion: 🏆 pops with rotation animation, 550ms delay before next action

> ⚠ This is NOT a road/coins — the road is a wireframe future vision, not yet built.

## 2.4 Input Handler Design

All input types must map to the same action interface. Never hardcode for a single input type.

```js
{ type: 'SELECT', target: elementId, source: 'touch' | 'mouse' | 'gamepad' | 'camera' }
{ type: 'CONFIRM', source: ... }  // swipe-right / controller-B / wave
{ type: 'BACK',    source: ... }  // swipe-left / controller-start / open-hand
{ type: 'DRAW', x, y, pressure }  // finger/mouse on tracing canvas
```

**MediaPipe gestures (Phase 12+):**
- `THUMBS_UP` → confirm answer
- `OPEN_HAND` → back / home
- `POINT` → hover / select
- `FINGERS_COUNT 1–5` → direct answer (stability: 2.5s for age 3–4, 1.5s for age 5–6)
- `WAVE` → next question

## 2.5 Navigation Flow

```
Onboarding (first launch) → Home Screen
Home Screen → [any module] → Quiz Loop → Journey Complete → Home Screen
Quiz Loop:  Question → Answer → Feedback → Next Question
Wrong (1st) → "נסה שוב" prompt → Same Question → Second attempt
Wrong (2nd) → Reveal Answer → Next Question
Stuck > threshold → Audio Hint → Continue
Mood negative → Small Win Screen → Home Screen
```

---

# 3. Design System

## 3.1 Color Palette

| Token | Hex | Use |
|---|---|---|
| Background | `#FFF9F0` | Warm off-white base |
| Primary / CTA | `#FF6B35` | Orange — buttons, active states |
| Secondary | `#00B4A6` | Teal — progress, camera overlay |
| Accent | `#FFD166` | Yellow — stars, coins, rewards |
| Correct | `#06D6A0` | Green — correct feedback |
| Wrong | `#EF476F` | Red/pink — brief flash only (<300ms) |
| Dark | `#1A1A2E` | Navy — text, headers |
| Gray | `#8B8FA8` | Labels, secondary text |

> ⚠ Forbidden: No gray `#808080` or black `#000000` in child-facing views. Use Dark navy instead.

## 3.2 Typography

- Display / Letters: **Varela Round** — RTL-safe, rounded, child-friendly
- Body / UI: **Rubik** — designed for Hebrew, clean at all sizes
- Letter size for recognition tasks: min 90px, target 130–160px
- Touch targets: minimum 96 × 96px — non-negotiable. Back button: minimum 64 × 64px.

## 3.3 Theme System

6 animated world themes. Applied as class on `<body>` via `engine/theme.js`.

| Theme ID | Emoji | Name (Hebrew) |
|---|---|---|
| dino | 🦕 | דינוזאורים |
| volcano | 🌋 | הר הגעש |
| ocean | 🐠 | אוקיינוס |
| space | 🚀 | חלל |
| forest | 🦉 | יער |
| dragon | 🐉 | דרקון |

Each theme: `bg`, `sky` (gradient), `ground`, `cardBg`, `mascot` (emoji), `particles`, `praise strings`, `dark` (bool).

> ℹ Future: themes can be filtered/reskinned per age band (cartoon for 3–4, adventure for 5–6). Not yet implemented.

## 3.4 Animation Rules

- Correct answer: green flash + confetti burst (level complete only)
- Wrong answer: red flash <300ms — brief, non-punishing
- Journey dot: bouncing animation on current step
- Confetti: canvas-based, 550ms, proportional — not excessive
- No timers visible to child — ever

---

# 4. Screens

**Global Persistent UI (all screens):**
- ⭐ Star badge: fixed top-right, yellow pill, cumulative stars
- ← Back button: fixed top-left, minimum **64×64px** circle — enlarged for small hands. See §9.1.
- 🌐 Lang FAB: fixed bottom-left, עב | EN pill, active language in orange

## Screen 0 — Onboarding ✅

First launch only. Dark space gradient. 3-step linear animated flow.

- Step 1 — Age picker: "כמה אתה בן/בת?" — 🐣 קטן (3–4) · ⭐ מדהים (5–6). Tap speaks the label. Saves to `localStorage ylmd_age`.
- Step 2 — Theme picker: "!בחר עולם" — 3×3 grid. Applies `Theme.apply()` immediately. All themes available immediately.
- Step 3 — Language picker: **REMOVED** from onboarding flow. Language defaults to Hebrew. Lang FAB always available.

Re-triggered via Settings "שנה גיל / עולם" button.

## Screen 1 — Home Screen ✅

| Module Card | Color | Age 3–4 | Age 5–6 |
|---|---|---|---|
| אותיות (Letters) | Orange `#FF6B35` | ✅ | ✅ |
| מספרים (Numbers) | Teal `#00B4A6` | ✅ | ✅ |
| צורות (Shapes) | Purple `#A78BFA` | ✅ | ✅ |
| צבעים (Colors) | Gradient orange→yellow→green→purple | ✅ | ✅ |
| חשבון (Math) | Pink `#FF4F8B` | ✅ | ✅ |
| פיזיקה ועולם הטבע (Physics & Nature) | Teal `#26A69A` | ✅ | ✅ |
| כתיבה (Tracing) | Yellow, dark text — full-width row | ✅ | ✅ |

## Screen 2 — Letters Quiz ✅

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Letter pool | All 22 (א–ת) | All 22 (א–ת) |
| Phonics move | Move 1 only (Kamatz + Patach) | Move 1 + Move 2 |
| Nikud | Always on, maximum size | Always on |
| Letter display size | clamp 9–13rem | clamp 7–11rem |
| Round 1 stimulus | Letter + image + word | Letter + word |
| Round 2 (audio only) | ❌ Not available | ✅ Active |
| Round 3 (hard distractors) | ❌ Not available | ✅ Active |
| Choice count | 2 | 3 |
| AI hint trigger | After 1st wrong answer | After 2nd wrong answer |
| Wrong-before-reveal | 1 | 2 |

> ⚠ Letters Quiz is RECOGNITION only. Tracing is a completely separate screen (Screen 3). See §9.1 for known bugs.

## Screen 3 — Letter Tracing ✅

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Available modes | Guided + Trace | Guided + Trace |
| Canvas size | 340 × 340px (larger) | 300 × 300px |
| Stroke tolerance | ~40px (very forgiving) | ~27–35px |
| Guided arrow speed | 1.5× slow | 1.5× slow |
| Phonics gating | Move 1 letters only | Move 1 + Move 2 |
| Free mode (OCR) | ❌ Not available | ❌ Not available (Phase 12) |

Mode badge pill (teal): מודרך / דהוי / חופשי. Journey bar. Controls: Clear (red) + Next (orange), min 96×52px.  
Live Beautification: snaps shaky strokes to clean curves — non-negotiable for all ages.

> 🐛 Known bugs in v0.9 — see §9.1.

## Screen 4 — Numbers Quiz ✅

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Number range | 1–20 | 1–200 (dynamic ceiling) |
| Emoji style | Simple, familiar objects (🍎🐶⭐) — high contrast | More varied emoji set |
| Emoji display mode | Literal count (one-by-one) + row grouping | Subitizing groups (two colour-coded rows, Gestalt layout) |
| Emoji figure size | clamp 1.8–2.2rem | clamp 1.5–1.8rem |
| Subitizing flash duration | 2.5 seconds | 2.0 seconds |
| Hebrew number words | 1–20 (cardinal) | 1–200 (cardinal + ordinal) |
| Triple reinforcement | Numeral + emojis + Hebrew word (all large) | Numeral + emojis + Hebrew word |
| Choice count | 2 | 3 |
| MediaPipe finger input | 1–5 fingers (Phase 12) | 1–10 fingers, two hands (Phase 12) |

> ⚠ Dynamic ceiling (5–6): starts at 1–20. Accuracy >80% → ceiling +20 (up to 200). Never decrease mid-session.  
> 🐛 Open gaps — see §9.2 (GAP-01).

## Screen 5 — Shapes Quiz ✅

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Shape set (standard) | Circle, square, triangle, rectangle | + Star, heart, oval, diamond |
| Shape set (high difficulty) | Pentagon, hexagon, cross | Octagon, trapezoid, parallelogram, rhombus |
| 3D shapes | ✅ Cube, sphere, cone | ✅ + pyramid, cylinder, torus |
| 3D high difficulty | Prism, hemisphere | Prism, hemisphere, frustum |
| Display size | clamp 9–13rem | clamp 7–10rem |
| Choice count | 2 | 3 |

> ℹ 3D shapes unlocked at age 5–6 (was 7–8 in v1.5). High-difficulty shape sets are a roadmap item, not yet built.

## Screen 6 — Colors Quiz ✅ *(redesigned v1.6)*

Colors redesigned from static quiz into a Color Science experience. Color naming is the entry point; module expands into RGB mixing and rainbow order.

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Color set | 8 basic (red, blue, green, yellow, orange, purple, pink, white) | 8 basic + brown, grey + light/dark variants |
| Color display circle size | clamp 140–170px | clamp 120–155px |
| RGB mixing game | ✅ Active — drag two colors, discover result | ✅ Active — drag two colors, discover result |
| Rainbow order game | ✅ Simple (3 arcs: red, yellow, blue) | ✅ Full 7-color ROY G BIV drag sequence |
| Color naming quiz | ✅ Standard | ✅ Active + shade discrimination |

Color mixing mechanic (both ages): child drags two color circles together → animated splat → new color. Discovery moment — no wrong state. Off-combinations show playful muddy result + funny audio.

> ⚠ Color mixing and rainbow sequence games are **Backlog Activities** — not immediate builds. Current build: standard recognition quiz.

## Screen 7 — Math Quiz ✅

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Operations | Addition only | Addition + Subtraction (slow difficulty ramp) |
| Number range | 1–9 (sum ≤ 10) | 1–20 (sum ≤ 20) |
| Stimulus — low difficulty | Emoji counting (5 🍎 + 2 🍎 = ?) | Emoji groups + numeric |
| Stimulus — high difficulty | Emoji counting | Numeric equation (5 + 2 = ?) |
| Grouping-of-5s shown | ✅ Always at lower difficulty | ✅ At lower difficulty |
| Subitizing warm-up | ✅ Flash clusters before equation | ✅ Flash clusters as warm-up |
| Number decomposition | ❌ Not available | ⚠ Intro only (5 = 3+2) |
| Equation display size | clamp 4–6rem | clamp 3–5.5rem |
| Choice count | 2 | 3 |

Subtraction ramp (5–6): introduce only after addition accuracy exceeds 70%. Begin with emoji-supported small numbers. Escalate to pure numeric only after sustained accuracy.

## Screen 8 — Physics & Nature ⏳ *(replaces Engineering — v1.6)*

Wonder module — no quiz format. Children observe animated physics phenomena and interact/predict.

| Topic | Mechanic | Age |
|---|---|---|
| Gravity | Drop objects, observe fall speed (feather vs rock) | 3–4, 5–6 |
| Weight | Animated balance scale — drag objects, observe tipping | 3–4, 5–6 |
| Light & Shadow | Move a light source, shadow grows/shrinks | 5–6 |
| Water flow | Tilt virtual cup, water flows to lowest point | 3–4 |
| Floating vs sinking | Drop objects into water — predict float or sink | 3–4, 5–6 |
| Magnetism | Drag magnet near objects — observe attraction/repulsion | 5–6 |
| Rainbow (light refraction) | Shine light through prism → rainbow appears | 5–6 |

AI asks a Socratic question per phenomenon — no correct/wrong, only discovery + praise for engagement.

> ⚠ Phase design only. Not yet built. Replace `engineering.js` with `physics.js` when Phase begins.

## Screen 9 — CV Finger Count ⏳

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Finger range | 1–5 fingers | 1–10 fingers (two hands) |
| Stability bar duration | 2.5 seconds | 1.5 seconds |
| Primary use | Direct answer for Numbers and Math | Same + two-hand counting for 6–10 |

> ⚠ Phase 12 — not yet built. Not active in any current version.

## Screen 10 — Voice Word Game ✅

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Word set | ⚠ DEPRECATED — current list (כלב, בית) replaced. See §9.3 (CONTENT-01). | ⚠ DEPRECATED — current list replaced. See §9.3 (CONTENT-01). |
| Touch fallback bubbles | 3 bubbles always visible | 3 bubbles always visible |
| Pronunciation tolerance | High (wide phoneme match) | Medium |
| Button letter size | Large — min 2rem Hebrew text | Standard |

## Screen 11 — Memory Match ✅

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Grid | 2×2 (2 pairs) | 2×4 (4 pairs) |
| Card face content | Emoji only, large and colorful | Emoji + Hebrew word |
| Face-down pattern | Theme mascot, large and colorful | Theme pattern, medium |

> 🎨 Wide-screen layout gap — see §9.2 (GAP-02).

## Screen 12 — Emotional Support (Small Win) ⏳

| Parameter | Age 3–4 | Age 5–6 |
|---|---|---|
| Trigger: consecutive wrong | After 1 wrong | After 2 wrong |
| Trigger: idle time | 5 seconds | 7 seconds |
| Mood detection threshold | Sensitive (Phase 12) | Normal (Phase 12) |
| Activity offered | Color a shape (tap) | Count objects (tap) |

## Screen 13 — PBE Treasure Hunt ⏳

Place-Based Education. Camera-based. Phase 15.

- AI issues a mission: "!מצא משהו כחול ועגול בחדר שלך והראה לי"
- Child holds real object to camera. MediaPipe + CV validates color + shape.
- On success: object "digitized" → virtual version appears in Physics & Nature world.
- Failure path: Socratic hint only — never says "wrong".

## Screen 14 — Socratic Story Architect ⏳

SEL-focused AI companion. Phase 15.

- Full narrative scene illustration. AI character companion (bottom-left avatar).
- Opening: "?הרובוט עצוב. מה נבנה כדי לשמח אותו"
- Child responds by speaking only (Mic API → Web Speech → he-IL).
- AI generates/animates next scene element. Highlights child's word with nikud in real-time.
- Socratic constraint: AI never gives the right answer. Always asks a follow-up.
- SEL themes: loneliness, sharing, fear, excitement — ages 5–6.
- Every generated word ≥90px with full nikud (scene is also a reading experience).

---

# 5. Sensors, Feedback & Metrics

## 5.1 Sensor Architecture

| Sensor | API / Library | Privacy |
|---|---|---|
| Touch / Mouse | Native browser events | No data stored |
| Microphone (voice) | Web Speech API — he-IL / en-US | On-device only |
| Camera (gestures) | MediaPipe Hands via WebAssembly | On-device only |
| Camera (mood) | MediaPipe Face Mesh (Phase 12) | On-device only |
| Gamepad | Browser Gamepad API | No data stored |

CV performance target: <50ms latency. Downsample to 640×480 for older hardware.

## 5.2 Feedback System

| Event | Feedback Response |
|---|---|
| Correct answer | Green flash + star++ + praise audio (theme-specific) + confetti on level complete |
| Wrong answer (1st) | Brief red flash <300ms. "נסה שוב" prompt. Same question stays — **DO NOT advance.** |
| Wrong answer (2nd — age 5–6) | Correct answer revealed with highlight. Auto-advance. |
| Wrong answer (age 3–4: after 1st) | Correct answer revealed immediately. Auto-advance. |
| Correct stroke (tracing) | Stroke snaps clean + audio praise + star increment |
| Wrong stroke direction | Gentle audio redirect. Stroke fades. Dot indicator. |
| Hesitation > threshold | Audio hint plays (3s for 3–4 / 5s for 5–6). |
| Level complete | Big confetti burst + star tally animation + character celebrates |
| Mood negative | Fade to Small Win screen. No mention of failure. |

## 5.3 Visible Metrics (Child-Facing)

- ⭐ Star count — cumulative, top bar + dashboard stat chip
- 🔥 Streak — shown for age 5–6 only (not meaningful for 3–4)
- 📍 Progress — journey bar position per session

## 5.4 localStorage Schema

```js
// Key: 'ylmd_progress'
{
  "letters": {
    "א": { attempts: 12, correct: 10, lastSeen: 1709500000 },
    "ב": { attempts: 4,  correct: 2,  lastSeen: 1709490000 }
  },
  "numbers": {
    "3": { attempts: 8, correct: 8, lastSeen: 1709500000 },
    "_ceiling": 40   // current dynamic ceiling for this profile
  },
  "sessions": 14,
  "totalStars": 87,
  "lastPlayed": 1709500000
}
```

Question weight = 1 / accuracy. Below age-specific threshold → 2× pool injection.

---

# 6. AI Layer

## 6.1 Trigger Conditions

Claude API is called **only** when:
1. Age 3–4: after 1st wrong answer (stuck state). Age 5–6: after 2nd wrong answer.
2. Hesitation beyond threshold AND audio hint already played (double-stuck).
3. Socratic Story Architect screen (every interaction — this screen is AI-native).

> ⚠ Never call Claude API on every question. Local logic handles everything else.

## 6.2 API Template

```js
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 150,
    system: `You are a warm Hebrew-speaking assistant helping a young child learn.
             Respond only in simple Hebrew. Keep responses under 2 sentences.
             Be encouraging. Never give the direct answer — guide with a hint.`,
    messages: [{ role: "user", content: prompt }]
  })
});
```

## 6.3 Planned AI Expansions (Backlog)

- Encouraging feedback variation (avoid repetitive "!כל הכבוד")
- Dynamic question variant generation
- Full Socratic Story Architect scene generation
- Mood-aware response tuning

---

# 7. Tech Stack

## 7.1 Runtime

- Browser-native, no server required
- No framework — vanilla HTML5 / CSS3 / JavaScript (intentional, for portability)
- Target browsers: Chrome 90+, Edge 90+, Safari 15+
- Target devices: touchscreen laptop, Android phone/tablet

## 7.2 File Architecture

| File | Purpose |
|---|---|
| `index.html` | Entry point; inline CSS+JS (App, Journey, Onboard, Confetti) |
| `i18n/he.js` | All Hebrew strings |
| `i18n/en.js` | All English strings |
| `engine/lang.js` | `Lang.t()`, `Lang.set()`, `Lang.isHe()`, `Lang.get()` |
| `engine/speech.js` | Web Speech API wrapper (rate 0.85, neural voice, he-IL fallback chain) |
| `engine/progress.js` | localStorage adapter (key: `ylmd_progress`) |
| `engine/input.js` | Unified touch/mouse/gamepad handler \[stuck-draw bug fixed v0.8.1\] |
| `engine/adaptive.js` | Weighted question pool, age-specific accuracy thresholds |
| `engine/claude.js` | Claude API wrapper, key management |
| `engine/theme.js` | `Theme.apply()`, `Theme.getAll()`, `Theme.getAvatar()` |
| `modules/letters.js` | Letters data + quiz logic (Screen 2) |
| `modules/tracing.js` | ALL tracing logic, all 3 modes (Screen 3) \[currently in letters.js — split on refactor\] |
| `modules/numbers.js` | Numbers data + quiz, subitizing grouping logic, dynamic ceiling |
| `modules/shapes.js` | Shapes data + quiz (2D + 3D, high-difficulty expansion) |
| `modules/colors.js` | Colors data + quiz + future mixing game |
| `modules/math.js` | Age-tiered arithmetic, grouping-of-5s logic |
| `modules/physics.js` | Physics & Nature module \[replaces engineering.js — Phase design\] |
| `modules/voice.js` | Voice Word Game (Screen 10) |
| `modules/memory.js` | Memory Match (Screen 11) |
| `manifest.json` | PWA manifest (exists) |
| `sw.js` | Service worker (registered, cache not fully configured) |

## 7.3 Key Dependencies

| Dependency | Detail |
|---|---|
| Fonts | Rubik + Varela Round (Google Fonts CDN, self-hosted fallback) |
| Speech | Web Speech API (he-IL locale, no external service) |
| AI | Claude API (`claude-sonnet-4-20250514`) — hints only, on retry |
| CV | MediaPipe Hands + Pose (WebAssembly, fully on-device) |
| Storage | localStorage only (no cloud, no accounts) |

---

# 8. Build Phases

| Phase | Focus | Status |
|---|---|---|
| 1 — Hebrew Core | Letters + Numbers, RTL, he-IL TTS, touch | ✅ Done (v0.2) |
| 2 — Tracing | Canvas letter tracing, pixel-mask scoring, 3 guided modes | ✅ Done (v0.3) |
| 3 — Shapes & Colors | Shapes + Colors modules, 3-round quiz loop | ✅ Done (v0.4) |
| BONUS — Math + Engineering | Age-tiered Math + Engineering module | ✅ Done (v0.7) |
| 4 — Adaptive Engine | localStorage weighted pool — basic done, no spaced repetition | ⚠️ Partial (v0.5) |
| 5 — Themes + Onboarding | 7 CSS themes, onboarding flow, i18n gaps fixed | ✅ Done (v0.8) |
| 6 — Input Expansion | Gamepad API done. MediaPipe Hands not started. | ⚠️ Partial |
| 7 — AI Layer | Claude API hints on Letters/Numbers/Shapes/Colors. Math + Physics not wired. | ⚠️ Partial (v0.8) |
| 8 — English Toggle | i18n layer, EN/HE runtime switch, `Lang.t()` API | ✅ Done (v0.8.1) |
| 9 — Memory Match + Voice | Memory Match + Voice Game modules, home redesign, progress engine | ✅ Done (v0.9) |
| 10 — Child Profiles | Multi-child profiles, GDrive sync via profiles.json, welcome-back UX | ⏳ Next |
| 11 — PWA / Distribution | Service worker registered. GitHub Pages not configured. | ⚠️ Partial |
| 12 — CV (MediaPipe) | Finger counting for math, mood detection, gesture vocab | ⏳ Later |
| 13 — Immersive Worlds | Sky gradients, theme mascot + particle animations, glow/depth polish | ✅ Done (2026-03-10) |
| 14 — Spaced Repetition | Full ALS: hesitation tracking, SM2-style scheduling | ⏳ Later |
| 15 — PBE + Story Architect | Camera treasure hunt + Socratic AI companion (Screens 13–14) | ⏳ Later |

> ⚠ Rule: do not move to next phase until current is checked off. New ideas → backlog only.

---

# 9. Open Issues, Gaps & Feedback

*Single source of truth for all known problems, design gaps, wireframe discrepancies, and user feedback. Every ⚠ and 🐛 in this document traces back here. Ordered by priority.*

---

## 9.1 Active Bugs *(fix before or during next phase)*

### ~~BUG-01 · Letters Quiz advances on first wrong answer~~ ✅ Fixed (2026-03-10)

- Age 5–6: first wrong → red flash → retry unlocked. Second wrong → reveal → advance.
- Age 3–4: first wrong → reveal immediately → advance.
- **Fixed in:** `modules/letters.js` — `wrongCount` counter + age-conditional branch.

### ~~BUG-02 · Guided tracing arrow direction wrong, stroke snaps to edge~~ ✅ Fixed (2026-03-10)

- Arrow direction corrected for ד, ז, ר, ש — strokes now point right→left as expected in Hebrew.
- Coordinate clamping added in `_onDrawStart` + `_onDraw` to prevent bezier control points going off-canvas on fast swipes.
- **Fixed in:** `modules/letters.js` — stroke path corrections + `Math.max(0, Math.min(canvasSize-1, e.x/e.y))`.

### BUG-03 · input.js stuck-draw regression risk

- Stuck-draw bug was fixed in v0.8.1. Monitor for regression in subsequent builds — especially after any touch handler refactor.
- **Fix location:** `engine/input.js`

---

## 9.2 UX & Design Gaps *(spec complete, not yet built)*

### GAP-01 · Numbers — emoji grouping and sizing `[Screen 4]`

Current state: emojis in the Numbers quiz are not grouped for subitizing at age 5–6. Also too small across both age groups.

Correct spec:
- Age 3–4: simple/familiar emoji set (🍎🐶⭐), one-by-one row. Size: clamp 1.8–2.2rem.
- Age 5–6: varied emoji set, two colour-coded Gestalt rows. Size: clamp 1.5–1.8rem. Flash duration: 2.0s.
- Emoji sets must differ between age groups.

### GAP-02 · Memory Match — wide-screen layout `[Screen 11]`

On tablets and landscape orientation the card grid does not expand. Tiles are the same small size as on a phone.

Correct spec: responsive grid (2→3→4 cols based on viewport width). Tile size scales up proportionally. Theme-aware card content where possible (ocean → sea creatures, space → planets).

### ~~GAP-03 · Sky gradient not applied to home background~~ ✅ Fixed (2026-03-10)

Sky gradient from `theme.js` is now applied to `#home-world-bg` per theme.

### ~~GAP-04 · Mascot animation not theme-specific~~ ✅ Fixed (2026-03-10)

6 unique `@keyframes` added: dino hops, volcano shakes, ocean sways, space rotates/floats, forest owl bobs, dragon pounces. Applied via `.t-{theme} .world-mascot`.

### ~~GAP-05 · Particle behavior not theme-specific~~ ✅ Fixed (2026-03-10)

5 unique particle keyframes: `cloudDrift`, `emberFloat`, `starTwinkle`, `fishSwim`, `firefly`. Assigned per particle via `anim` property in `theme.js` + `--p-anim` CSS var.

### ~~GAP-06 · Glow/depth effects missing on dark themes~~ ✅ Fixed (2026-03-10)

`mascotGlow` brightness-pulse on volcano + dragon. Drop-shadows on space/ocean/forest mascots. Ground strip uses theme `ground` color.

---

## 9.3 Content Gaps *(requires content work, not just code)*

### CONTENT-01 · Voice Word Game word lists deprecated `[Screen 10]`

Current word lists (כלב, בית = dog, house) are too simple and generic. Children are not engaged.

Redesign requirements:
- **40+ words per age group** minimum — enough variety to avoid repetition
- **Age 3–4:** familiar everyday objects and animals. Fun to say aloud. Examples: אריה (lion), נמר (tiger), ירח (moon), שמש (sun), עוגה (cake), כדור (ball)
- **Age 5–6:** actions, feelings, places, compound concepts. Examples: רץ (running), שמח (happy), מכונית (car), ים (sea), ענן (cloud), מכתב (letter)
- Words should feel interesting and worth saying — not just pedagogically correct
- Emoji visual must match word precisely — no approximations

### CONTENT-02 · Hebrew letter stroke paths incomplete `[Screen 3]`

Stroke direction and sequence data for all 22 Hebrew letters needs a full audit. Some paths are incorrect (causing BUG-02). Required: correct stroke path data array for each letter, including direction arrows and sequence numbers.

---

## 9.4 TTS & Audio Issues *(user feedback from testing)*

### ~~AUDIO-01 · Voice speed too fast — onset phonemes cut off~~ ✅ Fixed (2026-03-10)

- Rate now `0.70` for age 3–4 / `0.80` for age 5–6 (reads `ylmd_age` from localStorage).
- 150ms pre-roll silence added before every utterance.
- **Fixed in:** `engine/speech.js` — age-based `defaultRate` + `setTimeout` pre-roll.
- Long-term: pre-recorded audio fallback still recommended (see CONTENT-02).

### AUDIO-02 · Hebrew pronunciation incorrect on some words

**Reported:** TTS does not always pronounce Hebrew words correctly. Some letter names or vocabulary words sound unnatural or wrong.  
**Impact:** children may learn incorrect pronunciation — contradicts Ministry curriculum alignment.  
**Root cause:** Web Speech API he-IL voice quality is device/browser-dependent and cannot be controlled programmatically.

Options (ranked by alignment with offline-first principle):
1. **Option A — Pre-recorded audio (recommended):** collect recordings from a native Hebrew speaker (Israeli Standard dialect). Build hash map: `text → .mp3`. `speech.js` falls back to pre-recorded audio when needed. Critical vocabulary: all 22 letter names, numbers 1–20, common quiz words.
2. **Option B — Google Cloud TTS:** higher quality he-IL neural voice, but requires internet. Cache in PWA after first use. Falls back to Web Speech API offline.
3. **Option C — Community recordings:** partner with Hebrew-speaking parents/teachers. Open-source audio library.

> ⚠ High-priority quality issue. Incorrect pronunciation undermines the entire phonics curriculum. Resolve before or alongside Phase 12.

---

## 9.5 Wireframe Gaps *(delta between wireframes-v3 and current prototype)*

| Wireframe Element | Prototype Reality | Status |
|---|---|---|
| Screen 0: Theme picker as first screen | Onboarding is 3-step: age → theme → language | Superseded |
| Screen 0: Themes unlock every 10 stars | All themes available immediately | Build toward |
| Screen 1: World map dashboard with SVG road | Flat 2×2 module grid. No road. | Build toward |
| Screen 1: Language toggle in top bar | Lang FAB at bottom-left corner | Superseded |
| Screen 1: 4 activity cards (lock/unlock) | 7 module buttons, no locked state | Build toward |
| Screen 1: Engineering card | Now Physics & Nature card | Superseded |
| Numbers screen: Not in wireframes | Triple-display + grouped emoji subitizing | Gap in wireframes |
| Journey bar: Not in wireframes | Present on every quiz/tracing screen | Gap in wireframes |
| Back button: Not in wireframes | 64×64px circle (enlarged), fixed top-left | Gap in wireframes |
| Screens 9–14 | None exist in prototype yet | Future only |

---

## 9.6 Future UX & Polish *(non-blocking aspiration items)*

- Voice Game emoji quality — photorealistic or high-detail illustrated prompts, not flat pixel emoji
- Theme-aware Memory Match content — card pairs drawn from active theme
- Nikud toggle — hide vowel marks for advanced readers (age 5–6)
- Parent Dashboard — weekly summary, problem letters, session history
- Trophy room — all earned stars, unlocked themes, personal bests
- Settings: reset progress + volume control
- Offline indicator — subtle badge when offline (PWA)
- Accessibility mode — high contrast, larger targets, slower TTS rate
- Color mixing and rainbow sequence games (Colors module — Backlog Activities)

---

# 10. Backlog

## Activities

| Activity | Description | Age |
|---|---|---|
| Rhyme Match | Match two words that rhyme — audio-driven, no reading | 4–6 |
| Number Bonds | Split a number into two groups (5 → 3+2) via drag | 5–6 |
| Story Sequencing | Drag 3 picture cards into correct story order | 5–6 |
| Body Parts | Touch body part on doll when named | 3–5 |
| Opposites | Match hot/cold, big/small with image pairs | 4–6 |
| Colour Mixing | Drag two colour circles together to reveal result | 4–6 |
| Rainbow Sequence | Drag 3 arcs (age 3–4) or 7 arcs (age 5–6) into rainbow order | 3–6 |
| Counting On | Number line: tap where to land after jumping N steps | 5–6 |
| Letter Sounds | Hear a phoneme, identify which Hebrew letter makes that sound | 5–6 |
| Days of Week | Sequence the days — circular calendar, drag & drop | 5–6 |
| Weather Reporter | Child reports today's weather via camera — builds vocabulary | 4–6 |

## Technical Backlog

- OpenCV.js local OCR — Free Mode tracing letter recognition (Phase 12)
- Spaced repetition (SM2-style) — replace basic 2× weighting
- Service worker caching — full offline after first load
- GitHub Pages setup
- Claude API wiring — Math + Physics modules not yet wired
- Gamepad full mapping — basic done, needs D-pad navigation
- MediaPipe mood detection — face mesh emotion inference (Phase 12)
- Pre-recorded audio hash map — fallback for all 22 letters + numbers 1–10 (→ AUDIO-01, AUDIO-02)
- Tracing stroke paths audit — all 22 Hebrew letters need correct direction data (→ BUG-02, CONTENT-02)
- Numbers subitizing grouping — Gestalt two-row layout for age 5–6 (→ GAP-01)
- Dynamic numbers ceiling — `_ceiling` field in progress schema

---

# 11. Child Profiles & Cross-Device Sync

Single HTML file, no server, no login. Solution: `profiles.json` sidecar file in the same Google Drive folder as `index.html`. Syncing the folder syncs everything.

## Profile Schema

| Field | Type | Set By |
|---|---|---|
| `id` | String (uuid) | Auto-generated |
| `name` | String | Parent — e.g. יובל, אורי, נועם |
| `avatar` | String (emoji) | Parent picks — e.g. 🦁 🐸 🚀 |
| `ageGroup` | `"3-4"` \| `"5-6"` | Parent sets, child can change |
| `theme` | String | Last selected theme |
| `language` | `"he"` \| `"en"` | Last used language |
| `unlockedThemes` | Array of strings | Themes earned via stars |
| `totalStars` | Integer | Cumulative star count |
| `streak` | Integer | Consecutive days with ≥1 session |
| `lastPlayed` | ISO timestamp | For streak + welcome-back |
| `sessions` | Integer | Total session count |
| `letters` | Object | Per-letter accuracy + hesitation |
| `numbers` | Object | Per-number accuracy + hesitation + `_ceiling` |
| `shapes` | Object | Per-shape accuracy |
| `colors` | Object | Per-color accuracy |
| `tracing` | Object | Per-letter tracing scores |
| `activityProgress` | Object | Per-module journey bar position |
| `difficultyOverride` | `null` \| String | Manual tier override by parent |

## Welcome-Back Tiers

| Gap | Response |
|---|---|
| Same day | Straight to dashboard |
| 1–2 days | "התגעגענו אליך" + last activity |
| 3–6 days | Quick review of last weak concept |
| 7+ days | Soft restart one level below last achieved |

---

# 12. Locked Decisions

> ⚠ These are non-negotiable. Do not revisit without Oren's explicit approval.

1. **No framework.** Vanilla JS keeps the app portable as a single file.
2. **Hebrew first.** English is a toggle, never the default.
3. **Offline first.** Every core feature works without internet. Claude API is enhancement only.
4. **No user accounts.** localStorage + profiles.json only. No cloud, no login.
5. **No timers on exercises.** Children should never feel rushed.
6. **Claude API on retry/stuck only.** Not on every question.
7. **No negative feedback text.** "Wrong" does not exist in the UI.
8. **All sensor data on-device.** No camera/mic data leaves the browser.
9. **Min touch target 96×96px.** Non-negotiable.
10. **Socratic AI rule.** AI never gives the direct answer — system reveals it after N fails (age-dependent).
11. **Second try before advance.** On first wrong answer, the question stays. Never advance immediately on first wrong.
12. **Ages 3–6 only.** Ages 7–8 are out of scope. All design, content, and modules target 3–4 and 5–6 bands only.

---

# 13. Out of Scope

- User accounts / cloud sync
- Multiplayer / network features
- In-app purchases or ads
- Analytics / telemetry / tracking
- Content for ages outside 3–6 (ages 7–8 explicitly excluded)
- Server-side processing of any kind

---

*PDD v1.9 · March 2026 · Last updated: 2026-03-11*
*Wireframes: `wireframes-v3-learn-with-me.html` · Prototype: `index.html` (v0.9)*
