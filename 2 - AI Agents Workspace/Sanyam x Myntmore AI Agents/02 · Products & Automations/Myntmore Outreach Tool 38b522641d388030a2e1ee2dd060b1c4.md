# Myntmore Outreach Tool

## Navigation & reference status

- **Parent:** [Products & Automations](../02%20%C2%B7%20Products%20&%20Automations%203ea522641d3881fca27ec968eb819d8b.md)
- **Central handover:** [Sanyam handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

**Important:** This page documents the intended white-labelled experience and Waalaxy-backed operating model. Verify current vendor behavior, data flow, permissions, limits and customer-facing wording before implementation or sales use.

**Review before reuse:** Record the review date, reviewer, live test performed, evidence and unresolved questions. Do not treat an old description as proof of a current production capability.

---

**Overview**

Myntmore's outreach tool is a white-labeled LinkedIn outreach platform. The user experience lives entirely inside Myntmore. The automation engine running in the background is Waalaxy, but users will never know that. From their perspective, this is Myntmore's own technology.

---

## Architecture Summary

Myntmore is the front-end experience and brand. Waalaxy is the silent engine in the back. Users never see Waalaxy.

---

## Layer 1: Onboarding and ICP Definition

Users begin by defining who they want to reach and why.

**What users input:**

- Job titles they are targeting
- Industries they want to focus on
- Company size range (e.g. 50 to 500 employees)
- Geography (country, region, or city)
- Their value proposition (what problem they solve and for whom)

This input gets saved as a **Campaign Profile** inside Myntmore. It becomes the foundation for all messaging generated in the next step.

---

## Layer 2: AI Message Generation

Using the ICP and value prop from Layer 1, the tool automatically generates outreach copy.

**What gets generated:**

- A connection request note (max 300 characters, to fit LinkedIn's limit)
- 2 to 3 follow-up messages in sequence

Users can edit everything inline before moving forward. The quality of this copy is a key differentiator for Myntmore. Good messaging makes the whole product feel premium.

---

## Layer 3: Prospect Sourcing

The tool guides users to find the right people on LinkedIn or Sales Navigator.

**How it works:**

- Myntmore uses the ICP filters to build a pre-populated search URL for Sales Navigator or LinkedIn
- Users click the link, which takes them directly to a filtered search result
- They build their list on LinkedIn or Sales Nav, then export it as a CSV or saved list
- They import that list back into Myntmore

This keeps prospect sourcing simple while still giving users flexibility to refine their list manually.

---

## Layer 4: Campaign Launch

This is where Waalaxy runs silently in the background.

**What happens technically:**

- The user clicks "Launch Campaign" inside Myntmore
- Myntmore sends the prospect list and message sequence to Waalaxy via its API
- Waalaxy creates and runs the campaign
- Myntmore pulls back status updates and surfaces them in its own UI

**To the user:** they launched a campaign on Myntmore. Waalaxy is never mentioned, referenced, or visible.

---

## Keeping Waalaxy Invisible

This is the most important technical requirement.

| Concern | Solution |
| --- | --- |
| API calls exposing Waalaxy | All Waalaxy API calls happen server-side, never from the browser |
| Waalaxy branding in network requests | Route everything through Myntmore's own backend |
| Waalaxy status labels leaking through | Map all Waalaxy statuses to Myntmore terminology (e.g. Waalaxy "pending" becomes Myntmore "Queued") |
| Error messages referencing Waalaxy | Rewrite all error messages in Myntmore's voice before surfacing them to users |

---

## User Flow (End to End)

1. User creates a Campaign Profile (ICP + value prop)
2. Myntmore generates connection note and follow-up sequence
3. User edits and approves the messages
4. User is guided to Sales Nav or LinkedIn to source prospects
5. User imports the prospect list into Myntmore
6. User clicks "Launch Campaign"
7. Myntmore sends everything to Waalaxy in the background
8. Campaign runs; user tracks progress inside Myntmore

---

## Key Principles

- The product experience must feel native to Myntmore at every step
- No Waalaxy references anywhere in the UI, URLs, error messages, or network traffic
- The AI-generated messaging is the core value add, not just the automation
- Keep the flow linear and guided so users do not need to understand LinkedIn automation to use the product