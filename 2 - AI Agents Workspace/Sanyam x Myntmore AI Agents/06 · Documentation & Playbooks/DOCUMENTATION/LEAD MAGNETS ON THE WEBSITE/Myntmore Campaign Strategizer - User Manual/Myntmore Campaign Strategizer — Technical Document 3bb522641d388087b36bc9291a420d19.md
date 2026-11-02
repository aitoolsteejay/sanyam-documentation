# Myntmore Campaign Strategizer — Technical Documentation

## Navigation & document status

- **Product hub:** [Campaign Strategizer](../Myntmore%20Campaign%20Strategizer%20-%20User%20Manual%203b4522641d3880caa5f1ee5e0e0decc0.md)
- **Related guide:** [Non-technical guide](Myntmore%20Campaign%20Strategizer%20%E2%80%94%20Non%20Technical%20Docu%203bb522641d3880248717c77ba8549c4b.md)
- **Central handover:** [Sanyam handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

**Verification note:** Confirm the current repository, environment, dependencies, security controls and deployment behavior before changing production.

**Maintenance rule:** Record the date, owner, tested environment, evidence, and any unverified or skipped checks when updating this document.

---

> **Document purpose:** This is the central operating manual for the Myntmore Campaign Strategizer. It explains how to use the product, where every part of the code lives, how campaign generation works, how to run and deploy the application, how saved clients are handled, and how to troubleshoot and maintain the project.
> 

**Repository:** aitoolsteejay/campaign-strategy
**Application type:** React + TypeScript single-page application with a Vercel server function
**Primary AI provider:** Google Gemini through `@google/genai`**Current client storage:** Browser `localStorage`**Planned client storage:** Supabase

---

# 1. Product overview

The Myntmore Campaign Strategizer is an internal tool for creating LinkedIn connection notes and follow-up sequences. A user describes a client, the ideal customer profile, the intended positioning, the offer, and the preferred CTA. The application converts those inputs into a campaign strategy and three message variations for each stage.

The current output contains:

- A campaign strategy summary
- Three connection-note versions
- One to three follow-up stages
- Three message versions for every follow-up stage
- Character counts and length warnings
- Section-level regeneration
- Tone adjustment
- Team-note-based regeneration
- One-click message copying

---

# 2. Current system status

## Working today

- The React interface and campaign form
- Saved client selection
- Adding and editing clients in the current browser
- Gemini campaign generation through `/api/generate`
- Vercel build configuration
- Connection-note and follow-up version switching
- Copy-to-clipboard
- Tone and team-note regeneration
- Production build and TypeScript compilation

## Current limitations

- Saved clients are stored only in the browser using `localStorage`.
- Client records do not sync across browsers, devices, or users.
- Clearing browser storage removes locally added or edited clients.
- There is no authentication or user-role system yet.
- Campaign outputs and campaign history are not saved.
- Generated messages cannot currently be edited inside the result cards.
- `npm run dev` starts only Vite and does not run the Vercel API function.
- Tailwind is currently loaded from `cdn.tailwindcss.com`, which works but produces a production warning.
- Supabase variables are not used until the Supabase integration is implemented.

---

# 3. User manual

## 3.1 Starting a campaign

Open the application and complete the form from top to bottom. The minimum fields required to generate a campaign are:

- Client Name
- What do they sell? (Outcome focused)

For higher-quality output, complete every relevant field.

## 3.2 Choosing a saved client

At the top of **Section A: Client Details**, open **Choose Saved Client**.

Selecting a saved client automatically fills:

- Client Name
- Company Name
- What do they sell? (Outcome focused)

The populated values remain editable.

### Saving edits to an existing client

1. Select a client from the dropdown.
2. Edit Client Name, Company Name, or the outcome-focused offering.
3. Select **Save Client Changes**.
4. Confirm that the "Client changes saved" message appears.

The change is saved in the current browser.

### Adding a new client

1. Open **Choose Saved Client**.
2. Select **＋ Add new client**.
3. Enter the client name, company name, and outcome-focused offering.
4. Select **Add Client**.
5. The new client will become available in the dropdown.

All three fields must be completed before the client can be saved.

## 3.3 Writing the outcome-focused offering

Describe the business result the client creates rather than only the product or service.

Weak example:

> They sell air purifiers.
> 

Strong example:

> They provide measurable indoor air protection that reduces health complaints, improves workplace experience, and maintains filtration performance through structured servicing.
> 

A useful outcome-focused description normally includes:

- What is being sold
- Who buys it
- What problem it solves
- What measurable or emotional result it creates
- Why it is different from alternatives

## 3.4 Client strategy fields

### Target Industry

The industries the campaign should address. Use a specific market when possible, such as "GCCs and tier-2 IT services firms" instead of "technology."

### Primary Problem Solved

The central business problem the campaign should highlight. Keep it direct and outcome-oriented.

### Core Narrative Angle

One or more strategic frames can be selected:

- Authority Builder
- Category Creator
- Contrarian POV
- Systems/Process Expert
- Personal Brand Growth
- Revenue/ROI Focused

Multiple angles may be selected.

### Tone Preference

Available tones are:

- Soft conversational
- Analytical
- Bold
- Minimal
- Strategic
- Direct but respectful
- Curious
- Insight-led

Only one tone is selected at a time.

## 3.5 ICP fields

### ICP Job Titles

Enter the roles that should receive the campaign, for example:

- Founder
- CEO
- CFO
- Head of HR
- Talent Acquisition Lead
- Engineering Director

### ICP Industry

Enter the recipient's industry, not necessarily the client's own industry.

### Primary Pain Points

Select one or more built-in pain points, or type a custom pain point into the small input and press **Enter**.

Built-in options include:

- Not generating inbound leads
- Inconsistent content
- Low engagement
- Poor positioning clarity
- No differentiation
- Struggling to convert attention
- Scaling but invisible

## 3.6 Campaign structure

### Number of Follow Ups

Use the slider to generate one, two, or three follow-up stages.

### Free Offer Type

Choose one:

- Free Tool
- Free Audit
- Free Consultation Call

If **Free Tool** is selected, two additional fields appear:

- Tool Name
- One-line description

### CTA Style

Choose one:

- Soft curiosity
- Direct ask
- Offer first, ask later

## 3.7 Initial strategic notes

Use **Initial Strategic Notes** for hard campaign-wide instructions. Examples:

- Avoid rhetorical questions.
- Do not mention audits.
- Keep sentences short.
- Lead with operational cost rather than growth.
- Do not sound overly warm.
- Avoid talking about inbound leads.

These notes are included in the initial generation prompt.

## 3.8 Generating the campaign

Select **Generate Campaign**.

During generation:

- The button becomes disabled.
- A loading indicator appears if no previous output is visible.
- The application sends the full campaign configuration to `/api/generate`.
- The Vercel server function sends the request to Gemini.
- The result is returned as structured JSON and rendered on the page.

## 3.9 Reviewing results

### Campaign Strategy Summary

Explains the positioning and messaging strategy selected by the model.

### Version buttons

Use **V1**, **V2**, and **V3** to switch between variations of a message.

### Character warnings

- Connection notes show a warning if they exceed 300 characters.
- Follow-ups show a warning if they contain fewer than 450 characters.

Warnings do not prevent copying or using a message.

### Copy Message

Select **Copy Message** to copy the currently visible version to the clipboard.

### Regenerate Section

Regenerates the selected connection note or follow-up section. The current implementation sends a regeneration instruction to the same campaign-generation endpoint.

### Tone adjustment

After a campaign is generated, use:

- Make Strategic
- Insight-led
- Make Curious

The entire campaign is generated again with the selected tone instruction.

### Refine With Team Notes

1. Enter revision instructions.
2. Select **Regenerate With Notes**.
3. The application generates a revised campaign while retaining the original structural rules.

---

# 4. Built-in AI rules

The primary prompt is stored in `geminiService.ts`.

The model is instructed to:

- Keep connection notes under 300 characters.
- Generate follow-ups of at least 450 characters.
- End every follow-up with a CTA.
- Produce three versions for every stage.
- Avoid robotic follow-up phrases.
- Avoid corporate buzzwords, hype, and aggressive selling.
- Allow `{firstname}`, `{lastname}`, and `{company}` placeholders.
- Make each version structurally distinct.
- Apply the selected tone, offer, CTA, pain points, and strategic notes.

## Banned-word protection

The word "help" and its variants are prohibited:

- help
- helping
- helped
- helpful

The prompt tells Gemini not to use them. After generation, `geminiService.ts` also performs a second programmatic replacement pass.

---

# 5. Technical architecture

## High-level data flow

```
User completes React form
        ↓
App.tsx builds CampaignConfig
        ↓
campaignApi.ts sends POST /api/generate
        ↓
api/generate.ts validates request and environment
        ↓
geminiService.ts builds the prompt and calls Gemini
        ↓
Gemini returns structured JSON
        ↓
Server returns CampaignOutput
        ↓
App.tsx renders ResultCard components
```

## Technology stack

| Area | Technology |
| --- | --- |
| Frontend | React 19 |
| Language | TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CDN utilities plus `index.css` overrides |
| AI SDK | `@google/genai` |
| Server API | Vercel Node function |
| Hosting | Vercel |
| Current client storage | Browser `localStorage` |
| Planned shared storage | Supabase |

---

# 6. Repository map

```
myntmore_campaign_strategizer/
├── api/
│   └── generate.ts
├── components/
│   ├── Header.tsx
│   ├── InputCard.tsx
│   ├── MultiSelect.tsx
│   └── ResultCard.tsx
├── docs/
│   └── Myntmore Campaign Strategizer - Complete Manual.md
├── .env.example
├── .gitignore
├── App.tsx
├── campaignApi.ts
├── clientPresets.ts
├── geminiService.ts
├── index.css
├── index.html
├── index.tsx
├── logo.png
├── metadata.json
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── types.ts
├── vercel.json
├── vite-env.d.ts
└── vite.config.ts
```

---

# 7. File-by-file guide

## `App.tsx`

The main application component. It owns most UI state and workflow logic.

Responsibilities:

- Stores the current `CampaignConfig`
- Renders every form section
- Loads saved clients
- Adds and updates saved clients
- Stores clients in `localStorage`
- Starts campaign generation
- Displays loading and error states
- Renders generated results
- Handles tone changes and team refinements

The local-storage key is:

```
myntmore-saved-clients
```

## `clientPresets.ts`

Contains:

- The `ClientPreset` interface
- The eight default client records

This file acts as the fallback client list when the browser has no stored client data.

Important behavior: after `localStorage` has been created, edits to `clientPresets.ts` will not automatically replace the browser's existing copy. Clear the local-storage key or add a migration strategy when default records change.

## `types.ts`

Contains the application's shared data contracts and option enums:

- `NarrativeAngle`
- `TonePreference`
- `PainPoint`
- `OfferType`
- `CTAStyle`
- `CampaignConfig`
- `MessageVersion`
- `MessageBlock`
- `CampaignOutput`

Change this file when adding a new form field that must be included in the campaign configuration or output.

## `campaignApi.ts`

The browser-side API client.

It sends:

```
POST /api/generate
Content-Type: application/json
```

Request body:

json

```json
{
  "config": {},
  "customInstruction": "optional instruction"
}
```

It converts non-successful responses into JavaScript errors.

## `api/generate.ts`

The server-side Vercel function.

Responsibilities:

- Accepts only `POST`
- Checks that `GEMINI_API_KEY` exists
- Validates Client Name and Product Outcome
- Calls `generateCampaign`
- Returns JSON
- Prevents raw server errors from being exposed to the browser

Expected response codes:

| Code | Meaning |
| --- | --- |
| 200 | Campaign generated |
| 400 | Required campaign input missing |
| 405 | HTTP method is not POST |
| 500 | Missing environment variable or generation failure |

## `geminiService.ts`

Server-only Gemini integration.

Responsibilities:

- Initializes the Gemini SDK
- Builds the complete prompt
- Defines the required JSON response schema
- Calls the configured Gemini model
- Parses the returned JSON
- Replaces banned words after generation

Do not import this file into browser-rendered React code. Doing so could expose server logic or secret-dependent code in the frontend bundle.

## `components/Header.tsx`

Renders the logo, application title, and subtitle.

## `components/InputCard.tsx`

Reusable visual wrapper for major form sections.

## `components/MultiSelect.tsx`

Reusable multi-choice input.

Supports:

- Selecting multiple options
- Removing a selected option
- Adding a custom option by pressing Enter when `allowCustom` is enabled

## `components/ResultCard.tsx`

Displays one connection-note or follow-up block.

Responsibilities:

- Switches between V1, V2, and V3
- Displays character counts
- Shows length warnings
- Copies the active message
- Starts section regeneration

## `index.tsx`

The React entry point. It mounts `App` into the `#root` element.

## `index.html`

The HTML shell.

Contains:

- The root application element
- Page title
- Tailwind CDN loader
- Google Inter font
- Base body and scrollbar styling

## `index.css`

Contains light-theme overrides for inputs, cards, text, borders, and hover states.

## `vite.config.ts`

Configures:

- React support
- Development port 3000
- Development host `0.0.0.0`
- `@` path alias pointing to the project root

It intentionally does not inject the Gemini key into the browser bundle.

## `vercel.json`

Tells Vercel to:

- Detect the project as Vite
- Run `npm run build`
- Publish `dist`

Vercel automatically detects the function inside `api/`.

## `.env.example`

Documents required environment variables without containing real secrets.

## `package.json`

Contains dependencies and scripts.

Current scripts:

bash

```bash
npm run dev
npm run build
npm run preview
```

## `metadata.json`

Contains descriptive application metadata. It is not currently part of the campaign-generation workflow.

---

# 8. Local development setup

## Requirements

- Node.js 20 or newer
- npm
- Git
- A Gemini API key
- Vercel CLI access for full local API testing

## Clone and install

bash

```bash
git clone https://github.com/aitoolsteejay/campaign-strategy.git
cd campaign-strategy
npm install
```

## Create the environment file

Create `.env.local`:

```
GEMINI_API_KEY=your_real_gemini_api_key
```

Never commit `.env.local`.

## Run the interface only

bash

```bash
npm run dev
```

This runs Vite and is suitable for interface work. It does **not** run `api/generate.ts`; campaign generation will fail in this mode unless a separate API-development setup is provided.

## Run the complete application locally

Use Vercel's local runtime:

bash

```bash
npx vercel dev
```

This is the preferred command when testing campaign generation because it runs both the Vite frontend and Vercel server function.

If the project is not linked yet, the CLI may ask you to log in and select or create a Vercel project.

## Production build

bash

```bash
npm run build
```

The build output is written to `dist/`.

## TypeScript check

bash

```bash
npx tsc --noEmit
```

Run both the production build and TypeScript check before pushing changes.

---

# 9. Environment variables

## Currently required

```
GEMINI_API_KEY=
```

This is server-only and must never use a `VITE_` prefix.

## Required after Supabase integration

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Full future environment file:

```
GEMINI_API_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Secret rules

- `GEMINI_API_KEY` must remain server-only.
- A Supabase anon key may be used in the frontend when Row Level Security is correctly configured.
- Never expose a Supabase service-role key through a `VITE_` variable.
- Never commit `.env.local` or real credentials.

# 10. Vercel deployment

## Initial deployment

1. Open Vercel.
2. Import `aitoolsteejay/campaign-strategy`.
3. Confirm the framework is Vite.
4. Add `GEMINI_API_KEY` under **Project Settings → Environment Variables**.
5. Add it to Production, Preview, and Development as appropriate.
6. Deploy.

The repository already contains the build settings in `vercel.json`.

## After Supabase integration

Also add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Redeploy after adding or changing environment variables.

## Updating production

Normal workflow:

bash

```bash
git checkout main
git pull origin main
git add <changed-files>
git commit -m "Describe the change"
git push origin main
```

If Git integration is enabled, pushing to `main` triggers a production deployment. Feature branches and pull requests normally create preview deployments.

---

# 11. Saved-client storage

## Current local-storage behavior

When the application first opens:

1. It checks `localStorage` for `myntmore-saved-clients`.
2. If a saved value exists, that becomes the client list.
3. If no value exists or parsing fails, `clientPresets.ts` becomes the client list.

When a client is added or edited, the entire client array is written back to `localStorage`.

## Resetting saved clients in a browser

Remove the `myntmore-saved-clients` local-storage entry and reload the application. The built-in records from `clientPresets.ts` will return.

Warning: this also deletes custom clients and unsynced edits from that browser.

## Planned Supabase behavior

After migration, the dropdown should load from `public.clients` instead of `localStorage`.

Recommended operations:

- `select` to load clients
- `insert` to add clients
- `update` to edit clients
- Optional `delete` or archive behavior

Until authentication is implemented, decide whether Supabase access will be mediated by secure Vercel API routes or whether users will sign in directly through Supabase Auth. Do not disable RLS just to make frontend requests work.

---

# 12. API reference

## `POST /api/generate`

Generates or regenerates a campaign.

### Request

json

```json
{
  "config": {
    "clientName": "Example Name",
    "companyName": "Example Company",
    "productOutcome": "Outcome-focused description",
    "targetIndustry": "Target industry",
    "primaryProblem": "Primary problem",
    "narrativeAngles": ["Authority Builder"],
    "tone": "Strategic",
    "icpJobTitle": "Founder",
    "icpIndustry": "Technology",
    "painPoints": ["No differentiation"],
    "followUpCount": 2,
    "offerType": "Free Audit",
    "ctaStyle": "Soft curiosity",
    "initialStrategicNotes": "Keep it concise."
  },
  "customInstruction": "Optional regeneration instruction"
}
```

### Successful response

json

```json
{
  "strategySummary": "...",
  "appliedConstraintsSummary": "...",
  "connectionNote": {
    "title": "...",
    "versions": [
      { "content": "..." },
      { "content": "..." },
      { "content": "..." }
    ]
  },
  "followUps": [
    {
      "title": "...",
      "subtitle": "...",
      "versions": [
        { "content": "..." },
        { "content": "..." },
        { "content": "..." }
      ]
    }
  ]
}
```

---

# 13. Common maintenance tasks

## Add a narrative angle

1. Open `types.ts`.
2. Add a value to `NarrativeAngle`.
3. Build and type-check.

`App.tsx` renders the enum automatically.

## Add a tone

Add a value to `TonePreference` in `types.ts`.

## Add an offer type

1. Add the value to `OfferType` in `types.ts`.
2. Update conditional UI in `App.tsx` if the new offer requires extra fields.
3. Update prompt wording in `geminiService.ts` if necessary.

## Add a CTA style

Add a value to `CTAStyle` in `types.ts`.

## Add a built-in pain point

Add a value to `PainPoint` in `types.ts`.

## Add a built-in client in code

Add another `ClientPreset` object to `clientPresets.ts`.

Remember that browsers with an existing `myntmore-saved-clients` value will continue using that stored list. A data migration or local-storage reset is required for an updated default list to appear automatically.

## Change campaign-writing rules

Edit the prompt inside `geminiService.ts`.

Review all of these areas after a prompt change:

- Connection-note constraints
- Follow-up length
- CTA rules
- Tone behavior
- Banned words
- Number of versions
- Output schema

## Change the Gemini model

Find the `model` property in `geminiService.ts` and replace it with a supported Gemini model identifier. Test structured JSON output before deployment.

## Change the output structure

Update all three layers together:

1. `CAMPAIGN_SCHEMA` in `geminiService.ts`
2. Output interfaces in `types.ts`
3. Rendering logic in `App.tsx` and/or `ResultCard.tsx`

---

# 14. Troubleshooting

## Campaign generation fails locally

### Symptom

The interface loads, but selecting **Generate Campaign** displays:

> Failed to generate campaign. Check your API key or parameters.
> 

### Most likely cause

The application was started with `npm run dev`. Vite does not execute the Vercel function in `api/generate.ts`.

### Resolution

bash

```bash
npx vercel dev
```

## Missing Gemini API key

### Symptom

The server returns a 500 response and indicates that `GEMINI_API_KEY` is not configured.

### Resolution

- Add `GEMINI_API_KEY` to `.env.local` for local use.
- Add it in Vercel Project Settings for hosted use.
- Restart the development server or redeploy.

## Saved clients disappeared

Possible causes:

- Browser storage was cleared.
- The application was opened in a different browser or device.
- Private/incognito browsing was used.
- The site's domain changed.

Until Supabase integration is complete, locally saved clients cannot be recovered from another device unless they were also added to `clientPresets.ts`.

## Changes to `clientPresets.ts` do not appear

The browser is probably using its existing local-storage copy. Remove `myntmore-saved-clients` from local storage and reload.

## Gemini returns malformed or unexpected output

Check:

- The selected model supports structured JSON responses.
- `CAMPAIGN_SCHEMA` matches the TypeScript output interfaces.
- The response text is non-empty before JSON parsing.
- Prompt changes did not contradict schema requirements.

## Connection note exceeds 300 characters

The UI warns the user but does not block the message. Regenerate the section or manually shorten it outside the current application.

## Follow-up is under 450 characters

The UI displays a warning. Regenerate the section with an instruction requesting more substance.

## Copy Message does not work

Clipboard access can be blocked in insecure contexts or by browser permissions. Test on HTTPS or localhost and check browser clipboard permissions.

## Tailwind production warning

The warning occurs because Tailwind is loaded from `cdn.tailwindcss.com`. The long-term resolution is to install Tailwind locally and compile it during the Vite build.

## Vercel deployment builds but generation fails

Check:

1. `GEMINI_API_KEY` exists in the correct Vercel environment.
2. A redeployment occurred after adding the variable.
3. `/api/generate` is visible as a deployed function.
4. Vercel function logs contain no Gemini SDK or model errors.
5. The Gemini API key has the correct access and quota.

---

# 15. Security checklist

- Keep `GEMINI_API_KEY` server-only.
- Never add secrets to `vite.config.ts` using `define`.
- Never prefix secret values with `VITE_`.
- Never commit `.env.local`.
- Keep Supabase Row Level Security enabled.
- Never expose a Supabase service-role key to browser code.
- Validate server request bodies before calling external APIs.
- Add authentication before storing sensitive client information in a shared database.
- Add rate limiting before exposing campaign generation broadly.
- Avoid returning raw provider errors to the browser.
- Review generated copy before sending it to prospects.

---

# 16. Pre-release checklist

## Code quality

- [ ]  `npm install` completes
- [ ]  `npm run build` passes
- [ ]  `npx tsc --noEmit` passes
- [ ]  No real credentials are present in tracked files
- [ ]  `.env.example` lists every required variable

## Functional checks

- [ ]  Page renders without an error overlay
- [ ]  Every saved client can be selected
- [ ]  Client fields populate correctly
- [ ]  Existing client edits can be saved
- [ ]  A new client can be added
- [ ]  Campaign generation completes through `npx vercel dev`
- [ ]  V1, V2, and V3 switch correctly
- [ ]  Copy Message works
- [ ]  Section regeneration works
- [ ]  Tone regeneration works
- [ ]  Team-note regeneration works
- [ ]  Character warnings appear correctly

## Deployment checks

- [ ]  Vercel is connected to the correct GitHub repository
- [ ]  `GEMINI_API_KEY` is configured
- [ ]  Supabase variables are configured after integration
- [ ]  Production deployment succeeds
- [ ]  `/api/generate` returns a successful response
- [ ]  No secret appears in the browser bundle
- [ ]  Production function logs show no unhandled errors

---

# 17. Recommended roadmap

## Priority 1: Supabase client library

- Replace `localStorage` with Supabase CRUD
- Add loading, empty, and database-error states
- Preserve the eight seed clients
- Add archive or delete behavior
- Add RLS and authentication

## Priority 2: Campaign history

Save campaign inputs, outputs, revisions, dates, and client relationships.

## Priority 3: Editable outputs

Allow direct editing, autosave, version history, and approval locking.

## Priority 4: Quality checker

Score character length, CTA presence, banned words, repetition, tone match, and personalization depth.

## Priority 5: Team workflow

Add draft, internal review, client review, approved, launched, and archived statuses.

## Priority 6: Prospect imports and analytics

Add CSV prospect imports, per-prospect personalization, and reply/meeting performance tracking.

---

# 18. Ownership and handover notes

Anyone taking over this project should first understand these four files:

1. `App.tsx` — interface and workflow state
2. `types.ts` — data contracts and form options
3. `api/generate.ts` — secure server boundary
4. `geminiService.ts` — prompt, schema, and AI-generation logic

Before making architectural changes:

- Pull the latest `main` branch.
- Create a separate feature branch.
- Preserve server-only handling of the Gemini key.
- Update types, API response schema, and rendering together.
- Test through the full Vercel development runtime.
- Update this manual when workflows, environment variables, storage, or deployment procedures change.

---

# 19. Importing this manual into Notion

1. Download or locate this Markdown file.
2. In Notion, open **Settings → Import** or select **Import** from the workspace sidebar.
3. Choose **Text & Markdown**.
4. Upload `Myntmore Campaign Strategizer - Complete Manual.md`.
5. Notion will convert headings, tables, lists, checkboxes, links, and code blocks into editable Notion blocks.

After importing, consider adding:

- A table of contents block at the top
- Page owners
- Last-reviewed date
- Links to the Vercel project and Supabase project
- A change log section for future releases

---

**Manual version:** 1.0
**Based on repository commit:** `2d3fb32`**Last reviewed:** 6 August 2026