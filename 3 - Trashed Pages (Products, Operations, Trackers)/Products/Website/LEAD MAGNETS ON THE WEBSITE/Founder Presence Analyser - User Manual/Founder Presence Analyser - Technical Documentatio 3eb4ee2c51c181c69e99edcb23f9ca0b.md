# Founder Presence Analyser - Technical Documentation

### **Route/page files**

- `app/tools/founder-presence-analyzer/page.tsx` — server component; sets metadata/canonical URL, wraps `FounderPresenceClient` in `InnerLayout`.
- `app/tools/founder-presence-analyzer/FounderPresenceClient.tsx` — the entire client-side wizard/state machine and results rendering.

### **API endpoint(s)**

**`POST /api/tools/founder-presence`** (`app/api/tools/founder-presence/route.ts`)

- **Request body**: `{ input: UserInput, calculated: CalculatedData }`, where the client builds these from all wizard steps:
    
    ```
    interface UserInput {
      frequency: string;          // e.g. "3–5" (Step 1)
      engagement: string;         // e.g. "50–100 likes" (Step 1)
      userTopics: string[];       // Step 3 selections
      competitorTopics: string[]; // Step 3 selections
      competitors: Competitor[];  // Step 2
    }
    interface Competitor {
      id: string;
      name: string;
      frequency: FrequencyOption;
      engagement: EngagementOption;
    }
    interface CalculatedData {
      userFreqScore: number;
      userEngScore: number;
      compAvgFreqScore: number;
      compAvgEngScore: number;
      finalPresenceScore: number;
    }
    ```
    
    Note: `finalPresenceScore` and the other `calculated` values are computed **client-side only** (in `FounderPresenceClient.tsx`'s `useMemo`), not by the API — the API just receives the already-computed numbers and asks the AI to narrate them. `frequency`/`engagement` map to numeric weights via fixed lookup tables (`FREQUENCY_MAP`: 0→0, "1–2"→1.5, "3–5"→4, "6–10"→8, "10+"→12; `ENGAGEMENT_MAP`: "<20 likes"→10, "20–50 likes"→35, "50–100 likes"→75, "100–250 likes"→175, "250+ likes"→300), and the score formula is `freqRatio * 50 + engRatio * 50`, clamped to [0, 100].
    
- **Response shape** (JSON returned directly to the client, becomes `AIAnalysisResult`):
    
    ```
    {
      scoreInsight: string;
      opportunityAreas: string[];
      narrativePositioning: string;
      headlineSuggestions: {
        categoryLeadership: string;
        icpClarity: string;
        boldDifferentiation: string;
      };
    }
    ```
    
    There is no separate scoring/gap endpoint — the score ring uses `calculated.finalPresenceScore` (client-computed) and the gap chart uses `calculated.userEngScore` vs `calculated.compAvgEngScore` (also client-computed). The AI response only supplies the narrative/text fields layered on top of those numbers.
    

### **AI model & prompting**

Calls Gemini **directly** inside `route.ts` via `@google/genai`'s `GoogleGenAI` client, using `apiKey` from `process.env.GEMINI_API_KEY`.

Model string used: **`"gemini-2.5-flash"`**.

It's a **single combined prompt** (no separate system prompt) passed as `contents` to `ai.models.generateContent`. The real prompt template (from `route.ts`):

```
Analyze this LinkedIn founder presence data for a "Myntmore" competitor tool.

DATA:
- Founder Presence Score: ${calculated.finalPresenceScore}/100
- Founder Frequency: ${input.frequency} posts/month (Numeric weight: ${calculated.userFreqScore})
- Founder Avg Engagement: ${input.engagement} (Numeric weight: ${calculated.userEngScore})
- Competitor Avg Frequency weight: ${calculated.compAvgFreqScore}
- Competitor Avg Engagement weight: ${calculated.compAvgEngScore}
- Founder Topics: ${input.userTopics.join(", ")}
- Competitor Topics: ${input.competitorTopics.join(", ")}

TONE:
Direct, data-driven, slightly urgent, helpful, SaaS-premium.

REQUIRED OUTPUT:
1. A short insight about the presence score.
2. 3-4 bullet insights for opportunity areas (frequency gaps, visibility, narrative).
3. A narrative positioning recommendation (1 paragraph).
4. 3 headline styles: Category leadership, ICP clarity, and Bold differentiation.

Respond in valid JSON matching the schema.
```

**Output-format enforcement**: JSON mode via `config: { responseMimeType: "application/json", responseSchema: {...} }`, with an explicit schema built from `Type.OBJECT` / `Type.STRING` / `Type.ARRAY` requiring `scoreInsight`, `opportunityAreas`, `narrativePositioning`, and `headlineSuggestions` (itself requiring `categoryLeadership`, `icpClarity`, `boldDifferentiation`). The route then does `(response.text || "").trim()` and `JSON.parse(...)` on it before returning it to the client.

### **Error handling / retries / rate limiting**

No retry logic and no rate limiting exist in this route. The entire handler is wrapped in a single `try/catch`. On any failure (missing `input`/`calculated`, missing `GEMINI_API_KEY`, a thrown error from the Gemini call, or a `JSON.parse` failure on malformed model output), it returns `NextResponse.json({ error: ... }, { status: 400 or 500 })` and logs `"Error in founder-presence route:"` to the server console. On the client, `FounderPresenceClient.tsx`'s `handleRunAnalysis` catches fetch/response errors and shows a generic toast: "Something went wrong. Please check your internet connection and try again." There is no automatic retry — the user must click "Analyze My Competitive Presence" again.

### **Lead gate / lead capture**

Yes — this tool uses the shared `LeadGate` component (`components/tools/shared/LeadGate.tsx`) with `source="founder_presence_analyzer"`, rendered as the first interactive step after the landing page (before any wizard input is collected). On submit, `LeadGate`:

1. Submits the visible form directly to a dedicated Zoho CRM form endpoint for this tool (`ZOHO_FORM_ACTIONS.founder_presence_analyzer`, a `forms.zohopublic.com/flintstop/form/FounderPresence/...` URL) via a hidden iframe target, so the CRM lead is created without navigating away from the page.
2. In parallel, inserts a row into the app's own Supabase `leads` table (fields: `source`, `name`, `email`, `phone`, `company_name`, `linkedin_url`, `metadata: { designation }`).
3. Calls `onComplete(leadData)`, which in `FounderPresenceClient.tsx` stores the lead (including the Supabase row `id`) in state and advances to the "activity" wizard step.
4. Later, once the AI analysis completes, `FounderPresenceClient.tsx` performs a follow-up Supabase update (`supabase.from("leads").update({ inputs: {...formData, calculated}, outputs: result }).eq("id", leadData.id)`) to attach the full wizard inputs and the AI's output back onto that same lead row — so the CRM/DB record captures not just contact info but what the person actually entered and what analysis they received.

### **Dependencies**

- `@google/genai` (`GoogleGenAI`, `Type`) — direct Gemini API client, used only in `route.ts`.
- `recharts` (`BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`, `Cell`) — used by `GapChart.tsx`.
- Raw inline SVG (no charting library) for `ScoreRing.tsx`'s circular progress ring.
- `@/lib/supabase` — Supabase client, used both in `LeadGate.tsx` (lead insert) and `FounderPresenceClient.tsx` (inputs/outputs update).
- `zod` — validates the lead form fields in `LeadGate.tsx`.
- `sonner` (`toast`) — error toast in `FounderPresenceClient.tsx`.
- `lucide-react` — icons used throughout (`LandingPage.tsx`, wizard UI).
- Next.js `NextRequest`/`NextResponse` — API route plumbing.