# Competitor Battle Card Generator - Technical Documentation

### **Route/page files**

- `app/tools/battle-card-generator/page.tsx` — server component, sets metadata (title/ description/canonical), wraps `BattleCardGeneratorClient` in `InnerLayout`.
- `app/tools/battle-card-generator/BattleCardGeneratorClient.tsx` — client component, owns the `step` state machine (`"landing" | "lead" | "form" | "results"`), calls the API, and writes results back to Supabase.
- `components/tools/battle-card-generator/LandingPage.tsx` — marketing/landing content only, no logic.
- `components/tools/battle-card-generator/BattleCardForm.tsx` — the input form (competitor name, competitor website, your company name, your offer).
- `components/tools/battle-card-generator/BattleCardResults.tsx` — renders the returned battle card, builds a plain-text export string (`buildFullText`) for the "Copy all" button.
- `components/tools/battle-card-generator/CopyButton.tsx` — generic clipboard-copy button used throughout the results view.
- `components/tools/battle-card-generator/types.ts` — shared `BattleCardInput`, `ObjectionEntry`, `BattleCardOutput` interfaces.

### **API endpoint(s)**

`POST /api/tools/battle-card-generator` (file: `app/api/tools/battle-card-generator/route.ts`)

- Request body (`RequestBody` interface):
    
    ```
    interface RequestBody {
      competitorName: string;
      competitorWebsite: string;
      yourCompanyName: string;
      yourOffer: string;
    }
    ```
    
    Server-side validation (`validate()`) requires non-empty `competitorName`, `yourCompanyName`, and `yourOffer` (trimmed); `competitorWebsite` is optional. Inputs are trimmed and length-capped via `trimTo()` — short fields (`competitorName`, `competitorWebsite`, `yourCompanyName`) capped at 200 chars, `yourOffer` capped at 1000 chars.
    
- Response shape on success (200), matches `BattleCardOutput`:
    
    ```
    {
      competitorName: string;
      whatTheyDo: string;
      pricingModel: string;
      strengths: string[];
      gaps: string[];
      howToPosition: string;
      objectionResponses: { objection: string; response: string}[];
      researchNote: string;
    }
    ```
    
- Error responses: `400` with `{ error: "Competitor name is required" }` (or the equivalent for the other two required fields) on validation failure; `500` with `{ error: "GEMINI_API_KEY is not configured" }` if the env var is missing; `502` with `{ error: "Could not research this competitor. Please try again." }` if the research call returns no text; `500` with `{ error: <message> }` for any other thrown error (caught in a top-level try/catch).

### **AI model & prompting**

- Library: `@google/genai` (`GoogleGenAI`, `Type`), instantiated as `new GoogleGenAI({ apiKey })` with `apiKey = process.env.GEMINI_API_KEY`.
- Model string used for **both** calls: `"gemini-2.5-flash"`.

**This tool genuinely performs live web research, not just model-knowledge prompting.** The route makes two sequential model calls:

**Step 1 — research call, with live Google Search grounding actually invoked**:

```
const researchResponse= await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: buildResearchPrompt(cleanBody),
  config: {
    tools: [{ googleSearch: {} }],
  },
});
```

The code comment directly above this confirms the intent and a real technical constraint: `// Step 1: research the competitor with live Google Search grounding. Gemini's API does not support combining a search tool with strict responseSchema output in the same call, so this returns plain text, not JSON.` The prompt (`buildResearchPrompt`) literally opens with "Search for and research this company: ${competitorName}..." and asks for four things: what they do/who they sell to, pricing if publicly findable ("If you cannot find real pricing information, say clearly that pricing is not publicly available, do not guess a number"), user/reviewer-reported strengths, and user/reviewer-reported weaknesses. It ends with: "Be factual. If you cannot find something, say so explicitly rather than filling in a plausible-sounding guess."

Because the `googleSearch` tool is attached in `config.tools`, this call is Gemini's server-side grounded search feature — a real, live web search is performed by Google's infrastructure as part of answering the prompt, not a local `fetch`/scrape by this codebase. Output is plain text (`researchResponse.text`), trimmed; if empty, the route returns the 502 error above.

**Step 2 — structuring call, no search tool, JSON-schema enforced output**:

```
const structuredResponse= await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: buildStructuringPrompt(cleanBody, researchText),
  config: {
    responseMimeType: "application/json",
    responseSchema: BATTLE_CARD_SCHEMA,
  },
});
```

This second call does **not** re-search the web; it feeds step 1's research text back in as context and asks the model to reformat/tailor it. The prompt (`buildStructuringPrompt`) opens: "You are a sales enablement strategist. Using ONLY the research below, build a sales battle card for a rep at "${yourCompanyName}" who is selling against "${competitorName}"." followed by the user's own offer description and the full step-1 research text verbatim, then a rules list including: "Do not invent facts, pricing, or numbers that are not in the research above," "'strengths' and 'gaps' must come from the research above, not generic competitor cliches," "'howToPosition' and 'objectionResponses' must be specific to OUR offer," "'objectionResponses' should cover 3 to 4 realistic objections...," "'researchNote' must be one sentence reminding the rep that pricing and features change, and to verify anything specific directly before relying on it in a live call," and a style rule to avoid jargon, em dashes, and asterisks. It ends with "Return valid JSON matching the schema."

Output enforcement: `responseMimeType: "application/json"` plus an explicit `responseSchema` (`BATTLE_CARD_SCHEMA`, built with the SDK's `Type` enum) mirroring the `BattleCardOutput` TypeScript interface exactly, with all eight fields marked `required`. The route parses this with a plain `JSON.parse(structuredResponse.text.trim())` — no try/catch specifically around the parse (a parse failure would be caught by the outer route-level try/catch and returned as a 500).

**Bottom line for the honesty check**: the landing page's "we research them live" / "Grounded in real research... live search on the actual competitor" claims are accurate to the code — the first Gemini call really does invoke Google Search grounding (`tools: [{ googleSearch: {} }] }`), and that search's text output is what feeds the second, JSON-schema-constrained call. It is a single grounded search pass (not iterative multi-query deep research, not a raw web-fetch by this app's own code, and no citations/URLs are surfaced anywhere in the UI or response shape), but it is not model-knowledge-only despite the two-step design.

### **Error handling / retries / rate limiting**

There is no retry logic and no rate limiting anywhere in this route. It's a single try/catch wrapping the whole `POST` handler: validation errors return 400, missing API key returns 500, empty research text returns 502, and any other thrown error (including a failed Gemini call, JSON parse failure, or Zoho/Supabase issues — though those aren't in this file) falls through to a generic 500 with `error.message` or a fallback string. No exponential backoff, no queuing, no per-IP or per-session throttling is implemented in this file. On the client, `BattleCardGeneratorClient.handleGenerate` catches fetch/JSON errors and shows a `toast.error` with the message (or a generic "Something went wrong, please try again"); it does not retry automatically.

### **Lead gate / lead capture**

Yes, this tool uses the shared `components/tools/shared/LeadGate.tsx` component, gating the actual input form behind it (`step === "lead"` before `step === "form"` in `BattleCardGeneratorClient`). It's invoked with `source="battle_card_generator"`, `heading="Tell Us About You"`, `description="Enter your details to start researching."`. On submit, `LeadGate`:

1. Posts the form (First/Last Name, Designation, Company, Phone, LinkedIn URL, Email) to a dedicated Zoho form via a hidden iframe, using action URL `ZOHO_FORM_ACTIONS.battle_card_generator = "https://forms.zohopublic.com/flintstop/form/Battlecardgenerator/formperma/L6FLsnJj7kt0kDqoENc2F2Drbuo22v376RxReGr9t58/htmlRecords/submit"` (its own dedicated form, not the shared fallback form some other tools use).
2. In parallel, inserts a row into a Supabase `leads` table (`source`, `name`, `email`, `phone`, `company_name`, `linkedin_url`, `metadata: { designation }`), and captures the inserted row's `id`.
3. Calls `onComplete` with the lead data including that Supabase row `id`.

Back in `BattleCardGeneratorClient`, that `id` is later used in `saveOutputs()` to `update` the same Supabase `leads` row with the tool's `inputs` (the battle-card form data) and `outputs` (the generated battle card JSON) once generation succeeds — so the full input/output pair ends up attached to that lead's record for later reference.

### **Dependencies**

- `@google/genai` (`GoogleGenAI`, `Type`) — the Gemini API client, including its Google Search grounding tool.
- `@/lib/supabase` — Supabase client used both for lead insertion (in `LeadGate`) and for writing back inputs/outputs (in `BattleCardGeneratorClient`).
- `zod` — validates the lead form fields client-side in `LeadGate`.
- `sonner` — toast notifications for copy success/failure and generation errors.
- `lucide-react` — icons used throughout the landing page, form, and results views.
- Zoho Forms (external, via hidden iframe POST) — the CRM destination for lead capture, independent of Supabase.