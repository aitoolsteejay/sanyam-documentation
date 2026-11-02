# 🚀 Myntmore Technical Operations & Handover Portal

> Complete technical ownership transfer, system architecture, operating runbooks, and video walkthrough library for Myntmore's growth marketing systems, Command Center dashboard, website, automated outbound pipelines, and client deliverables.

Outgoing Lead: **Sanyam**  
Management: **Tejas Jhaveri**  
Repository: `aitoolsteejay/sanyam-documentation`  
Live Portal Target: Vercel

---

## ⚡ Quick Start & Deployment

### 1. Deploying to Vercel (One-Click)
This repository is pre-configured for instant zero-configuration deployment on **Vercel**:
1. Connect this GitHub repository (`aitoolsteejay/sanyam-documentation`) in your Vercel Dashboard.
2. Vercel automatically detects [`vercel.json`](./vercel.json) with `outputDirectory: "portal"`.
3. Click **Deploy**. Your documentation portal will be live in ~5 seconds!

### 2. Running Locally (Two Ways)
- **Direct in Browser (No Server Required)**:  
  Double-click or open [`portal/index.html`](./portal/index.html) in your browser. All scripts and data are offline-first.
- **Local HTTP Server**:
  ```bash
  python3 portal/serve.py
  # Serves http://localhost:8080/index.html with automatic port failover
  ```

---

## 🎬 Official Zoho WorkDrive Video Library (12 Recordings)

Every production walkthrough recorded by Sanyam is hosted on **Zoho WorkDrive** with full step-by-step demonstrations:

| Video # | Title | System / Focus | Direct Zoho WorkDrive URL |
| :---: | :--- | :--- | :--- |
| **01** | **Tour of the stack: GitHub & Vercel** | Stack & Cloud | [Part 1: GitHub Repos](https://workdrive.zohoexternal.com/external/1dce32f093a24f26bce2b959cfae5d7ed2d51396c442d83e463a30731e6ad5f3) <br> [Part 2: Vercel Deployments](https://workdrive.zohoexternal.com/external/7c7ca0a74e9178ab4a0048e227e212c4b0a1df292eb33a643486bf2179a6aa29) |
| **02** | **Gemini API key & Supabase projects: where they live** | Stack & Cloud | [Watch Video 02 ↗](https://workdrive.zohoexternal.com/external/7c7ca0a74e9178ab4a0048e227e212c4b0a1df292eb33a643486bf2179a6aa29) |
| **04** | **Deploying a new resource on the website** | Website & SEO | [Watch Video 04 ↗](https://workdrive.zohoexternal.com/external/346257aa736fe8dfcaabccb5c8c0592e1b9a49a82d9b19901bfd6758e1b53988) |
| **06** | **Website sitemap walkthrough** | Website & SEO | [Watch Video 06 ↗](https://workdrive.zohoexternal.com/external/83a179ad694040e29d529b0fbd714d75bebab601118d066cef407402b7b574a4) |
| **07** | **Writing and posting the weekly blogs** | Website & SEO | [Watch Video 07 ↗](https://workdrive.zohoexternal.com/external/a1da62e70e031917003e129900f09c7602c39bb53ff27c89e922c6a4a745be89) |
| **08** | **Weekly dashboard data entry** | Command Center | [Watch Video 08 ↗](https://workdrive.zohoexternal.com/external/97a3dba038ce3e6432815a0c5429dea750dac8be9123bbc9ad95e2676c89ba8d) |
| **09** | **Dashboard admin: clients, portal users, targets** | Command Center | [Part 1: Admin & Clients](https://workdrive.zohoexternal.com/external/60ea91024f866035e19003fb2dd201e0a72a282e3269f102e4518646798da518) <br> [Part 2: Weekly Targets](https://workdrive.zohoexternal.com/external/d69cdcd8cb24f768027119936e0dfc194bd6cff6a56ec0f884c5fdf8922835ca) |
| **14** | **Cold email: buying a domain through GoDaddy** | Cold Email & Domains | [Watch Video 14 ↗](https://workdrive.zohoexternal.com/external/8f93dbe5f13c81d1eef662edda4510619731ce0fb5265f949aa70b9a41fac237) |
| **15** | **Cold email: setting up domains & users** | Cold Email & Domains | [Watch Video 15 ↗](https://workdrive.zohoexternal.com/external/7e3b3bdd2660c5f9d956be9bf91b7a82854f29ba8b8a5bacf860538ca8282729) |
| **16** | **Cold email: creating an app password** | Cold Email & Domains | [Watch Video 16 ↗](https://workdrive.zohoexternal.com/external/7015160aa74787359131bed6acc6f7ee9e6ef1bce9842427f84819eab1e107f8) |
| **17** | **Scheduling YouTube Shorts** | Content & Media | [Watch Video 17 ↗](https://workdrive.zohoexternal.com/external/32c14810c66dd6c8647e909218f844307322a16725cdc45c089d958828effeca) |
| **20** | **Git cloning a repo & using it in Claude Code** | Stack & Dev | [Watch Video 20 ↗](https://workdrive.zohoexternal.com/external/f8ac0a51c76a8d3ef8da440610e481a6b318196dcbe334dd4a3d4fe999a7bbe8) |

*Plus 5 Strategic Architecture & Product Review Recordings on Fathom with Tejas Jhaveri accessible inside the portal.*

---

## 🔑 Private Credentials & API Keys Vault

- **Zero-Leak Guarantee**: All passwords, tokens, and API keys are stored strictly in browser `localStorage`. Nothing is ever sent to any remote server or written to disk.
- **Bulk `.env` Paste**: Paste standard `.env` blocks (`GEMINI_API_KEY=...`, `NEXT_PUBLIC_SUPABASE_URL=...`) for instant multi-key assignment.
- **Custom Secrets**: Add arbitrary credentials and tokens.
- **JSON Backup**: Export and re-import encrypted/sanitized configuration backups.

---

## 🗂️ What's Inside This Repository

```
├── portal/                     # Interactive Web Documentation Application
│   ├── index.html              # Main single-page application structure
│   ├── app.js                  # Client logic, URL hash routing, search, vault
│   ├── data.js                 # Pre-bundled database (window.PORTAL_DATA)
│   ├── data.json               # Standalone JSON database
│   ├── style.css               # Dark theme, typography & responsive styles
│   ├── build_data.py           # Data compiler parsing Notion markdown & CSVs
│   └── serve.py                # Local HTTP test runner
├── vercel.json                 # Vercel deployment configuration
├── .vercelignore               # Optimization rules for sub-5s deployments
├── .gitignore                  # Git ignore rules
├── index.html                  # Root fallback redirect
├── package.json                # Project scripts
├── 1 - Handover Hub/           # Raw Notion Handover Hub markdown documents
├── 2 - AI Agents Workspace/    # 9 core operational sections (275 markdown files)
├── 3 - Trashed Pages/          # Production trackers & databases (460 files)
└── FILE_INDEX.txt              # Complete index of all 879 Notion files
```

---

## 🛠️ Rebuilding Portal Data
If you modify any of the raw Notion Markdown or CSV trackers, run:
```bash
python3 portal/build_data.py
```
This re-compiles `portal/data.json` and `portal/data.js` and updates all cross-references across videos, apps, domains, and SOPs.
