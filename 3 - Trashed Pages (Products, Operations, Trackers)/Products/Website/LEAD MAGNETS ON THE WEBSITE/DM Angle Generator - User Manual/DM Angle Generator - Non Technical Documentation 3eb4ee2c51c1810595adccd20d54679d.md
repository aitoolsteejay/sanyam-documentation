# DM Angle Generator - Non Technical Documentation

### **What it does**

The DM Angle Generator is a free, self-serve tool on the Myntmore website that helps salespeople and founders write better cold outreach messages. Instead of staring at a blank message box and guessing what to say, a user describes who they're selling to (industry, the job title of their ideal customer) and what they're offering, and the tool instantly produces five different opening messages for a cold DM — each one built around a different psychological angle (emotional appeal, authority/credibility, social proof, curiosity, or a value-first/helpful approach).

It exists because generic, copy-paste-sounding outreach gets ignored, and most people don't have the time or training to write outreach that's grounded in persuasion psychology for five different approaches at once. The tool packages that expertise into a simple three-field form, so someone doing manual outbound (or managing a team that does) can generate ready-to-send message variants in seconds, tweak the tone (shorter, more formal, more direct, more friendly, or a fresh variation), and copy them straight into LinkedIn or email.

Like most of Myntmore's free tools, it also functions as a lead magnet: to actually see the generated output, a visitor has to fill out a short contact form first. That form feeds Myntmore's CRM (Zoho) and its own Supabase database, giving the business a qualified lead (with company, role, and contact details) for every person who uses the tool, and a soft upsell nudges the highest-intent users toward booking a strategy call with Myntmore for done-for-you outreach automation.

### **How someone uses it, step by step**

1. The user lands on `/tools/dm-angle-generator`, which shows a marketing/landing page (hero section, "why this works," "how it works" explainer, etc.) with a "Generate My Angles" call-to-action button.
2. Clicking that button smooth-scrolls down to a lead-capture form (the shared `LeadGate` component). The user must fill in First Name, Last Name, and Designation (required), plus optional Company, Phone, LinkedIn URL, and Email, and submit.
3. On submit, the form silently posts to a tool-specific Zoho form (via a hidden iframe) and simultaneously inserts a row into the Supabase `leads` table. Only after this completes does the tool reveal the actual input panel — there is no way to generate angles without first passing the lead gate.
4. The user then fills in three fields: Industry, ICP Role, and Offer, and clicks "Generate DM Angles" (button shows "Analyzing psychology drivers…" while loading).
5. The tool calls the Gemini API and returns 5 DM angle cards (Emotional, Authority, Social Proof, Curiosity, Value-First), each showing the message text, a "why this works" reasoning line, and action buttons: Copy DM, Regenerate, Shorter, More Formal, More Direct.
6. The user can copy an individual message, copy all 5 at once, regenerate a single angle (optionally in a specific style), or regenerate all 5 angles at once in a chosen style (Shorter / More Direct / More Friendly) — each of these hits the regenerate API and swaps in the new version.
7. At the bottom of the results, a "Want More?" panel invites the user to "Book Strategy Call," linking to `/founder-meeting`.