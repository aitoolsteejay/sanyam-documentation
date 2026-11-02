# MyntMore Voice Agent — Project Plan

**Status:** Draft for review
**Last updated:** July 2, 2026

---

## 1. What we're building

One voice AI agent, three jobs:

| Flow | Direction | Trigger | Goal |
| --- | --- | --- | --- |
| Calendly confirmation | Outbound | Someone books on TJ's Calendly | Confirm the slot, restate timing, answer basic logistics questions |
| Recruiting screening | Outbound | New candidate added to a list | Ask qualifying questions (WFO comfort, availability, etc.), capture structured answers |
| Cold calling | Outbound | Lead list upload | Pitch, handle objections, qualify the lead |
| Callback handling | Inbound | Someone calls the shared number | Route based on intent (candidate callback, lead question, general) |

All three share the same phone number, the same underlying platform, and the same data destination — they differ only in script and question logic.

---

## 2. Recommended stack

| Layer | Choice | Why |
| --- | --- | --- |
| Voice AI platform | **Retell AI** | Visual flow builder (non-engineers can edit scripts), strong latency/voice quality, handles inbound + outbound well, SIP trunking so we're not locked in |
| Telephony | Twilio (via Retell) or Retell-native number | Cheap in India, reliable coverage |
| Orchestration / glue | n8n (self-hosted or cloud) | Connects Calendly webhook → Retell → Airtable without custom backend code |
| Data storage | Airtable (or Google Sheets for v0) | You already chose this; one base, three tables (Confirmations / Candidates / Leads) |
| Scheduling source | Calendly (existing) | Webhook fires on booking |

**Alternative:** Vapi, if you want more engineering control later (bring-your-own LLM/TTS) — more flexible, more setup work. Not recommended as the starting point.

> Note on sourcing: pricing/comparison figures below are pulled from vendor and industry pricing pages as of mid-2026 — worth re-confirming exact rates at signup since these shift.
> 

---

## 3. Costing

### 3.1 One-time setup

| Item | Estimate |
| --- | --- |
| Conversation design (3 scripts: confirmation, screening, cold call) | 3–5 days |
| n8n workflows (Calendly webhook → Retell → Airtable, ×3) | 3–4 days |
| Airtable base structure + fields | 0.5 day |
| Testing + script tuning (real test calls) | 2–3 days |
| **Total** | **~2 weeks of build time** |

*(This is effort, not a dollar figure — depends on whether it's done in-house or outsourced.)*

### 3.2 Recurring monthly costs

Two separate buckets: cost **per minute talked**, and flat **tool subscriptions** you pay regardless of call volume.

**Per-minute cost (scales with usage)**

| What | Cost per minute |
| --- | --- |
| Retell AI (the voice agent itself) | $0.05 – $0.07 |
| Twilio calling (India rates) | $0.005 – $0.01 |
| **Combined, per minute talked** | **~$0.06 – $0.10** |

**Flat monthly tools (fixed, regardless of volume)**

| Tool | Monthly cost |
| --- | --- |
| Retell platform plan (some tiers charge this on top of per-minute) | $0 – $49 |
| Twilio phone number | ~$2 |
| n8n | $0 if self-hosted, ~$20 if cloud |
| Airtable | $0 on free tier, ~$20/user if you need the Team plan |
| **Typical total** | **~$20 – $90/month** |

### 3.3 What that adds up to, by volume

Assuming ~3-minute average calls, at ~$0.08/min blended:

| If you make... | That's about... | Talk-time cost | Plus flat tools | Total per month |
| --- | --- | --- | --- | --- |
| 200 calls/month | 600 minutes | ~$50 | ~$20–90 | **~$70 – $140** |
| 1,000 calls/month | 3,000 minutes | ~$240 | ~$20–90 | **~$260 – $330** |
| 5,000 calls/month | 15,000 minutes | ~$1,200 | ~$20–90 | **~$1,220 – $1,290** |

The flat tool costs barely move — it's the per-minute talk time that scales with volume.

### 3.4 Sanity check vs. a human caller

At roughly $0.40/min for a human agent (salary + overhead) vs. ~$0.08/min blended for the AI agent, the AI agent runs at **roughly 1/5th the per-minute cost** — the gap widens fast at volume, though this ignores conversion-quality differences that are worth testing for, not assuming.

---

## 4. Open questions before build starts

- Do we have a Twilio account / phone number already, or start from scratch?
- Confirmed data fields for each flow (e.g., exact screening questions for recruiting)?
- Expected monthly call volume per flow, to lock in the right Retell tier?
- Any compliance requirement (e.g., DND/DLT registration for India outbound calling) to check before launch?

## 5. Next steps

1. Finalize the three conversation scripts
2. Set up Retell account + phone number
3. Build n8n workflows for each trigger
4. Structure Airtable base
5. Run a small test batch (10–20 calls per flow) before full rollout