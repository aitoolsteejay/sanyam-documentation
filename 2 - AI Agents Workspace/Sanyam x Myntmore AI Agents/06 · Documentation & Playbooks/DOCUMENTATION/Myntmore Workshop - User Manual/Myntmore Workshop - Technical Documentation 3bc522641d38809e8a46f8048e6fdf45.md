# Myntmore Workshop - Technical Documentation

## Navigation & document status

- **Product hub:** [Myntmore Workshop](../Myntmore%20Workshop%20-%20User%20Manual%203bc522641d388085b07bc85d1d8e7485.md)
- **Related reference:** [Non-technical guide](Myntmore%20Workshop%20-%20Non%20Technical%20Documentation%203bc522641d388088bff6ea1a56da4c02.md)
- **Central handover:** [Sanyam handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

**Verification note:** Confirm the current repository, environment, dependencies, security controls and deployment behavior before changing production.

**Maintenance rule:** Record the date, owner, tested environment, evidence, and any unverified or skipped checks when updating this document.

---

Written to bring a new engineer from zero to productive on this codebase. Pairs with `workshop-guide-non-technical.md` (the product/business-level explanation) — this document is the implementation side.

---

## 1. Stack

Vite + React 18 + TypeScript SPA, styled with Tailwind + shadcn/ui (Radix primitives), Framer Motion for step transitions, React Router (two routes total: `/` and `/workshop`), TanStack Query is installed but barely used (state is almost entirely `useState`, not query-driven). Supabase (Postgres) holds session data only — no auth, no user accounts. One Vercel serverless function (`api/gemini.ts`) proxies every call to Google's Gemini API so the API key never reaches the browser. Deployed to Vercel; `vercel.json` handles the SPA rewrite so client-side routes resolve on direct load/refresh.

## 2. Repository layout

```
api/gemini.ts                 The only serverless function — proxies Gemini calls
src/
  pages/
    Landing.tsx                Marketing page at "/"
    Index.tsx                  The entire workshop flow, at "/workshop" — one big state machine
    NotFound.tsx
  components/
    workshop/
      WelcomeScreen.tsx         Sign-up / resume screen
      Step1Onboarding.tsx  ... Step7Outreach.tsx   (see §5 — the 7 numbered steps, some skipped in numbering)
      StepJewelleryDesign.tsx, StepJewelleryModelling.tsx   Jewellery-only detour, steps 7-8 in the UI
      FinalScreen.tsx           Summary + PDF download
      ProgressBar.tsx, ProgressSidebar.tsx, WorkshopFooter.tsx, RestartButton.tsx
      MultiSelect.tsx, LoadingSpinner.tsx, InfoTooltip.tsx    Shared building blocks
    ui/                         shadcn-generated primitives, not hand-written
  hooks/
    use-autosave.ts             Periodic silent-save hook, used by most steps
    use-toast.ts, use-mobile.tsx
  lib/
    workshop-store.ts           Session CRUD (Supabase) + callGemini() (the AI-calling layer)
    prompt-rules.ts             Shared prompt fragments injected into every AI call
    sanitize.ts                 Strips —, *, # from AI output
    pdf-export.ts               ~1150 lines — hand-built PDF layout engine (jsPDF), not a template
    constants.ts                Industries, countries, ICP count limits, affiliate links
    audience.ts, utils.ts, clipboard.ts
  integrations/supabase/
    client.ts, types.ts         Generated Supabase client + the Database type
supabase/migrations/            Two migration files — see §8, this is out of date vs. the app
```

## 3. Architecture at a glance

```
Landing (/)  ──"Start the Free Workshop"──►  Index (/workshop)
                                                   │
                                        step: number state machine
                                        -1 loading | -2 resume-prompt | 0 welcome | 1..10 wizard
                                                   │
                          ┌────────────────────────┼────────────────────────┐
                          ▼                        ▼                        ▼
                  Step components          workshop-store.ts          Supabase
                  (one per step)     ──►    callGemini()          (workshop_sessions
                  build a prompt from              │                    table)
                  props + own state,                ▼
                  call callGemini(),          POST /api/gemini
                  parse+sanitize the                │
                  JSON/text response                ▼
                                          Gemini generateContent API
```

Every step component is essentially: **props in (data from earlier steps) → build a prompt string → `callGemini()` → parse the JSON (or, for Step5, raw text) → `sanitizeAIOutput()` → render → `onSave()` bubbles the result back up to `Index.tsx`**, which merges it into `sessionData` and persists it.

## 4. Session lifecycle (`src/pages/Index.tsx`, `src/lib/workshop-store.ts`)

- A session ID (`crypto.randomUUID()`) is generated client-side and stored under `localStorage["workshop_session_id"]`. There is no server-side auth — the ID itself is the only "credential."
- `createSession(name, email, phone)` inserts a `workshop_sessions` row and also writes a local `localStorage["workshop_backup"]` copy.
- On every future load, `getSessionId()` checks for an existing ID; if found, `loadSession(id)` fetches the most recent matching row from Supabase. If that fails, it silently falls back to the local backup (`loadBackup()`).
- `step` in `Index.tsx` is the entire UI state machine: `1` (initial loading spinner), `2` (resume-prompt / "welcome back"), `0` (fresh welcome/sign-up), `1..10` (the wizard steps, see §5). `goToStep(s)` both sets local state and persists `current_step` to Supabase.
- `saveField(field, data, opts)` optimistically updates local `sessionData`, then calls `debouncedSave(field, data)`, which clears a **single shared** `setTimeout` ref and reschedules a 1-second-delayed `saveProgress(sessionId, { [field]: data })` call. ⚠️ See §9 — this shared timer means two different fields saved within the same second can silently drop one write.
- `useAutosave(data, onSave, intervalMs=10000)` (used by most, not all, step components) is a `setInterval` that calls `onSave(data, {silent:true})` every 10s regardless of whether anything actually changed — there is no dirty-check anywhere in this chain.
- Every Supabase write failure is caught and only `console.error`'d — the UI is never told a save failed (the local backup write in `saveProgress` always still happens, so data isn't lost as long as the same browser/device is used again).

## 5. The step components

| # in code | Route step | Component | AI call? | Depends on |
| --- | --- | --- | --- | --- |
| — | `-2`/`0` | `WelcomeScreen.tsx` | No | — |
| 1 | `1` | `Step1Onboarding.tsx` | No — pure form | — |
| 2 | `2` | `Step2Profile.tsx` | Yes ×2 (offer-polish + LinkedIn analysis) | Step 1 |
| 3 | `3` | `Step3ICP.tsx` | Yes ×2 (D2C-description-polish + ICP generation) | Steps 1-2 |
| 4 | `4` | `Step4ValueProp.tsx` | Yes ×1 | Step 3 |
| 5 | `5` | `Step5Website.tsx` | Yes ×1 (returns plain text, not JSON) | Steps 1-4 |
| 6 | `6` | `Step6GTM.tsx` | Yes ×3 in parallel (`Promise.all`) | Steps 1-4 |
| 7 | `7` | `StepJewelleryDesign.tsx` | **No** — prompt assembled client-side, no Gemini call at all | — |
| 8 | `8` | `StepJewelleryModelling.tsx` | Yes ×1 | Step 7 (loosely) |
| 9 | `9` | `Step7Outreach.tsx` | Yes ×1 | Steps 1-4 |
| — | `10` | `FinalScreen.tsx` | No — renders a summary + triggers `generatePDF()` | All prior steps |

Full per-step detail (props consumed, exact response JSON shape, validation, UI quirks) is in the code-review notes and the earlier conversation history; the table above plus §6-7 below cover what a new engineer needs to start reading code productively. When in doubt, `grep -n "callGemini(" src/components/workshop/*.tsx` finds every AI call site.

Two components are the largest and most complex: **`Step3ICP.tsx`** (~813 lines — B2B vs. D2C vs. "Both" branching, up to 6 ICPs, India-specific city collection, an inline `D2CDescriptionBox` sub-component with its own debounced AI-polish flow) and **`pdf-export.ts`** (~1155 lines — see §8).

## 6. The Gemini-calling layer (`src/lib/workshop-store.ts`)

```tsx
callGemini(prompt, systemPrompt?, image?) → Promise<string>
```

- **Dedup**: identical in-flight calls (keyed on the full `prompt + systemPrompt + image-prefix` string, not a truncated key, since every prompt shares a long common preamble) return the same pending promise instead of firing twice.
- **Retry ladder**: up to 3 attempts, with `RETRY_DELAYS = [1000, 2000, 4000]` between them — though note only indices `[0]` and `[1]` (1s, 2s) are ever actually read; the loop's guard (`attempt < RETRY_DELAYS.length - 1`) never lets `attempt` reach 2 while the condition is true, so the `4000` entry is dead. Real backoff is ~3s total, not the ~7s the array/comment implies.
- **Final fallback**: one more attempt with the prompt truncated to 2000 chars and the image dropped, before giving up and throwing.
- **No `AbortController` anywhere** — a hung `fetch("/api/gemini")` just stays pending forever; a caller's own timeout race (see below) only stops *waiting*, it doesn't cancel the request, and a hung request can poison the dedup map for identical future calls.
- Each step component independently wraps its *primary* generate call in `Promise.race([callGemini(prompt), timeoutPromise])` at 60-90 seconds — but this pattern is copy-pasted per file rather than centralized, and two call sites don't have it at all (see §9).

`describeGeminiError(e)` maps a thrown error to specific user copy (timeout / misconfigured key / rate-limited / generic). `AI_PARSE_ERROR_MESSAGE` is the shared string shown whenever `JSON.parse` on the model's response fails.

**`api/gemini.ts`** (the serverless proxy): rejects non-POST, 400s on missing `prompt`, 500s if `GEMINI_API_KEY` isn't set. Calls `gemini-2.5-flash:generateContent` with `temperature: 0.7, maxOutputTokens: 16384`. **No auth, no rate-limiting** — anything that can reach this URL can spend your Gemini quota.

## 7. The shared prompt-rules system (`src/lib/prompt-rules.ts`)

Four exported string constants get concatenated into nearly every AI prompt in the app:

- `NO_JARGON_RULE` — mandates short sentences, plain-English substitutions for business jargon, bans a specific list of buzzwords.
- `PERSONALISATION_RULE` — mandates every output reference the user's actual name/company/industry/offer, never generic filler.
- `GEO_AWARENESS_RULE` — mandates channel/tone adaptation per target country (explicit examples for India, USA, UK, Europe, Middle East, SEA, Australia).
- `BUSINESS_TYPE_RULE` — mandates adapting to both "Selling To" (D2C/B2B/Both) and "Business Type" (Product/Service/Hybrid) independently.

This is the mechanism that makes output feel consistently "on-brand" across completely different steps — if the writing style needs to change app-wide, this file is the one place to do it.

`src/lib/sanitize.ts` (`sanitizeAIText`/`sanitizeAIOutput`) strips em-dashes, asterisks, and hash signs from every AI response, recursively over arrays/objects, before it's ever stored or rendered — confirmed applied consistently at every call site.

## 8. Supabase schema — **and a live gap to know about**

`supabase/migrations/` has two files: the initial `CREATE TABLE public.workshop_sessions` (session_id, user_name/email, current_step, and one JSONB column per step: `onboarding_data, profile_data, icp_data, value_prop_data, website_data, gtm_data, outreach_data`), and a later `ALTER TABLE ... ADD COLUMN user_phone`. Row Level Security is disabled on this table.

**Gap**: `src/pages/Index.tsx` and `src/lib/workshop-store.ts` write to `jewellery_design_data` and `jewellery_modelling_data` on every save from Steps 7-8, but **no migration ever created those columns**, and `src/integrations/supabase/types.ts`'s `Database` type doesn't declare them either. Every such `.update()` fails silently server-side (caught, `console.error`'d only). The data survives solely in the browser's `localStorage` backup — until the next `loadSession()` call, whose success path does an unconditional `saveBackup(data)` with the full (columnless) server row, which overwrites and permanently loses the local copy too. **Fix**: add a migration creating both `jsonb` columns and regenerate `types.ts` before relying on this data being durable.

## 9. Known issues / tech debt (condensed from the last full code review)

Ranked roughly by how much they affect real usage:

1. **`pdf-export.ts:1087`** references an undeclared `jewelleryDesign` variable → `ReferenceError` → PDF download silently fails for any session that used the Jewellery Design step.
2. **Jewellery data has no DB columns** (§8 above) — silent data loss risk.
3. **No timeout race** on the debounced "3-options" AI-polish effects in `Step2Profile.tsx:90` and `Step3ICP.tsx`'s `D2CDescriptionBox:752`, and on `StepJewelleryModelling.tsx:65`'s primary generate call — unlike every other step's generate button. A hang leaves the user stuck with no error, recoverable only by reloading.
4. **`Index.tsx`'s `debouncedSave`** uses one shared timer for every field — two different-field saves within the same ~1s window can cause the earlier one to be silently dropped.
5. **The "loaded from local backup" warning** (`Index.tsx:44` vs `:54`) is computed two inconsistent ways between the two code paths that can load from backup — it under-fires on one path and over-fires unconditionally on the other.
6. **`Step6GTM.tsx`/`Step7Outreach.tsx`** don't guard against an empty ICP array before generating, unlike `Step4ValueProp.tsx` which explicitly checks and shows a clear error first.
7. **`Step6GTM.tsx`** never imports `describeGeminiError`/`AI_PARSE_ERROR_MESSAGE` — every failure (rate limit, missing key, parse error) collapses into one generic message, unlike every sibling step.
8. **Stale-closure race** (no request-generation guard) in the debounced offer/D2C-description AI-polish flows — an older, slower response can resolve after a newer one and silently overwrite its correct results.
9. Significant **copy-paste duplication** worth extracting into shared helpers eventually: the "debounce → AI-polish into 3 options" flow (Step2Profile + Step3ICP, ~75 duplicated lines), the "race against timeout + regex-extract JSON + parse" block (copied across 4+ files instead of one `callGeminiJSON()` helper), the copy-to-clipboard button (reimplemented 5×), and a toggle-tag chip UI that reimplements `MultiSelect.tsx` in 4 places instead of reusing it.
10. **`api/gemini.ts` has no auth or rate-limiting** — worth adding before this URL is ever exposed somewhere less controlled than it is today.

## 10. Local dev & deployment

```bash
npm install
cp .env.example .env   # fill in Supabase values
npm run dev             # Vite dev server only
```

`/api/gemini` won't resolve under plain `npm run dev` — run `vercel dev` alongside it (needs `GEMINI_API_KEY` in a local, server-only `.env`, distinct from the client `VITE_`-prefixed one).

Client env vars (must be `VITE_`-prefixed to reach the browser): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`. Server-only: `GEMINI_API_KEY`. All configured in Vercel → Project Settings → Environment Variables. `vercel.json` handles the SPA rewrite; `api/gemini.ts` deploys automatically as part of the same build.

`npm run test` runs Vitest; `npm run lint` runs ESLint; `npm run build` produces `dist/`.

## 11. Planned but not yet built: the payment gate

There's a full design (separate document) for putting a Razorpay payment wall between sign-up and Step 1, plus a coupon-code system and free-trial toggles. None of it exists in the code yet — no `paid` column, no `api/razorpay-*` functions, no `PaymentScreen.tsx`. When this gets built, the natural insertion point is right after `WelcomeScreen`'s `onStart` callback in `Index.tsx` (currently goes straight to `setStep(1)`).

## 12. Where to look when something breaks

- **"Nothing happens" on any Generate button** → check `describeGeminiError`'s mapping first (is `GEMINI_API_KEY` set in Vercel? is Gemini rate-limiting?), then check whether that specific component has the 60s timeout race (§9, item 3) — some don't.
- **PDF download does nothing** → open the browser console; if the session used the Jewellery Design step, this is the known `pdf-export.ts:1087` bug (§9, item 1).
- **A field's edit "disappeared" after navigating away quickly** → likely the shared-debounce-timer issue (§9, item 4) — check whether two saves landed within ~1s of each other.
- **Jewellery step answers gone after a refresh** → the missing-columns gap (§8) — confirm by checking the Supabase table editor for `jewellery_design_data`/`jewellery_modelling_data` columns (they won't exist).
- **Generic, unhelpful error text on the GTM step specifically** → known gap, `Step6GTM.tsx` doesn't use the shared error-description helper (§9, item 7).