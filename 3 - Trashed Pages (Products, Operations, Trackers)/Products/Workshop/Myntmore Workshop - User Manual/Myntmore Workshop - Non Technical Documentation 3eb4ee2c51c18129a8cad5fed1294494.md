# Myntmore Workshop - Non Technical Documentation

This explains what the Workshop is, what it does screen by screen, and how it fits into the business — no code involved. If you need to teach someone this product (a new team member, a partner, support staff), this document alone should get them there.

---

## 1. What this is, in one paragraph

The Myntmore Workshop is a free, guided, one-sitting web tool that walks a business owner through a series of questions about their business, and at each step, an AI (Google's Gemini) turns their rough answers into polished, ready-to-use strategy material: a sharper LinkedIn profile, a clear picture of their ideal customers, a value proposition, website copy, a go-to-market plan, and an outreach playbook. At the end, they download everything as one PDF report. There's also a jewellery-specific detour (design + product-photo prompts) for jewellery businesses specifically.

## 2. Who it's for, and why it exists

The Workshop is built and run by **Myntmore**, Tejas Jhaveri's B2B lead-generation and outbound agency. It's positioned on the landing page as "Free · No credit card." The reason it's free: **it's a lead magnet, not a standalone product.** Someone spends 15-20 minutes getting genuinely useful, personalized output, which builds enough trust to want to talk further — and by the time they finish, Myntmore already has their name, email, and phone number (collected right at sign-up) to follow up with about the paid agency service. The Workshop's job is to be good enough that finishing it feels like a small win worth having a conversation about.

## 3. The journey, screen by screen

### Landing page

A marketing page (outcomes, how-it-works, Tejas's bio, testimonial-style stats) ending in one call to action: "Start the Free Workshop."

### Sign-up

Before anything else, the visitor gives their name, email, and phone number. This is the lead capture — it happens whether or not they finish the rest of the Workshop.

### Step 1 — Business Basics

They pick their industry, who they sell to (businesses, individual consumers, or both), what kind of business it is (product, service, or a mix), their revenue range, team size, and their main goal (more leads, better conversion, brand authority). Nothing AI-generated here — this is just context that every later step will use to personalize its output.

### Step 2 — LinkedIn Profile

They paste in their current LinkedIn headline and About section (or say they don't have one yet), describe their business offer in their own words, and pick a tone. The AI first turns their rough offer description into 3 cleaner, more detailed versions to choose from — then, once they hit Generate, it scores their LinkedIn profile out of 100 across five criteria (clarity, specificity, differentiation, proof, execution), and writes three new headline options plus a rewritten About section.

### Step 3 — Define Your Ideal Customers (ICP)

This is the heart of the Workshop. They build 3 (up to 6) "Ideal Customer Profiles" — the types of people who'd actually buy from them. For a business buyer (B2B), they specify roles, company sizes, industries, and geography. For an individual consumer (D2C), they describe the person in their own words and the AI turns it into 3 cleaner versions to pick from. The AI then generates, for each profile: who this person really is, their pain points, what triggers them to buy, their objections, where to find them online, and a list of potential referral/co-selling partners who already have that person's trust.

### Step 4 — Value Proposition

Using the ICPs from Step 3, the AI writes a tailored pitch for each one: a before/after transformation story, a 3-step system explaining how the offer works, why competitors fall short, a positioning statement, and a ready-to-use elevator pitch and call-to-action. If any ICP has referral partners, it also writes a separate pitch aimed at recruiting those partners.

### Step 5 — Website

They pick a brand name and two brand colors (optionally uploading a screenshot of a website they like as a style reference), and the AI writes a complete, ready-to-paste prompt for an AI website builder (like Lovable) — describing the whole page layout, copy, and sections, personalized to their business and ICPs. It also includes a library of one-click "refine this" follow-up prompts (add testimonials, add an ROI calculator, etc.) and a short FAQ on using the tool.

### Step 6 — Go-To-Market Strategy

The AI generates, per ICP: which channels to focus on and why, an execution timeline, and lead magnet / event ideas to attract that audience.

### Step 7 — Jewellery Design *(only relevant to jewellery businesses)*

A tag-based picker (jewellery type, style, material, gemstone, mood) that assembles a detailed product-photography prompt for AI image generation — no AI call happens in the app itself; the user copies the finished prompt and pastes it into Gemini's own image tool.

### Step 8 — Jewellery Modelling *(same audience as Step 7)*

Given a jewellery type, the AI writes 4 distinct image-generation prompts for showing that piece worn in different styles (on a model, a close-up, a lifestyle street shot, and one fun/creative concept).

### Step 9 — Outreach Playbook

The AI builds a strategic outreach plan per ICP — for business buyers, a LinkedIn connection-and-follow-up cadence; for individual consumers, a content/channel plan instead (since cold LinkedIn outreach doesn't make sense for consumers). It includes messaging angles, what to say, what not to do, and example openers.

### Step 10 — Final Screen

A one-page snapshot of everything generated, and a "Download PDF" button that compiles every step's output into one polished report the user can keep and act on.

Throughout all of this, progress saves automatically every few seconds — if someone closes the tab and comes back later (on the same device), they're offered a "Welcome back, resume where you left off?" screen.

## 4. How the "AI" part actually works, in plain terms

Every generation step follows the same shape: the user's own words plus everything they've entered in earlier steps get sent to Google's Gemini AI along with a consistent set of writing instructions that apply everywhere in the app — write in plain language with no jargon or buzzwords, personalize everything to this specific business (never generic filler), and adapt tone and channel advice to the target country (India vs. USA vs. UK read very differently) and to whether the buyer is a business or an individual consumer. That's why the tone and advice feel tailored rather than templated — the same underlying rules get applied consistently across every single step.

## 5. Where everything is saved

As soon as someone signs up, a session is created and saved to a database (Supabase). Every answer and every AI-generated result gets saved a second or so after it's entered, with no "Save" button needed (there's also a manual save button in the header, and a small local backup on the device itself in case the database is briefly unreachable). This is what makes "leave and come back later" possible.

## 6. The business model today, and where it's headed

**Today:** the Workshop is entirely free. The real monetization happens off-tool — a person's contact info gets captured at sign-up regardless of whether they finish, and Myntmore's team follows up to sell the actual paid agency retainer. There are also a couple of small affiliate links baked into the outreach/GTM output (to Clay and Apollo, two outbound sales tools) that earn a commission if someone signs up through them.

**Planned:** there's an active plan to put a payment wall in front of the Workshop itself — pay before Step 1 unlocks, using Razorpay (India's most common payment gateway) — while still keeping the free sign-up step so a lead is captured either way. Alongside that, there's a plan for:

- **Coupon codes** — for giving specific people (partners, warm leads, team demos) free or discounted access without a card, tracked so the same code can't be reused endlessly or past its limit.
- **Free-trial windows** — a simple on/off switch for periods where payment isn't turned on yet (e.g. a pre-launch phase, or a promotional free week), rather than anything more complicated like a metered trial.

None of this is built yet — it's designed and ready to build when the team is ready to move on it.

## 7. Known rough edges (as of the last full review)

Worth knowing about if you're supporting users or demoing this:

- **Downloading the PDF can silently fail** for anyone who used the Jewellery Design step — nothing downloads and no error shows, just nothing happens when they click the button.
- **Jewellery Design and Modelling answers aren't actually being saved to the shared database** yet (a technical gap in how that part was set up) — they only live in that one browser/device until this is fixed, so switching devices or clearing browser data can lose that specific step's answers.
- A couple of screens (the "turn my rough description into 3 options" moments in Step 2 and Step 3, and the whole of Step 8) have no safety timeout — if the AI takes an unusually long time to respond, that screen can appear stuck with no error message, and the only fix right now is refreshing the page.
- The "loaded from a local backup, may not be fully synced" warning message doesn't always show up at the right time — don't rely on its absence to mean everything definitely synced.

## 8. Glossary

- **ICP (Ideal Customer Profile)**: a detailed description of one type of person or company most likely to buy — their role, pain points, and what makes them say yes.
- **D2C**: Direct-to-Consumer — selling to an individual person for their personal use, as opposed to selling to a business.
- **B2B**: Business-to-Business — selling to a company, usually through a professional decision-maker.
- **GTM (Go-To-Market)**: the overall plan for how a business will reach and win its target customers.
- **Value proposition**: a clear, specific statement of what a business does for a customer and why it beats the alternatives.
- **Lead magnet**: something free and useful offered to attract potential customers and get their contact details.
- **Session**: one person's full run through the Workshop, from sign-up to the final PDF, saved under one ID.