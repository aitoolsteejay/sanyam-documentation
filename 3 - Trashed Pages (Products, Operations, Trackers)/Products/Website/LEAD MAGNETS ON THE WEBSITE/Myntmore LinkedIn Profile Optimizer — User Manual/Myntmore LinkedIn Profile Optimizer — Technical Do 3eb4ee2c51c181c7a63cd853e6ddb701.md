# Myntmore LinkedIn Profile Optimizer — Technical Documentation

**Repo:** [https://github.com/aitoolsteejay/profile-optimizer](https://github.com/aitoolsteejay/profile-optimizer)
**Live stack:** Vite + React + TypeScript frontend, Supabase (Postgres + Edge Functions) backend, deployed on Vercel.

> 📌 **How to get this into Notion:** Notion doesn't have an API connection set up in this session, so this was written as a Markdown file instead of pushed directly. In Notion: **New Page → "…" menu (top right) → Import → Markdown & CSV**, and select this file (`docs/USER_MANUAL.md`). Headings, tables, code blocks, and checklists will carry over as native Notion blocks. If you want it pushed automatically next time, connect the Notion MCP connector and ask again.
> 

---

## 1. What this product is

A free "LinkedIn profile clarity audit" lead-magnet tool. A visitor lands on the page, fills in a contact form (captured to Zoho CRM), types in their current LinkedIn headline + About section, and an AI (Google Gemini) rewrites both plus gives a "Profile Clarity Score" and keyword/ICP relevance analysis. Built to generate inbound leads for Myntmore's founder.

---

## 2. Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Vite + React 18 + TypeScript |
| UI Kit | shadcn/ui (Radix primitives) + Tailwind CSS |
| Routing | react-router-dom (single real route, `/`) |
| Forms/validation | react-hook-form + zod |
| Backend | Supabase (Postgres, Row-Level Security, Edge Functions on Deno) |
| AI | Google Gemini 2.5 Flash (`generativelanguage.googleapis.com`) |
| Scraping (built, currently unused by the live flow) | Firecrawl API |
| CRM / lead capture | Zoho Forms (hidden iframe POST) |
| Analytics | Vercel Analytics (`@vercel/analytics/react`) |
| Hosting | Vercel (frontend) + Supabase (DB + functions) |
| PDF export | jsPDF (client-side) |

---

## 3. Folder structure (what lives where)

```
profile-optimizer/
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx                # Router + providers + Vercel <Analytics />
│   ├── pages/
│   │   ├── Index.tsx          # THE page — orchestrates the whole flow (see §4)
│   │   └── NotFound.tsx       # catch-all 404
│   ├── components/
│   │   ├── LandingPage.tsx    # Marketing sections shown before the lead form
│   │   ├── LeadGate.tsx       # Contact form → submits to Zoho CRM
│   │   ├── LoadingState.tsx   # Animated "analyzing…" screen
│   │   ├── ResultsSection.tsx # Renders AI output + "Download as PDF"
│   │   ├── CTASection.tsx     # Bottom "Book a Strategy Call" CTA
│   │   ├── NavLink.tsx        # react-router NavLink wrapper (shadcn sidebar dep)
│   │   ├── HeroSection.tsx    # ⚠️ UNUSED — not imported anywhere
│   │   ├── InputSection.tsx   # ⚠️ UNUSED — an older, more advanced version of the form (has LinkedIn URL scraping + fallback UI). Not wired up.
│   │   ├── wizard/
│   │   │   ├── ProfileWizard.tsx   # Wraps StepOne, hands data up to Index.tsx
│   │   │   ├── StepOne.tsx         # THE actual input form (headline, about, role, ICP, tone)
│   │   │   ├── StepTwo.tsx         # ⚠️ UNUSED — old "unlock results" contact-capture step, superseded by LeadGate
│   │   │   └── WizardProgress.tsx  # ⚠️ UNUSED — step-progress dots, no longer rendered
│   │   └── ui/                # shadcn/ui primitives (button, input, card, dialog, etc.) — generated, rarely hand-edited
│   ├── integrations/supabase/
│   │   ├── client.ts           # Supabase client init (reads VITE_ env vars)
│   │   └── types.ts            # Auto-generated DB types (regenerate via Supabase CLI after schema changes)
│   ├── hooks/                  # use-toast, use-mobile (shadcn helpers)
│   ├── lib/utils.ts             # `cn()` classnames helper
│   └── assets/                  # myntmore-logo.png (no longer rendered in the header, see §9)
├── supabase/
│   ├── config.toml              # Supabase project id + which functions skip JWT verification
│   ├── functions/
│   │   ├── optimize-profile/    # Edge function — calls Gemini, returns optimized copy (ACTIVE)
│   │   └── scrape-linkedin/     # Edge function — calls Firecrawl to scrape a profile (BUILT, not called by current UI)
│   └── migrations/              # Chronological SQL schema history (see §7)
├── public/                      # favicon, robots.txt, placeholder.svg
├── .env                         # VITE_SUPABASE_* vars (safe/public anon key — see §8)
├── vercel.json                  # SPA rewrite rule for Vercel
├── tailwind.config.ts            # Design tokens (colors, radius, animations)
└── components.json               # shadcn/ui config (used by `npx shadcn add …`)
```

---

## 4. The end-to-end user flow (as actually wired in `src/pages/Index.tsx`)

1. **Landing page** (`LandingPage.tsx`) — hero, problem/solution copy, testimonial, two CTA buttons that scroll down to the form.
2. **Lead capture** (`LeadGate.tsx`) — visitor enters first/last name, designation, company, phone, LinkedIn URL, email. On submit:
    - Validated with `zod`.
    - The real HTML `<form>` silently POSTs to a **Zoho Forms** endpoint via a hidden `<iframe>` target (so the page never navigates away). This is how leads land in Zoho CRM.
    - After ~600ms (fake delay for UX), `onComplete()` fires and the app moves to the wizard.
3. **Profile input** (`ProfileWizard.tsx` → `StepOne.tsx`) — visitor pastes their current Headline + About section, optionally Role + Target ICP (audience) + tone tags (bold, professional, casual, etc.).
4. **Submit → `handleWizardComplete()` in `Index.tsx`**:
    - Runs two **local, client-side heuristic scorers** (no AI call): `calculateClarityScore()` and `calculateKeywordScore()` — regex/keyword-based scoring of the *original* text (this produces the "Profile Clarity Score" and "ICP Relevance Score").
    - Calls the Supabase Edge Function `optimize-profile` (via `supabase.functions.invoke`) which calls **Gemini 2.5 Flash** to actually rewrite the headline/about/positioning.
5. **Loading state** (`LoadingState.tsx`) — cosmetic progress animation while the request is in flight.
6. **Results** (`ResultsSection.tsx`) — shows the clarity score, "what's holding you back", 3 rewritten headline angles, rewritten About section, 3 positioning angles, keyword/ICP analysis, and a **Download as PDF** button (client-side `jsPDF` generation, no server round-trip).
7. **CTA** (`CTASection.tsx`) — "Book a Strategy Call" → now points to `https://www.myntmore.com/founder-meeting` (migrated off Calendly, see §9).

**Important:** none of this flow writes to the Supabase `leads` or `profile_optimizations` tables — see §7 for why those tables still exist in the schema.

---

## 5. The AI prompt / scoring logic (where to edit copy quality)

- **Local heuristic scoring** — `src/pages/Index.tsx`, functions `calculateClarityScore()`, `extractKeywords()`, `calculateKeywordScore()`. Pure string/regex heuristics — edit the word lists here (e.g. `problemIndicators`, `vagueWords`, `credibilityIndicators`, the `icpKeywords` map) to change how the *score* (not the AI copy) is calculated.
- **AI rewriting** — `supabase/functions/optimize-profile/index.ts`. The `systemPrompt` string is the entire instruction set given to Gemini (rules, word count, tone blending, JSON output shape). **This is the single most important file to edit if the AI output quality/tone/length needs to change.**
- Tone options are defined in **three places** that must stay in sync if you add/remove a tone: `StepOne.tsx` (`toneOptions`), `InputSection.tsx` (unused, but same list), and `optimize-profile/index.ts` (`VALID_TONES` + `toneGuidance`).
- ICP (target audience) options are defined in **two places**: `StepOne.tsx` (`icpOptions`) and `Index.tsx` (`icpKeywords` map used for keyword scoring). Adding a new ICP option to the dropdown without adding it to `icpKeywords` just falls back to generic keywords.

---

## 6. Supabase Edge Functions

| Function | Status | Purpose | External dependency |
| --- | --- | --- | --- |
| `optimize-profile` | **Active**, called from `Index.tsx` | Validates input, rate-limits by IP (10 req/hr via Deno KV), builds the prompt, calls Gemini, parses/returns JSON | `GEMINI_API_KEY` secret (Supabase → Settings → Edge Functions → Secrets) |
| `scrape-linkedin` | **Built but not called** by any current frontend code | Given a LinkedIn URL, calls Firecrawl to scrape it and heuristically parse headline/about out of the markdown | `FIRECRAWL_API_KEY` secret — was intended to power the (unused) `InputSection.tsx` flow |

Both are configured with `verify_jwt = false` in `supabase/config.toml`, meaning they're publicly callable without a Supabase auth token (rate limiting on `optimize-profile` is the only abuse guard).

Deploy changes to a function with the Supabase CLI:

```bash
supabase functions deploy optimize-profile
supabase functions deploy scrape-linkedin
```

---

## 7. Database schema (Supabase Postgres)

Two tables exist, defined across `supabase/migrations/*.sql` (chronological, read top-to-bottom to see the full history of policy changes):

### `profile_optimizations`

Originally meant to log every audit run (headline, about, scores, AI output) for analytics. RLS policy history shows churn — it was public-readable → then locked down → currently **insert-only for anon/authenticated, no public reads**. **Nothing in the current frontend actually inserts into this table** — it's dead/unused by the live app, likely a leftover from an earlier version that did log results server-side.

### `leads`

Meant to store captured contact form submissions server-side (name, email, company, role, ICP, tones, `company_website`, `linkedin_url`). RLS: anonymous insert allowed, no public read. **Also not currently written to** — the live `LeadGate.tsx` sends leads straight to **Zoho Forms** instead, bypassing Supabase entirely.

> If you want a source-of-truth database of leads/results (instead of relying on Zoho), the schema is already there — you'd just need to add a `supabase.from('leads').insert(...)` call in `LeadGate.tsx` and/or `Index.tsx`.
> 

To change the schema going forward: add a new timestamped file to `supabase/migrations/`, then `supabase db push` (or apply via the Supabase dashboard SQL editor), then regenerate `src/integrations/supabase/types.ts` via the Supabase CLI (`supabase gen types typescript`).

---

## 8. Environment variables & secrets

**Frontend (`.env`, committed to the repo — these are Supabase's public "anon" key, safe to expose in a browser bundle by design):**

```
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY   # public anon key
VITE_SUPABASE_URL
```

**Backend secrets (set in Supabase dashboard → Settings → Edge Functions → Secrets, NOT in this repo):**

- `GEMINI_API_KEY` — required for `optimize-profile` to work at all.
- `FIRECRAWL_API_KEY` — required for `scrape-linkedin` (currently unused feature).

> ⚠️ Note: `.env` being committed to git is unusual practice — normally `.env` holds secrets and is gitignored. In this case the values are Supabase's *publishable* anon key (meant to be public), so it's not a live security issue, but if you ever add a private key to `.env`, gitignore it first.
> 

---

## 9. Third-party integrations & where they're wired up

| Service | Purpose | File(s) |
| --- | --- | --- |
| **Zoho Forms** | Lead capture / CRM | `src/components/LeadGate.tsx` — `ZOHO_FORM_ACTION` constant has the endpoint URL and field name mapping (`SingleLine`, `SingleLine1`, etc. are Zoho's internal field IDs, not descriptive names — don't rename form field `name=` attributes without checking Zoho's form config) |
| **Google Gemini** | AI copy rewriting | `supabase/functions/optimize-profile/index.ts` |
| **Firecrawl** | LinkedIn scraping (unused currently) | `supabase/functions/scrape-linkedin/index.ts` |
| **Myntmore founder-meeting page** (migrated off Calendly, Aug 2026) | "Book a Strategy Call" CTA destination | `src/pages/Index.tsx` (header button), `src/components/CTASection.tsx` (2 buttons) — all point to `https://www.myntmore.com/founder-meeting` |
| **Vercel Analytics** | Page-view/traffic analytics | `src/App.tsx` — `<Analytics />` from `@vercel/analytics/react` |
| **Vercel** | Hosting | `vercel.json` — just an SPA fallback rewrite; build command is the default `npm run build` → `dist/` |

**Header logo:** removed intentionally (Aug 2026) — the site is meant to be embedded via `<iframe>` inside [myntmore.com](http://myntmore.com)'s own page chrome (which already has a header/footer/logo), so a second logo inside the iframe would be redundant.

---

## 10. Known dead code (safe to ignore or delete)

These exist in the repo but are not reachable from the live app (`Index.tsx` never imports them):

- `src/components/HeroSection.tsx`
- `src/components/InputSection.tsx` (a more feature-complete version of the form with LinkedIn URL scraping + manual-fallback UI — looks like an abandoned iteration; could be revived to wire up `scrape-linkedin` if "paste your LinkedIn URL and auto-fill" is wanted later)
- `src/components/wizard/StepTwo.tsx` (old "enter your details to unlock results" step — superseded by `LeadGate.tsx` capturing the lead earlier in the funnel)
- `src/components/wizard/WizardProgress.tsx` (step-progress dots, no longer rendered since the wizard is a single step)

None of these are imported by any other file — confirmed via repo-wide grep before writing this doc.

---

## 11. Local development

```bash
git clone https://github.com/aitoolsteejay/profile-optimizer.git
cd profile-optimizer
npm i
npm run dev        # starts Vite dev server, default http://localhost:5173
```

Other scripts (`package.json`):

- `npm run build` — production build to `dist/`
- `npm run build:dev` — build in development mode (unminified, useful for debugging a prod-like build)
- `npm run lint` — ESLint
- `npm run preview` — serve the built `dist/` locally

Since Supabase Edge Functions run on Deno (not Node), testing them locally requires the Supabase CLI (`supabase start` / `supabase functions serve`) — not part of the standard `npm run dev` loop.

---

## 12. Deployment

- **Frontend:** Vercel, connected to the GitHub repo (`aitoolsteejay/profile-optimizer`, branch `main`). Every push to `main` auto-deploys. Build command `npm run build`, output `dist/`.
- **Backend:** Supabase project `dbaxhgedupktogldzzpk`. Edge functions are **not** auto-deployed by Vercel — deploy manually via Supabase CLI (see §6) whenever you change a function.
- **DB migrations** are also not auto-applied — run them via `supabase db push` or paste the SQL into the Supabase dashboard SQL editor.

---

## 13. Common "how do I…" tasks

**Change the AI's writing style / rules** → edit `systemPrompt` in `supabase/functions/optimize-profile/index.ts`, then `supabase functions deploy optimize-profile`.

**Add a new tone option** → add it to `toneOptions` in `StepOne.tsx`, `VALID_TONES` + `toneGuidance` in `optimize-profile/index.ts`, redeploy the function.

**Add a new ICP/target-audience option** → add it to `icpOptions` in `StepOne.tsx` AND to the `icpKeywords` map in `Index.tsx` (otherwise keyword scoring falls back to generic terms for that ICP).

**Change where "Book a Call" goes** → 3 spots: `Index.tsx` line ~216, `CTASection.tsx` lines ~24 and ~34 (all currently `https://www.myntmore.com/founder-meeting`).

**Change the Zoho lead form destination or fields** → `LeadGate.tsx`, `ZOHO_FORM_ACTION` constant and the `name=` attributes on each `<Input>` (these map to Zoho's internal field slugs — check the Zoho form builder before renaming).

**Actually persist leads/results to Supabase instead of just Zoho** → add `supabase.from('leads').insert(...)` / `.from('profile_optimizations').insert(...)` calls; tables and RLS policies already exist (see §7).

**Re-enable "paste a LinkedIn URL to auto-fill"** → wire `InputSection.tsx` back into `Index.tsx` in place of `ProfileWizard`, it already calls the (built, deployed) `scrape-linkedin` function — just needs `FIRECRAWL_API_KEY` set as a Supabase secret.

**Change Tailwind design tokens (colors, radius, fonts)** → `tailwind.config.ts` and `src/index.css` (CSS variables consumed by Tailwind).

**Add a new shadcn/ui component** → `npx shadcn@latest add <component>` (reads config from `components.json`), drops the file into `src/components/ui/`.

---

## 14. Repo & branch info

- GitHub: [https://github.com/aitoolsteejay/profile-optimizer](https://github.com/aitoolsteejay/profile-optimizer)
- Default/only branch: `main` (no branching strategy in place — all changes go straight to `main`, which auto-deploys to production via Vercel)
- No CI/test suite configured — `npm run lint` and `tsc --noEmit` are the only automated checks currently, and they're manual (not run on push).