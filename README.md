# ⚡ MYNTMORE AI Prompt Library

> Production-ready AI prompt engineering library organized specifically for Myntmore's core systems: **Website**, **Dashboard**, and **Outreach Tool**.

Built for instant filtering, real-time search, automated variable parameter filling, and single-click copying into **Claude Code**, **ChatGPT**, and **Cursor**.

---

## 🚀 Quick Start

### 1. Run Locally
```bash
# Option A: Start with npm
npm start

# Option B: Run via Python server
python3 portal/serve.py
# Opens http://localhost:8080/index.html with automatic port failover

# Option C: Direct in Browser (Offline-First, Zero Server Required)
# Simply double-click or open portal/index.html in any browser.
```

### 2. Deploy on Vercel
Pre-configured for instant zero-configuration deployment via [`vercel.json`](./vercel.json).
Connect the repository to Vercel and it deploys automatically.

---

## 🗂️ Core Prompt Categories

| Category | Prompts | Primary Focus Areas | Target Models / Tools |
| :--- | :---: | :--- | :--- |
| **🌐 Website** | **56** | Next.js architecture, Core Web Vitals, SEO audits, schema markup, blog generation, lead magnets, conversion copy, releases. | Codex / Claude Code, ChatGPT, Cursor |
| **📊 Dashboard** | **40** | Supabase database migrations, Row-Level Security (RLS) policies, client analytics, KPI cards, weekly data entry, targets, high scores. | Codex / Claude Code |
| **🚀 Outreach Tool** | **157** | Guardrails, wizard flow, campaign lists, lead labels, CSV handling, API routes, security hardening, migrations, testing, and troubleshooting. | Claude Code |
| **Total** | **253** | Complete production prompt library for technical growth operations. | All AI Coding Assistants |

---

## 🔍 Features & Architecture

- **Instant Full-Text Search**: Live substring search across titles, descriptions, categories, tags, target tools, and prompt content. Press `⌘K`, `Ctrl+K`, or `/` anywhere to focus search.
- **Categorization & Filtering**:
  - Main category selector tabs (All, Website, Dashboard, Outreach Tool) with live count badges.
  - Interactive tag chips (`#SEO`, `#Next.js`, `#Supabase`, `#ColdEmail`, `#Smartlead`, etc.).
  - Target tool dropdown (Claude Code, ChatGPT, Cursor, General).
- **Interactive Parameter Auto-Filler**:
  - Automatically extracts bracketed parameters like `[WEBSITE_URL]` or `{{CLIENT_NAME}}`.
  - Clicking **Fill & Test** opens an interactive modal with dynamically generated form fields.
  - As you type parameter values, the prompt preview updates live so you can copy the customized prompt in one click.
- **One-Click Clipboard Copying**: Instant visual checkmark feedback and toast notifications.
- **Add & Export Prompts**:
  - **In-App Add Prompt Modal**: Add prompts directly through the UI.
  - **JSON Export / Backup**: Download or copy `prompts.json` to keep prompts in git version control.
  - **Offline First**: All seed data is stored in [`portal/prompts.js`](./portal/prompts.js) and [`portal/prompts.json`](./portal/prompts.json).

---

## 📁 Repository Structure

```
├── portal/
│   ├── index.html       # Clean, modern single-page prompt library application
│   ├── app.js           # Client search, filtering, variable parsing, and modal state
│   ├── prompts.json     # Structured JSON prompt database
│   ├── prompts.js       # Offline-first JavaScript seed data
│   ├── style.css        # Custom design, category badges, code styling
│   └── serve.py         # Local lightweight HTTP development server
├── index.html           # Root redirect to portal
├── vercel.json          # Vercel deployment configuration
├── package.json         # Project metadata and run scripts
└── README.md            # Documentation
```

---

## ✍️ Adding Prompts via Code

To add prompts permanently into the repository database, simply append them to [`portal/prompts.json`](./portal/prompts.json) and [`portal/prompts.js`](./portal/prompts.js):

```json
{
  "id": "web-004",
  "title": "Your Prompt Title",
  "category": "Website",
  "subcategory": "SEO & Performance",
  "tags": ["SEO", "Next.js"],
  "targetTool": "Claude Code",
  "description": "Short explanation of use case and output.",
  "prompt": "Your full prompt here with [PARAMETERS] in brackets...",
  "variables": ["PARAMETERS"],
  "author": "Myntmore Team",
  "updatedAt": "2026-11-16"
}
```
