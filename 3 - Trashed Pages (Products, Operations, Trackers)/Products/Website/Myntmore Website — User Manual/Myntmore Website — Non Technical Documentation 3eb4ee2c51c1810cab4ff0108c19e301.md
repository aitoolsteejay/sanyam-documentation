# Myntmore Website — Non Technical Documentation

## What is this?

This is Myntmore's main marketing website — the site where people learn about the company's services, read case studies and blog posts, apply for jobs, try free AI tools, and eventually book a call with the founder. It's the digital front door for the whole business.

---

## What's on the site

**Core marketing pages**

- A homepage
- 5 service pages (Sales Intelligence, AI Lead Generation, LinkedIn Outreach, Personal Branding, Cold Email)
- An About page and Contact page
- A careers section, with individual pages for each open role
- A page for booking a call with the founder (everything "book a call" related sends people here)

**Content**

- 6 blog posts, plus a feed that automatically pulls in Myntmore's Medium articles too
- 6 case studies showing real client results
- A resources hub tying blog + case studies + free tools together

**7 free tools**
These are the interactive tools visitors can use for free, mostly to generate leads for Myntmore:

1. LinkedIn Profile Optimizer
2. DM Angle Generator
3. ROI Calculator (the only one that doesn't require AI or a contact form — pure calculator)
4. Posting Rhythm Builder
5. Lead Magnet Idea Generator
6. Founder Presence Analyzer
7. ICP Builder & Lead Scoring Rubric

**Other pages**

- A few landing pages built for specific types of clients (SaaS founders, manufacturers/exporters, agencies) used for targeted ad campaigns
- Guides linked from Myntmore's Instagram bio
- A few SEO-focused pages, an embedded workshop page, and a feedback form page

---

## How the free tools work

Six of the seven tools follow the exact same pattern:

1. **Contact form first.** Before using the tool, visitors fill in their name, job title, company, phone, LinkedIn URL, and email.
2. **They describe what they need.** Each tool asks a few relevant questions (depending on what it does).
3. **AI generates the result.** The tool sends everything to Google's Gemini AI, which produces a tailored result — a rewritten LinkedIn profile, DM ideas, a posting plan, etc.

Every lead captured this way goes into Myntmore's CRM (Zoho) as the main record, and also gets logged as a backup record in a separate internal database — including what the visitor typed in and what the AI gave back. That way, there's a full record of "who used which tool, and what they got out of it."

The ROI Calculator is the one exception — it's a pure calculator with no AI and no contact form gate, so anyone can use it immediately.

---

## Design and voice, in plain terms

- The site uses a warm, off-white background (never plain white), with a signature gold color as the main accent throughout — used for buttons, highlights, and underlines.
- Different sections of the site (services, tools, blog tags, career listings) each get their own accent color from a defined set, so things feel organized and colorful without being random.
- The site's voice is direct and to the point, deliberately avoiding corporate-sounding filler phrases. Its signature line, used across CTAs and messaging, is *"No pitch, no pressure."*
- One firm writing rule: no em dashes (—) anywhere on the site. Any copy written for the site should avoid that particular punctuation mark.

---

## Things worth knowing (in case something looks off)

1. **Not every "book a call" button goes where it should.** There's a site-wide rule that every such button should link to Myntmore's own internal booking page (which then embeds the actual calendar), not straight to the external calendar link. This has been a recurring bug in the past, so it's worth double-checking whenever a new CTA is added.
2. **Confirmation emails to tool users don't reliably go out.** When someone submits their info to try one of the free tools, their information reliably lands in the CRM, but the automatic "thanks, here's your confirmation" email doesn't always send. This is a known issue, and the agreed fix (sending that email directly from Myntmore's own systems instead of relying on the CRM to do it) hasn't been built yet.
3. **The DM Angle Generator may currently be pointing to an old, outdated version of itself.** There's a known routing issue where visitors going to that tool's page might be served an older, separate version of the tool instead of the newer one built directly into the site. This needs to be checked and fixed.
4. **One of the free tools (LinkedIn Profile Optimizer) still shares its contact form with other tools**, while all the others have their own dedicated one. This isn't broken, just an in-progress cleanup — a dedicated form for it is expected once it's ready.
5. **There's an outdated internal handoff document floating around** (called `HANDOFF.md`) that predates a lot of what's currently on the site — the newer, complete manual should always be treated as the accurate source, not that older document.
6. **Updates don't go live automatically.** New work happens on a separate working version of the site first, and someone has to manually approve and merge it into the live version — so it's possible for finished work to exist "behind the scenes" for a while before it's actually visible to site visitors.

---

## Quick answers to common questions

- **"Where do leads from the free tools actually end up?"** Primarily in Myntmore's CRM (Zoho), with a full backup copy (including what they asked for and what they got back) kept in a separate internal database.
- **"Can visitors use every tool without giving their contact info?"** No — six of the seven require contact info first. Only the ROI Calculator is open to use immediately.
- **"Is the site's information always current the moment someone finishes updating it?"** Not necessarily — there's a manual approval step before changes go live, so there can be a delay between "it's built" and "it's visible on the actual site."
- **"Why does the site avoid em dashes?"** It's a specific, ongoing style rule for the site's writing voice, not a one-time fix.