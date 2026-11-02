# Case Study & Proposal Generator - Non Technical Documentation

### **What it does**

The Case Study & Proposal Generator is a free tool on the Myntmore website that helps a service business turn real work into written sales material, without staring at a blank page. It has two modes: the first turns a finished, completed project into a polished case study (the kind you'd put on your website or send to a prospect as proof of results). The second turns notes from a conversation with a new prospect into a first-draft sales proposal, ready to be reviewed and sent.

The tool exists because writing this kind of copy is a recurring bottleneck for a small agency: everyone knows the project and the pitch, but turning it into a properly structured document eats an hour nobody has, so case studies never get written and proposals get rushed out from a generic template. This tool removes that friction by taking rough, unstructured notes (a few sentences about the problem, what was done, and the result) and structuring them into a properly organized draft in under a minute.

The most important design principle behind it is that it refuses to make things up. If the person filling in the form doesn't give it a real number, it will not invent a statistic. If they don't give it a client quote, it will not fabricate one. The proposal side goes further and tries to write the "understanding your challenge" section in the prospect's own words rather than boilerplate, and if there are no past wins to reference, it deliberately falls back to generic, non-numeric credibility language instead of inventing a result to sound more impressive.

Before someone can use the tool, they have to fill out a short lead-capture form (name, company, role, contact details). That submission is captured for the business (both to their CRM and their own database) as a qualified lead before the visitor gets access to the AI drafting tool itself.

### **How someone uses it, step by step**

**Landing and mode choice (shared by both modes)**

1. The visitor lands on `/tools/case-study-generator`, which shows a marketing/landing page explaining the tool ("Never Face The Blank Page Again") with a "Start Drafting" call to action.
2. Clicking "Start Drafting" reveals the lead-capture gate: a form asking for first name, last name, designation/role (all required), and optional company, phone, LinkedIn URL, and email.
3. After submitting, the visitor is shown a mode picker: "Turn a project into a case study" or "Draft a new proposal."

**Case study mode** 4. The visitor fills in: Client Industry (required), The Problem the client had (required), What You Did / the approach, in rough notes (required), The Result achieved, ideally with real numbers (required), and an optional Client Quote/testimonial (with copy explicitly telling them "we won't make one up" if left blank). 5. They click "Generate Case Study." A loading state ("Writing your case study...") shows while the request is in flight. 6. The result view shows: a headline, a row of stat tiles (only if real numbers were given), a "The Problem" paragraph, a 2-3 step "The Approach" breakdown, a "The Results" paragraph, an optional pull-quote block (only if a testimonial was supplied), and a row of "Services used" tags. Each section, and the whole draft, has a "Copy" button to copy the text to clipboard. A "Start Over" button resets back to mode selection.

**Proposal mode** 4. The visitor fills in: Prospect Company and Their Industry (required, side by side), The Problem They Shared in the prospect's own words (required), Decision Maker's Role and an optional Budget Indication (side by side), a "How We Met" selector (Referral / Inbound / Outbound), and optional Past Wins to Reference (with copy noting that leaving it blank keeps the "Why Us" section generic rather than inventing numbers). 5. They click "Generate Proposal," seeing a "Drafting your proposal..." loading state. 6. The result view shows: a "Positioning" statement in a highlighted box, an Executive Summary, an "Understanding Your Challenge" section, a 3-phase "Our Approach" grid, a "Why Us" bullet list, an Investment placeholder block, and a Next Step block. Again, per-section and "Copy all" buttons are available, plus "Start Over."

In both modes, once a result is generated it is also silently saved back to the same lead record created at the gate (see the Lead gate section below) so the business has a record of what that lead actually input and received.