# Lead Magnet Idea Generator - Technical Docuementation

## Navigation & document status

- **Product hub:** [Lead Magnet Idea Generator](../Lead%20Magnet%20Idea%20Generator%20-%20User%20Manual%203bc522641d388054ba0acfc52b23df6c.md)
- **Related guide:** [Non-technical guide](Lead%20Magnet%20Generator%20-%20Non%20Technical%20Documentatio%203bc522641d38808192f4e406f5f7e0e7.md)
- **Central handover:** [Sanyam handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

**Verification note:** Confirm the current repository, environment, dependencies, security controls and deployment behavior before changing production.

**Maintenance rule:** Record the date, owner, tested environment, evidence, and any unverified or skipped checks when updating this document.

---

### **Route/page files**

- `app/tools/lead-magnet-ideas/page.tsx` — server component; sets page metadata (title/description/canonical) and wraps `LeadMagnetIdeasClient` in `InnerLayout`.
- `app/tools/lead-magnet-ideas/LeadMagnetIdeasClient.tsx` — client component; owns the `landing → lead → input → results` step state machine, form state, the fetch call to the API, clipboard-copy logic, and the Supabase update of lead outputs.
- `components/tools/lead-magnet-ideas/LandingPage.tsx` — the pure marketing/landing-page UI shown before the lead gate.
- `app/api/tools/lead-magnet-ideas/route.ts` — the Next.js API route that talks to Gemini.

### **API endpoint(s)**

**`POST /api/tools/lead-magnet-ideas`**

- Request body (JSON): `{ businessDescription: string, icp: string, industry: string, tone: string }`. Server-side limits enforced: `businessDescription` ≤ 1000 chars, `icp` ≤ 300 chars, `industry` ≤ 100 chars, `tone` ≤ 100 chars; all four fields are required non-empty strings, otherwise a 400 with `{ error: string }` is returned.
- Response (on success, 200): `{ ideas: Array<{ title: string, pitch: string, whyItWorks: string, distribution: string }> }` — this is the parsed Gemini JSON output returned as-is.
- Response (on failure, 500 or 400): `{ error: string }`.

### **AI model & prompting**

Calls Gemini directly via the `@google/genai` SDK (`GoogleGenAI` client), using `process.env.GEMINI_API_KEY`. No server framework/agent library in between.

Model string used: `"gemini-2.5-flash"` (via `ai.models.generateContent({ model: "gemini-2.5-flash", ... })`).

It is a **single combined prompt** (no separate system-prompt call) — one template literal string passed as `contents`. The actual prompt text (from `route.ts`) is:

```
You are a B2B outbound strategist who designs lead magnets founders can use in cold email and LinkedIn outreach to earn replies and book meetings.

BUSINESS: ${businessDescription.trim()}
TARGET AUDIENCE / ICP: ${icp.trim()}
INDUSTRY: ${industry.trim()}
PREFERRED TONE: ${tone.trim()}

Generate exactly 3 distinct lead magnet ideas this business could offer their ICP as part of outreach (things like calculators, benchmark reports, audits, templates, checklists, swipe files, or short assessments, not generic ebooks).

STRICT GUIDELINES:
- Each idea must be concrete and buildable, not a vague concept.
- Tailor every idea specifically to the stated business, ICP, and industry. Do not give generic advice that could apply to any company.
- Apply the requested tone in the pitch and copy.
- Avoid generic buzzwords (synergy, game changer, cutting-edge).
- The distribution field must name a specific outreach channel and moment (e.g. "Attach as a follow-up on LinkedIn after a connection accepts" or "Offer as the CTA in the third email of a cold sequence").

Respond in valid JSON matching the schema.
```

**Output-format enforcement**: uses Gemini's structured-output mode — `config.responseMimeType: "application/json"` plus an explicit `responseSchema` built with `Type.OBJECT` / `Type.ARRAY` / `Type.STRING`, requiring an `ideas` array of objects each with required `title`, `pitch`, `whyItWorks`, `distribution` string fields.

Server code then does `JSON.parse(response.text.trim())` and returns that parsed object directly as the API response.

### **Error handling / retries / rate limiting**

There is no retry logic and no rate limiting in this route. Input validation happens first (`validateInputs`, returning 400 with a specific message per missing/oversized field). Everything from the API-key check onward is wrapped in one `try/catch`: a missing `GEMINI_API_KEY` returns a 500 with `{ error: "GEMINI_API_KEY is not configured" }`; any other thrown error (including a Gemini API failure or a `JSON.parse` failure on malformed model output) is caught, logged via `console.error("Error in lead-magnet-ideas route:", error)`, and returned as a 500 with `{ error: error.message }` (or a generic fallback message if the error isn't an `Error` instance). There is no automatic retry of the Gemini call.

### **Lead gate / lead capture**

Yes — this tool uses the shared `components/tools/shared/LeadGate.tsx` component, invoked with `source="lead_magnet_ideas"`. The gate does two things on submit:

1. Submits a hidden HTML form (POST, `multipart/form-data`) to a dedicated Zoho form endpoint for this tool (`ZOHO_FORM_ACTIONS.lead_magnet_ideas`, a `forms.zohopublic.com` URL) via a hidden iframe target, so the lead lands in Zoho CRM without navigating away from the page.
2. In parallel, inserts a row into a Supabase `leads` table with `source: "lead_magnet_ideas"`, `name`, `email`, `phone`, `company_name`, `linkedin_url`, and `metadata: { designation }`, and captures the inserted row's `id`.

Once the visitor generates ideas, `LeadMagnetIdeasClient` updates that same Supabase lead row (`supabase.from("leads").update({ inputs: requestInputs, outputs: result }).eq("id", leadData.id)`) so the row ends up with both the form inputs and the generated ideas attached. Only first name, last name, and designation are actually required by validation (`leadSchema` in `LeadGate.tsx`); company, phone, LinkedIn, and email are optional.

### **Dependencies**

- `@google/genai` (Gemini SDK) for AI generation.
- `zod` for lead-form validation in `LeadGate`.
- Supabase client (`@/lib/supabase`) for storing leads and their inputs/outputs.
- Zoho Forms (external, via hidden iframe POST) as the CRM destination for captured leads.
- `sonner` for toast notifications (copy-to-clipboard feedback) and `lucide-react` for icons in the UI.