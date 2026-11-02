# Competitor Battle Card Generator - Non Technical Documentation

### **What it does**

This is a free tool on the Myntmore site that helps a salesperson prepare for the moment a prospect says "we're also looking at [Competitor X]." The user types in a competitor's name (and optionally their website), plus a bit about their own company and what they sell. The tool then researches the competitor and hands back a one-page "battle card": what the competitor does, their pricing if it's publicly available, their real strengths and weaknesses (based on what reviewers/users actually say), specific advice on how to position against them, and 3-4 realistic objections a prospect might raise, each with a ready-made answer.

Unlike most AI writing tools that just make things up from the model's training data, this one is explicitly designed to actually look things up: it runs a live Google Search through Gemini before writing anything, and it's instructed to say "not publicly available" rather than invent a pricing figure or a fake strength/weakness. That said, it is not a deep-research tool — it's a single search-grounded pass, not multiple searches, page-by-page crawling, or citation-by-citation verification.

It exists to save a sales rep the 20-30 minutes of manually digging through a competitor's website, pricing page, and review sites before every call, and to make sure the answer they give in the moment is grounded in something real rather than an improvised guess.

Before a user can generate a card, they have to fill out a lead-capture form (name, company, designation, etc.) — this is how Myntmore captures the visitor's contact details in exchange for the free tool, the same pattern used across their other tools.

### **How someone uses it, step by step**

1. User lands on `/tools/battle-card-generator`, sees a marketing landing page ("Never Lose A Deal To A Competitor You Understand Better") describing the tool and clicking "Build My Battle Card."
2. This reveals the `LeadGate` form: First Name, Last Name, Designation (all required), plus optional Company, Phone, LinkedIn URL, Email. Submitting this both silently posts to a Zoho CRM form (via a hidden iframe) and inserts a row into a Supabase `leads` table.
3. After the lead form, the user sees the actual input form (`BattleCardForm`) asking for:
    - Competitor Name (required)
    - Competitor Website (optional, "Helps us find the right company")
    - Your Company Name (required)
    - What You Sell, And To Whom (required, textarea, "the more specific, the sharper the positioning and objection answers")
4. Clicking "Generate Battle Card" shows a loading state ("Researching and building your battle card...") while the API call runs.
5. Results (`BattleCardResults`) show: competitor name heading, "What They Do," a pricing box, two side-by-side lists ("Their Strengths" / "Their Gaps"), a highlighted "How To Position Against Them" block, 3-4 "Objection Responses" as Q&A pairs, and a caution note (`researchNote`) reminding the rep to verify anything specific before a live call. Every section (and the whole card) has a "Copy" button. A "Research Another Competitor" button resets back to the input form (bypassing the lead gate on repeat use in the same session).
6. The generated input/output is also written back into the same Supabase `leads` row created at step 2, via a follow-up `.update()` call keyed on the lead's id.