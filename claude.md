# CLAUDE.md — ai-digest
> Context file for Codi (Claude Code). Read this at the start of every session.

---

## What This Project Does

Daily AI news research agent + personal dashboard.

- **Daily:** GitHub Actions runs `agent.py` → calls Gemini API → writes `docs/digest/data.json`
- **Dashboard:** `docs/digest/index.html` hosted at `digest.dads42.com` (GitHub Pages) — reads `data.json`, shows live ticker at bottom
- **Weekly:** Cowork runs `weekly_generator.py` every Monday → commits `docs/digest/weekly.md` → Oren pastes it to Clodi/Codi as context injection

---

## Repo Structure

```
ai-digest/
├── digest/
│   ├── agent.py                # Daily Gemini research agent
│   ├── weekly_generator.py     # Monday weekly MD generator
│   ├── sources.json            # Curated AI sources + influencers
│   ├── requirements.txt        # google-genai
│   └── .env                    # GEMINI_API_KEY (never commit this)
├── docs/digest/
│   ├── index.html              # Dashboard UI
│   ├── data.json               # Daily output (agent writes here)
│   ├── weekly.md               # Weekly injection (Cowork writes here)
│   └── history/                # Daily snapshots: YYYY-MM-DD.json
└── .github/workflows/
    └── digest.yml              # Cron: daily 6am UTC
```

---

## Owner Context

- **Oren** — Data & Validation Team Leader, computer vision. Not a developer. Smart, fast learner.
- **Stack:** VS Code, GitHub, Google Drive, Gemini API
- **Planning:** Done with Clodi (Claude Web). Codi only builds.
- **Style:** Keep it simple. No over-engineering. Explain what you did briefly after each task.

---

## Key Conventions

- **Python package:** `google-genai` (NOT the deprecated `google-generativeai`)
- **Gemini model:** `gemini-2.5-flash`
- **API key:** Read from `.env` via `python-dotenv` or environment variable `GEMINI_API_KEY`
- **Never hardcode API keys** — check `.gitignore` includes `.env`
- **Output paths** are always relative to repo root, not `digest/` subfolder
- **data.json** is overwritten daily + copied to `history/YYYY-MM-DD.json`
- **Dashboard** is pure HTML/CSS/JS — no frameworks, no build step
- **Windows dev environment** — use `set GEMINI_API_KEY=...` or `.env` file, not bash export

---

## Current Status

| Component | Status |
|---|---|
| `sources.json` | ✅ Done |
| `requirements.txt` | ✅ Done — `google-genai>=0.8.0` + `python-dotenv` |
| `agent.py` | ✅ Done — `google-genai` client + `python-dotenv` |
| `weekly_generator.py` | ✅ Done |
| `index.html` | ✅ Done — includes live ticker |
| `digest.yml` | ✅ Done |
| `.env` | ✅ Created — add real key, never commit |
| `.gitignore` | ✅ Done — `.env`, `venv/`, `__pycache__/` |
| GitHub secret | ⏳ Pending |
| Local test | ✅ Done — first run 2026-03-24, data.json + history snapshot confirmed |
| DNS / GitHub Pages | ⏳ Later |

---

## Known Issues / Open Fixes

_None — all resolved._

---

## Data Schema — `data.json`

```json
{
  "date": "YYYY-MM-DD",
  "top_story": "string",
  "tools": [{"name":"","summary":"","url":"","relevance":""}],
  "hacks": [{"title":"","description":"","source":""}],
  "use_cases": [{"title":"","description":"","applicable_to":""}],
  "big_moves": [{"who":"","what":"","why_it_matters":""}],
  "deprecated": [{"what":"","note":""}]
}
```
Relevance tags: `coding` `CV` `education` `prompting` `agents` `general`
Applicable_to tags: `Clodi` `Codi` `dads42` `kids-apps` `general`

---

## Sources Monitored

Orgs: Anthropic, OpenAI, Google DeepMind, NVIDIA, Meta AI, Mistral, HuggingFace, xAI
Newsletters: TLDR AI, Ben's Bites, The Rundown AI
Influencers: Simon Willison, Andrej Karpathy, Yann LeCun, Sam Altman, Jensen Huang, Demis Hassabis, **Yuval (Logan) Avidani / YUV.AI**

---

## Future Vision

This project will become one feed/widget inside a larger **personal + professional dashboard** for Oren at `dads42.com`. Build with that in mind — keep data modular, dashboard component self-contained.
