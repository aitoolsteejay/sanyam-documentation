# DM Angle Generator - Technical Guide

### **Route/page files**

- `app/tools/dm-angle-generator/page.tsx` — server component; sets page metadata (title, description, canonical URL) and renders `DmAngleGeneratorClient` inside `InnerLayout`.
- `app/tools/dm-angle-generator/DmAngleGeneratorClient.tsx` — the client component holding all state (`leadData`, `angles`, `lastInputs`, loading flags) and wiring together `LandingPage`, `LeadGate`, `InputPanel`, and `OutputSection`.

### **API endpoint(s)**

**`POST /api/tools/dm-angles`** (`app/api/tools/dm-angles/route.ts`)

- Request body: `{ industry: string, icpRole: string, offer: string, senderName?: string, senderCompany?: string }`
- Validation limits: `industry` ≤ 200 chars, `icpRole` ≤ 200 chars, `offer` ≤ 500 chars; all three of industry/icpRole/offer are required non-empty strings. `senderName`/`senderCompany` come from the captured lead (`leadData.name` / `leadData.companyName`) and are optional.
- Response (success): `{ angles: Array<{ id: string, label: string, message: string, reasoning: string }> }` — `id` is generated server-side as  `angle-${Date.now()}-${index}` .
- Response (error): `{ error: string }` with status 400 (validation) or 500 (missing API key / generation failure).

**`POST /api/tools/dm-angles/regenerate`** (`app/api/tools/dm-angles/regenerate/route.ts`)

- Request body: `{ angle: { label: string, message: string, reasoning?: string, ... }, style?: string }`. `style` is one of `"shorter"`, `"more formal"`, `"more direct"`, `"more friendly"`, or any other value (including undefined) which falls through to a generic "variation" instruction.
- Response (success): `{ angle: { label: string, message: string, reasoning: string } }` (no `id` field — the client re-attaches the original angle's `id` itself: `{ ...result.angle, id: angle.id }` in `DmAngleGeneratorClient.tsx`).
- Response (error): `{ error: string }`, status 400 (invalid angle shape) or 500.

### **AI model & prompting**

Both routes call the Gemini API directly via the `@google/genai` SDK (`GoogleGenAI` client, `ai.models.generateContent(...)`), using API key `process.env.GEMINI_API_KEY`. The model string used in both routes is exactly:

```
"gemini-2.5-flash"
```

There is no separate system-prompt field — each route builds a single combined prompt string (passed as `contents: prompt`) that mixes persona, task, and constraints.

**Main generation prompt** (`app/api/tools/dm-angles/route.ts`), built as a template literal with real interpolated values:

```
You are an expert at writing hyper-personalized, psychology-driven cold DMs that get replies. You understand the mental triggers that make people respond.

Your task: Generate 5 unique DM angles for reaching out to prospects in the ${industry.trim()} industry, specifically targeting ${icpRole.trim()} roles.

The offer being pitched: ${offer.trim()}${senderContext}

For each angle, create a short, conversational DM (2-4 sentences max) that:
- Opens with a pattern interrupt (no generic "Hi [Name]")
- Creates curiosity or emotional resonance
- Ends with a soft CTA (question or value offer, not hard sell)
- Feels personal, not templated

Use exactly these 5 psychological frameworks, one per angle, in this order:
1. Emotional Angle - trigger FOMO, desire, or pain relief
2. Authority Angle - position as expert, reference credibility
3. Social Proof Angle - leverage results, peer validation
4. Curiosity Angle - create intrigue, open loops
5. Value-First Angle - lead with insight or helpful resource

Respond in valid JSON matching the schema.
```

When both `senderName` and `senderCompany` are present, `senderContext` appends:

```
The sender's name is ${senderName} from ${senderCompany}. Subtly weave the sender's identity into messages where natural (for example, referencing what their company does or signing off with their first name).
```

**Regenerate prompt** (`app/api/tools/dm-angles/regenerate/route.ts`):

```
You are an expert at writing psychology-driven cold DMs.

You have this existing DM:
"${angle.message}"

It uses the ${angle.label} psychological framework.

Your task: ${styleInstruction(style || "variation")}

Keep the same psychological framework (${angle.label}) but create a fresh message that:
- Still opens with a pattern interrupt
- Creates curiosity or emotional resonance
- Ends with a soft CTA
- Feels personal and conversational

Respond in valid JSON matching the schema.
```

`styleInstruction(style)` maps to one of these literal instructions:

- `"shorter"` → `"Make it 1-2 sentences max, very punchy and direct."`
- `"more formal"` → `"Use more professional, business-appropriate language."`
- `"more direct"` → `"Be more assertive and confident. Skip the small talk."`
- `"more friendly"` → `"Use warmer, more conversational language, like messaging a friend."`
- default (anything else / no style) → `"Create a completely different variation using the same psychological framework."`

**Output-format enforcement**: Both calls set `config.responseMimeType: "application/json"` and pass an explicit `responseSchema` using `Type` from `@google/genai` (Gemini's structured-output/JSON-schema mode), not just prompt instructions:

- Generation route schema: `{ angles: Array<{ label: string (enum: ["Emotional Angle","Authority Angle","Social Proof Angle","Curiosity Angle","Value-First Angle"]), message: string, reasoning: string }> }`, all three sub-fields and the top-level `angles` array marked `required`.
- Regenerate route schema: `{ label: string, message: string, reasoning: string }`, all three required.

The route then does `response.text.trim()` and `JSON.parse(...)` on the raw model output to get the structured object.

### **Error handling / retries / rate limiting**

There is no retry logic and no rate limiting anywhere in these two route files — each call to Gemini is a single attempt. Both routes wrap their body in a single `try/catch`:

- On any thrown error (missing/invalid input, missing `GEMINI_API_KEY`, Gemini call failure, JSON parse failure) they log via `console.error("Error in dm-angles route:", error)` / `console.error("Error in dm-angles/regenerate route:", error)` and return `{ error: message }` with HTTP 500 (or 400 for input validation failures).
- If `GEMINI_API_KEY` is not set in the environment, both routes short-circuit and return a 500 with `{ error: "GEMINI_API_KEY is not configured" }` before ever calling Gemini.
- On the client (`DmAngleGeneratorClient.tsx`), fetch failures are caught and surfaced via `sonner` toast notifications ("Please try again", or the server's error message for the main generation call); there is no automatic client-side retry either — the user must click again manually.

### **Lead gate / lead capture**

Yes — this tool uses the shared `LeadGate` component (`components/tools/shared/LeadGate.tsx`) exactly like the other tools, with `source="dm_angle_generator"`. Key behavior:

- The input panel and output are only rendered once `leadData` is set in `DmAngleGeneratorClient`; until then, only the `LandingPage` and the `LeadGate` form are shown.
- Required fields: First Name, Last Name, Designation. Optional: Company Name, Phone, LinkedIn URL, Email (validated with a `zod` schema — email, if provided, must be valid).
- On submit, the real HTML form (hidden `target` iframe, `method="POST"`, `encType="multipart/form-data"`) posts directly to a dedicated Zoho Forms endpoint for this tool: `https://forms.zohopublic.com/flintstop/form/DMAngleGenerator/formperma/62jROMu8G-5OfsQqYL4Bfn4tL1ArsSVjbBXAJwbI4N8/htmlRecords/submit` (field names `SingleLine`, `SingleLine1`, `SingleLine2`, `SingleLine3`, `PhoneNumber_countrycode`, `Website`, `Email`).
- In parallel, the same data is inserted into a Supabase `leads` table (`source`, `name`, `email`, `phone`, `company_name`, `linkedin_url`, `metadata: { designation }`); the returned row `id` is stored in `leadData.id`.
- After the DM angles are generated (or regenerated), `DmAngleGeneratorClient.saveOutputs()` runs a Supabase `update` on that same `leads` row, writing `inputs: { industry, icpRole, offer }` and `outputs: { angles: outputAngles }` back onto the lead record — so the CRM/DB ends up with both the contact info and what they generated.
- `senderName` (the lead's name) and `senderCompany` (the lead's company) captured by the gate are passed into the main generation API call and, if both present, get woven into the Gemini prompt via `senderContext`.

### **Dependencies**

`@google/genai` (Gemini SDK, including its `Type` enum for JSON schema definitions), `zod` (lead form validation), `sonner` (toast notifications), Supabase client (`@/lib/supabase`) for lead/inputs/outputs persistence, Next.js API routes (`NextRequest`/`NextResponse`), and Zoho Forms (external CRM intake) via a hidden-iframe form POST.