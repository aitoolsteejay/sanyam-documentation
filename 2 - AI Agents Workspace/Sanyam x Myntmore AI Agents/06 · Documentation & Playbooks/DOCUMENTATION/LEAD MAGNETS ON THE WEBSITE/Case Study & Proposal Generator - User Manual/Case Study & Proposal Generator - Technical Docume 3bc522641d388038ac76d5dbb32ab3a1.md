# Case Study & Proposal Generator - Technical Documentation

### **Route/page files**

- `app/tools/case-study-generator/page.tsx` — server component; sets page metadata/canonical URL and renders `CaseStudyGeneratorClient` inside `InnerLayout`.
- `app/tools/case-study-generator/CaseStudyGeneratorClient.tsx` — the client-side state machine driving the whole flow (`landing` → `lead` → `mode` → `form` → `results`), holds `mode`, `leadData`, `caseStudyResult`/`proposalResult` state, calls the API route, and calls `saveOutputs` to persist inputs/outputs to Supabase.

### **API endpoint**

`POST /api/tools/case-study-generator` (file: `app/api/tools/case-study-generator/route.ts`). A single endpoint handles both modes via a `mode` field in the request body.

**Case study mode request body** (`mode: "case_study"`):

```
{
  mode: "case_study",
  clientIndustry: string,   // required, trimmed, max 200 chars
  problem: string,          // required, trimmed, max 1000 chars
  approach: string,         // required, trimmed, max 1000 chars
  result: string,           // required, trimmed, max 1000 chars
  testimonial: string       // optional, trimmed, max 1000 chars
}
```

**Proposal mode request body** (`mode: "proposal"`):

```
{
  mode: "proposal",
  prospectCompany: string,      // required, max 200 chars
  prospectIndustry: string,     // required, max 200 chars
  problemShared: string,        // required, max 1000 chars
  decisionMakerRole: string,    // required, max 200 chars
  budgetIndication: string,     // optional, max 200 chars
  howWeMet: "Referral" | "Inbound" | "Outbound" | "", // optional
  pastWins: string              // optional, max 1000 chars
}
```

Validation is done server-side (`validateCaseStudy` / `validateProposal`) and returns HTTP 400 with an `{ error: string }` body if a required field is missing after trimming (limits: 200 chars for "short" fields, 1000 chars for "long" fields, via a shared `LIMITS`/`trimTo` helper). An invalid/missing `mode` also returns 400.

**Case study mode response shape** (`CaseStudyOutput`, from `components/tools/case-study-generator/types.ts`):

```
{
  headline: string,
  stats: { value: string; label: string }[],
  problemParagraph: string,
  approachSteps: { title: string; description: string }[],
  resultsParagraph: string,
  pullQuote: string | null,
  servicesUsed: string[]
}
```

**Proposal mode response shape** (`ProposalOutput`):

```
{
  executiveSummary: string,
  understandingChallenge: string,
  approachPhases: { title: string; description: string }[],
  whyUs: string[],
  investment: string,
  nextStep: string,
  positioning: string
}
```

The route returns the parsed model JSON directly as the response body (no wrapper object) on success (200), or `{ error: string }` on failure (400 for validation, 500 for missing API key or thrown errors).

### **AI model & prompting**

The route calls the Gemini API directly via the `@google/genai` SDK (`GoogleGenAI` client, instantiated with `apiKey: process.env.GEMINI_API_KEY`). The exact model string used is:

```
model: "gemini-2.5-flash"
```

called through `ai.models.generateContent({ model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: <schema> } })`. Output format is enforced via Gemini's structured-output config: `responseMimeType: "application/json"` plus an explicit `responseSchema` built with `Type.OBJECT`/`Type.ARRAY`/`Type.STRING` from `@google/genai`, one schema per mode (`CASE_STUDY_SCHEMA`, `PROPOSAL_SCHEMA`), each with a `required` field list. The response is read from `response.text`, trimmed, and `JSON.parse`d.

Both prompts share a `NO_JARGON_RULE` constant prepended to every prompt:

> "Write in simple, everyday language. Short sentences, one idea per sentence. No jargon, no buzzwords ("synergy", "unlock", "leverage", "holistic", "cutting-edge"). Do not use em dashes or asterisks anywhere in your response."
> 

**Case study prompt** (`buildCaseStudyPrompt`) opens with "You are a sharp B2B copywriter turning a completed project into a case study for a service business's website," then injects the client industry, problem, approach, result, and testimonial (or the literal string "None provided" if testimonial is blank), followed by these rules (quoted verbatim from the code):

- "Do not invent numbers. Only put a number in "stats" if a real number appears in the result text above. If fewer than 3 real numbers exist, return fewer stats (even zero is fine)."
- "Do not invent a client quote. Only fill "pullQuote" if a testimonial was provided above, otherwise return null."
- "Structure the rough "what you did" notes into 2 to 3 clear phases, do not invent activities that were not implied."
- ""servicesUsed" should be 2 to 4 short service-category tags inferred from the approach (e.g. "Cold Email", "LinkedIn Outreach", "ICP Mapping & Lead Scoring"), not generic words."
- "The headline must be outcome-focused and specific to this project, not generic."

**Proposal prompt** (`buildProposalPrompt`) opens with "You are a senior strategist drafting a sales proposal for a service business to send to a prospect," then injects prospect company, prospect industry, the problem in the prospect's words, decision maker's role, budget indication (or "Not discussed"), how we met (or "Not specified"), and past wins (or "None provided"), followed by these rules (quoted verbatim):

- ""understandingChallenge" must mirror the prospect's own language from the problem they described, not generic filler."
- "Structure "approachPhases" into exactly 3 phases specific to their stated problem."
- ""whyUs" must draw only on the past results provided above. If none were provided, keep it generic and credibility-based (process, responsiveness, communication) and do not invent specific numbers or client names."
- ""investment" must literally be the placeholder text "Investment to be scoped based on your specific needs, happy to walk through pricing on a call." Do not invent a number."
- ""positioning" must follow exactly this format: "We help [specific prospect type] to [their desired outcome] by [specific method]"."

Both prompts end with "Return valid JSON matching the schema."

### **Error handling / retries / rate limiting**

There is no retry logic and no rate limiting anywhere in `route.ts`. The whole handler is wrapped in a single `try/catch`: any thrown error (missing/invalid mode, failed validation, missing `GEMINI_API_KEY`, a Gemini API failure, or a JSON parse failure on the model's output) is caught and logged via `console.error("Error in case-study-generator route:", error)`, then returned to the client as `{ error: message }` with status 500 (validation/mode errors return 400 explicitly before the try's Gemini call; the generic catch-all returns 500). On the client, `CaseStudyGeneratorClient.tsx` shows the returned error (or a generic fallback) via a `sonner` toast and simply leaves the user on the form step to retry manually — there is no automatic retry.

### **Lead gate / lead capture**

Yes, this tool gates the generator behind `components/tools/shared/LeadGate.tsx`, invoked in `CaseStudyGeneratorClient.tsx` with `source="case_study_generator"`. The lead form (first name, last name, designation — required; company, phone, LinkedIn URL, email — optional) is validated client-side with a `zod` schema, then on submit does two things in parallel: (1) submits the actual HTML form to a dedicated Zoho Forms endpoint for this tool (`case_study_generator` maps to `https://forms.zohopublic.com/flintstop/form/CaseStudyGenerator/formperma/.../submit`) via a hidden iframe target, so the lead lands in Zoho CRM without navigating away; and (2) inserts a row into a Supabase `leads` table (`source`, `name`, `email`, `phone`, `company_name`, `linkedin_url`, and a `metadata: { designation }` field), capturing the inserted row's `id`. Only after both complete does `onComplete` fire, advancing the flow to mode selection. Later, when the user generates a case study or proposal, `CaseStudyGeneratorClient.saveOutputs` updates that same Supabase `leads` row (`.update({ inputs, outputs }).eq("id", leadData.id)`) with the raw form inputs and the AI-generated output, so the business has a complete record of what each lead asked for and got back.

### **Dependencies**

- `@google/genai` (`GoogleGenAI`, `Type`) — direct Gemini API client and schema-typing helpers used in `route.ts`.
- `zod` — client-side validation schema for the lead form in `LeadGate.tsx`.
- `sonner` — toast notifications for success/error states (copy-to-clipboard, generation errors).
- Supabase client (`@/lib/supabase`) — used both by `LeadGate.tsx` (lead insert) and `CaseStudyGeneratorClient.tsx` (`saveOutputs` update) to persist lead + generated-content records.
- `lucide-react` — icons used throughout the landing page, forms, and results views.
- Zoho Forms (external, via hidden iframe POST) — the CRM system of record for captured leads, separate from the Supabase copy.