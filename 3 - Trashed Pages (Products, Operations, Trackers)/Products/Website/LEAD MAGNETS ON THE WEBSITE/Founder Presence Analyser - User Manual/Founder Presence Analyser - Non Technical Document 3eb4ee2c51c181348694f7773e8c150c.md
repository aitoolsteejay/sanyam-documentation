# Founder Presence Analyser - Non Technical Documentation

### **What it does**

The Founder Presence Analyzer is a free interactive tool on the Myntmore website that helps a startup founder understand how their personal LinkedIn presence stacks up against their competitors. Instead of guessing whether posting more or engaging more actually matters, the founder enters their own posting frequency and engagement over the last 30 days, then does the same for up to five named competitors. The tool crunches these numbers into a single "Founder Presence Score" and hands that off to an AI model that produces a short written interpretation, a list of opportunity areas, a positioning recommendation, and three ready-to-use LinkedIn headline options.

It exists as a lead-generation and credibility-building asset for Myntmore, a firm that helps founders build their personal brand and pipeline. The tool is free to use, but before a visitor can see their results they must first fill out a short contact form (name, company, designation, email, phone, LinkedIn URL), which is captured as a sales lead. After the analysis, the results page ends with a call-to-action inviting the visitor to book a strategy call with Myntmore.

In short: it's a benchmarking quiz dressed up as an analytics dashboard, whose real purpose is (1) to give founders a genuinely useful, personalized data point about their LinkedIn presence, and (2) to capture qualified leads (founders who care about their personal brand) for Myntmore's sales pipeline.

### **How someone uses it, step by step**

1. **Landing page** (`LandingPage.tsx`): The visitor arrives at `/tools/founder-presence-analyzer` and sees a marketing page — hero section ("See How You Really Stack Up"), a "problem" section (posting blind, no competitor visibility, weak headline), a "how it works" walkthrough, and value propositions. Clicking "Analyze My Presence" starts the flow.
2. **Lead gate**: Before any wizard step, the visitor must fill out a form (First Name, Last Name, Designation, Company, Phone, LinkedIn URL, Email — only first name/last name/ designation are strictly required). Submitting this both posts to a Zoho CRM form in a hidden iframe and inserts a row into the app's own Supabase `leads` table.
3. **Step 1 — "Your Activity"**: The user picks their own LinkedIn posting frequency over the last 30 days (0, 1–2, 3–5, 6–10, or 10+ posts) and their average engagement per post (<20, 20–50, 50–100, 100–250, or 250+ likes).
4. **Step 2 — "Competitors"**: The user adds 1–5 competitors, each with a name, a posting frequency, and an engagement bracket (same option sets as above). "Continue" is disabled until every added competitor has a name.
5. **Step 3 — "Content Themes"**: The user picks (multi-select, from a fixed list of 9 topics like "Hiring / Recruiting," "AI & Automation," "Founder Journey," etc.) which topics they mostly post about, and which topics their competitors mostly post about.
6. **"Ready for Analysis" screen**: A confirmation screen addressed to the lead by first name ("Thanks, {name}. We're ready to calculate your competitive gap.") with a single button to trigger the AI call.
7. **Results dashboard**: Once the AI responds, the user sees:
    - A **Score Ring** — a circular progress indicator showing their 0–100 "Founder Presence Score," plus an italicized AI-written one-line insight about that score.
    - A **Posting Frequency Comparison table** listing "You" (highlighted) versus each named competitor, side by side on frequency and engagement.
    - An **Engagement Gap Chart** — a two-bar chart comparing the user's average engagement score against the competitors' average engagement score.
    - **Key Opportunity Areas** — a bulleted list (checkmarks) of 3–4 AI-generated insights about frequency gaps, visibility, or narrative gaps.
    - **Positioning Recommendation** — a short AI-written paragraph suggesting a narrative angle.
    - **Three headline suggestions** — "Category Leadership," "ICP Clarity," and "Bold Differentiation" styled headlines, each with a "Copy Headline" button.
    - A closing call-to-action to book a strategy call with Myntmore (`/founder-meeting`).