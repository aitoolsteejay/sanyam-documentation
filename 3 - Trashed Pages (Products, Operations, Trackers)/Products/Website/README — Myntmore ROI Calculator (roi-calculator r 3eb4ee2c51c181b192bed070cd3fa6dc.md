# README — Myntmore ROI Calculator (roi-calculator repo)

<aside>
📄

Copy of [README.md](http://README.md) from the aitoolsteejay/roi-calculator repo. Vite + React static app on Vercel (originally scaffolded in Lovable). No backend, no env vars.

</aside>

# Myntmore ROI Calculator

A single-page, fully client-side calculator that models outreach ROI — connection requests → replies → meetings → deals → revenue — in real time, and exports a branded PDF of the results.

No backend. No database. No environment variables. Everything happens in the browser.

---

---

## Overview

This app is used by the Myntmore sales team to show prospects (and themselves) a live, interactive projection of what a LinkedIn/outreach campaign is worth in dollars — starting from a monthly volume of connection requests and a handful of conversion-rate assumptions, all the way through to projected revenue, ROI %, and a month-by-month revenue-vs-cost chart.

The whole experience lives on a single route (`/`). There is no login, no persistence, no server round-trip — every number on screen recalculates instantly, in-browser, as soon as any input changes. The only "output" that leaves the browser is the PDF export, which is generated client-side and downloaded directly (nothing is uploaded anywhere).

It was originally scaffolded by [**Lovable**](https://lovable.dev) (see `lovable-tagger` in `devDependencies` and the Lovable metadata in `index.html`) and has since been hand-developed directly in this repo.

---

## Features

- 🎚️ **Live sliders & inputs** for every stage of the outreach funnel (acceptance rate, response rate, positive-response rate, meeting show-up rate, sales conversion rate)
- 💰 **Revenue & LTV modeling**, including duration-prorated "Effective LTV" so short ROI windows don't overstate long-retention customers
- 📊 **Two visualizations**: a hand-built gold conversion funnel, and a Recharts line chart projecting cumulative Revenue / Service Cost / Profit across the selected duration
- 🌍 **Multi-currency support** (USD, INR, AUD, AED, SGD, HKD, CNY, JPY, CAD) with locale-aware number formatting (India gets lakh/crore grouping)
- 🖨️ **One-click PDF export** — screenshots the results panel and drops it into a branded, printable PDF
- 🎨 **Themeable design system** — every color is a single CSS variable; the whole app is currently a light theme (white background, black text, gold/amber accent)
- ✅ **Zero backend** — pure static site, deployable anywhere that serves static files (currently configured for Vercel)

---

## Tech Stack

| Layer | Choice | Version | Notes |
| --- | --- | --- | --- |
| Language | TypeScript | ^5.8.3 | Strict-ish config, see `tsconfig*.json` |
| UI Framework | React | ^18.3.1 | Function components + hooks only, no class components |
| Build tool | Vite | ^5.4.19 | Dev server on port `8080` (see `vite.config.ts`) |
| Bundler plugin | `@vitejs/plugin-react-swc` | ^3.11.0 | SWC-based Fast Refresh |
| Styling | Tailwind CSS | ^3.4.17 | Config in `tailwind.config.ts` |
| Component library | shadcn/ui (Radix UI primitives) | various `@radix-ui/*` ^1.x–2.x | Generated components in `src/components/ui/` |
| Charts | Recharts | ^2.15.4 | Used only in `RevenueChart.tsx` |
| PDF generation | `jspdf` | ^3.0.3 |  |
| DOM → canvas | `html2canvas` | ^1.4.1 | Screenshots the results panel for the PDF |
| Toasts | `sonner` | ^1.7.4 |  |
| Icons | `lucide-react` | ^0.462.0 |  |
| Routing | `react-router-dom` | ^6.30.1 | Two routes total: `/` and catch-all 404 |
| Forms/validation deps | `react-hook-form`, `zod`, `@hookform/resolvers` | present, currently unused | Installed by the shadcn scaffold; no form in this app uses them yet |
| Data fetching | `@tanstack/react-query` | ^5.83.0 | Provider is wired in `App.tsx` but nothing in the app currently fetches data |
| Linting | ESLint 9 (flat config) + `typescript-eslint` | ^9.32.0 / ^8.38.0 | See `eslint.config.js` |
| Package manager | npm | — | A `bun.lockb` is also present in the repo from the original scaffold — **pick one lockfile system and stick with it**; mixing `npm install` and `bun install` in the same working copy will cause dependency drift |

Full dependency list: `package.json`.

---

## Prerequisites

- **Node.js** ≥ 18 (tested with Node 20+/22+/26)
- **npm** (ships with Node) — or Bun, if you prefer to use the existing `bun.lockb`, but don't mix the two
- No API keys, no `.env` file, no external services required to run this locally

---

## Getting Started

```bash
# 1. Clone the repository
git clone http://github.com/aitoolsteejay/roi-calculator.git
cd roi-calculator

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The dev server runs at [**http://localhost:8080**](http://localhost:8080) (not Vite's default 5173 — the port is explicitly set in `vite.config.ts`).

Open that URL, and you should see the calculator with every input defaulted to `0` (except a few funnel-stage defaults noted in State Reference below).

---

## Available Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server with HMR at `http://localhost:8080` |
| `npm run build` | Type-checks and builds an optimized production bundle into `dist/` |
| `npm run build:dev` | Same build, but in Vite's `development` mode (unminified, useful for debugging a prod-shaped build) |
| `npm run lint` | Runs ESLint across the whole project |
| `npm run preview` | Serves the already-built `dist/` folder locally, to sanity-check a production build before deploying |

There is no test script / test runner configured in this project at present.

---

## Project Structure

```
roi-calculator/
├── index.html                 # HTML shell — favicon links, Google Fonts, meta/OG tags
├── vercel.json                # Vercel deploy config (build command, SPA rewrite)
├── package.json                # Scripts & dependencies
├── vite.config.ts              # Dev server config (port 8080), "@/" path alias → src/
├── tailwind.config.ts           # Maps Tailwind color utilities → CSS variables
├── postcss.config.js            # Tailwind + autoprefixer pipeline
├── components.json              # shadcn/ui CLI config (used if you run `npx shadcn add ...`)
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js              # Flat ESLint config
│
├── public/                      # Static files served as-is, unprocessed by Vite
│   ├── favicon.ico              # Myntmore triangle mark, multi-size .ico (16/32/48/64px)
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png     # 180×180, for iOS "Add to Home Screen"
│   ├── placeholder.svg
│   └── robots.txt
│
├── docs/
│   └── USER_MANUAL.md           # Longer-form product/dev manual (Notion-importable)
│
└── src/
    ├── main.tsx                  # React entry point — mounts <App /> into #root, imports index.css
    ├── App.tsx                   # Router + global providers (React Query, Tooltip, Toaster/Sonner)
    ├── App.css                   # ⚠️ Unused Vite boilerplate — never imported anywhere, safe to ignore/delete
    ├── index.css                 # ⭐ THE THEME FILE — every color as an HSL CSS variable
    ├── vite-env.d.ts              # Vite's ambient type declarations
    │
    ├── pages/
    │   ├── Index.tsx              # ⭐ THE APP — all state, all math, page layout, PDF export
    │   └── NotFound.tsx           # Catch-all 404 route
    │
    ├── components/
    │   ├── CalculatorInputs.tsx    # Left panel — every input field & slider
    │   ├── ResultsDashboard.tsx    # Right panel (top) — revenue / ROI / LTV summary cards
    │   ├── FunnelChart.tsx         # Right panel — hand-built gold conversion funnel
    │   ├── RevenueChart.tsx        # Right panel — Recharts line graph (revenue/cost/profit)
    │   └── ui/                     # shadcn/ui primitives (Button, Card, Slider, Select, Tooltip, …)
    │                                 # Generated code — edit only for app-wide style tweaks
    │
    ├── assets/
    │   └── logo.png                # Myntmore logo — used ONLY in the PDF export header (not on-page)
    │
    ├── hooks/
    │   ├── use-toast.ts             # Toast state management (backs the shadcn Toaster)
    │   └── use-mobile.tsx            # `useIsMobile()` breakpoint hook
    │
    └── lib/
        └── utils.ts                  # `cn()` — clsx + tailwind-merge helper used throughout
```

> **Rule of thumb:** 95% of feature work happens in `src/pages/Index.tsx`, the four non-`ui` files in `src/components/`, and `src/index.css`. You should almost never need to hand-edit `src/components/ui/*`.
> 

---

## Architecture & Data Flow

There is **no global state library** — no Redux, no Zustand, no Context for app data. All state lives as plain `useState` calls inside one component, `Index.tsx`, and flows one-way down into presentational children:

```
Index.tsx  (owns ALL state + ALL derived calculations)
   │
   ├──▶ CalculatorInputs.tsx   — renders every input; calls the setters passed in as props on change
   │
   ├──▶ ResultsDashboard.tsx   — pure render of computed totals (read-only props)
   │
   ├──▶ FunnelChart.tsx        — pure render of the `funnelData` array (read-only props)
   │
   └──▶ RevenueChart.tsx       — pure render of a month-by-month projection (read-only props)
```

This is an intentional, appropriate architecture for an app this size: one screen, one form, nothing to persist, nothing to share across routes. Don't introduce a state management library here unless the app's scope genuinely grows (e.g. multi-scenario comparison, saved presets, auth).

### State Reference (all declared at the top of `Index.tsx`)

| State variable | Type | Default | Set by |
| --- | --- | --- | --- |
| `currency` | `string` | `"USD"` | Currency `<Select>` |
| `connectionRequests` | `number` | `0` | "Monthly Outreach Volume" input |
| `acceptanceRate` | `number` (0–100) | `0` | "Connection Acceptance Rate" slider |
| `replyRate` | `number` (0–100) | `0` | "Response Rate" slider |
| `positiveResponseRate` | `number` (0–100) | `50` | "Positive Response Rate" slider |
| `meetingRateFromPositive` | `number` (0–100) | `30` | "Meeting Show-Up Rate" slider |
| `closingRate` | `number` (0–100) | `0` | "Sales Conversion Rate" slider |
| `averageTicketPrice` | `number` | `0` | "Average Deal Value" input |
| `transactionsPerYear` | `number` | `1` | "Invoices Raised (per Year)" input |
| `monthsCustomerStays` | `number` | `0` | "Customer Retention Period (months)" input |
| `duration` | `number` (1/3/6/12) | `12` | "Duration" `<Select>` |
| `monthlyCost` | `number` | `0` | "Monthly Investment with Myntmore" input |

Nothing is persisted to `localStorage`, a URL query string, or any backend — a page refresh resets everything to these defaults.

---

## Calculation Logic

All business logic lives in one place: `Index.tsx`, roughly lines 40–59. If a number on screen looks wrong, this is where to trace it.

### Funnel Math

```
totalRequests        = connectionRequests × duration
acceptedConnections   = totalRequests × acceptanceRate%
replies                = acceptedConnections × replyRate%
positiveReplies        = replies × positiveResponseRate%
negativeReplies        = replies × (100 − positiveResponseRate)%
meetings                = positiveReplies × meetingRateFromPositive%
```

Each stage is a straightforward percentage-of-the-previous-stage calculation, rounded with `Math.round()` at every step (so intermediate rounding error can compound slightly across a long chain — this is expected/accepted behavior, not a bug).

### The +1% Conversion Uplift

`closingRate` (the raw value the user drags on the "Sales Conversion Rate" slider) is **not** used directly. The app silently adds **+1 percentage point** and caps at 100% before computing deals:

```tsx
// Sales Conversion Rate Adjustment: +1 percentage point
const adjustedClosingRate = Math.min(closingRate + 1, 100);
const deals = Math.round(meetings * (adjustedClosingRate / 100));
```

This is intentional and disclosed in the UI — the "Sales Conversion Rate" card shows both **Input Rate** and **Adjusted Rate (used)** side by side, so anyone reading the results can see the uplift being applied. If a stakeholder asks why their manual math doesn't match, this is the first thing to check.

To remove the uplift entirely: change that line to `const adjustedClosingRate = closingRate;`.

### Lifetime Value vs. Effective LTV

```
fullLifetimeLTV = averageTicketPrice × transactionsPerYear × (monthsCustomerStays ÷ 12)
coveredMonths     = min(duration, monthsCustomerStays)
effectiveLTV      = averageTicketPrice × transactionsPerYear × (coveredMonths ÷ 12)
```

- **Full Lifetime LTV** — what a customer is worth over their *entire* retention period, independent of the ROI window being calculated.
- **Effective LTV** — the *prorated* slice of that value that actually falls inside the selected `duration`. If `monthsCustomerStays` (say, 12) is longer than the selected `duration` (say, 3 months), only 3/12 of the lifetime value counts toward revenue for that specific window.

This prevents the calculator from overstating revenue when someone picks a short ROI window but a long customer-retention assumption.

### Revenue & ROI

```
revenue           = deals × effectiveLTV
totalServiceCost  = monthlyCost × duration
roi                = totalServiceCost > 0
                       ? ((revenue − totalServiceCost) ÷ totalServiceCost) × 100
                       : 0
```

ROI is expressed as a whole-number percentage (e.g. `3733%`), and is explicitly `0` (not `Infinity` or `NaN`) whenever `totalServiceCost` is `0`, since dividing by zero would otherwise blow up the UI.

---

## Component Reference

### `src/pages/Index.tsx` — the page

- Owns every `useState` value and every derived calculation above.
- Renders: sticky header (Export button only — see Branding & Favicon for why there's no logo here), the "ROI Calculator" title block, a 12-column responsive grid (`lg:col-span-4` sticky inputs panel + `lg:col-span-8` results panel), and a footer.
- `handleExport()` — the full PDF export pipeline, see PDF Export.
- `resultsRef` — a `useRef` attached to the results column; `html2canvas` screenshots exactly this DOM node for the PDF.

### `src/components/CalculatorInputs.tsx` — left panel

A purely controlled-inputs component — every value and setter is passed down as a prop from `Index.tsx`; this component holds no state of its own. Three sections:

1. **Basic Settings** — Currency select, Monthly Outreach Volume input, Duration select (1/3/6/12 months)
2. **Conversion Rates** — five `<Slider>` components (Acceptance, Response, Positive Response, Meeting Show-Up, Sales Conversion) **plus** one non-interactive visual bar for "Disengagement Rate (auto)" — this is *not* a slider, it's `100 − positiveResponseRate` rendered for context only, and has no setter.
3. **Revenue** — Average Deal Value, Invoices Raised (per Year), Customer Retention Period, plus two read-only summary rows (Full LTV, Effective LTV).

Every field has an info `<Tooltip>` (the small ⓘ icon) with a plain-English explanation — check there before assuming a field name is ambiguous.

### `src/components/ResultsDashboard.tsx` — right panel, top half

Purely presentational: takes already-computed numbers as props and lays them out as cards —

- Total Revenue Generated / ROI (large highlight cards, top row)
- Full LTV vs. Effective LTV (side-by-side comparison row)
- Sales Conversion Rate card (Input Rate → Adjusted Rate, visually explaining the +1% uplift)
- Five small metric tiles (Total Requests, Accepted, Replies, Meetings, Deals) rendered via an internal `MetricCard` helper defined at the top of the file.

### `src/components/FunnelChart.tsx` — the gold funnel

Hand-rolled — **not** a charting library. Each funnel stage is a `<div>` whose width is `(stageValue / firstStageValue) × 100%`, clamped to a 20% minimum so small numbers stay visible. Colored with an inline CSS gradient (`#FFC947 → #FFB627 → #FFA500`) rather than a theme variable — this is deliberate, so the funnel always reads as "gold" regardless of whatever the global theme is set to. "Negative Responses" is filtered out of this specific visualization (it's shown elsewhere, in `ResultsDashboard`, but would clutter the funnel shape here).

### `src/components/RevenueChart.tsx` — the line chart

A Recharts `<LineChart>` plotting **cumulative** Revenue, Service Cost, and Profit, month-by-month, across the selected `duration`. All three series are linear — the model assumes flat monthly revenue/cost and simply multiplies out; there is no seasonality or ramp-up curve. A custom tooltip component (`CustomTooltip`, defined inside this file) controls the hover card contents and colors.

### `src/components/ui/*`

Generated shadcn/ui primitives (Button, Card, Slider, Select, Tooltip, Dialog, Sheet, etc.) built on top of Radix UI. These are generic and **not app-specific**. Don't hand-edit a `ui/` file to fix a one-off styling issue that only appears in the calculator — instead override via `className` at the call site, or change the underlying CSS variable (see next section). The one legitimate reason to edit here is a true global change (e.g. "every button everywhere should have sharper corners").

---

## Design System / Theming

All colors are defined **once**, as HSL CSS custom properties in `src/index.css`, and mapped to Tailwind utility class names in `tailwind.config.ts`. That means `bg-card`, `text-foreground`, `border-border`, `bg-accent`, etc. anywhere in the codebase all resolve back to this single file.

### Current theme — light mode (white background, black text, gold/amber accent)

| CSS Variable | HSL Value | Rendered as | Used for |
| --- | --- | --- | --- |
| `--background` | `0 0% 100%` | white | Page background |
| `--foreground` | `0 0% 0%` | black | Default body text |
| `--card` / `--card-foreground` | `0 0% 100%` / `0 0% 0%` | white / black | Card backgrounds & text |
| `--popover` / `--popover-foreground` | `0 0% 100%` / `0 0% 0%` | white / black | Dropdowns, tooltips |
| `--primary` / `--accent` | `45 100% 64%` | gold/amber | Buttons, highlighted numbers |
| `--primary-foreground` / `--accent-foreground` | `0 0% 0%` | black | Text drawn on top of gold backgrounds |
| `--secondary` | `0 0% 95%` | light gray | Secondary surfaces, icon chips |
| `--muted` / `--muted-foreground` | `0 0% 90%` / `0 0% 35%` | light gray / dark gray | De-emphasized backgrounds/text |
| `--destructive` / `--destructive-foreground` | `0 84.2% 60.2%` / `0 0% 100%` | red / white | Error/destructive states (shadcn default, unused directly by app UI today) |
| `--border` / `--input` | `0 0% 85%` / `0 0% 95%` | light gray | Borders / input field backgrounds |
| `--ring` | `45 100% 64%` | gold/amber | Focus rings |
| `--radius` | `1rem` | — | Global corner rounding, used by `borderRadius.lg/md/sm` in Tailwind config |

**To re-theme the entire app** (e.g. rebrand the accent color, or flip back to a dark theme): edit the variables in `src/index.css` `:root`. Every component using Tailwind's semantic classes updates automatically — you do **not** need to touch individual component files for a global color change.

### Places that intentionally bypass the theme (hardcoded, not variables)

These were hand-tuned for a *light* background and will **not** auto-update if the theme is ever flipped back to dark — check them first if you re-invert:

| Location | What's hardcoded | Why |
| --- | --- | --- |
| `FunnelChart.tsx` | Gold gradient (`#FFC947`/`#FFB627`/`#FFA500`), `text-gray-900` percentage labels | Funnel is meant to always look gold, independent of theme |
| `RevenueChart.tsx` | Grid/axis stroke colors (`hsl(0 0% 88%)`, `hsl(0 0% 40%)`), `text-red-600`/`text-green-600` tooltip text | Tuned for readability specifically on a light card background |
| `Index.tsx` → `handleExport()` | `html2canvas({ backgroundColor: "#ffffff" })`, `pdf.setFillColor(255,255,255)`, `pdf.setTextColor(0,0,0)` | The exported PDF is always meant to be a white page with black text, regardless of on-screen theme |

---

## Currency Support

Currencies are defined as **two separate, non-shared lists** — this is a known duplication, not a bug, and both must be kept in sync by hand:

1. **`src/pages/Index.tsx`** — `const currencies = { USD: "$", INR: "₹", ... }` — a flat symbol lookup used for calculations and passed down as `currencySymbol`.
2. **`src/components/CalculatorInputs.tsx`** — `const currencies = [{ code, symbol, name }, ...]` — a richer array used to populate the `<Select>` dropdown with full currency names.

Currently supported: **USD, INR, AUD, AED, SGD, HKD, CNY, JPY, CAD**.

**To add a new currency:** add an entry to *both* lists above with a matching `code`.

Number formatting also branches on currency in a few places (`CalculatorInputs`, `ResultsDashboard`, `RevenueChart`, `FunnelChart`):

```tsx
const locale = currency === 'INR' ? 'en-IN' : 'en-US';
```

`en-IN` gives Indian-style lakh/crore digit grouping; everything else defaults to standard thousands grouping. If you add another currency that needs its own locale-specific grouping (e.g. a hypothetical future JPY-specific format), extend this ternary into a proper `Record<string, string>` lookup instead of nesting more ternaries.

---

## PDF Export

Triggered by the **"Export Results"** button in the header, wired to `handleExport()` in `Index.tsx`. Step by step:

1. **`html2canvas`** screenshots the results `<div>` — everything inside `resultsRef` (i.e. `ResultsDashboard` + the Funnel and Revenue charts) — into an in-memory canvas, at **2× scale** for print sharpness, with a forced white background (regardless of on-screen theme).
2. That canvas is converted to a PNG data URL.
3. A new **A4-sized `jsPDF`** document is created (`orientation: "portrait"`, `unit: "mm"`).
4. The Myntmore logo (`src/assets/logo.png`) is stamped at the top-left, at `(10mm, 10mm)`, sized `40mm × 10mm`.
5. A black **"ROI Calculator Results"** title is drawn, centered, below the logo.
6. The screenshot PNG is placed below the title, scaled to the full page width (proportional height).
7. The file downloads client-side as **`roi-calculator-results.pdf`**.
8. A `sonner` toast shows loading → success/error state throughout.

> **Important:** the logo was intentionally removed from the on-page header (per product direction) but is **intentionally still used in the PDF** — the `logo` import at the top of `Index.tsx` exists *solely* for this PDF stamp. Do not remove `src/assets/logo.png` or its import without also removing this PDF step, or the export will throw at build/runtime.
> 

To change the PDF's logo placement, title text, or overall layout: edit `handleExport()` directly. All coordinates are in millimeters on a 210mm × 297mm (A4) canvas.

---

## Branding & Favicon

| Asset | File(s) | Where it's used |
| --- | --- | --- |
| Full logo (wordmark + icon) | `src/assets/logo.png` | **PDF export only** — see above. Not rendered anywhere on the page itself. |
| Favicon (browser tab icon) | `public/favicon.ico`, `public/favicon-16x16.png`, `public/favicon-32x32.png` | Linked via `<link rel="icon" ...>` tags in `index.html` `<head>` |
| Apple touch icon | `public/apple-touch-icon.png` (180×180) | iOS "Add to Home Screen" |

The favicon set was generated by **cropping just the triangle/mountain icon mark** out of the full wordmark logo (not squishing the entire wide logo into a square), padding it onto a transparent square canvas, and exporting at each required size. If the logo is ever redesigned, regenerate the favicon set the same way rather than naively resizing the full rectangular logo file.

**To restore the logo to the on-page header:** add `<img src={logo} alt="Myntmore Logo" className="h-10" />` back inside the `<header>` block in `Index.tsx` — the `logo` import already exists in that file (kept alive for the PDF export), so no new import is needed.

---

## Deployment (Vercel)

`vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

| Key | Purpose |
| --- | --- |
| `buildCommand` | Standard Vite production build (`npm run build`) |
| `outputDirectory` | Vite outputs static files to `dist/` by default — this tells Vercel where to serve them from |
| `rewrites` | This is a single-page app using `react-router-dom`. Without this catch-all rewrite, refreshing the browser on any non-root path (or hitting the 404 page directly) would 404 at Vercel's edge *before* React Router ever gets a chance to load and handle routing client-side. This rewrite sends every request to `index.html` and lets the client-side router take over. |

### Deploy steps

1. Push your changes to the `main` branch (or your working branch) on GitHub.
2. In the [Vercel dashboard](https://vercel.com), **Import Project** → select this repository.
3. Vercel auto-detects the Vite framework preset and picks up `vercel.json` automatically — no manual build/output overrides needed.
4. No environment variables need to be configured.
5. Deploy. Every subsequent push to the connected branch triggers an automatic redeploy.

You can also deploy from the CLI once the project is linked:

```bash
npm i -g vercel   # one-time, if not already installed
vercel            # deploy a preview
vercel --prod     # deploy to production
```

---

## Common Customizations

| I want to... | Do this |
| --- | --- |
| Change the accent/brand color | Edit `--primary` and `--accent` in `src/index.css` |
| Flip back to a dark theme | Invert the lightness values in `src/index.css` `:root` (check git history — commit `02a0518`, "Invert theme to light mode", has the prior dark values for reference) |
| Add a new currency | Add matching entries to `currencies` in **both** `Index.tsx` and `CalculatorInputs.tsx` |
| Remove/adjust the +1% conversion uplift | Edit the `adjustedClosingRate` line in `Index.tsx` (see The +1% Conversion Uplift) |
| Add a brand-new input field | 1) add a `useState` in `Index.tsx` → 2) pass value + setter down as props → 3) add the actual `<Input>`/`<Slider>` in `CalculatorInputs.tsx` → 4) wire it into the calculation block in `Index.tsx` |
| Bring the logo back to the on-page header | Add `<img src={logo} .../>` into the `<header>` in `Index.tsx` (import already present) |
| Change the PDF's layout, title, or logo position | Edit `handleExport()` in `Index.tsx` — units are millimeters on an A4 page |
| Replace the favicon | Swap `public/favicon.ico`  • the two PNGs + `apple-touch-icon.png`, **keeping the same filenames**, so `index.html` needs no edits |
| Change the funnel's colors | Edit the inline gradient string inside `FunnelChart.tsx` (intentionally decoupled from the theme system) |

---

## Troubleshooting / FAQ

**"The numbers on screen don't match my manual math."**

Check the +1% conversion uplift first — it's the most common source of "off by a little" confusion.

**"I changed a CSS variable and nothing happened."**

Make sure you edited `src/index.css`, not `src/App.css` — the latter is unused Vite boilerplate, never imported anywhere (confirmed via `src/main.tsx`, which only imports `index.css`).

**"The revenue chart's lines look empty right when the page loads."**

Recharts animates lines in on mount via a `strokeDasharray` entrance transition. It fully resolves within about a second — it's not a rendering bug, just don't judge (or screenshot) the chart the instant it mounts.

**"A slider drag isn't registering in an automated browser test."**

Radix `<Slider>` thumbs respond reliably to click-then-arrow-key interaction; some headless/automated tooling doesn't correctly simulate a raw pointer drag on the thumb. For quick manual QA, click the thumb and use arrow keys, or temporarily hardcode non-zero `useState` defaults in `Index.tsx` and revert afterward.

**"Where's the backend / API?"**

There isn't one. This is 100% client-side — nothing is sent to a server, nothing is persisted anywhere.

**"`npm install` is behaving oddly / lockfile conflicts."**

This repo has both a `package-lock.json` and a `bun.lockb` (leftover from the original Lovable/Bun scaffold). Pick **one** package manager and don't switch back and forth on the same `node_modules` — mixing them is the most common cause of "works on my machine" dependency drift.

---

## Browser Support

Targets modern evergreen browsers (recent Chrome, Firefox, Safari, Edge). No specific legacy/IE support is configured — Vite's default `esbuild`/`browserslist`-driven target applies. `html2canvas`-based PDF export relies on standard Canvas/`toDataURL` APIs and works in all modern desktop browsers; mobile PDF export has not been explicitly QA'd.

---

## Project History

Recent notable commits (see `git log` for the full history):

- **Invert theme to light mode, swap logo, add Vercel config** — flipped the entire design system from a dark theme to the current light theme, and added the Vercel deployment config
- **Refactor funnel chart and update metrics**
- **Fix INR formatting in Revenue section**
- **Update LTV, retention, and conversion rate logic** — introduced the Full vs. Effective LTV distinction
- **feat: Implement Indian Number Formatting** — added the `en-IN` locale branch for INR

For a longer-form, more narrative walkthrough of the product and codebase (written for import into Notion), see `docs/USER_MANUAL.md`.

---

## License

No license file is currently present in this repository. Treat this as **proprietary/internal to Myntmore** unless a `LICENSE` file is added stating otherwise — do not assume open-source usage rights.

---

*This README is meant to be kept accurate as the source of truth for onboarding. If you change the calculation logic, the file structure, the theme, or the deployment setup, update this document in the same commit — treat drift here the same as you'd treat a stale API doc.*