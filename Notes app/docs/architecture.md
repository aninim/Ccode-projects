# Architecture — Second Brain Notes App

## Overview
Electron desktop app (Windows) with React+Vite renderer.
Mobile: PWA with MSAL auth (Phase 2).

## Data Flow
```
User input (form / voice / HWR)
  → CaptureForm.jsx
  → noteParser.js (serialize to MD+YAML)
  → ~/SecondBrain/notes/ (local filesystem)
  → OneDrive (automatic OS sync)
  → MS Copilot indexes via OneDrive Graph
```

## Key Decisions
- Storage is local-first. No custom cloud sync code in v1.
- AI processing queued when offline, runs when online.
- ClickUp: one-way push in v1. No two-way sync.
- Voice: Phase 2 priority. App can't replace paper until this works.
- 3 mandatory fields max on capture form. Friction kills adoption.

## Phase Gate: Before Phase 3
Validate Copilot OneDrive indexing in Gentex tenant:
- [ ] Upload sample .md with YAML front-matter to OneDrive
- [ ] Ask Copilot Chat: "What's in my SecondBrain notes about Avner?"
- [ ] If it works → build Phase 3 on it
- [ ] If not → implement Graph API connector instead
