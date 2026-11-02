# README — Myntmore Workshop (workshop app)

<aside>
📄

Copy of [README.md](http://README.md) from the Myntmore Workshop app repo. Vite + React on Vercel with one Gemini serverless proxy; embedded on [myntmore.com/workshop](http://myntmore.com/workshop) via iframe.

</aside>

# Myntmore Workshop

A free, guided, AI-powered B2B/D2C growth workshop. A visitor answers a series of questions about their business, and at each step Google's Gemini turns their raw answers into polished, personalized strategy material — an optimized LinkedIn profile, ideal customer profiles, a value proposition, website copy, a go-to-market plan, an outreach playbook, and (for jewellery businesses specifically) product-design and product-photography prompts. Everything gets compiled into one downloadable PDF at the end.

It's built and run by [Myntmore](https://myntmore.com), Tejas Jhaveri's B2B lead-generation and outbound agency, as a lead magnet: the Workshop is free and asks for a name/email/phone up front, which feeds Myntmore's own sales follow-up.

- **Live app**: deployed to Vercel, landing page at `/`, the Workshop itself at `/workshop`.
- **Stack**: Vite + React 18 + TypeScript, Tailwind + shadcn/ui (Radix primitives), Framer Motion, Supabase (session storage only), one Vercel serverless function proxying Gemini.

---

---

## The Workshop journey

The Workshop is a single-page wizard driven by one `step` number in `src/pages/Index.tsx`. Progress autosaves continuously (see Session lifecycle), so a visitor can leave and resume later on the same device.

| Step | Screen | What the visitor provides | What comes back |
| --- | --- | --- | --- |
| — | **Landing** (`/`) | — | Marketing page, one CTA: "Start the Free Workshop" |
| — | **Sign-up** (`WelcomeScreen`) | Name, email, phone | A session is created; this is the lead capture, independent of whether the rest is completed |
| 1 | **Business Basics** (`Step1Onboarding`) | Industry, who they sell to (B2B/D2C/Both), business type (Product/Service/Hybrid), revenue range, team size, main goal | Nothing generated — pure context for every later step |
| 2 | **LinkedIn Profile** (`Step2Profile`) | Current headline/About (or "I don't have one"), a rough description of their offer, preferred tone | The offer description is AI-polished into 3 picks; then a 0-100 profile score across 5 criteria, 3 new headline options, and a rewritten About section |
| 3 | **Ideal Customer Profiles** (`Step3ICP`) | 3-6 customer profiles: for B2B, roles/company size/industry/geography; for D2C, a free-text description (AI-polished into 3 picks) | Per profile: who they are, pain points, buying triggers, objections, where to find them, and potential referral/co-selling partners |
| 4 | **Value Proposition** (`Step4ValueProp`) | — (built from Step 3) | Per ICP: a before/after story, a 3-step system, why competitors fail, a positioning statement, an elevator pitch, a CTA — plus a separate pitch for any referral partners |
| 5 | **Website** (`Step5Website`) | Brand name, two brand colors, optional design-reference screenshot | A complete, ready-to-paste prompt for an AI website builder (e.g. Lovable), plus a library of one-click follow-up prompts |
| 6 | **Go-To-Market** (`Step6GTM`) | — (built from Steps 3-4) | Per ICP: channels & partner strategy, an execution timeline, lead magnet & event ideas |
| 7 | **Jewellery Design** *(jewellery businesses only)* (`StepJewelleryDesign`) | Tag picks: jewellery type, style, material, gemstone, mood | A photorealistic product-photography prompt, assembled client-side (no AI call in-app — the visitor pastes it into Gemini's own image tool) |
| 8 | **Jewellery Modelling** *(same audience)* (`StepJewelleryModelling`) | Jewellery type | 4 distinct image-generation prompts (on-model, close-up, lifestyle, one fun/creative concept) |
| 9 | **Outreach Playbook** (`Step7Outreach`) | Up to 2 messaging angles | Per ICP: a LinkedIn cadence (B2B) or a channel/content plan (D2C), with example openers and what to avoid |
| 10 | **Final Screen** (`FinalScreen`) | — | A one-page strategy snapshot and a "Download PDF" button compiling every step into one report |

Every generation step sends the visitor's own words, plus everything entered in earlier steps, to Gemini along with a shared set of writing rules that apply everywhere (see Prompt rules) — plain language, personalized to this specific business, and adapted to the target country and to B2B vs. D2C. That consistency is what makes the output read as tailored rather than templated.

---

## Tech stack

- **Build tool**: Vite 5 (`@vitejs/plugin-react-swc`)
- **Framework**: React 18 + TypeScript
- **Routing**: React Router 6 (two routes: `/` and `/workshop`)
- **Styling**: Tailwind CSS + shadcn/ui components (Radix UI primitives underneath)
- **Animation**: Framer Motion (step/tab transitions)
- **Data fetching**: TanStack Query is installed but barely used — state is almost entirely local `useState`, not query-driven
- **Database**: Supabase (Postgres) — session storage only, no auth/user accounts
- **AI**: Google Gemini (`gemini-2.5-flash`), called only through a Vercel serverless proxy
- **PDF generation**: jsPDF, hand-built layout (not a template library)
- **Testing**: Vitest + Testing Library; **E2E**: Playwright config present
- **Linting**: ESLint 9 (flat config) + typescript-eslint
- **Hosting**: Vercel (SPA rewrite + the one serverless function deploy together)

---

## Repository structure

```
api/
  gemini.ts                    The only serverless function — proxies every Gemini call
src/
  pages/
    Landing.tsx                 Marketing page at "/"
    Index.tsx                   The entire workshop flow at "/workshop" — one state machine
    NotFound.tsx
  components/
    workshop/
      WelcomeScreen.tsx          Sign-up / resume screen
      Step1Onboarding.tsx        Step 1 — business basics (no AI)
      Step2Profile.tsx           Step 2 — LinkedIn profile optimisation
      Step3ICP.tsx               Step 3 — Ideal Customer Profiles (~813 lines, largest step file)
      Step4ValueProp.tsx         Step 4 — value proposition
      Step5Website.tsx           Step 5 — website prompt generator
      Step6GTM.tsx               Step 6 — go-to-market strategy
      StepJewelleryDesign.tsx    Step 7 — jewellery design prompt (no AI call)
      StepJewelleryModelling.tsx Step 8 — jewellery modelling prompts
      Step7Outreach.tsx          Step 9 in the UI — outreach playbook
      FinalScreen.tsx            Step 10 — summary + PDF download trigger
      ProgressBar.tsx, ProgressSidebar.tsx, WorkshopFooter.tsx, RestartButton.tsx
      MultiSelect.tsx, LoadingSpinner.tsx, InfoTooltip.tsx    Shared building blocks
    ui/                          shadcn-generated primitives (not hand-written; regenerate via shadcn CLI)
  hooks/
    use-autosave.ts              Periodic silent-save hook (10s interval), used by most steps
    use-toast.ts, use-mobile.tsx
  lib/
    workshop-store.ts            Session CRUD (Supabase) + callGemini() — the AI-calling layer
    prompt-rules.ts               Shared prompt fragments injected into nearly every AI call
    sanitize.ts                  Strips em-dashes/asterisks/hash-signs from AI output
    pdf-export.ts                ~1155 lines — hand-built PDF layout engine (jsPDF)
    constants.ts                 Industries, countries, ICP count limits, affiliate links
    audience.ts                  Shared B2B/D2C badge styling
    utils.ts, clipboard.ts
  integrations/supabase/
    client.ts                    Generated Supabase client
    types.ts                     Generated Database type — see the schema gap noted below
  test/                          Vitest specs + setup
supabase/
  migrations/                   Two SQL migrations — see Database schema section, this is out of date vs. the app
public/
  workshop-static/               Static logo/image assets served at this path
playwright.config.ts, playwright-fixture.ts    E2E test scaffolding
vercel.json                     SPA rewrite config
vite.config.ts, vitest.config.ts, tailwind.config.ts, tsconfig*.json
```

---

## Architecture at a glance

```
Landing (/)  ──"Start the Free Workshop"──►  Index (/workshop)
                                                   │
                                        `step` state machine
                                 -1 loading | -2 resume-prompt | 0 welcome | 1..10 wizard
                                                   │
                          ┌────────────────────────┼────────────────────────┐
                          ▼                        ▼                        ▼
                  Step components          workshop-store.ts          Supabase
                  (one per step)     ──►    callGemini()          (workshop_sessions
                  build a prompt from              │                    table)
                  props + own state,                ▼
                  call callGemini(),          POST /api/gemini
                  parse + sanitize                  │
                  the response                       ▼
                                          Gemini generateContent API
```

The pattern every generation-capable step component follows: **props in (data from earlier steps) → build a prompt string → `callGemini()` → parse the JSON (Step 5 is the one exception, returning raw text) → `sanitizeAIOutput()` → render → `onSave()` bubbles the result back up to `Index.tsx`**, which merges it into `sessionData` and persists it.

---

## Session lifecycle & state management

- A session ID (`crypto.randomUUID()`) is generated client-side and stored in `localStorage["workshop_session_id"]`. There is no server-side auth — the ID itself is the only "credential," and there's no login.
- `createSession(name, email, phone)` (`src/lib/workshop-store.ts`) inserts a `workshop_sessions` row and writes a local `localStorage["workshop_backup"]` copy at the same time.
- On every future load, `getSessionId()` checks for an existing ID; if found, `loadSession(id)` fetches the most recent matching Supabase row. If that fails, it silently falls back to the local backup (`loadBackup()`).
- `step` in `Index.tsx` is the whole UI state machine: `-1` (initial loading spinner), `-2` (resume-prompt / "welcome back"), `0` (fresh sign-up), `1..10` (the wizard steps above). `goToStep(s)` sets local state and persists `current_step` to Supabase in the same call.
- `saveField(field, data, opts)` optimistically updates local `sessionData`, then calls `debouncedSave(field, data)`, which clears a single shared `setTimeout` ref and reschedules a 1-second-delayed `saveProgress(sessionId, { [field]: data })`. **Note**: because this timer is shared across all fields (not one per field), two different fields saved within the same second can cause the earlier write to be silently dropped — see Known issues.
- `useAutosave(data, onSave, intervalMs = 10000)` (`src/hooks/use-autosave.ts`), used by most but not all step components, is a plain `setInterval` that calls `onSave(data, { silent: true })` every 10 seconds regardless of whether the data actually changed — there's no dirty-check anywhere in this chain, so it always issues a write.
- Every Supabase write failure is caught and only `console.error`'d — the UI is never told a save failed. The local backup write inside `saveProgress` always still happens, so data survives as long as the same browser/device is used again.

---

## AI integration

### The calling layer (`src/lib/workshop-store.ts`)

```tsx
callGemini(prompt: string, systemPrompt?: string, image?: GeminiImage): Promise<string>
```

- **In-flight dedup** — identical concurrent calls (keyed on the full `prompt + systemPrompt + image-prefix` string, deliberately not a truncated key, since every prompt shares a long common instructional preamble) return the same pending promise instead of firing twice.
- **Retry ladder** — up to 3 attempts, with `RETRY_DELAYS = [1000, 2000, 4000]` between them. In practice only indices `[0]` and `[1]` (1s, 2s) are ever read — the loop's guard never lets a delay fire on the third attempt — so real backoff is ~3s total, not the ~7s the array/comment suggest. Low-severity, but worth knowing if you're tuning retry behavior.
- **Final fallback** — one more attempt with the prompt truncated to 2000 characters and any image dropped, before giving up and throwing.
- **No `AbortController` anywhere** in the underlying `fetch("/api/gemini")` — a hung request just stays pending forever. A caller's own timeout race only stops *waiting*, it doesn't cancel the request, and a hung request can poison the dedup map for identical future calls.
- Most (not all — see Known issues) primary "Generate" actions wrap their call in `Promise.race([callGemini(prompt), timeoutPromise])` at 60-90 seconds, copy-pasted per file rather than centralized.

`describeGeminiError(e)` maps a thrown error to specific user-facing copy (timeout / misconfigured key / rate-limited / generic network failure). `AI_PARSE_ERROR_MESSAGE` is the shared string shown whenever `JSON.parse` on the model's response fails.

### The serverless proxy (`api/gemini.ts`)

The only function that ever touches `GEMINI_API_KEY`. Rejects non-POST requests, 400s on a missing `prompt`, 500s if the key isn't configured. Calls `gemini-2.5-flash:generateContent` with `temperature: 0.7, maxOutputTokens: 16384`. **There is currently no auth or rate-limiting on this endpoint** — anything that can reach this URL can spend the account's Gemini quota; worth adding before this URL is exposed anywhere less controlled than it is today.

### Prompt rules (`src/lib/prompt-rules.ts`)

Four exported string constants get concatenated into nearly every AI prompt in the app:

- **`NO_JARGON_RULE`** — short sentences, plain-English substitutions for business jargon, a banned buzzword list.
- **`PERSONALISATION_RULE`** — every output must reference the user's actual name/company/industry/offer, never generic filler.
- **`GEO_AWARENESS_RULE`** — channel/tone adaptation per target country, with explicit examples for India, USA, UK, Europe, Middle East, Southeast Asia, and Australia.
- **`BUSINESS_TYPE_RULE`** — adapts independently to "Selling To" (D2C/B2B/Both) and "Business Type" (Product/Service/Hybrid).

This is the single mechanism that keeps output feeling consistently on-brand across completely different steps — if the writing style needs to change app-wide, this file is the one place to do it.

### Sanitization (`src/lib/sanitize.ts`)

`sanitizeAIText` / `sanitizeAIOutput` strip em-dashes, asterisks, and hash signs from every AI response — recursively over arrays and objects — before it's ever stored or rendered. Confirmed applied consistently at every call site in the codebase.

---

## Database schema (Supabase)

`supabase/migrations/` has two files:

1. The initial `CREATE TABLE public.workshop_sessions`, with `session_id`, `user_name`, `user_email`, `current_step`, and one `JSONB` column per step: `onboarding_data`, `profile_data`, `icp_data`, `value_prop_data`, `website_data`, `gtm_data`, `outreach_data`. Row Level Security is disabled on this table.
2. `ALTER TABLE ... ADD COLUMN user_phone text`.

<aside>
⚠️

**Known schema gap**: `src/pages/Index.tsx` and `src/lib/workshop-store.ts` write to `jewellery_design_data` and `jewellery_modelling_data` on every save from Steps 7-8, but **no migration ever created those columns**, and `src/integrations/supabase/types.ts`'s generated `Database` type doesn't declare them either. Every such `.update()` fails silently server-side (caught and `console.error`'d only). The data survives solely in the browser's `localStorage` backup — until the next `loadSession()` call, whose success path does an unconditional `saveBackup(data)` with the full (columnless) server row, overwriting and permanently losing the local copy too.

**Fix**: add a migration creating both as `jsonb` columns, then regenerate `src/integrations/supabase/types.ts` (via the Supabase CLI or dashboard) before relying on this data being durable.

</aside>

---

## PDF export

`src/lib/pdf-export.ts` (`generatePDF(sessionData)`) is a single ~1155-line function that hand-builds a multi-page report with jsPDF: a cover page, table of contents, and one section per completed step (ICPs, Value Props, Website Prompt, GTM Strategy, Outreach Playbook, and a "Bonus Add-Ons" section for the jewellery steps). It runs entirely synchronously on the click handler (aside from one `await loadLogo()`), so a session with several ICPs and full playbooks can visibly freeze the tab for the duration of the layout pass.

<aside>
⚠️

**Known bug**: line ~1087 references an undeclared variable `jewelleryDesign` (only `addonsPrompt` and `modellingData` are actually destructured earlier in the function). Any session that used the Jewellery Design step throws a `ReferenceError` here, and since the caller never awaits/catches `generatePDF`'s promise, the download just silently does nothing with no visible error. This needs a one-line fix (replace `jewelleryDesign?.selections` with the correct source of the selections data) before jewellery-flow PDF exports work.

</aside>

---

## Environment variables

Values: [stored in password vault].

### Client-side (Vercel → Project Settings → Environment Variables)

These are read via `import.meta.env` and must be prefixed with `VITE_` to be exposed to the browser. Get these values from your Lovable/Supabase project settings (Project Settings → API):

| Variable | Where to find it |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API → anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase → Project Settings → General → Reference ID |

These three are safe to expose to the browser (the anon key is designed for client-side use; access is enforced by Supabase Row Level Security policies — though note RLS is currently disabled on `workshop_sessions`, see Database schema). Supabase is only used here to store workshop session progress — it has nothing to do with the AI generation calls.

### Server-side (Vercel → Project Settings → Environment Variables, do NOT prefix with `VITE_`)

| Variable | Where to find it |
| --- | --- |
| `GEMINI_API_KEY` | Google AI Studio → API keys |

`api/gemini.ts` is a Vercel serverless function that proxies Gemini API calls using this key. It stays server-side — never prefix it with `VITE_`, or it would be bundled into the public client JS and anyone could steal it.

---

## Local development

```bash
npm install
cp .env.example .env   # fill in your Supabase values
npm run dev
```

`npm run dev` runs the Vite dev server only — `/api/gemini` won't resolve locally unless you also run `vercel dev` alongside it (which needs `GEMINI_API_KEY` in a local, server-only `.env` file — not the client-side `.env` above, since it's a server-only variable and Vercel's local dev server reads it separately).

Available scripts (`package.json`):

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Build in development mode (useful for debugging a prod-shaped build) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the whole repo |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |

---

## Testing & linting

- **Unit/component tests**: Vitest + Testing Library, config in `vitest.config.ts`, specs under `src/test/`. Supabase and `workshop-store` are typically mocked in these specs (see `src/test/example.test.ts` for the pattern: `vi.mock("../lib/supabase", ...)` and `vi.mock("../lib/workshop-store", ...)`) since the real client requires live env vars.
- **E2E**: Playwright is configured (`playwright.config.ts`, `playwright-fixture.ts`) though the suite itself may be minimal — check `src/test/` and any `*.spec.ts` files for current coverage before assuming full E2E coverage exists.
- **Linting**: `eslint.config.js` — flat config, `@eslint/js` + `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`.

---

## Deploying to Vercel

1. Import this repo into Vercel (Framework Preset: Vite is auto-detected).
2. Add all four env vars above in Vercel → Project Settings → Environment Variables (for Production, Preview, and Development).
3. Deploy. `vercel.json` handles the SPA rewrite so client-side routes (e.g. `/workshop`) resolve correctly on refresh/direct load. `/api/gemini` deploys automatically as a serverless function in the same build — no separate platform or redeploy step needed.

---

## Known issues / tech debt

From the most recent full codebase review, ranked roughly by real-world impact:

1. **PDF export crashes for jewellery-flow sessions** — `src/lib/pdf-export.ts` line ~1087, undeclared `jewelleryDesign` variable. See PDF export.
2. **Jewellery step data has no database columns to persist to** — silent data-loss risk. See Database schema.
3. **Three call sites have no timeout race**, unlike every sibling "Generate" action: the debounced offer/D2C-description AI-polish effects (`Step2Profile.tsx`, `Step3ICP.tsx`'s `D2CDescriptionBox`) and `StepJewelleryModelling.tsx`'s main generate call. A hung Gemini request leaves the user stuck with no error, recoverable only by a full page reload.
4. **`Index.tsx`'s `debouncedSave` uses one shared timer for every field** — two different-field saves within the same ~1-second window can cause the earlier write to be silently dropped rather than merely delayed.
5. **The "loaded from local backup, may not be fully synced" warning is computed two inconsistent ways** between the two code paths that can load from a backup (`Index.tsx` success path vs. its catch path) — it under-fires on one and over-fires unconditionally on the other.
6. **`Step6GTM.tsx` / `Step7Outreach.tsx` don't guard against an empty ICP array** before generating, unlike `Step4ValueProp.tsx`, which explicitly checks and shows a clear error first.
7. **`Step6GTM.tsx` never uses the shared `describeGeminiError`/`AI_PARSE_ERROR_MESSAGE` helpers** — every failure mode (rate limit, missing key, parse error) collapses into one generic message, unlike every sibling step.
8. **Stale-closure race** in the debounced offer/D2C-description AI-polish flows (no request-generation guard) — an older, slower response can resolve after a newer one and silently overwrite its correct results.
9. **Meaningful copy-paste duplication** worth extracting into shared helpers: the "debounce → AI-polish into 3 options" flow (`Step2Profile` + `Step3ICP`, ~75 duplicated lines), the "race against timeout + regex-extract JSON + parse" block (copied across 4+ files instead of one shared `callGeminiJSON()` helper), the copy-to-clipboard button (reimplemented 5×), and a toggle-tag chip UI that reimplements `MultiSelect.tsx` in 4 places instead of reusing it.
10. **`api/gemini.ts` has no auth or rate-limiting.**

---

## Roadmap

**Payment gate (designed, not yet built)**: putting the Workshop behind a Razorpay payment wall, sitting between sign-up and Step 1 (so a lead is still captured whether or not someone pays), plus:

- **Coupon codes** — for individual free/discounted grants (partners, warm leads, team demos), with atomic redemption-cap enforcement and per-email reuse limits.
- **Free-trial windows** — a simple global on/off switch for periods where payment isn't turned on yet, rather than a metered per-user trial.

None of this exists in code yet — no `paid` column, no `api/razorpay-*` functions, no `PaymentScreen.tsx`. The natural insertion point when it's built is right after `WelcomeScreen`'s `onStart` callback in `Index.tsx` (which currently goes straight to `setStep(1)`).

---

## Glossary

- **ICP (Ideal Customer Profile)**: a detailed description of one type of person or company most likely to buy — their role, pain points, and what makes them say yes.
- **D2C**: Direct-to-Consumer — selling to an individual for personal use, as opposed to a business buyer.
- **B2B**: Business-to-Business — selling to a company, usually through a professional decision-maker.
- **GTM (Go-To-Market)**: the overall plan for how a business reaches and wins its target customers.
- **Value proposition**: a clear, specific statement of what a business does for a customer and why it beats the alternatives.
- **Lead magnet**: something free and useful offered to attract potential customers and capture their contact details.
- **Session**: one visitor's full run through the Workshop, from sign-up to the final PDF, saved under one session ID.