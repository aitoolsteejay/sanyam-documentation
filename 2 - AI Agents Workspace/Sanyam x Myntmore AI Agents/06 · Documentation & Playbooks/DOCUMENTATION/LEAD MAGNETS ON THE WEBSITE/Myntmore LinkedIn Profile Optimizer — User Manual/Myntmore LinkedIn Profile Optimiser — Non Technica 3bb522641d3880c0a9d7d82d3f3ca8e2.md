# Myntmore LinkedIn Profile Optimiser — Non Technical Documentation

## Navigation & document status

- **Product hub:** [LinkedIn Profile Optimizer](../Myntmore%20LinkedIn%20Profile%20Optimizer%20%E2%80%94%20User%20Manual%203b4522641d3880f6824feb3a5efec12a.md)
- **Related guide:** [Technical guide](Myntmore%20LinkedIn%20Profile%20Optimizer%20%E2%80%94%20Technical%20Do%203bb522641d3880448c3ef1ea8acbffcd.md)
- **Central handover:** [Sanyam handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

**Verification note:** Confirm the live screens, permissions, labels and workflow before relying on this user-facing guide.

**Maintenance rule:** Record the date, owner, tested environment, evidence, and any unverified or skipped checks when updating this document.

---

## What is this tool?

This is a free "profile audit" tool that Myntmore uses to attract potential clients. A visitor comes to the page, fills out a contact form, pastes in their current LinkedIn headline and About section, and the tool uses AI to rewrite both — plus gives them a score on how clear and effective their profile currently is. It's designed to generate leads for Myntmore's founder.

---

## How it works, step by step

**1. Landing page**
The visitor sees a marketing page explaining the problem ("your LinkedIn profile isn't converting") and clicks a button to get started.

**2. Contact form**
They enter their name, job title, company, phone number, LinkedIn URL, and email. This information goes straight into Myntmore's CRM (a service called Zoho), so the sales team can follow up.

**3. Paste in their current profile**
The visitor pastes in their current LinkedIn headline and "About" section, and optionally tells the tool their role, who they're trying to reach (their target audience), and what tone they want (bold, professional, casual, etc.).

**4. Get scored and rewritten**
The tool does two things at once:

- It scores the visitor's *original* text for clarity and how well it matches their target audience — this is done with a simple word-matching system, not AI.
- It sends the profile to Google's Gemini AI, which rewrites the headline (3 different versions) and the About section, along with an explanation of what wasn't working before.

**5. See the results**
The visitor sees their score, an explanation of what's holding their profile back, the 3 new headline options, the rewritten About section, and a few different positioning angles to consider. They can download the whole thing as a PDF.

**6. Call to action**
At the end, there's a "Book a Strategy Call" button that takes them to a scheduling page to talk with Myntmore's founder.

---

## What's under the hood (in plain terms)

- **The AI**: Google's Gemini model does the actual rewriting of the headline and About section.
- **The scoring**: the "Profile Clarity Score" and audience-match score are calculated with simple rule-based logic (checking for certain words and patterns) — not AI. This happens instantly and doesn't cost anything to run.
- **Lead capture**: contact details go straight to Zoho (Myntmore's CRM), not into Myntmore's own database. This is a deliberate choice — it means all lead follow-up happens inside the CRM the sales team already uses.
- **Where it's hosted**: the site itself is hosted on Vercel; the AI and background logic run on a service called Supabase.

---

## Things worth knowing (in case something looks off)

1. **There's a database that isn't currently being used.** The system was originally built to also save every lead and every AI result into its own database, and that database still technically exists — but right now, nothing is being saved there. All the real lead data lives in Zoho instead. If Myntmore ever wants a backup record of leads/results outside of Zoho, that's possible to switch on, but it isn't happening automatically today.
2. **There's an unused "paste your LinkedIn URL" feature.** An earlier, more advanced version of this tool let people just paste their LinkedIn profile link and have it auto-scraped, instead of manually pasting their headline and About section. That feature was fully built but isn't currently turned on in the live tool — it's sitting there in case it's wanted again later.
3. **The logo was intentionally removed from the header.** This isn't a mistake — the tool is designed to be shown inside a Myntmore webpage (like a window within a window), and that outer page already has its own Myntmore logo and header, so a second one would be redundant.
4. **The "Book a Call" link recently changed.** As of August 2026, that button now goes to a Myntmore scheduling page instead of the previous Calendly link.
5. **There's no dedicated testing process.** Changes go live automatically whenever an update is made — there isn't a formal review or testing step built into the process, so it relies on the person making changes to double-check things manually.

---

## Quick answers to common questions

- **"Where do leads actually end up?"** In Zoho CRM — not in any Myntmore-owned database (see #1 above).
- **"Does the visitor's original profile get analyzed by AI, or just the rewritten version?"** The *score* they see is calculated with simple rules, not AI. Only the *rewritten* headline and About section come from the AI.
- **"Can visitors just paste a LinkedIn link instead of copying and pasting text?"** Not currently — that feature exists behind the scenes but isn't switched on for visitors yet.
- **"Is this tool a standalone page, or part of Myntmore's main website?"** It's built to be embedded inside Myntmore's main website as a section of the page, rather than feeling like a separate site.