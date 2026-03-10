# CLAUDE.md — Second Brain (Notes App)

> Project-specific instructions for Codi (Claude Code).
> Global rules in `~/.claude/CLAUDE.md` still apply. This file adds project context.

---

## 🧠 Project Summary

**Name:** Second Brain  
**Owner:** Oren Elimelech — DnV Team Leader, Gentex Israel (solo, single persona — v1)  
**Status:** Planning → Phase 1 build  
**Goal:** Replace the paper notebook. Minimum friction capture → maximum intelligence output.

---

## 🤖 AI Roles — Critical Separation

| Role | Who |
|------|-----|
| **Building the app (code)** | Codi (Claude Code) |
| **Intelligence inside the app** | Microsoft Copilot Pro — exclusively |

> ⛔ Codi must **never** wire Claude API, Gemini, or any non-MS AI into the app itself.
> All in-app AI features (summaries, search, reports, suggestions) = Copilot + MS Graph only.
> This is a work tool — must stay within the Microsoft ecosystem.

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js (Electron for desktop shell) |
| **Frontend** | React + Vite (inside Electron renderer) |
| **Styling** | Tailwind CSS |
| **Storage** | Local JSON + Markdown files (OneDrive-synced folder) |
| **AI Engine** | Microsoft Copilot Pro via MS Graph API / Azure OpenAI — no substitutes |
| **Auth (mobile)** | MSAL (Microsoft Authentication Library) |
| **Voice (Phase 2)** | MS Speech SDK (Web Speech API fallback for dev) |
| **Task Integration** | ClickUp REST API (v2) |
| **Calendar** | MS Graph API (read events, write note attachments) |
| **OCR (Phase 5)** | Azure AI Vision or Copilot Vision |

**Target platforms:**
- Phase 1–2: Electron desktop app (Windows primary) + PWA for mobile
- Phase 3+: Native mobile companion (React Native or PWA with MSAL)

---

## 📋 Data Schema

Every note saved as `.md` with YAML front-matter:

```yaml
---
id: uuid-v4
type: doc_note | table_note
created_at: ISO8601
persons: [string]          # team members mentioned
project: string
feature: string
sprint: string
tags: [string]
priority: urgent | followup | fyi | none
language: en | he | auto
location: string | url
weather: string            # auto-fetched on save
actions:
  - text: string
    assignee: string
    due: YYYY-MM-DD
    clickup_id: string     # filled after push
growth_note:
  person: string
  type: string             # strength | improvement | observation
  observation: string
---

# Note body in Markdown
```

Storage root: `~/SecondBrain/notes/` (mapped to OneDrive)  
Index files: `~/SecondBrain/index/persons.json`, `projects.json`, `tags.json`

---

## 📝 Two Note Types

### Doc Notes (`doc_note`)
Long-form: employee notes, meeting minutes, 1:1s, growth observations.

### Table Notes (`table_note`)
Task/sprint-oriented: short items with due dates, sprint tags, assignees. Companion to ClickUp.

---

## 🖊️ Input Form — Mandatory vs Optional

**Mandatory (3 fields only — never add more):**
1. Person(s)
2. Project / Context
3. Free text notes

**Optional / auto-suggested after saving:**
- Tags, priority, location, actions, growth note

---

## 🏗️ Build Phases

| Phase | Focus | Status |
|-------|-------|--------|
| **1 — MVP** | Capture form + local MD storage + OneDrive sync + feed view + EOD prompt | 🔨 Build now |
| **2 — Mobile + Voice** | PWA + MSAL + voice dictation (EN/HE) + quick capture widget | ⏳ Later |
| **3 — Intelligence Views** | Team member cards + project map + meeting prep (Copilot) | ⏳ Later |
| **4 — Automation** | ClickUp push + digests + triage view + reminders | ⏳ Later |
| **5 — Full Integration** | Handwriting OCR + two-way ClickUp + MS Graph connector | ⏳ Later |

> ⚠️ **Always build Phase 1 only unless Oren explicitly says otherwise.**

---

## ✅ Phase 1 Definition of Done

- [x] Capture form: 3 mandatory fields + optional fields
- [x] Saves as `.md` + YAML front-matter to `~/SecondBrain/notes/`
- [x] Chronological feed with filters (person, project, tag, keyword)
- [ ] OneDrive folder sync confirmed working (OS-level, no custom code) ← verify manually
- [ ] End-of-day prompt: 3 questions → structured note + ClickUp task list ← Phase 1 remainder
- [ ] All above tested before handoff ← Oren testing in progress (March 2026)

> **Last built:** March 2026 — CaptureForm wired, FeedView built. App launches via `npm run electron`.

---

## 🔗 Integrations — v1 Scope Only

- **ClickUp:** One-way push only. Note action → ClickUp task. No pull in v1.
- **OneDrive:** Folder sync only. No Graph API calls in v1.
- **MS Copilot:** Passive — reads Markdown via OneDrive. No active API calls in v1.
- **MS Calendar:** Read-only via Graph API for meeting prep trigger.

> Everything else (Teams, Outlook, GitHub, Notion) = Phase 5. Don't build early.

---

## 🌐 Language Support

- English & Hebrew — auto-detect on input
- Tags and metadata always stored in English (Copilot compatibility)
- All UI strings via `i18n.js` — no hardcoded EN strings in components
- In-note toggle: Translate → EN / Translate → HE

---

## 🤖 Operating Model (AI vs Oren)

**Copilot/AI owns:**
- End-of-day 3-question debrief → structured note
- Meeting prep briefing (auto, 30 min before)
- Post-meeting note structuring from raw dump/voice
- Team intelligence compilation
- Task triage (🔴/🟡/⬜/📅)
- Reminders and "next step" suggestions
- 1:1 prep from growth notes

**Oren owns:**
- Decisions only
- Final approval before ClickUp push
- Exception handling

---

## 📁 Folder Structure

```
NotesApp/
├── CLAUDE.md
├── project.json
├── package.json
├── vite.config.js
├── electron.main.js           # Electron main process
├── src/
│   ├── App.jsx                # Root React component
│   ├── capture/               # Input form + voice + OCR
│   │   ├── CaptureForm.jsx
│   │   ├── VoiceInput.jsx
│   │   └── HWRInput.jsx
│   ├── views/
│   │   ├── FeedView.jsx
│   │   ├── TeamView.jsx
│   │   ├── ProjectView.jsx
│   │   └── TriageView.jsx
│   ├── automation/
│   │   ├── eodPrompt.js
│   │   ├── meetingPrep.js
│   │   └── scheduler.js
│   ├── integrations/
│   │   ├── clickup.js
│   │   ├── msGraph.js
│   │   ├── copilot.js
│   │   └── speechSDK.js
│   └── utils/
│       ├── noteParser.js      # MD + YAML front-matter read/write
│       ├── indexManager.js    # persons/projects/tags index
│       └── i18n.js            # EN/HE translations
├── tests/
│   ├── noteParser.test.js
│   ├── clickup.test.js
│   └── capture.test.jsx
├── docs/
│   ├── architecture.md
│   ├── api-keys.md            # How to configure secrets (no secrets committed)
│   └── copilot-integration.md
├── assets/
│   ├── icons/
│   └── fonts/
├── data/                      # Local dev sample notes (gitignored in prod)
└── .vscode/
    ├── settings.json
    ├── extensions.json
    └── launch.json
```

---

## 📐 Conventions

- **File naming:** `kebab-case` for files, `PascalCase` for React components
- **Note IDs:** UUID v4 — never sequential
- **Dates:** ISO 8601 everywhere (`YYYY-MM-DD`, `YYYY-MM-DDTHH:mm:ssZ`)
- **Secrets:** Never committed. Use `.env` (gitignored). Document keys in `docs/api-keys.md`
- **No `console.log` in production** — use a logger utility
- **Every action item** must have: `text`, `assignee`, `due`. `clickup_id` added after push.
- **Copilot calls:** Always include note body + YAML metadata as context. Never send raw personal data without user confirmation.

---

## 👥 Team Members Seed Data

```json
["Oren", "Tom", "Avner", "Eliyahu", "Corinne", "Aviram", "Ayman"]
```
Domains: RDS, ETL, FDM, OMPS, SimRig, Synthetic Data

---

## 🔒 Critical Decisions (Locked — Don't Revisit)

1. **3 mandatory fields max** at capture time. Don't add more.
2. **Voice is Phase 2 priority** — app can't replace paper until voice works on mobile.
3. **ClickUp is one-way push only in v1.** Two-way = conflict hell. Defer.
4. **Copilot OneDrive indexing must be validated in Gentex tenant** before Phase 3 builds on it.
5. **Single user persona: Oren.** Don't generalize for other TLs in v1.

---

## 🚫 Out of Scope (v1)

- Cloud database (no Firebase, Supabase, etc.)
- Multi-user / team sharing
- Two-way ClickUp sync (deferred to v2)
- Offline AI processing (save locally, queue for when online)
- Handwriting OCR (Phase 5)
- Any third-party cloud outside Microsoft ecosystem

---

*Last updated: March 2026 | Plan ref: SecondBrain_Plan_v3*