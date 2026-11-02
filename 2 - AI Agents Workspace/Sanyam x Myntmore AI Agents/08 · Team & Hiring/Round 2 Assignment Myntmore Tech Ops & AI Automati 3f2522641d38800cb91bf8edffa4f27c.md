# Round 2 Assignment: Myntmore Tech Ops & AI Automations

Build a system that turns people who use our free tools into booked calls, plus a small tool that feeds it. Time: 3 days.

## The stack

Use the tools we use. The free plans are enough.

| For | Use |
| --- | --- |
| Automation | Make.com |
| AI | Google Gemini (`gemini-2.5-flash`), with a free API key from Google AI Studio |
| Database | Supabase |
| CRM | Zoho CRM |
| Web app | Next.js, code on GitHub, deployed on Vercel |
| Walkthrough video | Loom |

AI coding assistants such as Claude Code are fine, as long as you can explain what you built.

## Part 1: Lead follow-up engine (main task)

Visitors use our 9 free AI tools at [myntmore.com/resources/tools](https://www.myntmore.com/resources/tools). Each session is saved as one row: contact details, what they typed, and what the tool returned.

**Input:** the **Sample leads** section at the bottom of this page, with 20 fictional sessions. Some rows are messy on purpose. Import them into a Supabase table.

Build a Make.com scenario that:

1. **Cleans** the data. Handle duplicates, test entries and non-buyers on purpose, and record a reason. Never drop a row silently.
2. **Scores** each lead from 1 to 10 for fit with one of our services (personal branding, LinkedIn outreach, cold email, lead generation), with a one-line reason. Say which parts are rules and which are Gemini.
3. **Writes a follow-up email** with Gemini that uses what the lead typed and what the tool returned. It must have no jargon or em dashes, no invented numbers or claims, under 120 words, and only myntmore.com/founder-meeting as the call link.
4. **Routes** each lead: Hot (draft email plus an alert), Warm (one nurture email drafted) or Not a fit (tagged with the reason, no email).
5. **Pushes** every lead to Zoho CRM with its score, tier, reason and draft, and emails a daily summary: leads per tier and the top 3.

Drafts only. Send nothing to real people.

**Bonus:** enrich leads with company size, funding or LinkedIn activity. Show it on 3 real companies, since the sample people are fictional.

## Part 2: LinkedIn Hook Grader (a 10th free tool)

A visitor pastes the first two lines of a LinkedIn post and gets a score and 3 rewrites. Try our LinkedIn Profile Optimizer first to see the pattern.

1. Build it in Next.js and deploy it on Vercel. The flow is a landing screen, a contact form (name, designation, email), the tool, then the results.
2. Score the hook out of 100 with code, not AI: 4 to 6 rules, one line for each rule that fails. The same hook always gets the same score.
3. Get 3 rewrites from Gemini as structured JSON (`responseSchema`), following the Part 1 writing rules.
4. Save each session (contact, hook, score, rewrites) as one row in Supabase, and send it to your Part 1 scenario through a Make.com webhook.

One plain page is enough.

## Part 3: Ops judgement (written, 1 page max)

**3a. A silent bug.** Leads from the Battle Card and Case Study tools reach Zoho CRM, but Supabase has none of their sessions. The other 7 tools are fine. What is wrong, how do you fix it, and how do you stop it from failing silently again?

```sql
constraint leads_source_check check (source in (
  'roi_calculator', 'icp_builder', 'profile_optimizer',
  'dm_angle_generator', 'lead_magnet_ideas',
  'posting_rhythm_builder', 'founder_presence_analyzer'
))
```

```tsx
async function saveLead(source: LeadSource, lead: LeadForm) {
  postToZohoForm(source, lead);
  const { data, error } = await supabase
    .from("leads").insert({ source, ...lead }).select().single();
  if (error) console.error("lead insert failed", error);
  return data?.id; // later used to save the tool's inputs and outputs
}
```

**3b. A busy morning.** It is the 29th, 10 am, and you have a client call at 1 pm. In what order do you handle these, and why?

- The client dashboard shows blank numbers for every client.
- All 9 free tools return an error.
- A cold-email domain is flagged on a spam blacklist.
- The proxy plan behind our clients' LinkedIn outreach renews today, and the card has expired.
- The founder wants a new landing page live by 5 pm.

**3c. AI search.** Ask ChatGPT, Perplexity and Gemini 5 questions a potential client would ask. Does Myntmore appear, and who appears instead? Name the 3 website changes you would make first.

## What to submit

Within 3 days, email founder@myntmore.com and growth@myntmore.com with the subject "Round 2 Assignment – [Your Name]":

- [ ]  A Loom (7 minutes max): Part 1 running on the sample leads, then one Part 2 lead flowing through it
- [ ]  The Part 2 live URL and GitHub repo
- [ ]  Your Make.com scenario export (blueprint)
- [ ]  Zoho CRM screenshots or a CSV export of the processed leads
- [ ]  A 2-page doc: your scoring rules and your Part 3 answers

Keep API keys out of your repo and video. Questions are welcome: reply to the email that sent you this.

## How we evaluate

| Area | Weight (%) |
| --- | --- |
| It works end to end: Part 1 on the sample leads, and a Part 2 lead flowing through | 25 |
| Follow-ups are personal and follow the writing rules | 15 |
| Built to reuse: easy to add a tool or a rule, and failures are visible | 15 |
| Part 2: deployed, consistent score, structured AI output | 15 |
| Messy data handled on purpose | 10 |
| Part 3 judgement | 10 |
| Initiative and clear communication | 10 |

---

## Sample leads

20 fictional tool sessions, in the shape our database stores them. Every person and company is made up, and the web domains end in .example on purpose. Copy the CSV into a file called leads.csv.

| Column | What it holds |
| --- | --- |
| source_tool | Which of our free tools they used |
| designation | The job title they typed into the contact form |
| tool_input | What they typed into the tool |
| tool_output | What the tool gave back. Blank if they left before generating anything |

[leads.csv](Round%202%20Assignment%20Myntmore%20Tech%20Ops%20&%20AI%20Automati/leads.csv)