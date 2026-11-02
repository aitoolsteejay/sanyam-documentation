# ROI Calculator — Technical Documentation

A living reference for the `roi-calculator` codebase: what it does, how it's built, where everything lives, and how to change it safely.

> **Repo:** `aitoolsteejay/roi-calculator`
**Live purpose:** A single-page calculator that models LinkedIn/outreach ROI — connection requests → replies → meetings → deals → revenue — and lets a sales team export the results as a branded PDF.
> 

---

## 1. Quick Start

```bash
# Install dependencies
npm install

# Run the dev server (http://localhost:8080)
npm run dev

# Type-check + lint
npm run lint

# Production build → outputs to /dist
npm run build

# Preview the production build locally
npm run preview
```

No environment variables, no backend, no database. It's a fully static, client-side app — all "calculation" happens live in the browser as the user drags sliders and types numbers.

---

## 2. Tech Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | React 18 + TypeScript | Single page, no routing complexity |
| Build tool | Vite 5 | Fast dev server, outputs static `dist/` |
| Styling | Tailwind CSS + CSS variables | Theme lives in `src/index.css`, mapped in `tailwind.config.ts` |
| UI components | shadcn/ui (Radix UI primitives) | Everything in `src/components/ui/` — pre-built, rarely needs editing |
| Charts | Recharts | Used in `RevenueChart.tsx`; the funnel is hand-built (not Recharts) |
| PDF export | `html2canvas`  • `jspdf` | Screenshots the results panel, drops it into a PDF |
| Toasts | `sonner` | Success/error messages on export |
| Icons | `lucide-react` |  |
| Routing | `react-router-dom` | Only two routes exist: `/` and a catch-all 404 |
| Package manager | npm (a `bun.lockb` also exists — either works, don't mix them in one install) |  |

This was originally scaffolded by **Lovable** (see the `lovable-tagger` dev dependency and `<meta name="author" content="Lovable">` in `index.html`) and has since been hand-edited.

---

## 3. Project Structure

```
roi-calculator/
├── index.html                 # HTML shell — favicon links, fonts, meta tags live here
├── vercel.json                # Vercel deploy config (build command, SPA rewrite)
├── package.json               # Scripts & dependencies
├── tailwind.config.ts         # Maps Tailwind color names → CSS variables
├── vite.config.ts             # Dev server port (8080), path alias "@/ → src/"
│
├── public/                    # Static files served as-is
│   ├── favicon.ico            # Myntmore triangle mark, multi-size .ico
│   ├── favicon-16x16.png / favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── placeholder.svg
│   └── robots.txt
│
└── src/
    ├── main.tsx                # React root — mounts <App /> into #root
    ├── App.tsx                 # Router + global providers (React Query, Tooltip, Toaster)
    ├── index.css                # ⭐ THEME FILE — all colors as CSS variables
    │
    ├── pages/
    │   ├── Index.tsx           # ⭐ THE APP — all state, all math, page layout, PDF export
    │   └── NotFound.tsx        # Catch-all 404 page
    │
    ├── components/
    │   ├── CalculatorInputs.tsx   # Left panel — every input field/slider
    │   ├── ResultsDashboard.tsx   # Right panel top — revenue/ROI/LTV cards
    │   ├── FunnelChart.tsx        # Right panel — the gold funnel visualization
    │   ├── RevenueChart.tsx       # Right panel — the Recharts line graph
    │   └── ui/                    # shadcn primitives (Button, Card, Slider, Select, etc.)
    │                               # Generated code — edit only for global style tweaks
    │
    ├── assets/
    │   └── logo.png             # Myntmore logo — used ONLY in the PDF export header now
    │
    ├── hooks/                   # use-toast, use-mobile — small utility hooks
    └── lib/
        └── utils.ts              # `cn()` — Tailwind class-merging helper used everywhere
```

**Rule of thumb:** almost everything you'll ever want to change lives in `src/pages/Index.tsx`, `src/components/*.tsx` (the four non-`ui` ones), and `src/index.css`. You should rarely need to touch `src/components/ui/`.

---

## 4. How It Works — Data Flow

Everything is driven from **one component**: `Index.tsx`. It owns all state and all math, then passes the results down as props.

```
Index.tsx (state + calculations)
   │
   ├──▶ CalculatorInputs.tsx   (renders inputs, calls setters on change)
   │
   ├──▶ ResultsDashboard.tsx   (renders computed totals — read-only)
   │
   ├──▶ FunnelChart.tsx        (renders funnelData array — read-only)
   │
   └──▶ RevenueChart.tsx       (renders month-by-month projection — read-only)
```

There is **no global state library** (no Redux/Zustand/Context) — it's plain `useState` in one component. This is a deliberate, appropriate choice for an app this size: one screen, one form, no persistence.

### The input state (all in `Index.tsx`)

| State variable | Default | Set by |
| --- | --- | --- |
| `currency` | `"USD"` | Currency dropdown |
| `connectionRequests` | `0` | "Monthly Outreach Volume" input |
| `acceptanceRate` | `0` | "Connection Acceptance Rate" slider |
| `replyRate` | `0` | "Response Rate" slider |
| `positiveResponseRate` | `50` | "Positive Response Rate" slider |
| `meetingRateFromPositive` | `30` | "Meeting Show-Up Rate" slider |
| `closingRate` | `0` | "Sales Conversion Rate" slider |
| `averageTicketPrice` | `0` | "Average Deal Value" input |
| `transactionsPerYear` | `1` | "Invoices Raised (per Year)" input |
| `monthsCustomerStays` | `0` | "Customer Retention Period" input |
| `duration` | `12` | "Duration" dropdown (1/3/6/12 months) |
| `monthlyCost` | `0` | "Monthly Investment with Myntmore" input |

Nothing is persisted — refreshing the page resets everything to these defaults.

---

## 5. Calculation Reference

All of this lives in `Index.tsx`, lines ~40–59. This is the "business logic" of the whole app — if a number on screen looks wrong, it traces back to here.

```
totalRequests        = connectionRequests × duration
acceptedConnections   = totalRequests × acceptanceRate%
replies                = acceptedConnections × replyRate%
positiveReplies        = replies × positiveResponseRate%
negativeReplies        = replies × (100 − positiveResponseRate)%
meetings                = positiveReplies × meetingRateFromPositive%

adjustedClosingRate    = min(closingRate + 1, 100)     ← see note below
deals                   = meetings × adjustedClosingRate%

fullLifetimeLTV         = averageTicketPrice × transactionsPerYear × (monthsCustomerStays ÷ 12)
coveredMonths            = min(duration, monthsCustomerStays)
effectiveLTV             = averageTicketPrice × transactionsPerYear × (coveredMonths ÷ 12)

revenue                  = deals × effectiveLTV
totalServiceCost         = monthlyCost × duration
roi                      = ((revenue − totalServiceCost) ÷ totalServiceCost) × 100   (0 if cost is 0)
```

### ⚠️ Important quirk: the "+1%" conversion uplift

`closingRate` (what the user types in) is **not** used directly for the deals calculation. The app silently adds **+1 percentage point** and caps at 100%:

```tsx
const adjustedClosingRate = Math.min(closingRate + 1, 100);
const deals = Math.round(meetings * (adjustedClosingRate / 100));
```

This is intentional — the UI is transparent about it, showing both "Input Rate" and "Adjusted Rate (used)" side by side in the Sales Conversion Rate card. If a stakeholder asks "why don't my numbers match a plain % calculation?", point them here. To remove the uplift entirely, change that one line to `const adjustedClosingRate = closingRate;`.

### LTV vs. Effective LTV — why two numbers?

- **Full Lifetime LTV** = what a customer is worth over their *entire* retention period, regardless of the ROI window you're calculating.
- **Effective LTV** = the *prorated* portion of that value that actually falls inside the selected `duration` (1/3/6/12 months). If `monthsCustomerStays` (12) is longer than `duration` (say, 3 months), only 3/12 of the lifetime value counts toward revenue for that window.

This prevents the calculator from overstating revenue when someone picks a short ROI window but a long retention period.

---

## 6. Component Reference

### `Index.tsx` — the page

- Owns all `useState` values and derived calculations (see §5).
- Renders the header (logo removed — see §9), the input panel, the results panel, and the footer.
- `handleExport()` — the PDF export flow (see §7).
- Layout: 12-column grid — inputs take `lg:col-span-4` (sticky), results take `lg:col-span-8`.

### `CalculatorInputs.tsx` — left panel

Pure "controlled inputs" component — every field's value and its setter are passed in as props from `Index.tsx`. It has three sections:

1. **Basic Settings** — Currency, Monthly Outreach Volume, Duration
2. **Conversion Rates** — five `<Slider>` components (Acceptance, Response, Positive Response, Meeting Show-Up, Sales Conversion) + one **read-only visual bar** for "Disengagement Rate (auto)" — this one isn't a slider, it's just `100 − positiveResponseRate` displayed for context.
3. **Revenue** — Average Deal Value, Invoices/Year, Retention Period, and two read-only LTV summary rows.

Every field has an info `<Tooltip>` (the small ⓘ icon) explaining what it means — check there first before assuming a field is unclear.

### `ResultsDashboard.tsx` — right panel, top half

Purely presentational — takes the calculated numbers as props and lays them out as cards:

- Total Revenue Generated / ROI (large highlight cards)
- Full vs. Effective LTV (side-by-side comparison)
- Sales Conversion Rate (Input → Adjusted, explaining the +1% uplift live)
- Five small metric cards (Total Requests, Accepted, Replies, Meetings, Deals) via an internal `MetricCard` helper.

### `FunnelChart.tsx` — the gold funnel

Hand-rolled (not a charting library) — each stage is a `<div>` whose width is `(value / firstStageValue) × 100%`, clamped to a minimum 20% so small numbers are still visible. Colored with an inline CSS gradient (`#FFC947 → #FFB627 → #FFA500`) rather than a theme variable, since the funnel is meant to always look gold regardless of light/dark theme. Negative Responses is filtered out of the funnel visualization (shown elsewhere, in ResultsDashboard, but not in this specific chart).

### `RevenueChart.tsx` — the line chart

A Recharts `<LineChart>` plotting **cumulative** Revenue, Service Cost, and Profit month-by-month across the selected `duration`. Three data series, all linear (revenue and cost are assumed flat per month and just multiplied out — there's no seasonality modeling). Custom tooltip component inside the file (`CustomTooltip`) controls what appears on hover.

### `src/components/ui/*`

Generated shadcn/ui primitives (Button, Card, Slider, Select, Tooltip, etc.) built on Radix UI. These are **not app-specific** — they're generic, reusable components. Don't hand-edit these to fix a one-off styling issue in the calculator; instead override via `className` where the component is *used*, or change the underlying CSS variables (§8). The one exception: if you want to change something globally (e.g. every button's default corner radius), editing here is correct.

---

## 7. PDF Export — how it works

Triggered by the "Export Results" button in the header (`handleExport` in `Index.tsx`):

1. `html2canvas` screenshots the results `<div>` (everything inside `resultsRef`, i.e. `ResultsDashboard` + the two charts) into a canvas, at 2× scale for print quality, with a forced white background.
2. That canvas becomes a PNG data URL.
3. A new A4 `jsPDF` document is created.
4. The Myntmore logo (`src/assets/logo.png`) is stamped at the top-left (10mm, 10mm, 40×10mm).
5. A black "ROI Calculator Results" title is drawn, centered.
6. The screenshot PNG is placed below the title, scaled to the full page width.
7. The file downloads as `roi-calculator-results.pdf`.

**Note:** the on-page header logo was removed (per a later request), but the logo is **intentionally still used in the PDF** — the `logo` import in `Index.tsx` exists solely for this PDF stamp. Don't remove `src/assets/logo.png` or that import without also removing this PDF step.

To change the PDF logo, title, or layout, edit the `handleExport` function directly — all the coordinates are in millimeters (A4 = 210mm × 297mm).

---

## 8. Design System / Theming

All colors are defined **once**, as HSL CSS variables in `src/index.css`, then mapped to Tailwind utility names in `tailwind.config.ts`. This means `bg-card`, `text-foreground`, `border-border`, etc. anywhere in the codebase all trace back to this one file.

### Current theme (light mode — white background, black text, gold accent)

| Variable | Value | Used for |
| --- | --- | --- |
| `--background` | `0 0% 100%` (white) | Page background |
| `--foreground` | `0 0% 0%` (black) | Default text |
| `--card` | `0 0% 100%` (white) | Card backgrounds |
| `--card-foreground` | `0 0% 0%` (black) | Text on cards |
| `--primary` / `--accent` | `45 100% 64%` (gold/amber) | Buttons, highlighted numbers, funnel-adjacent accents |
| `--primary-foreground` / `--accent-foreground` | `0 0% 0%` (black) | Text on gold backgrounds |
| `--secondary` | `0 0% 95%` (light gray) | Secondary surfaces, icon chips |
| `--muted` / `--muted-foreground` | `0 0% 90%` / `0 0% 35%` | De-emphasized backgrounds/text |
| `--border` / `--input` | `0 0% 85%` / `0 0% 95%` | Borders and input backgrounds |
| `--radius` | `1rem` | Global corner rounding |

**To re-theme the whole app** (e.g. switch back to dark mode, or rebrand colors): edit these variables in `src/index.css` — everything using Tailwind's semantic color classes (`bg-background`, `text-foreground`, `bg-accent`, etc.) updates automatically. You do **not** need to touch individual components for a global color change.

### Places that deliberately bypass the theme (hardcoded, not variables)

These were tuned by hand for light backgrounds and won't auto-update if you flip the theme back to dark — check them if you ever re-invert:

- **`FunnelChart.tsx`** — the gold gradient (`#FFC947`/`#FFB627`/`#FFA500`) and the `text-gray-900` percentage labels are hardcoded, by design, so the funnel always reads as "gold" regardless of theme.
- **`RevenueChart.tsx`** — grid/axis stroke colors (`hsl(0 0% 88%)`, `hsl(0 0% 40%)`) and the Cost/Profit tooltip text (`text-red-600`/`text-green-600`) are tuned for a *light* card background. The chart line colors themselves (gold/red/green) are theme-independent.
- **`Index.tsx`** PDF export — `html2canvas`'s `backgroundColor: "#ffffff"` and the `jsPDF` `setFillColor(255,255,255)`/`setTextColor(0,0,0)` calls are hardcoded to produce a white-page PDF regardless of the on-screen theme.

---

## 9. Branding & Assets

| Asset | File | Where it's used |
| --- | --- | --- |
| Logo (full, wordmark + icon) | `src/assets/logo.png` | **PDF export only** (see §7) — removed from the on-page header |
| Favicon (browser tab icon) | `public/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` | Linked in `index.html` `<head>` |
| Apple touch icon | `public/apple-touch-icon.png` | iOS "Add to Home Screen" icon |

The favicon files were generated by cropping just the triangle/mountain icon mark out of the full logo (not the wordmark), padded onto a square transparent canvas, and exported at multiple sizes. If the logo is ever redesigned, regenerate the favicon set the same way rather than squishing the full wide logo into a square.

To bring the logo back onto the page header, re-add an `<img src={logo} ... />` inside the `<header>` in `Index.tsx` (it's a one-line change — the `logo` import is already there for the PDF).

---

## 10. Currency Support

Currencies are defined as a **flat object literal**, duplicated in two places:

- `Index.tsx` — `const currencies = { USD: "$", INR: "₹", ... }` (symbol lookup for calculations/props)
- `CalculatorInputs.tsx` — `const currencies = [{ code, symbol, name }, ...]` (richer list, used to populate the dropdown)

**To add a new currency:** add it to *both* lists (they're not shared/imported from one source — this is a known duplication, not a bug). Also note: number formatting uses `locale = currency === 'INR' ? 'en-IN' : 'en-US'` in a few components (`CalculatorInputs`, `ResultsDashboard`, `RevenueChart`, `FunnelChart`) — India gets lakh/crore-style grouping, everything else gets standard thousands grouping. If you add another locale-sensitive currency, you'll want to extend that ternary into a lookup map instead.

---

## 11. Deployment (Vercel)

`vercel.json` (repo root):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- **`buildCommand`** — standard Vite production build.
- **`outputDirectory`** — Vite outputs to `dist/` by default; this tells Vercel where to serve from.
- **`rewrites`** — this is a single-page app using `react-router-dom`. Without this rewrite, refreshing on any non-root URL (or the 404 page) would 404 at the server level before React Router ever loads. This rewrite sends every path to `index.html` and lets React Router handle it client-side.

**To deploy:** push to GitHub, then import the repo in the Vercel dashboard (or run `vercel` from the CLI once linked). No environment variables are required.

---

## 12. Common Customizations (recipes)

| I want to... | Do this |
| --- | --- |
| Change the accent/brand color | Edit `--primary` and `--accent` in `src/index.css` |
| Switch back to dark mode | Invert the lightness values in `src/index.css` `:root` (see git history, commit `02a0518`, for the exact prior dark values) |
| Add a new currency | Add to `currencies` in **both** `Index.tsx` and `CalculatorInputs.tsx` |
| Change the +1% conversion uplift | Edit the `adjustedClosingRate` line in `Index.tsx` (§5) |
| Add a new input field | 1) add `useState` in `Index.tsx`, 2) pass value+setter down as props, 3) add the UI control in `CalculatorInputs.tsx`, 4) wire it into the calculation block in `Index.tsx` |
| Restore the logo to the on-page header | Add `<img src={logo} ... />` back into the `<header>` in `Index.tsx` (import already exists) |
| Change the PDF layout/title | Edit `handleExport()` in `Index.tsx` — all units are mm on an A4 canvas |
| Change the favicon | Replace `public/favicon.ico`  • the two PNGs + `apple-touch-icon.png`, keep the same filenames so `index.html` doesn't need edits |
| Change funnel colors | Edit the inline gradient string in `FunnelChart.tsx` (intentionally not theme-linked) |

---

## 13. Troubleshooting / FAQ

**"The numbers on screen don't match my manual math."**
Check the +1% conversion uplift (§5) — it's the most common source of "off by a little" confusion.

**"I changed a CSS variable and nothing happened."**
Make sure you're editing `src/index.css`, not `src/App.css` (the latter is unused Vite boilerplate — never imported anywhere; confirmed via `main.tsx`, which only imports `index.css`).

**"The revenue chart lines look empty right after the page loads."**
Recharts animates lines in on mount (`strokeDasharray` entrance animation). It resolves within ~1 second; it's not a bug, just don't screenshot immediately.

**"Slider drag isn't registering in an automated test / browser tool."**
Radix `<Slider>` thumbs respond reliably to click + arrow-key focus, not synthetic drag events in some headless tooling — click the thumb, then use arrow keys, or (for a quick visual check) temporarily hardcode `useState` defaults in `Index.tsx` and revert after.

**"Where's the backend / API?"**
There isn't one. This is 100% client-side; nothing is sent to a server, nothing is persisted.

---

## 14. Glossary

| Term | Meaning |
| --- | --- |
| **Acceptance Rate** | % of connection requests that get accepted |
| **Response/Reply Rate** | % of accepted connections that reply |
| **Positive Response Rate** | % of replies that express genuine interest |
| **Disengagement Rate** | The inverse of Positive Response Rate — replies that are *not* interested (auto-calculated, not user-set) |
| **Meeting Show-Up Rate** | % of positive replies that convert into a booked/attended meeting |
| **Sales Conversion Rate** | % of meetings that close as paid deals (user input — the app then adds +1pt internally) |
| **LTV** | Lifetime Value — total expected revenue from one customer |
| **Effective LTV** | LTV prorated to only the portion that falls within the selected ROI `duration` |
| **Duration** | The ROI measurement window (1/3/6/12 months) — affects both totals and how LTV is prorated |

---

*Last updated to match the codebase as of the light-theme conversion, PDF-export logo retention, and favicon setup work. If the calculations, components, or file layout change, update this manual alongside the code — treat drift here the same as a stale README.*