# Myntmore Website — Technical Documentation

This is the complete reference for the Myntmore marketing site: what exists, where it lives, how it's built, and how to work on it safely. Written from a direct read of the actual codebase (not from memory or old docs), so treat this as the current source of truth over `HANDOFF.md`, which is stale.

---

## 1. Quick Facts

|  |  |
| --- | --- |
| **Framework** | Next.js 14.2.3 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS + inline `style={{}}` for colors (both are used side by side throughout) |
| **Fonts** | Inter (body/headings) + Caveat (handwritten annotations only), via `next/font/google` |
| **Backend/DB** | Supabase (Postgres) — secondary lead log only, not the source of truth |
| **CRM** | Zoho Forms — the actual, primary lead record for every form on the site |
| **AI** | Google Gemini (`gemini-2.5-flash`) via `@google/genai`, used by the 6 free AI tools |
| **Repo** | GitHub — `aitoolsteejay/ClaudeCode` |
| **Hosting** | Vercel |
| **Path alias** | `@/*` → repo root (e.g. `@/lib/supabase`, `@/components/ui/button`) |

### Running it locally

```bash
npm install
npm run dev        # http://localhost:3000 (or 3100 in this session's dev environment)
npm run build       # production build check — run this before trusting any change
```

### Environment variables required

Only three, none of which are committed to the repo (no `.env` file exists in the repo currently):

```
GEMINI_API_KEY                    # Google Gemini API key, powers all 6 AI tools
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase anon/public key
```

Without these, the site still runs, but `lib/supabase.ts` falls back to a placeholder Supabase project (so it doesn't crash the app), and any Gemini-powered tool will return a "GEMINI_API_KEY is not configured" error.

---

## 2. Repository Map

```
app/                     Next.js App Router — every route lives here
  components/            Shared, site-wide components (Navbar, Footer, Hero, FadeIn, etc.)
  api/tools/              API routes for the AI tools (one folder per tool)
  tools/                  The 7 free tool pages + their client components
  blog/                   Individual blog post pages
  case-studies/           Case studies listing + individual case study pages
  careers/                Careers listing + individual role pages
  services/               The 5 core service pages + services listing
  resources/              Resources hub, blog listing, tools listing
  lp/                     Standalone landing pages (ICP-specific campaign pages)
  instagram-resources/    Guides linked from Instagram bio (not in main nav)
  globals.css             All CSS: color tokens, button classes, keyframe animations
  layout.tsx              Root layout — fonts, <Toaster/>, global <html> setup
  sitemap.ts              next-gen sitemap.xml generator — MUST be updated when adding pages
  robots.ts               robots.txt generator

components/               Tool-specific components (NOT app/components — see note below)
  tools/
    shared/LeadGate.tsx    THE shared lead-capture form used by every AI tool
    dm-angles/             DM Angle Generator's own components
    profile-optimizer/     LinkedIn Profile Optimizer's own components
    founder-presence/      Founder Presence Analyzer's own components
    roi-calculator/        ROI Calculator's own components
  ui/                      shadcn/ui primitives (Button, Input, Select, Slider, etc.)

lib/
  supabase.ts              Supabase client singleton
  utils.ts                 `cn()` class-merging helper (clsx + tailwind-merge)

supabase/
  schema.sql               The entire Supabase schema, safe to re-run any time (idempotent)
```

> **Important quirk:** there are *two* component directories — `app/components/` (page-building blocks like `Navbar`, `Footer`, `Hero`, `FadeIn`, `StatTicker`, `LeadCaptureForm`, `CopyBlock`) and the top-level `components/` (everything related to the AI tools, plus the shadcn `ui/` primitives). This isn't a mistake to fix, it's just how the codebase evolved — the AI tools were originally separate projects that got merged in, and kept their own `components/` folder instead of moving into `app/components/`. When you're looking for something and can't find it in one, check the other.
> 

---

## 3. Full Page / Route Map

### Marketing pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/services` | Services listing (5 core services) |
| `/services/sales-intelligence` | Sales Intelligence & ICP Mapping |
| `/services/ai-lead-generation` | AI Lead Generation |
| `/services/linkedin-outreach` | LinkedIn Outreach & Automation |
| `/services/personal-branding` | Personal Branding |
| `/services/cold-email` | Cold Email Infrastructure |
| `/about-us` | About page (Tejas Jhaveri bio, credentials) |
| `/contact-us` | Contact form page |
| `/careers` | Careers listing |
| `/careers/senior-sales-head`, `/lead-gen-strategist`, `/gtm-strategist`, `/hr-operations-intern` | Individual role pages |
| `/founder-meeting` | Embedded Calendly booking widget — **every "book a call" CTA on the site should point here**, never straight to [calendly.com](http://calendly.com) |
| `/1-on-1-consultation` | A dedicated SEO-targeted variant of the booking pitch |

### Resources & content

| Route | Purpose |
| --- | --- |
| `/resources` | Resources hub (links out to blog + tools + case studies) |
| `/resources/blogs` | Blog listing (hero + grid + a live "Also on Medium" section pulling from `medium.com/@myntmore`'s RSS feed) |
| `/blog/*` | 6 individual blog posts |
| `/case-studies` | Case studies listing |
| `/case-studies/*` | 6 individual case studies |
| `/resources/tools` | **Free tools listing** — the hub page for all 7 AI tools |

### The 7 free AI tools (see Section 5 for the full system)

| Route | Tool |
| --- | --- |
| `/tools/linkedin-optimizer` | LinkedIn Profile Optimizer |
| `/tools/dm-angle-generator` | DM Angle Generator |
| `/tools/roi-calculator` | ROI Calculator (no AI, no lead gate — pure calculator) |
| `/tools/posting-rhythm-builder` | Posting Rhythm Builder |
| `/tools/lead-magnet-ideas` | Lead Magnet Idea Generator |
| `/tools/founder-presence-analyzer` | Founder Presence Analyzer |
| `/tools/icp-builder` | ICP Builder & Lead Scoring Rubric |

### Standalone landing pages (`app/lp/*`)

Not in the main nav, used for targeted ad/outreach campaigns to a specific ICP:

- `/lp/saas-founders`
- `/lp/manufacturers-exporters`
- `/lp/agencies-it`

### Instagram / social bio-link pages (`app/instagram-resources/*`)

Not in the main nav, meant to be linked directly from a social bio:

- `/instagram-resources/claude-skills-guide` — "The 6 Claude Skills Guide"

### SEO-only / redirect / utility pages

| Route | What it actually does |
| --- | --- |
| `/about` | Redirects to `/about-us` |
| `/contact` | Redirects to `/contact-us` |
| `/personal-branding` | Redirects to `/services/personal-branding` |
| `/marketing-automation`, `/seo` | Standalone SEO-targeted content pages (real content, not redirects) |
| `/GIAtech-stack` | A curated directory of 106 AI tools for jewellery businesses — a content/SEO play, unrelated to the core B2B product |
| `/workshop` | Full-page iframe embedding an external workshop site (`workshop-vert-omega.vercel.app`) — this is what the `workshop-redirect` branch name refers to |
| `/feedback` | Full-page iframe embedding a Zoho feedback form |
| `/thankyou` | Post-booking confirmation page (`noindex`) |
| `/privacy-policy` | Privacy policy |

**When adding any new page, update `app/sitemap.ts` too** — it is not automatic, and it was found badly out of date earlier in this project (missing all 7 tool pages and half the case studies) before being fixed.

---

## 4. Design System

### Colors

```
Page background:     #F8F6F2   (warm off-white — pages are never pure white)
White card:          #ffffff
Card border:         #E8E2D9   (used everywhere for borders/dividers)
Text primary:        #0a0a0a
Text secondary:      #52525B
Text muted:          #6B6B6B / #8C8279
Text disabled:       #B8B0A7

Brand gold:          #F5B731   (the primary accent — CTAs, underlines, badges)
Gold hover/dark:      #D97706
Gold bg tint:        #FEF9EC
```

**Accent rotation** (used for per-item coloring — service cards, tool cards, testimonial cards, blog tags, career role tags):

```
Blue:      #3b82f6       LinkedIn blue:  #0077b5
Purple:    #a855f7 / #7C3AED
Green:     #16a34a / #10b981
Teal:      #14B8A6
Orange:    #F97316        Gold/amber: #D97706
Red/rose:  #ef4444
```

When adding a new card/tile that needs its own color (a new tool, a new role, a new blog tag), pick a color from this list that isn't already used by its immediate siblings — don't invent a new hex value unless nothing here fits.

### Typography

- Headings: `font-black` (900 weight), never `font-bold` or `font-extrabold`.
- Page H1s: `text-4xl sm:text-5xl` (or `lg:text-6xl` on richer hero sections).
- Small "eyebrow" labels above headings: `text-xs uppercase tracking-widest` or `tracking-[0.2em]`.
- No forced `tracking-tighter` on marketing headlines, no all-caps body text.

### Buttons (defined in `app/globals.css`)

| Class | Use |
| --- | --- |
| `.btn-dark` | Primary CTA — white→cream gradient, gold border, shimmer sweep on hover |
| `.btn-ghost` | Secondary CTA — transparent, gold border, fills cream on hover |
| `.card-hover-{color}` | Border-color + shadow transition on card hover, one per accent color (`card-hover-warm`, `-blue`, `-purple`, `-green`, `-teal`, `-orange`, `-linkedin`, `-dark`) |

### Shared components worth knowing about

| Component | Location | What it does |
| --- | --- | --- |
| `InnerLayout` | `app/components/InnerLayout.tsx` | Wraps a page in `<Navbar/>`  • `<main>`  • `<Footer/>`. Every real page uses this. |
| `FadeIn` | `app/components/FadeIn.tsx` | Scroll-triggered fade-up reveal (IntersectionObserver-based). Wrap any section in `<FadeIn delay={100}>...</FadeIn>` for a staggered entrance. |
| `StatTicker` | `app/components/StatTicker.tsx` | Animates a stat string like `"$1.2M"` or `"40+"` counting up when scrolled into view. **Correctly separates prefix/suffix from the number** — there used to be a duplicated, buggy version of this same idea hand-rolled inline in a couple of page files that mangled `"$1.2M"` into `"1.2$M"`; those were replaced with this shared component. If you ever see a local `Ticker` function defined inside a page file instead of importing `StatTicker`, that's the bug pattern, fix it the same way. |
| `CopyBlock` | `app/components/CopyBlock.tsx` | Dark code-block-style box with a copy-to-clipboard button, used for the AI-prompt snippets on the Claude Skills Guide page. |
| `LeadCaptureForm` | `app/components/LeadCaptureForm.tsx` | The generic site-wide lead form (used on landing pages / contact-us), separate from the AI tools' `LeadGate`. |
| `AskYourAI` | `app/components/AskYourAI.tsx` | The "Ask ChatGPT / Claude / Perplexity about this page" widget shown on the homepage, all 6 blog posts, and the case studies listing page (not the individual case study pages). |

### Animation conventions

- **On page load** (hero sections): `hero-fade`, `hero-fade-d1` through `d4` CSS classes, staggered fade-up (defined in `globals.css`).
- **On scroll into view** (everything below the fold): wrap in the `<FadeIn>` component.
- **Drawn-in underline accent** under a key headline phrase: an inline SVG `<path>` with `strokeDasharray`/`strokeDashoffset`, driven by `getTotalLength()` + `IntersectionObserver`. This exact pattern has been hand-written multiple times across different pages (careers, case studies, services, blog listing, tools listing, the Instagram guide) rather than extracted into one shared component — if you're touching one of these, you're not missing an import, it's just duplicated by convention. Worth extracting into a shared `Underline` component if you're touching a 4th or 5th one.
- **Number tickers**: use `<StatTicker>`, don't hand-roll one.

---

## 5. The AI Tools System (the most complex part of the codebase)

There are 7 tools total, 6 of which are AI-powered (Gemini) and gated behind a lead-capture form; the 7th (ROI Calculator) is a pure client-side calculator with no backend and no lead gate.

### The shared flow

Every AI tool follows the same 3-step flow, controlled by a local `step` state (`"lead" | "input" | "results"`):

1. **Lead gate** — `<LeadGate source="..." onComplete={...} />` collects name, designation, company, phone, LinkedIn URL, email. On submit, it:
    - POSTs to the tool's Zoho form via a hidden iframe (`target` attribute), so the page never navigates away.
    - Simultaneously inserts a row into Supabase's `leads` table as a secondary record, and hands the new row's `id` back to the caller.
2. **Input step** — the tool's own form (business description, competitors, whatever that specific tool needs).
3. **Results step** — calls the tool's own `/api/tools/*` route (Gemini), renders the structured output, and updates the same Supabase row (`.update({ inputs, outputs }).eq("id", leadData.id)`) so that one row captures the whole session: who they are, what they asked for, and what they got.

### `components/tools/shared/LeadGate.tsx` — read this before touching any tool

- **`LeadSource` type**: `"profile_optimizer" | "posting_rhythm_builder" | "lead_magnet_ideas" | "dm_angle_generator" | "founder_presence_analyzer" | "icp_builder"`. Add a new value here when adding a new tool.
- **`ZOHO_FORM_ACTIONS`**: a `Record<LeadSource, string>` mapping each source to its own Zoho form POST URL. Each tool was originally launched pointing at one shared Zoho form (`SHARED_ZOHO_FORM_ACTION`), then migrated one at a time to its own dedicated Zoho form as those were created. **As of now, every tool except Profile Optimizer has its own dedicated form**; Profile Optimizer is still on the shared one pending a dedicated form being created in Zoho.
- Field names are consistent across every Zoho form (`SingleLine`, `SingleLine1`, `SingleLine2`, `SingleLine3`, `PhoneNumber_countrycode`, `Website`, `Email`) — this is why swapping which URL a tool posts to is a one-line change, no field mapping needed.
- **Known unresolved issue**: Zoho's autoresponder/confirmation email does not reliably fire for these forms (leads land fine in Zoho, but the visitor never gets a confirmation email). Root cause is believed to be that the form submits via a JS-triggered POST into a hidden iframe rather than a natural top-level browser navigation, which Zoho's spam/bot heuristics may deprioritize for "Instant Actions." **The agreed fix, not yet built:** stop relying on Zoho's autoresponder and send the confirmation email directly from our own backend at the moment `LeadGate` captures the lead. Blocked on getting either a Zoho Mail app-password (simplest, no new service) or a transactional email API key (e.g. Resend).

### `supabase/schema.sql` — the `leads` table

```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in (
    'profile_optimizer', 'posting_rhythm_builder', 'lead_magnet_ideas',
    'dm_angle_generator', 'founder_presence_analyzer', 'roi_calculator', 'icp_builder'
  )),
  name text not null,
  email text, phone text, company_name text, company_website text, linkedin_url text,
  metadata jsonb not null default '{}',
  inputs jsonb not null default '{}',   -- what the visitor typed into the tool
  outputs jsonb not null default '{}'   -- what Gemini generated for them
);
```

- Anonymous **insert** and **update** are both allowed (RLS policies `using (true) with check (true)`) since there's no user auth in these tools — this is intentional, not an oversight.
- No anonymous **select** or **delete** — only the Supabase dashboard / service role can read the data back.
- The whole file is **idempotent** — safe to re-run any time in the Supabase SQL editor, even on a table that already exists (uses `create table if not exists`, `add column if not exists`, `drop policy if exists` + recreate, and an explicit `drop constraint if exists` + recreate for the `source` check constraint). This matters because the check constraint has been widened multiple times as new tools were added, and Postgres doesn't let you just "add a value" to an existing `CHECK` — you have to drop and recreate it.

### Each tool's API route (`app/api/tools/*/route.ts`)

Consistent pattern across all of them:

```tsx
import { GoogleGenAI, Type } from "@google/genai";
// 1. Validate inputs (length limits, required fields) — hand-rolled, not zod, in the API routes
// 2. new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
// 3. ai.models.generateContent({
//      model: "gemini-2.5-flash",
//      contents: prompt,               // a hand-written prompt string with strict guidelines
//      config: { responseMimeType: "application/json", responseSchema: {...} }  // Type.OBJECT/ARRAY/STRING
//    })
// 4. JSON.parse(response.text) and return it
```

The `responseSchema` is what forces Gemini to return clean, typed JSON instead of prose you'd have to parse yourself — every tool's schema exactly matches the TypeScript interface its client component expects.

### Adding a new AI tool — checklist

This has been done 7 times now; the pattern is stable. To add tool #8:

1. `app/api/tools/<name>/route.ts` — copy an existing simple one (e.g. `lead-magnet-ideas`) as a template.
2. `app/tools/<name>/<Name>Client.tsx` — the 3-step flow (lead → input → results), copy an existing simple one as a template.
3. `app/tools/<name>/page.tsx` — thin wrapper: `InnerLayout` + metadata + the client component.
4. `components/tools/shared/LeadGate.tsx` — add the new source to `LeadSource` and to `ZOHO_FORM_ACTIONS` (point it at `SHARED_ZOHO_FORM_ACTION` until a dedicated Zoho form exists).
5. `app/resources/tools/page.tsx` — add an entry to the `FREE_TOOLS` array (pick an unused accent color + matching `card-hover-*` class; add the CSS class to `globals.css` if it doesn't exist yet).
6. `supabase/schema.sql` — add the new source to the `check` constraint (both in the `create table` and in the `drop constraint`/`add constraint` backfill block).
7. `app/sitemap.ts` — add the new route.
8. Once the client sends you the tool's dedicated Zoho form HTML, update its entry in `ZOHO_FORM_ACTIONS` — the field names will already match, it's a one-line URL swap.

---

## 6. Content Architecture

### Blog posts (`app/blog/*/page.tsx`)

Each is a plain server component: breadcrumb → colored topic tag (`"LinkedIn Outreach · 6 min read"` style) → H1 → intro paragraph → a 3-stat strip → the article body (array of `{heading, body}` or `{heading, list}` sections mapped over) → a closing CTA box → `<AskYourAI>`.

### Case studies (`app/case-studies/*/page.tsx`)

Similar shape to blog posts, but built around a `stats` array (rendered through `<StatTicker>`) and framed as client outcomes rather than educational content.

### Careers (`app/careers/[slug]/page.tsx`)

Each role page: breadcrumb → colored role tag → H1 → 4-item quick-facts grid (Location / Type / CTC / etc.) → mailto "Apply Now" button → About the Role → What You'll Do → Who You Are → Skills & Mindset checklist → Why Join Myntmore → the standard "Our values" 6-item grid → closing Apply CTA. The listing page (`app/careers/page.tsx`) drives its cards off a local `ROLES` array — adding a new role means adding both the array entry on the listing page *and* the individual `[slug]/page.tsx` file, plus a sitemap entry.

### Landing pages (`app/lp/*/page.tsx`)

Heavier, more animated pages built for a single ICP (SaaS founders, manufacturers/exporters, agencies), each using its own `LpLayout` wrapper (not `InnerLayout`) and a dedicated `Faq` / `FlowDiagram` component per page.

---

## 7. Third-Party Integrations

| Service | What it's used for | Where it's configured |
| --- | --- | --- |
| **Zoho Forms** | Primary CRM record for every lead-capture form on the site (AI tools + main contact form) | Hardcoded form action URLs in `LeadGate.tsx` and `LeadCaptureForm.tsx`/`contact-us/page.tsx` — no API key, it's a plain HTML POST |
| **Supabase** | Secondary lead log with full input/output capture for the AI tools | `lib/supabase.ts`  • `supabase/schema.sql`, env vars `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Google Gemini** | Powers all 6 AI-generation tools | `@google/genai` in each `app/api/tools/*/route.ts`, env var `GEMINI_API_KEY` |
| **Calendly** | Every "book a call" CTA site-wide | Embedded once, on `/founder-meeting` (`app/founder-meeting/FounderMeetingClient.tsx`), via `data-url="https://calendly.com/founder-myntmore/web?primary_color=ffc947"` and the official Calendly widget script. **Rule: every other CTA on the site should link to the internal `/founder-meeting` page, never straight to a `calendly.com` URL** — this was a repeated bug (several CTAs linked straight to Calendly, found and fixed across multiple passes). |
| **Medium** | The blog listing page's "Also on Medium" section | Server-side fetch of `https://medium.com/feed/@myntmore` (RSS), parsed with a small regex-based extractor in `app/resources/blogs/page.tsx` — no dependency added, deliberately not using a full RSS-parser library for 3 fields |

---

## 8. Git & Deployment Workflow

- **`master`** is the branch Vercel deploys to production from.
- **`workshop-redirect`** is the active working branch for this project's ongoing changes (named after the `/workshop` iframe redirect page, not descriptive of everything that happens on it).
- The pattern that's been used repeatedly: work happens on `workshop-redirect`, gets pushed, and then gets merged into `master` via a GitHub PR — **this merge is a manual step someone has to do on GitHub, it does not happen automatically.** More than once, several commits piled up on `workshop-redirect` after the last PR merge and were invisible in production until the next PR was merged — if something you built isn't showing up live, this is the first thing to check (`git log --oneline origin/master -5` vs `git log --oneline -5` on `workshop-redirect`).
- **Recurring merge conflict:** `tsconfig.tsbuildinfo` (a generated TypeScript incremental-build cache file that happens to be committed to the repo) conflicts almost every time `master` and `workshop-redirect` have both moved forward. It is safe to resolve by deleting it and regenerating via `rm tsconfig.tsbuildinfo && npx tsc --noEmit -p .`, then committing the regenerated file. The content of this file has no functional meaning, it's just a build cache.
- Every commit in this project's history ends with a `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` trailer.
- There's no CI pipeline checking builds — the discipline of running `npx tsc --noEmit -p .` before committing is manual, not enforced.

---

## 9. Content & Style Conventions

- **No em dashes anywhere on the site** — this is an explicit, standing rule (not a one-time cleanup). If you write or generate any copy with a `—` character, rewrite it with a comma, period, or colon depending on grammar, don't just delete it. **En dashes are fine and out of scope** (e.g. `"5–16 LPA"`, `"2–5 years"` number ranges) — only the long em dash is banned.
- **Voice**: direct, no corporate filler, no fake-casual copywriter hedging ("worth a proper look", "here's the thing"). The site's own recurring phrase is *"No pitch, no pressure."* — reuse that pattern rather than inventing new hedge phrases when writing CTAs or emails.
- Testimonials and placeholder form examples deliberately use a mix of Indian and international names, reflecting that Myntmore is a Mumbai-based company serving both Indian and international B2B clients. Landing pages targeting a specific region (e.g. `/lp/saas-founders`, `/lp/manufacturers-exporters`) intentionally keep Indian example names since those pages are Indian-ICP-specific.
- Don't hand-roll a component that already exists (`StatTicker`, `FadeIn`, `LeadGate`) — grep for it first. Several bugs in this codebase's history came from a page re-implementing something that already existed elsewhere, slightly wrong.

---

## 10. Known Issues / Technical Debt

1. **DM Angle Generator route conflict** — `next.config.js` has a `rewrites()` rule sending `/tools/dm-angle-generator` to an external `mynt-more-angles.lovable.app` site, left over from before the tool was ported into this codebase (`app/tools/dm-angle-generator/page.tsx` now exists as a real, complete page). Since Next.js rewrites take precedence over file-based routing, the real page may currently be unreachable in production, silently shadowed by the old external tool. Needs verifying and the rewrite removing if the local page is a complete replacement.
2. **Zoho autoresponder emails don't reliably fire** for any of the AI tools (see Section 5) — leads land in Zoho fine, confirmation emails don't send. Fix agreed but not yet built: send the confirmation email from our own backend instead of depending on Zoho.
3. **Profile Optimizer** is still on the shared Zoho form; every other tool has its own dedicated form.
4. **`HANDOFF.md`** in the repo root is significantly out of date (predates the AI tools, careers pages, most blog/case-study content, and several design-system changes) — this document supersedes it. Consider deleting or rewriting `HANDOFF.md` to avoid two conflicting sources of truth.