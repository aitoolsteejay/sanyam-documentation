# README — Myntmore Website (ClaudeCode repo)

<aside>
📄

Copy of [README.md](http://README.md) from the aitoolsteejay/ClaudeCode repo (live at [www.myntmore.com](https://www.myntmore.com)). Deploys from the `master` branch.

</aside>

# Myntmore Website

The marketing website for **Myntmore** — a Mumbai-based, AI-powered B2B outbound agency (cold email, LinkedIn outreach, ABM). Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS, deployed on Vercel at [myntmore.com](https://www.myntmore.com).

This is a large, content-heavy marketing site: **165 routes** as of this writing, spanning service pages, 9 free interactive AI tools, a 30-term glossary, 26 blog posts, 26 case studies, 9 vertical-specific landing pages, 8 city pages, and several standalone micro-sites (a live Mentimeter-style Q&A tool, digital vCard pages, a pricing area). It is actively developed by iterating directly in production-adjacent branches with heavy attention to SEO/AEO/GEO hygiene — see SEO / AEO / GEO governance below before adding or changing pages.

---

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 14](https://nextjs.org/) (App Router, `app/` directory) |
| Language | TypeScript |
| Styling | Tailwind CSS 3, plus per-component inline styles for brand hex values (see design system) |
| UI primitives | A small [shadcn/ui](https://ui.shadcn.com/)-style set in `components/ui/` (Radix UI underneath: `@radix-ui/react-select`, `-slider`, `-tooltip`, `-label`, `-slot`) |
| Icons | `lucide-react` |
| Charts | `recharts` (used in a couple of the free tools) |
| AI | Google Gemini via `@google/genai`, called server-side from `app/api/**/route.ts` |
| Database | Supabase (Postgres) via `@supabase/supabase-js` — lead capture only, see Database |
| PDF / image export | `jspdf`  • `html2canvas` (free tools export results as a PDF) |
| Toasts | `sonner` |
| Analytics | `@vercel/analytics` |
| Hosting | Vercel (implied by `next.config.js` conventions and the redirect/rewrite setup; no separate IaC in this repo) |

Node package manager: npm (there's a committed `package-lock.json`).

## Getting started

```bash
npm install
npm run dev      # starts the dev server on http://localhost:3100 by default in this project's tooling
```

Scripts (from `package.json`):

```bash
npm run dev      # next dev
npm run build    # next build
npm run start    # next start (serve the production build)
```

There is no test suite or linter script configured — the closest things to CI gates in this repo are:

- `npx tsc --noEmit` (typecheck)
- `npm run build` (full production build — catches most real breakage)
- The mechanical SEO checks described in `docs/keyword-map.md` (keyword-collision) and `docs/featured-snippet-audit.md`

Run both before pushing anything non-trivial.

### A note on the dev server

This project has occasionally hit two distinct, easy-to-conflate issues during long sessions:

1. **`.next` webpack-cache corruption** from a build and a dev server touching the same `.next` directory — fixed with `rm -rf .next` and a restart.
2. **A zombie `next dev` process** left bound to the dev port, silently serving a stale pre-edit module graph even after the terminal/tool that started it appears to have stopped. Find it and kill it before restarting:

```bash
lsof -nP -iTCP:3100 -sTCP:LISTEN
kill -9 <pid>
```

If you see a genuinely inexplicable build error that `tsc --noEmit` and Prettier both say isn't real, suspect this before anything else.

## Project structure

```
app/                          Next.js App Router — one folder per route (page.tsx + optional *Client.tsx)
  api/                         Server route handlers (Gemini calls, lead-magnet tool logic, Menti, vCards)
  components/                  Sitewide shared components (Navbar, Footer, Hero, schema/JSON-LD helpers, etc.)
  <route folders>/             165 page.tsx routes — see "Content architecture" below
  layout.tsx, page.tsx         Root layout + homepage
  globals.css                  Tailwind base + every hand-written animation/utility class used sitewide
  sitemap.ts, robots.ts        Generated sitemap.xml / robots.txt (see below)
  not-found.tsx                Custom 404

components/                    Feature-scoped React components, imported by one or a few app/ routes
  ui/                           shadcn/ui-style primitives (button, card, select, slider, tooltip, ...)
  pricing/                      GrowthPlansPricing.tsx — the one component powering both /plans/* pages
  glossary/                     GlossaryTerm.tsx — the one component powering all 30 glossary term pages
  case-studies/                 Shared case-study page chrome
  tools/                        One subfolder per free tool's client-side UI + shared/ (LeadGate, RelatedTools)

lib/                            Non-visual shared logic (see "Data layer" below)

public/                         Static assets: logos, client logos, photos, videos, llms.txt

supabase/
  schema.sql                    SQL for the single `leads` table backing every gated free tool

docs/                           Living SEO/content operations docs (see "SEO / AEO / GEO governance")

.claude/skills/                 Project-scoped Claude Code skills (frontend-design, design-motion-principles, apple-design)
```

## Content architecture

The site is organized less like a typical small marketing site and more like a **content system**: several page *types* are each driven by one shared component + a data file, so adding a new instance (a new glossary term, a new case study, a new city) means adding data, not new UI code. Understanding which pages are "templated" vs. fully bespoke is the fastest way to orient in this codebase.

### Marketing & company pages

Bespoke, hand-built pages, each its own `app/<slug>/page.tsx` (occasionally with a co-located `*Client.tsx` for interactive parts):

- `/` — homepage (`app/page.tsx`), composed from the shared section components in `app/components/` (`Hero`, `Services`, `Industries`, `WhoWeHelp`, `Testimonials`, `Results`, `CTABanner`, `LogoStrip`, `BenefitsMarquee`, `HowItWorks`, `SystemFlow`).
- `/about-us`, `/contact-us`, `/careers`, `/events`, `/who-this-is-for`, `/how-to-choose-an-outbound-agency`, `/myntmore-framework`, `/dos-and-donts-of-outreach`, `/agency-vs-in-house`
- `/founder-meeting`, `/1-on-1-consultation` — both are call-booking pages that embed Calendly, worded/targeted slightly differently (one is the primary nav CTA destination, the other a dedicated organic-search landing page)
- `/newsletter-subscribe`, `/feedback`, `/privacy-policy`
- `/thank-you` and `/thankyou` — **both exist** (post-conversion confirmation pages); check before assuming either is dead code or safe to remove
- `/careers-and-job-guide`, `/education-guide` — long-form guide-style pages aimed at students/early-career audiences (also linked from `llms.txt`)
- `/instagram-resources` — landing page(s) for social-driven traffic

### Services

`/services` is the index; each of the 7 services has its own page under `/services/<slug>`: LinkedIn Outreach & Automation, Cold Email Infrastructure, ICP Mapping & Lead Scoring, AI Lead Generation, Account-Based Marketing, Personal Branding, GTM Strategy — plus a "Do It Yourself" variant at `/services/do-it-yourself`. There's also a standalone `/marketing-automation` and `/seo` page (positioned as adjacent/complementary services, not in the main 7).

### Vertical landing pages (`/lp/*`)

9 industry-specific paid-traffic landing pages, each a `page.tsx` + `*Client.tsx` pair with its own hero, stat strip, and CTA copy tailored to the vertical:

`agencies-it`, `agency-partners`, `financial-services`, `fundraising`, `insurance`, `manufacturers-exporters`, `pharma`, `recruitment-firms`, `saas-founders`.

These map directly onto the 26 case studies' verticals.

### City pages (`/b2b-lead-generation-{city}`)

8 pages — Mumbai, Delhi, Bengaluru, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad — each with city-specific industry context (e.g. Mumbai's copy leads with BFSI/media), but sharing structure, `LocalBusiness` schema, and FAQ patterns. **Not separate offices** — Myntmore serves all of India from Mumbai; these pages are local-market-context content, not location pages, and the copy is careful to say so (see `llms.txt`).

### Blog, guides, glossary

- **Blog** (`/blog/*`, 26 posts) — each post is its own `page.tsx` (mostly static JSX, not MDX). Several share an identical "3-stat-strip with source citations" block near the top (grid layout — was fixed for mobile in `sm:grid-cols-3`, see git history for the pattern).
- **Guides** (`/resources/guides/*`) — long-form reference pages; `GuideTemplate.tsx` is the shared shell for these where applicable, plus at least one fully bespoke guide (`ai-tech-stack-jewellery`, 106 tools across 14 categories).
- **Glossary** (`/resources/glossary/<term>`, 30 terms) — every term page is `<GlossaryTerm ... />` (from `components/glossary/GlossaryTerm.tsx`) with per-term content passed as props/data. This is the cleanest example of the "one component, many pages" pattern in the repo — **always extend this component or its data, never fork it**, when adding a 31st term.
- `/resources`, `/resources/blogs`, `/resources/tools`, `/resources/feed` — index/hub pages tying the above together.
- The 2026 benchmark report (`/blog/b2b-outbound-benchmark-report-2026`) is treated as an evergreen, periodically-refreshed asset (aggregate reply-rate/inbox-placement/time-to-meeting stats) — its value depends on staying current, per `docs/seo-aeo-geo-cadence.md`.

### Case studies

`/case-studies` is the index (`CaseStudiesClient.tsx`); 26 individual pages under `/case-studies/<slug>`, grouped by the same 9 verticals as the `/lp/*` pages (e.g. 5 pharma case studies across India/USA/UAE/Singapore/France). Real client results only — `docs/content-gaps.md` and the cadence doc are explicit that **no fabricated stats** are allowed; a new offering with no track record yet gets honest "new, no data yet" framing instead.

### Free tools (`/tools/*`)

9 AI-powered lead-magnet tools, each `/tools/<slug>` + a matching `app/api/tools/<slug>/route.ts` server route that calls Gemini:

| Tool | Route |
| --- | --- |
| ROI Calculator | `/tools/roi-calculator` (no backend/lead-gate — pure client-side math) |
| ICP Builder & Value Proposition Generator | `/tools/icp-builder` |
| LinkedIn Profile Optimizer | `/tools/linkedin-optimizer` |
| DM Angle Generator | `/tools/dm-angle-generator` |
| Competitor Battle Card Generator | `/tools/battle-card-generator` |
| Case Study & Proposal Generator | `/tools/case-study-generator` |
| Lead Magnet Idea Generator | `/tools/lead-magnet-ideas` |
| Posting Rhythm Builder | `/tools/posting-rhythm-builder` |
| Founder Presence Analyzer | `/tools/founder-presence-analyzer` |

`lib/tools-registry.ts` is the **single source of truth** for each tool's name/href/tagline, consumed by the "Try this next" cross-link section every tool page shows — update the registry, not each page individually, when a tool's name or URL changes.

Every tool except the ROI Calculator gates its actual output behind `components/tools/shared/LeadGate.tsx` (name/email/phone capture), then logs the session to Supabase (see below) and separately posts to a per-tool Zoho form. `/tools/dm-angle-generator` is a special case: it's rewritten in `next.config.js` to an external Lovable-hosted app rather than rendered locally.

### Pricing (`/plans/*`)

`/plans/[code]` is a **dynamic route** — the only one in the codebase — resolving `alpha` → USD/international pricing and `beta` → INR/Indian pricing via a lookup `Record` in `app/plans/[code]/page.tsx`. Both are unlisted (`robots: noindex`, not in any nav/footer/sitemap) and share 100% of their UI via `components/pricing/GrowthPlansPricing.tsx`, which takes `currencyPrefix`/`currencySuffix`/`prices` as props. The URLs are intentionally region-blind codes rather than `/international-pricing` / `/indian-pricing` (old URLs 308-redirect to the new ones — see `next.config.js`).

If you need to add a 3rd pricing variant, add a key to the `PLANS` record in `app/plans/[code]/page.tsx` — do not create a new page.

### Misc standalone pages

- `/menti` + `/menti/room` — a small live, real-time Q&A/polling feature (Supabase-backed) used at in-person events/talks; has its own lightweight auth (`lib/mentiAuth.ts`, gated by `MENTI_ADMIN_PASSWORD`).
- `/tejasjhaveri`, `/jahnvijhaveri`, `/enwilfernandes` — individual digital business-card pages for team members, each pairing with an `app/api/vcard/<name>/route.ts` endpoint that serves a downloadable `.vcf` (so a phone's native "Add to Contacts" flow works, which a static file's content-type wouldn't reliably trigger).
- `/workshop` — a thin `iframe` wrapper around an external app; deliberately `noindex`ed since it has no unique content of its own.
- `/sitemap` — a **human-readable** HTML sitemap page (distinct from the machine-readable `sitemap.xml` generated by `app/sitemap.ts`).

## Shared components & design system

Brand tokens (used as inline `style` hex values throughout, *not* as Tailwind theme colors, except where noted):

| Token | Hex |
| --- | --- |
| Cream (background) | `#F8F6F2` |
| Near-black (text) | `#0A0A0A` |
| Gold (primary accent) | `#F5B731` |
| Tan (borders) | `#E8E2D9` |
| Body text | `#52525B` |
| Muted text | `#8C8279` |

Secondary accent rotation (used for tiered/categorized content — service icons, tier cards, table sections, industry cards): Blue `#3B82F6`, Purple `#7C3AED`, Orange `#F97316`, Teal `#14B8A6`, Green `#10B981`, alongside the Gold above. `app/components/Industries.tsx` is the canonical source of this 6-color rotation.

Font: Inter, sitewide (no per-page font switching).

Key shared components (`app/components/*.tsx`, imported across many routes — treat changes here as high-blast-radius):

- **`Navbar.tsx`** — fixed header, desktop dropdown megamenus (Services/Resources) + mobile accordion drawer. Data-driven from `SERVICE_LINKS`/`RESOURCE_LINKS`/`NAV_LINKS` arrays at the top of the file.
- **`Footer.tsx`** — sitewide footer, imported by (effectively) every page via layout.
- **`InnerLayout.tsx`** — the standard page content wrapper (max-width, padding) most `page.tsx` files render into.
- **`Breadcrumbs.tsx`** — visible breadcrumb trail **and** emits `BreadcrumbList` JSON-LD via `lib/schema.ts`; used on ~60% of pages (rolled out sitewide, some newer pages still need it added — see conventions).
- **`FadeIn.tsx`** — the sitewide scroll-reveal wrapper (`IntersectionObserver` + a `.reveal`/`.reveal-visible` CSS class pair in `globals.css`). Respects `prefers-reduced-motion` at the CSS level.
- **`JsonLd.tsx`** — renders a `<script type="application/ld+json">` from a schema object built by `lib/schema.ts`.
- **`LeadCaptureForm.tsx`** / **`NewsletterForm.tsx`** — generic lead/email capture forms used outside the tools' dedicated `LeadGate`.
- **`ReelWidget.tsx`** — the floating bottom-right autoplay Instagram-reel promo (appears after a 5s delay or 50% scroll, dismissible, muted by default).
- **`EventPopup.tsx`** — a similar fixed-position, timed/scroll-triggered promo pattern for upcoming events.
- **`StatTicker.tsx`** — the count-up-on-scroll-into-view number animation used for stats throughout the site (homepage, case studies, landing pages, pricing). Always animates a plain digit count internally and only ever *displays* the caller's pre-formatted string on completion — this is deliberate, so it never mangles India's lakh-style comma grouping (`1,74,999`) by reformatting programmatically. Follow this pattern for any new count-up UI rather than reimplementing.
- **`GuideTemplate.tsx`** — shared shell for long-form guide pages.
- **`Testimonials.tsx`** — CSS `@keyframes` marquee (not JS-driven), pauses on hover, respects reduced motion.

`components/pricing/GrowthPlansPricing.tsx` and `components/glossary/GlossaryTerm.tsx` are the two purest examples of the "one component, N pages via props/data" pattern — see Content architecture above.

## Data layer (`lib/`)

| File | Purpose |
| --- | --- |
| `schema.ts` | JSON-LD builders: `buildLocalBusinessSchema`, `buildFaqSchema`, `buildServiceSchema`, `buildWebApplicationSchema`, `buildDefinedTermSchema`, `buildBreadcrumbSchema`, `buildWebsiteSchema`, `buildHowToSchema`, `buildArticleSchema`, `buildEventSchema`, `buildJobPostingSchema`. Every new page should use whichever of these fits its content type — see the "Triggered" checklist in `docs/seo-aeo-geo-cadence.md`. |
| `tools-registry.ts` | Single source of truth for the 9 free tools' slug/name/href/tagline (see Free tools). |
| `faq-data.ts` | Shared FAQ content used by the `FAQ.tsx` component / `buildFaqSchema`. |
| `events-data.ts` | Data backing `/events` and the `UpcomingEvents.tsx` component. |
| `tool-social-metadata.ts` | OG/social preview metadata specific to the tools. |
| `mentiAuth.ts` | Simple password-based auth for the `/menti/room` admin flow. |
| `supabase.ts` | Supabase client init (reads `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`). |
| `utils.ts` | Generic helpers (the usual `cn()`-style class merge helper, etc., backing `components/ui/*`). |

## API routes

All under `app/api/`, all Next.js Route Handlers (`route.ts`):

- `gemini/route.ts` — presumably a generic/shared Gemini-calling endpoint.
- `tools/{battle-card-generator,case-study-generator,founder-presence,dm-angles,lead-magnet-ideas,profile-optimizer,posting-rhythm}/route.ts` — one per gated AI tool; `dm-angles` also has a `regenerate/route.ts` sub-route.
- `menti/{auth,reset,gist}/route.ts` — backs the `/menti/room` live Q&A admin flow.
- `vcard/{tejas-jhaveri,jahnvi-jhaveri,enwil-fernandes}/route.ts` — serves each person's `.vcf` contact card with the correct content-type.

## Database (Supabase)

One table, `public.leads` (see `supabase/schema.sql`, safe to re-run — it's idempotent: `create table if not exists`, `add column if not exists`, policies dropped/recreated). Row-level security is enabled with an "allow anonymous insert" policy so client-side code can write directly.

Flow: `LeadGate.tsx` inserts a row at submission time (contact fields populated, `inputs`/`outputs` empty) and gets the row's `id` back; once the tool actually runs, the same page `update`s that row in place with what the visitor typed (`inputs`) and what the AI generated (`outputs`). So one row = one full session. `source` is a constrained enum matching the tool slugs (`profile_optimizer`, `posting_rhythm_builder`, `lead_magnet_ideas`, `dm_angle_generator`, `founder_presence_analyzer`, `roi_calculator`, `icp_builder`) — the ROI Calculator's inclusion in the enum is legacy; it has no backend today and writes nothing.

Zoho CRM is the primary lead record for each tool (a dedicated form per tool, or a shared one); Supabase is explicitly the *secondary* record.

## Environment variables

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client init (`lib/supabase.ts`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client init |
| `GEMINI_API_KEY` | Server-side Gemini calls in `app/api/**/route.ts` |
| `MENTI_ADMIN_PASSWORD` | Gates the `/menti/room` admin flow |

No `.env.example` is committed — set these in your local `.env.local` and in the Vercel project's environment settings. (Values: [stored in password vault].)

## SEO / AEO / GEO governance

This is a genuinely load-bearing part of the repo, not boilerplate. Read `docs/seo-aeo-geo-cadence.md` before shipping any content change — it defines:

- A **triggered checklist** to run on every page add/change: keyword-collision check, full schema pass, sitemap entry with a real `lastModified`, title/description length limits, bidirectional internal linking, snippet-formatted FAQ answers, `public/llms.txt` updates for structural changes, no fabricated stats.
- Weekly/monthly/quarterly/semi-annual recurring tasks (GSC error sweep, keyword-collision re-run, broken-link sweep, snippet audit, E-E-A-T consistency sweep, benchmark report refresh).
- A monthly **manual** GEO citation spot-check (running target prompts through ChatGPT/Perplexity/Claude/Gemini) — there is no API for this, it has to be done by a human and results pasted back for analysis.

Companion docs:

- `docs/keyword-map.md` — every page's primary target keyword; enforces **zero primary-keyword collisions sitewide** via a mechanical, re-runnable check. Read this before choosing a new page's primary keyword.
- `docs/content-gaps.md` — backlog of high-intent topics not yet covered, cross-checked against the keyword map so nothing proposed would cannibalize an existing page.
- `docs/featured-snippet-audit.md` — audits every FAQ answer against Google's featured-snippet format (~40–60 words, direct claim first, no hedge openers).

`public/llms.txt` is a structured, human-and-AI-readable summary of the whole site (company info, every service/tool/location, key resources) — keep it in sync in the same commit whenever a service, major page, or URL changes name.

## Redirects, sitemap & robots

- **`next.config.js`** — all redirects are `permanent: true` (real 308s, not `next/navigation`'s `redirect()` which always issues a 307 regardless of intent). Grouped by why they exist: legacy renamed paths, retired roles/pages, legacy WordPress URLs from the previous site (deliberately *not* mapping the fully-discontinued service lines like `/cro`, `/sem`, `/web-development` — pointing those at `/services` would read as a soft-404 to Google), and the pricing-page region-code retirement. Also has one `rewrites()` block proxying `/tools/dm-angle-generator` to an external Lovable app.
- **`app/sitemap.ts`** — statically enumerates every indexable URL with a real `lastModified` per page, derived from `git log -1 --format=%aI -- <path>` — **never** hand-wave this to "now"; a single identical timestamp on every URL on every deploy is actively discounted by search engines.
- **`app/robots.ts`** — `allow: "/"` for all user agents (so GPTBot/ClaudeBot/PerplexityBot/Google-Extended are all permitted by default), with one `disallow` for the `/tools/dm-angle-generator/` subtree (to stop crawlers wandering into the externally-rewritten Lovable app's own open-ended sub-paths).

## Conventions & gotchas

- **Mobile-first grids.** Any multi-column `grid-cols-N` needs either a `grid-cols-1` mobile base (stacking below `sm:`) or genuinely short cell content (a big number + a 2–4 word label survives 2–3 narrow columns fine; a full sentence + a citation does not — this exact bug shipped across 9 blog posts before being caught and fixed).
- **Tables always get `overflow-x-auto`.** Every comparison/data table sitewide follows this; keep it that way for anything new.
- **`prefers-reduced-motion` is mandatory** for any new animation (background blob drift, count-up numbers, marquees, badge pops) — add both the CSS guard in `globals.css` and, for JS-driven animation loops, an early-return check via `window.matchMedia("(prefers-reduced-motion: reduce)").matches`.
- **Never reformat a pre-formatted number.** Count-up animations must animate a plain digit and swap to the caller's exact string on completion (see `StatTicker.tsx` / the pricing page's `AnimatedPrice`) — this is the only way India's `1,74,999`-style grouping survives.
- **One primary keyword per page, sitewide** — see `docs/keyword-map.md`.
- **No fabricated numbers.** A new offering with no real track record gets honest "new, no data yet" framing (see the GTM Strategy / fundraising pages for the pattern) rather than an invented stat.
- **Both `/thank-you` and `/thankyou` exist** — don't assume one is a typo to delete without checking what links to it.
- **`/plans/[code]` is the only dynamic route in the app.** Confirm before assuming a `[param]`-style pattern exists elsewhere.
- **Git remote uses SSH, not HTTPS** — plain `https://` pushes have failed in this environment before; the origin remote should be `git@github.com:...`.
- **Two categories of "fixed-width-looking" code are not bugs**: (1) large `width: "600px"`-class values on `aria-hidden`, `pointer-events:none` decorative background blur blobs inside an `overflow-hidden` section — these never cause scroll; (2) `flex-shrink-0 w-[Npx]` cards inside a CSS `@keyframes marquee` track — these are an intentional horizontal auto-scroll, not a broken grid.
- Watch for a **stale/zombie `next dev` process** vs. genuine `.next` cache corruption when debugging an inexplicable build error — see Getting started above.

## Deployment

Hosted on Vercel, deploying from `master`. There's no committed `vercel.json` — routing/redirect/rewrite behavior lives entirely in `next.config.js`, and image formats (AVIF-first, WebP fallback) are configured in the same file's `images` block. Push to `master` to ship; there is no separate staging environment defined in this repo.