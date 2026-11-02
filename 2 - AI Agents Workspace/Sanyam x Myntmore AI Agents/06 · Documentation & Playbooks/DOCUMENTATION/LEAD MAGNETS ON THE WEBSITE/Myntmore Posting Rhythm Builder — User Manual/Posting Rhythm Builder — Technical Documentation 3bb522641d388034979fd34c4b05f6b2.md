# Posting Rhythm Builder — Technical Documentation

## Navigation & document status

- **Product hub:** [Posting Rhythm Builder](../Myntmore%20Posting%20Rhythm%20Builder%20%E2%80%94%20User%20Manual%203b4522641d3880c096dadd74e3a3e0dd.md)
- **Related guide:** [Non-technical guide](Posting%20Rhythm%20Builder%20-%20Non%20Technical%20Documentati%203bb522641d3880dcac78e3d694804297.md)
- **Central handover:** [Sanyam handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

**Verification note:** This is an implementation reference. Confirm the current repository, environment, dependencies, security controls and deployment behavior before changing production.

**Maintenance rule:** When updating this document, record the date, owner, tested environment, evidence, and any unverified or skipped checks.

---

A single-page React app that captures a lead, asks a founder five questions about their posting habits, calls Gemini to generate a personalized LinkedIn posting strategy, and renders it as a printable "operating pack." Built as a lead-gen / demo tool for Myntmore.

---

## 1. Quick Facts

|  |  |
| --- | --- |
| **Framework** | React 19 + TypeScript, bundled with Vite 6 |
| **Styling** | Tailwind CSS (loaded via CDN in `index.html`, no build step) |
| **AI** | Google Gemini (`gemini-2.5-flash`) via `@google/genai` |
| **Database** | Supabase (`leads` table — captures form submissions) |
| **Hosting** | Vercel (static SPA build) |
| **Source repo** | `https://github.com/sanyamg1305/posting-rhythm-builder` (remote: `origin`) |
| **Deploy repo** | `https://github.com/aitoolsteejay/posting-rhtyhem` (remote: `deploy`) |
| **Local path** | `~/Documents/Sanyam/Myntmore/posting-rhythem/posting-rhythm-builder` |

---

## 2. Project Structure

```
posting-rhythm-builder/
├── index.html            Page shell, Tailwind CDN import, global CSS (theme, scrollbar, print rules)
├── index.tsx              React entry point — mounts <App /> into #root
├── App.tsx                Entire application UI + logic (single component, ~420 lines)
├── constants.ts           Dropdown/option lists + default form state
├── types.ts               All shared TypeScript types/interfaces
├── services/
│   └── geminiService.ts   Calls the Gemini API and returns a typed PostingStrategy
├── public/
│   └── logo.png           Myntmore logo shown in the header
├── vercel.json            SPA rewrite rule for Vercel
├── vite.config.ts         Vite config (dev server port, path alias)
├── package.json           Scripts + dependencies
└── metadata.json          App name/description (AI Studio metadata, not used at runtime)
```

There is **no router, no CMS, no backend server** — it's one component with three internal "steps," a Supabase insert, and a Gemini call. Everything lives in `App.tsx`.

---

## 3. Environment Variables

Set these in a local `.env.local` for development, and in **Vercel Project → Settings → Environment Variables** for production.

| Variable | Required? | Used in | Fallback if unset |
| --- | --- | --- | --- |
| `VITE_GEMINI_API_KEY` | **Yes** — app throws `MISSING_API_KEY` without it | `services/geminiService.ts:6` | *none* — hard requirement |
| `VITE_SUPABASE_URL` | No | `App.tsx:9` | Hardcoded Supabase project URL baked into the source |
| `VITE_SUPABASE_ANON_KEY` | No | `App.tsx:10` | Hardcoded publishable anon key baked into the source |

> ⚠️ **Security note:** the Supabase URL and anon key are hardcoded as fallbacks directly in `App.tsx`. An anon/publishable key is meant to be public (it only works within your Supabase Row-Level-Security rules), but it's worth confirming RLS is locked down on the `leads` table so this key can only ever *insert*, never read/update/delete other people's rows.
> 

---

## 4. Running Locally

```bash
npm install
npm run dev
```

- Dev server runs on **port 3000** (set in `vite.config.ts`), reachable on your network (`host: '0.0.0.0'`).
- Create `.env.local` in the project root with at least:
    
    ```
    VITE_GEMINI_API_KEY=your_key_here
    ```
    
- To build for production: `npm run build` → outputs to `dist/`.
- To preview the production build locally: `npm run preview`.

---

## 5. Application Flow

The whole app is one state machine driven by `step: 'lead' | 'input' | 'results'` in `App.tsx`.

```
┌─────────────┐      ┌──────────────┐      ┌───────────────┐
│  Step: lead │ ───▶ │ Step: input  │ ───▶ │ Step: results │
│ (contact    │      │ (5 strategy  │      │ (AI-generated │
│  form)      │      │  questions)  │      │  strategy)    │
└─────────────┘      └──────────────┘      └───────────────┘
```

### Step 1 — `lead`

A gate form collecting: **Name, Company Name, Company Email, Company Website, Personal LinkedIn URL**.

On submit (`handleLeadSubmit`):

1. Validates all 5 fields are filled.
2. Inserts a row into the Supabase `leads` table.
3. **If the Supabase insert fails, the error is swallowed** — the user still proceeds to Step 2 (`setStep('input')` runs in both the `try` and `catch` paths). This is intentional so a DB hiccup never blocks the demo, but it means lead data can silently fail to save — worth monitoring the Supabase table directly if lead capture matters.

### Step 2 — `input`

Five strategy inputs, all required to enable the "Build My Rhythm" button (`isFormValid` check):

- **Founder Lifestyle** — dropdown, options from `LIFESTYLE_OPTIONS`
- **Preferred Tone** — dropdown, options from `TONE_OPTIONS`
- **Ideal Customer Profile (ICP)** — free text
- **Content Strengths** — multi-select pill buttons, options from `STRENGTH_OPTIONS`

On submit (`handleBuildInitial`) it calls `generateStrategy(formData, leadData)` from `services/geminiService.ts` and moves to Step 3 on success.

### Step 3 — `results`

Renders the AI's `PostingStrategy` object across several cards:

- **Best Posting Days** — explanation + list of days + best time window
- **Topic Cadence** — a day-by-day content-type schedule + the psychology behind it
- **Weekly Posting System** — a routine grid (one card per day/action)
- **High Probability Post Ideas** — category + idea pairs
- **Scroll-Stopping Hooks** and **Low-Friction CTAs** — two numbered lists
- A CTA block with a **Download Full Operating Pack** button that calls `window.print()` (see §8 — Print Styles)
- A closing pitch block linking to a Calendly booking link

---

## 6. Data Model (`types.ts`)

```tsx
FounderLifestyle  = 'I can post daily' | '4–5 days/week' | '3 days/week'
                  | 'Weekends only' | 'Mornings only' | 'Nights only'

Tone              = 'Authoritative' | 'Professional & Warm' | 'Sharp & Direct'
                  | 'Friendly' | 'Visionary'

ContentStrength   = 'Educational' | 'Storytelling' | 'Analytical'
                  | 'Contrarian' | 'Inspirational' | 'Humorous'

AppState = { lifestyle, icp, strengths: ContentStrength[], tone }

LeadData = { name, companyName, companyEmail, companyWebsite, linkedinUrl }

PostingStrategy = {
  bestPostingDays: { explanation, days: string[], timeWindow },
  topicCadence:    { schedule: {day, type}[], psychology },
  weeklySystem:    { routine: {day, action}[] },
  postIdeas:       { category, idea }[],
  hooks:           string[],
  ctas:            string[],
}
```

`PostingStrategy` is the exact shape Gemini is forced to return (see §7) — if you ever change one, change the other.

---

## 7. AI Integration (`services/geminiService.ts`)

- **Model:** `gemini-2.5-flash`
- **Call pattern:** one `ai.models.generateContent()` call with `responseMimeType: "application/json"` and a strict `responseSchema` (mirrors `PostingStrategy` from §6) — this forces Gemini to return valid, parseable JSON rather than freeform text.
- **Prompt** embeds: founder name, company name, lifestyle, ICP, content strengths, and tone, plus hard rules (no buzzwords, no filler, dual timezone — IST/GMT — for all times).
- **Editing the prompt or schema:** both live in the same file — if you add/remove a field from the schema's `properties`, update `types.ts` → `PostingStrategy` to match, and update the JSX in `App.tsx`'s results section that reads it.
- **Failure mode:** throws `Error("MISSING_API_KEY")` if `VITE_GEMINI_API_KEY` isn't set; `App.tsx`'s `handleBuildInitial` catches this and shows a user-facing config-error message.

---

## 8. Styling System

- **Tailwind is loaded via CDN** (`<script src="https://cdn.tailwindcss.com">` in `index.html`) — there is **no `tailwind.config.js`**, no PostCSS build step, no purging. All styling is inline utility classes in `App.tsx`, plus a handful of custom classes defined in `<style>` in `index.html`:
    - `.accent-border`, `.accent-text`, `.accent-bg` → all map to the brand yellow `#FFC947`
    - Custom `::-webkit-scrollbar` styling
    - `@media print` rules — used for the "Download Full Operating Pack" button (`window.print()`), which forces white background / black text and hides the header CTA + footer so the printed/PDF'd output looks like a clean document.

### Current theme: light (white background, black text)

As of **August 2026**, the app was inverted from its original dark theme (black bg/white text) to a light theme. If you're auditing colors, the rough mapping used was:

| Role | Old (dark theme) | New (light theme) |
| --- | --- | --- |
| Page background | `#000000` | `#FFFFFF` |
| Page text | `#FFFFFF` | `#000000` |
| Card background | `bg-[#0A0A0A]` | `bg-[#F5F5F5]` |
| Card/input borders | `border-white/5–30` | `border-black/5–30` |
| Input fields | `bg-black` / `text-white` | `bg-white` / `text-black` |
| Disabled buttons | `bg-gray-900` / `text-gray-600` | `bg-gray-100` / `text-gray-400` |
| Body text hierarchy | `text-gray-300…800` (light→dark) | mirrored to `text-gray-700…300` (dark→light) |
| Accent (`#FFC947`) | unchanged | unchanged |
| Logo | white "Mynt" text (invisible on white) | black-text logo variant (`public/logo.png`) |

The print stylesheet's selector was also updated from `.bg-\[\#0A0A0A\]` to `.bg-\[\#F5F5F5\]` to keep matching the card class after the rename — if you rename that Tailwind arbitrary-value class again, remember to update the print selector in `index.html` too, since it won't warn you if it silently stops matching.

---

## 9. Supabase Integration

- Client created in `App.tsx` with `createClient(supabaseUrl, supabaseAnonKey)`.
- Single table used: **`leads`**, with an insert shaped like:
    
    ```tsx
    {  name, company_name, company_email,  company_website, linkedin_url,  created_at: ISO timestamp}
    ```
    
- No reads happen client-side — this is write-only lead capture.
- **Reminder:** as noted in §3, insert failures are caught and hidden from the user. Check the Supabase dashboard directly to confirm leads are landing, especially after any RLS policy changes.

---

## 10. Build & Deployment (Vercel)

1. **Build command:** `npm run build` (runs `vite build`, outputs to `dist/`)
2. **`vercel.json`** already contains the SPA rewrite Vercel needs:
    
    ```json
    { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
    ```
    
    Vercel auto-detects the Vite framework preset; no other config is required.
    
3. **In the Vercel dashboard**, set the environment variable:
    - `VITE_GEMINI_API_KEY` — **required**, or the "Build My Rhythm" step will fail in production with a config-error message (the message text itself still says "Netlify Environment Variables" — a leftover from an earlier hosting target; harmless but worth fixing if you want it accurate for Vercel).
    - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — optional; the hardcoded fallbacks in `App.tsx` will work, but overriding via env vars is cleaner if you rotate the Supabase project.
4. **Two git remotes exist locally:**
    - `origin` → `sanyamg1305/posting-rhythm-builder` (original source repo)
    - `deploy` → `aitoolsteejay/posting-rhtyhem` (the repo currently intended for Vercel to build from)
    
    To ship a change: commit on `main`, then `git push origin main` (to keep the source of truth updated) and `git push deploy main` (to trigger a Vercel deploy, if Vercel is watching that repo).
    

---

## 11. Known Gotchas

- **No environment isolation for Supabase creds** — see §3/§9.
- **Silent lead-save failures** — see §5/§9.
- **Tailwind via CDN, no config file** — if you ever want to purge unused CSS, restrict the theme, or add custom Tailwind config, you'll need to migrate off the CDN script to a real Tailwind build (`tailwindcss` + PostCSS + Vite plugin).
- **Single-file component** — `App.tsx` holds all UI, state, and side effects for all three steps. It's manageable at its current size but would benefit from being split into `LeadForm`, `InputPanel`, and `ResultsView` components if it grows further.
- **Print selector coupling** — see the note at the end of §8.
- **Stale error copy** — the "Netlify Environment Variables" message in `handleBuildInitial`'s catch block (§10).

---

## 12. Recent Change Log

| Date | Change |
| --- | --- |
| 2026-08-06 | Inverted theme from dark (black bg/white text) to light (white bg/black text); replaced logo with a black-text variant so it stays visible; confirmed via local dev server screenshots |
| 2026-08-06 | Verified production build (`npm run build`) succeeds post-theme-change |
| 2026-08-06 | Pushed current `main` to a second remote, `deploy` → `aitoolsteejay/posting-rhtyhem`, in preparation for Vercel hosting |

---

## 13. Quick Reference — "Where do I change X?"

| I want to... | Edit this |
| --- | --- |
| Change the dropdown/option choices (lifestyle, tone, strengths) | `constants.ts` |
| Change the AI prompt or the shape of the generated strategy | `services/geminiService.ts` (and `types.ts` → `PostingStrategy` to match) |
| Change any colors, spacing, or layout | `App.tsx` (Tailwind utility classes) + `index.html` (`<style>` block for the theme/scrollbar/print rules) |
| Change the logo | `public/logo.png` |
| Change the lead-capture fields | `App.tsx` (`LeadData` state + form JSX) and `types.ts` → `LeadData` |
| Change where leads get saved | `App.tsx` — the Supabase client init and `handleLeadSubmit` insert call |
| Change the Calendly links | `App.tsx` — search for `calendly.com` (two links: one in the header CTA, one in the closing pitch) |
| Change the SPA rewrite / hosting config | `vercel.json` |