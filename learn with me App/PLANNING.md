# PLANNING.md — Learn With Me / למד איתי
> Live ops doc. Maintained by Clodi (planning) + Codi (build progress).
> Full design spec → `PDD.md` | Codi instructions → `CLAUDE.md`
> ⚠️ SPEC_APP.md is retired — superseded by PDD.md + CLAUDE.md

---

## Current Version
**v0.9** — stable, tested
- Phases 1–3 + Bonus (Math, Engineering) complete
- Memory Match + Voice Game modules added
- Home redesign: age pills (3–4 / 5–6 only), stat chips, themed bg, module completion indicators
- Theme engine: per-theme praise. Progress engine: streak/sessions/moduleCompletions
- Tracing: phase pills + nikud toggle + letter chip strip
- **Phase 13 Immersive Worlds complete** — sky gradients, theme mascot animations, particle behaviors, glow/depth
- BUG-01, BUG-02, AUDIO-01 all resolved
- All 9 engine/module JS files recovered and committed (were never in git)
- 7–8 age option removed (Locked Decision #12 enforced)

---

## Active Feature
**Phase 10 — Child Profiles**
**Goal:** Multi-child support via `profiles.json` sidecar file, synced via Google Drive folder
**Branch:** `feature/child-profiles` *(create before starting)*
**Spec:** → PDD.md §11

### Tasks
- [ ] Define `profiles.json` schema (PDD §11 ready)
- [ ] Build Profile Selector screen (avatar circles, last-played label, max 6)
- [ ] Wire File System Access API — read/write `profiles.json`
- [ ] Welcome-back tiers (same day / 1–2d / 3–6d / 7+d)
- [ ] Migrate localStorage progress to per-profile structure
- [ ] Export/import fallback button
- [ ] Test: multi-profile switching, data isolation

### Notes
- `profiles.json` lives in same folder as `index.html` — no server needed
- Last-write-wins conflict resolution (no merge)
- Max 6 profiles

---

## Phase Status

| Phase | Focus | Status |
|-------|-------|--------|
| 1 — Hebrew Core | Letters + Numbers, RTL, TTS, touch | ✅ Done |
| 2 — Fine Motor | Letter tracing — canvas, pixel-mask, 3 modes | ✅ Done |
| 3 — More Modules | Shapes + Colors | ✅ Done |
| BONUS | Math (age-tiered) + Engineering (8 tools) | ✅ Done |
| 4 — Adaptive Engine | localStorage weighting (basic) | ⚠️ Partial |
| 5 — Input Expansion | Gamepad ✅ — MediaPipe Hands/Pose ❌ | 🔨 Partial |
| 6 — AI Layer | Claude API hints — limited modules, no error handling | ⚠️ Partial |
| 7 — English Toggle | Fully wired | ✅ Done |
| 8 — Distribution | PWA shell exists, GitHub Pages not set up | ⚠️ Partial |
| 9 — Memory Match + Voice Game | New modules, home redesign, theme/progress engine | ✅ Done |
| 13 — Immersive Worlds | Sky gradients, mascot/particle animations, glow/depth | ✅ Done (2026-03-10) |
| **10 — Child Profiles** | profiles.json + GDrive sync | 🔲 **Next** |
| 11 — Spaced Repetition | SM2-style scheduling, replaces 2× weighting | 🔲 Backlog |
| 12 — MediaPipe | Finger counting + gesture control | 🔲 Backlog |
| 14 — Full Offline | Service worker caching + GitHub Pages | 🔲 Backlog |

---

## Known Issues / Watch List
- Claude API not wired to Math + Engineering modules
- Claude API has minimal network error handling
- English toggle regression risk — watch on new builds
- Service worker registered but not caching assets
- Gamepad D-pad navigation incomplete
- input.js stuck-draw fix (v0.8.1) — watch for regression
- CONTENT-01 — Voice Game word lists deprecated; need 40+ words per age group
- AUDIO-02 — TTS Hebrew pronunciation quality varies by device/browser

---

## Backlog (Priority Order)
1. Child Profiles (Phase 10) ← **active**
2. CONTENT-01 — Voice Game: 40+ words per age group
3. Claude API — wire Math + Engineering + add error handling
4. Spaced repetition (SM2) — replace basic 2× weighting
5. MediaPipe Hands — finger counting + gesture control
6. GitHub Pages + full offline caching
7. Parent Dashboard — weekly summary, problem letters
8. Pre-recorded audio fallback (22 letters + numbers 1–10) → AUDIO-02
9. Rhyme Match, Number Bonds, Story Sequencing (activity backlog — PDD §10)

---

## Decisions Log
| Date | Decision | Reason |
|------|----------|--------|
| Mar 2026 | Retired SPEC_APP.md | Fully superseded by PDD + CLAUDE.md |
| Mar 2026 | Tracing in `letters.js`, not separate file | Keeps single-file portability |
| Mar 2026 | profiles.json sidecar (no server) | Offline-first, GDrive folder sync |
| Mar 2026 | Last-write-wins for profile sync | Simplest conflict resolution, no server |

---

## Session Log
| Date | Version | Milestone |
|------|---------|-----------|
| Mar 2026 | v0.1 | English prototype — 4 modules |
| Mar 2026 | v0.2 | Full Hebrew rewrite — RTL, he-IL, 22 letters |
| Mar 2026 | v0.3 | Letter tracing — canvas, pixel-mask, 3 modes |
| Mar 2026 | v0.4 | Shapes + Colors |
| Mar 2026 | v0.5 | Adaptive engine (basic) + localStorage |
| Mar 2026 | v0.6 | Gamepad input |
| Mar 2026 | v0.7 | Math + Engineering bonus modules |
| Mar 2026 | v0.8 | Claude API hints, 7 themes, onboarding, PWA, i18n |
| Mar 2026 | v0.8.1 | English toggle wired, i18n gaps fixed, input.js stuck-draw fixed |
| Mar 2026 | v0.9 | Memory Match + Voice Game. Home redesign, theme/progress engine, tracing improvements |
| 2026-03-10 | v0.9+ | Phase 13 Immersive Worlds. BUG-01, BUG-02, AUDIO-01 fixed. |
| 2026-03-11 | v0.9+ | All JS files recovered + in git. 7–8 age pill removed. Docs updated. App to standalone repo. |
| TBD | v1.0 | Child Profiles (Phase 10) |
| TBD | v1.1 | Full offline, GitHub Pages |

---
*Last updated: 2026-03-11*
