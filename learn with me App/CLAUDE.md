# CLAUDE.md — Learn With Me

> Instructions for Codi (Claude Code).
> Global rules in `~/.claude/CLAUDE.md` still apply. This file adds project context.

---

## 🧠 Project Summary

**Name:** Learn With Me
**Owner:** Oren Elimelech — Father of 3, Petach Tikva, Israel
**Status:** v0.9 stable — Phases 1–3 + Bonus + Memory Match + Voice Game + Phase 13 (Immersive Worlds) complete. BUG-01, BUG-02, AUDIO-01 resolved. All engine/module JS files recovered and in git.
**Goal:** A free, offline-capable Hebrew early education app for ages 3–6. Replaces cheap commercial toys (WinFun et al.) with adaptive, AI-powered, touch/camera/gamepad-native learning. Shareable as a single HTML file or hosted on GitHub Pages.

---

## 🤖 AI Roles

| Role | Who |
|------|-----|
| **Building the app (code)** | Codi (Claude Code) |
| **Intelligence inside the app** | Claude API (`claude-sonnet-4-20250514`) |

> ✅ Codi **may and should** wire Claude API directly into the app for adaptive hints, feedback generation, and question variation.
> Keep API calls minimal. Most logic runs locally. API key via `.env`, never committed.

---
## ✅ Testing Standards

- **Test every completed phase** before moving on
- Use iterative internal test → feedback loops
- Report in plain language: what passed, what failed, what was fixed
- Never hand off untested code

### Iterative Code Review (Static Bug Hunt)
1. **Read every source file** — all modules, engine files, i18n files, index.html
2. **Check each file against these categories:**
   - Hardcoded strings that should use `Lang.t()` or `Lang.strings()` — will break English toggle
   - Missing `data-i18n` attributes on HTML elements
   - Input event edge cases — mouseup/touchcancel outside element, stuck state
   - i18n keys present in one language file but missing or mismatched in the other
   - Module state not resetting on `init()` — leftover data from previous session
   - Timer/async leaks — `setTimeout` references not cleared on cleanup
   - Functions called with wrong argument types or order
3. **Prioritize fixes:**
   - Critical (functionally broken) → fix immediately
   - i18n / translation gaps → fix in batch
   - Minor edge cases → note and fix in order
4. **Fix, then report** — list bug, file, and fix in a table

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Browser-native (no server required) |
| **Frontend** | Vanilla HTML5 / CSS3 / JavaScript — no framework |
| **Fonts** | Rubik + Varela Round (Google Fonts CDN, self-hosted fallback) |
| **Speech** | Web Speech API — `he-IL` locale |
| **AI (in-app)** | Claude API `claude-sonnet-4-20250514` — hints, feedback, question variation |
| **CV / Gestures** | MediaPipe Hands + Pose (WebAssembly, fully in-browser) |
| **Gamepad** | Gamepad API (browser-native) |
| **Storage** | localStorage only |
| **Distribution** | Single `.html` file → GitHub Pages → PWA |

**Target browsers:** Chrome 90+, Edge 90+, Safari 15+
**Target devices:** Touchscreen laptop, Android phone/tablet
**No build step required.**

---

## 🏗️ Build Phases

| Phase | Focus | Status |
|-------|-------|--------|
| **1 — Hebrew Core** | Letters + Numbers, RTL, he-IL TTS, touch | ✅ Done |
| **2 — Fine Motor** | Canvas letter tracing — finger/mouse, pixel-mask scoring, 3 modes | ✅ Done |
| **3 — More Modules** | Shapes (צורות) + Colors (צבעים) | ✅ Done |
| **BONUS** | Math (חשבון) — age-tiered arithmetic | ✅ Done |
| **BONUS** | Engineering (הנדסה) — 8 tools, reverse mode | ✅ Done |
| **4 — Adaptive Engine** | localStorage accuracy tracking, weighted question pool | ⚠️ Partial (basic weighting only) |
| **5 — Input Expansion** | Gamepad API ✅ done — MediaPipe Hands/Pose | 🔨 MediaPipe pending |
| **6 — AI Layer** | Claude API hints after 2 wrong answers, cached | ⚠️ Partial (limited categories, no error handling) |
| **7 — English Toggle** | Runtime toggle wired, dir switches RTL↔LTR, all hardcoded strings moved to i18n | ✅ Done |
| **8 — Distribution** | manifest.json + sw.js exist, GitHub Pages not set up | ⚠️ Partial |
| **9 — Memory Match + Voice Game** | 2 new modules, home redesign, theme/progress engine, tracing improvements | ✅ Done |
| **13 — Immersive Worlds** | Sky gradients, theme mascot animations, particle behaviors, glow/depth | ✅ Done (2026-03-10) |
| **10 — Child Profiles** | profiles.json sidecar + GDrive sync, Profile Selector screen | 🔲 Next |

---

## ✅ Phase 2 — Definition of Done (Letter Tracing) — COMPLETE

- [x] Canvas element with touch + mouse drawing
- [x] Each letter has a defined stroke path (direction + sequence)
- [x] **Guided mode:** trace over faded letter outline
- [x] **Faded mode:** minimal guide, partial outline only
- [x] **Free mode:** blank canvas, no guide
- [x] Stroke scoring: tolerant — not pixel-perfect (small hands!)
- [x] Audio feedback: correct stroke → praise | wrong direction → gentle redirect
- [x] Works on touchscreen and with mouse
- [x] Integrated into existing Letters module flow

### Tracing — Implementation Notes
- Tracing logic lives in **`modules/letters.js`** (not a separate file)
- Guide: faded Hebrew letter rendered via canvas text (alpha 0.18 guided / 0.08 faded)
- Guided mode: start dot + direction arrow from `LETTER_STROKES` path
- Scoring: pixel-mask approach — accuracy (% user points landing on letter) + coverage (% letter covered by user)
- Tolerance: 9% of canvas size (~27px at 300px canvas)
- Combined score threshold: 0.62 (40% accuracy weight + 60% coverage weight)
- Hard gate: accuracy < 44% or coverage < 40% → always fail (blocks random scribbling)
- Bezier smoothing: quadratic curves through midpoints for smooth real-time drawing
- On fail: flash orange stroke-path hint for 1.3s, then redraw guide
- On correct completion: green overlay + checkmark + confetti + star

---

## 📝 Content Data

### Aleph-Bet (22 letters)
Each entry: `{ letter, name (with nikud), word, emoji }`

```javascript
{ letter:'א', name:'אָלֶף',  word:'אֲרִי',    emoji:'🦁' },
{ letter:'ב', name:'בֵּית',  word:'בַּיִת',   emoji:'🏠' },
{ letter:'ג', name:'גִּימֶל', word:'גָּמָל',   emoji:'🐪' },
{ letter:'ד', name:'דָּלֶת',  word:'דָּג',     emoji:'🐟' },
{ letter:'ה', name:'הֵא',    word:'הַר',      emoji:'⛰️' },
{ letter:'ו', name:'וָו',    word:'וֶרֶד',    emoji:'🌹' },
{ letter:'ז', name:'זַיִן',  word:'זֶבְרָה',  emoji:'🦓' },
{ letter:'ח', name:'חֵית',   word:'חָתוּל',   emoji:'🐱' },
{ letter:'ט', name:'טֵית',   word:'טַיִס',    emoji:'✈️' },
{ letter:'י', name:'יוֹד',   word:'יֶלֶד',    emoji:'👦' },
{ letter:'כ', name:'כַּף',   word:'כֶּלֶב',   emoji:'🐶' },
{ letter:'ל', name:'לָמֶד',  word:'לֵב',     emoji:'❤️' },
{ letter:'מ', name:'מֵם',    word:'מָגֵן',    emoji:'⭐' },
{ letter:'נ', name:'נוּן',   word:'נָחָשׁ',   emoji:'🐍' },
{ letter:'ס', name:'סָמֶך',  word:'סוּס',     emoji:'🐴' },
{ letter:'ע', name:'עַיִן',  word:'עֵץ',      emoji:'🌳' },
{ letter:'פ', name:'פֵּא',   word:'פִּיל',    emoji:'🐘' },
{ letter:'צ', name:'צָדִי',  word:'צִפּוֹר',  emoji:'🐦' },
{ letter:'ק', name:'קוֹף',   word:'קוֹף',     emoji:'🐒' },
{ letter:'ר', name:'רֵישׁ',  word:'רַכֶּבֶת', emoji:'🚂' },
{ letter:'ש', name:'שִׁין',  word:'שֶׁמֶשׁ',  emoji:'☀️' },
{ letter:'ת', name:'תָּו',   word:'תַּפּוּחַ', emoji:'🍎' },
```

### Numbers (1–10)
Each entry: `{ num, word (Hebrew), emoji }`

```javascript
{ num:1,  word:'אֶחָד',   emoji:'⭐' },
{ num:2,  word:'שְׁתַּיִם', emoji:'👀' },
{ num:3,  word:'שָׁלוֹשׁ', emoji:'🔺' },
{ num:4,  word:'אַרְבַּע', emoji:'🍀' },
{ num:5,  word:'חָמֵשׁ',  emoji:'🖐️' },
{ num:6,  word:'שֵׁשׁ',   emoji:'❄️' },
{ num:7,  word:'שֶׁבַע',  emoji:'🌈' },
{ num:8,  word:'שְׁמוֹנֶה',emoji:'🕷️' },
{ num:9,  word:'תֵּשַׁע',  emoji:'🎱' },
{ num:10, word:'עֶשֶׂר',  emoji:'🔟' },
```

### Math (חשבון) — Bonus Module
Age-tiered arithmetic, 3 tiers based on onboarding age selection:
- **Tier 0 (3–4):** Counting emoji objects 1–5
- **Tier 1 (5–6):** Addition, sums ≤ 10
- **Tier 2 (5–6, advanced):** Addition + subtraction, values ≤ 20 *(activated after several journey completions)*

Questions generated dynamically with nearby wrong answers (not random distractors).

### Engineering (הנדסה) — Bonus Module
8 tools with Hebrew names:
```javascript
{ tool:'🔨', name:'פַּטִּישׁ' },  // Hammer
{ tool:'🔧', name:'מַפְתֵּחַ' }, // Wrench
{ tool:'✂️', name:'מִסְפָּרַיִם' }, // Scissors
{ tool:'📏', name:'סַרְגֵּל' },  // Ruler
{ tool:'🔩', name:'בֹּרֶג' },    // Screw
{ tool:'🪛', name:'מַברֵג' },   // Screwdriver
{ tool:'🪚', name:'מְסוֹר' },   // Saw
{ tool:'🧲', name:'מַגְנֵט' },  // Magnet
```
- Level 0: emoji + label → pick Hebrew name
- Level 1: emoji only → pick Hebrew name
- Level 2 (reversed): Hebrew name → pick emoji

---

## 🎮 Input Handler Design

All input types map to the same action interface. Never hardcode for a single input type.

```javascript
// Unified action interface
{ type: 'SELECT',  target: elementId, source: 'touch'|'mouse'|'gamepad'|'camera' }
{ type: 'CONFIRM', source: ... }   // swipe-right / controller-B / wave
{ type: 'BACK',    source: ... }   // swipe-left / controller-start / open-hand
{ type: 'DRAW',    x, y, pressure, source: 'touch'|'mouse' }  // tracing canvas
```

### Gamepad Mapping (Phase 5)
```
A button  → SELECT / confirm
B button  → back
D-pad     → navigate options
Start     → home screen
```

### MediaPipe Gestures (Phase 5)
```
THUMBS_UP         → confirm answer
OPEN_HAND         → back / home
POINT             → hover / select
FINGERS_COUNT 1–5 → direct answer for number questions
WAVE              → next question
```

---

## 🔊 Speech Engine

```javascript
speak(text, options = {}) {
  lang: 'he-IL',
  rate: 0.85,
  pitch: 1.1,
  fallback: 'audio/prerecorded/{hash}.mp3'
}
// Priority: Web Speech API → pre-recorded MP3 → silent (visual-only)
```

Hebrew voice requires `he-IL` on OS. Best on Chrome/Edge Windows.
Check voice availability on init — warn user if missing.

---

## 🤖 Claude API Usage (Phase 6 only)

```javascript
// Use ONLY for:
// 1. Adaptive hint — child is stuck after 2 failed attempts
// 2. Feedback variation — avoid repeating "כל הכבוד!" every time
// 3. New question variants

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 150,
    system: "You are a warm Hebrew-speaking assistant helping a 5-year-old learn. Simple Hebrew only. Under 2 sentences. Be encouraging.",
    messages: [{ role: "user", content: prompt }]
  })
});
```

> ⚠️ Never call on every question. Only on stuck/retry. Cache responses. API key via `.env`.

---

## 📊 Adaptive Progress Schema (localStorage)

```javascript
// Key: 'ylmd_progress'
{
  "letters": {
    "א": { attempts: 12, correct: 10, lastSeen: 1709500000 },
    "ב": { attempts: 4,  correct: 2,  lastSeen: 1709490000 }
  },
  "numbers": {
    "3": { attempts: 8, correct: 8, lastSeen: 1709500000 }
  },
  "sessions": 14,
  "totalStars": 87,
  "lastPlayed": 1709500000
}
```

- Question weight = inverse of accuracy ratio
- Below 70% accuracy → appear 2× more often in question pool
- After 2 failures → reveal correct answer, move on (no dead ends)

---

## 🎨 Design System

### Typography
- Display / Hebrew letters: **Varela Round** — RTL-safe, rounded, child-friendly
- UI / Body: **Rubik** — designed for Hebrew
- Letter size (recognition tasks): min 90px, target 130–160px
- **Touch targets: minimum 96×96px — never smaller**

### Color Palette
```
Background:  #FFF9F0  (warm off-white)
Primary CTA: #FF6B35  (orange)
Secondary:   #00B4A6  (teal)
Accent:      #FFD166  (yellow)
Correct:     #06D6A0  (green)
Wrong:       #EF476F  (red/pink)
Dark:        #1A1A2E
```

### Interaction Principles
- One task per screen — no reading required to navigate
- Audio instruction before every question
- Feedback within 100ms of input
- Correct answer always revealed after wrong attempt — no dead ends
- Confetti + star on correct — proportional, not excessive
- No timers — child sets the pace
- Never show "wrong" — always gentle redirect

---

## 📁 Folder Structure

```
Learn with me/
├── CLAUDE.md
├── index.html                  # Entry point
├── manifest.json               # PWA (Phase 8)
├── sw.js                       # Service worker (Phase 8)
├── .env                        # API keys — never commit
├── assets/
│   ├── fonts/                  # Self-hosted fallback
│   └── audio/                  # Pre-recorded he-IL fallback
├── modules/
│   ├── letters.js              # Data + render + tracing paths (Phase 2 lives here)
│   ├── numbers.js              # Data + render
│   ├── shapes.js               # Phase 3
│   └── colors.js               # Phase 3
├── engine/
│   ├── speech.js               # TTS wrapper
│   ├── progress.js             # localStorage adapter
│   ├── input.js                # Unified input handler
│   ├── adaptive.js             # Question weighting (Phase 4)
│   └── claude.js               # Claude API wrapper (Phase 6)
├── cv/
│   ├── mediapipe-hands.js      # Hand gesture recognition (Phase 5)
│   └── gesture-map.js          # Gesture → action mapping
└── i18n/
    ├── he.js                   # All Hebrew UI strings
    └── en.js                   # English strings (Phase 7)
```

> ⚠️ **Tracing logic is in `modules/letters.js`** — not a separate tracing.js file.

---

## 📐 Conventions

- **No frameworks** — vanilla JS only
- **No `console.log` in production**
- **All Hebrew UI strings** in `i18n/he.js` — never hardcoded in HTML/JS
- **RTL always** — `dir="rtl"` on `<html>`, never override
- **Touch targets:** 96×96px minimum
- **No timers on exercises**
- **Tracing tolerance:** Forgiving — ~30–40px threshold

---

## 🔒 Locked Decisions

1. **No framework.** Vanilla JS only — portability as single HTML file.
2. **Hebrew first.** English is a toggle, never default.
3. **Offline first.** Every core feature works without internet. Claude API is enhancement only.
4. **No user accounts.** localStorage only.
5. **No timers on exercises.**
6. **Claude API on retry/stuck only.** Never on every question.
7. **Tracing in `letters.js`**, not a separate module.
8. **No negative feedback text.** "Wrong" does not exist in the UI — always gentle redirect.
9. **All sensor data on-device.** No camera/mic data leaves the browser.
10. **Socratic AI rule.** AI never gives the direct answer — system reveals it after 2 fails, not the AI voice.

---

## 🚫 Out of Scope

- User accounts / cloud sync
- Multiplayer / network features
- In-app purchases or ads
- Analytics / telemetry / tracking
- Microsoft ecosystem tools
- Server-side processing of any kind

---

## 👨‍👧 Owner Context

Oren is a father of 3 boys, based in Petach Tikva. Background in Product Management, Systems Engineering, and Computer Vision (Gentex Israel). Not a developer — works with Codi to build. The CV/MediaPipe direction is personally motivated.

---

## 📅 Session Log

| Date | Milestone |
|------|-----------|
| Mar 2026 | Project started — WinFun identified as baseline |
| Mar 2026 | v0.1: English prototype — 4 modules |
| Mar 2026 | v0.2: Full Hebrew rewrite — RTL, he-IL TTS, all 22 letters, nikud |
| Mar 2026 | SPEC_APP.md + CLAUDE.md created and aligned |
| Mar 2026 | v0.3: Letter tracing — canvas, pixel-mask scoring, 3 modes, Bezier smoothing |
| Mar 2026 | v0.4: Shapes + Colors modules complete |
| Mar 2026 | v0.5: Adaptive engine (basic) + localStorage progress tracking |
| Mar 2026 | v0.6: Gamepad input wired (input.js) |
| Mar 2026 | v0.7: Math + Engineering bonus modules |
| Mar 2026 | v0.8: Claude API hints, 7 themes, onboarding flow, PWA shell, i18n complete |
| Mar 2026 | v0.8.1: English toggle wired (toggleLang + dir switch), i18n gaps fixed (journeyMsgs, traceJourneyMsgs, listenAndFind, settings), input.js stuck-draw fixed (touchcancel + document mouseup), SPEC_TEMPLATE.md added |
| Mar 2026 | v0.9: Memory Match + Voice Game modules added. Home redesign: age pills, stat chips, themed bg, mod-dot completion indicators. Theme engine: per-theme praise. Progress engine: streak/sessions/moduleCompletions. Tracing: phase pills + nikud toggle + letter chip strip. All 9 modules track journey completions. |
| 2026-03-10 | Phase 13: Immersive Worlds complete — GAP-03–06 resolved. BUG-01, BUG-02, AUDIO-01 fixed. |
| 2026-03-11 | All 9 missing engine/module JS files recovered (speech.js, input.js, adaptive.js, claude.js, numbers.js, shapes.js, colors.js, math.js, engineering.js). Merge conflicts resolved. 7–8 age pill removed. App moving to standalone repo. |
| TBD | v1.0: Child Profiles (Phase 10) |
| TBD | v1.1: MediaPipe Hands — finger counting + gesture control |
| TBD | v1.2: Full offline caching, GitHub Pages |

---

*Last updated: 2026-03-11 | Ops: PLANNING.md | Design ref: LearnWithMe_PDD_v1_8.md*
