# Posting Rhythm Builder - Non Technical Documentation

## Navigation & document status

- **Product hub:** [Posting Rhythm Builder](../Myntmore%20Posting%20Rhythm%20Builder%20%E2%80%94%20User%20Manual%203b4522641d3880c096dadd74e3a3e0dd.md)
- **Related guide:** [Technical guide](Posting%20Rhythm%20Builder%20%E2%80%94%20Technical%20Documentation%203bb522641d388034979fd34c4b05f6b2.md)
- **Central handover:** [Sanyam handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

**Verification note:** This is a user-facing reference. Confirm the live screens, permissions, labels and workflow before relying on it; update this guide when the product changes.

**Maintenance rule:** When updating this document, record the date, owner, tested environment, evidence, and any unverified or skipped checks.

---

## What is this tool?

It's a small website (one page) that helps a founder figure out the best way to post on LinkedIn. It's used by Myntmore to attract leads and show off what Myntmore can do.

Think of it as a 3-step mini-quiz that ends with a personalized "LinkedIn posting plan," which the person can then print or save as a PDF.

---

## How it works, step by step

**Step 1 — Get their details**
The visitor fills in a short form: their name, company name, company email, company website, and their LinkedIn profile link. This info is saved to a database so Myntmore has a record of who used the tool (a "lead").

*Note: if saving to the database ever fails for some technical reason, the visitor won't see an error — they just move on to Step 2 anyway. This keeps the demo running smoothly, but it means someone should occasionally double-check the database to make sure leads are actually being captured.*

**Step 2 — Answer 5 quick questions**
The visitor answers questions about themselves, like:

- How often can they realistically post? (e.g. daily, 3 days a week, weekends only)
- What tone do they want to sound like? (e.g. friendly, authoritative, sharp & direct)
- Who is their ideal customer?
- What are they naturally good at writing about? (e.g. storytelling, humor, education)

**Step 3 — Get their personalized plan**
The tool sends those answers to an AI (Google's Gemini) behind the scenes, which creates a custom plan including:

- The best days and times to post
- A weekly content schedule with reasoning behind it
- A simple weekly routine to follow
- Specific post ideas
- Ready-to-use "hooks" (attention-grabbing opening lines) and "calls to action" (ways to end a post that invite engagement)

The visitor can then click a button to print this plan or save it as a PDF, and there's a link at the end inviting them to book a call with Myntmore (via Calendly).

---

## What's "under the hood" (in plain terms)

- **The website itself**: built with common, modern web tools (React and Vite) — nothing unusual here, it's a standard way to build a fast, simple website.
- **The AI**: Google's Gemini AI model is what actually writes the personalized plan. It's told exactly what format to reply in, so the plan always looks consistent no matter who uses the tool.
- **The database**: a service called Supabase quietly stores each visitor's contact details when they fill out the first form.
- **Where it lives online**: the site is hosted on a service called Vercel, which is a common place to host simple websites like this one.

---

## Things worth knowing (in case something looks off)

1. **Lead info might occasionally not save.** As mentioned above, if the database has a hiccup, the visitor never sees an error — but that also means it's worth someone periodically checking that leads are actually showing up in the database.
2. **The look was recently changed.** In early August 2026, the tool's design was switched from a dark theme (black background, white text) to a light theme (white background, black text), including a color update to the logo so it stays visible.
3. **There's an old error message that mentions the wrong hosting company.** If the AI plan ever fails to generate because of a setup issue, the error message shown still refers to "Netlify" (a different hosting service) instead of "Vercel" (the one actually being used now). It's a leftover from an earlier version and doesn't break anything — just slightly confusing wording if anyone ever sees that error.
4. **There are two copies of the code online (two "repos").** One is the original/master copy, and the other is the one connected to the live website. When updates are made, they need to be sent to both places to keep everything in sync.

---

## Quick answers to common questions

- **"Does this tool work without any setup?"** No — it needs a valid connection (an "API key") to Google's Gemini AI to generate the plans. Without it, the tool won't be able to create a strategy.
- **"Is visitor data safe?"** Contact details are stored in a database with access rules meant to only allow new entries to be added, not read or changed by outsiders. It's worth someone occasionally confirming those access rules are still properly locked down.
- **"Can non-developers edit the questions or colors?"** Changing wording, dropdown choices, or colors would still require someone comfortable editing code — this isn't a drag-and-drop editor. But the changes involved are usually small and contained.