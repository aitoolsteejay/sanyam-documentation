# 05 · Infrastructure & Operations

## Infrastructure & operations | Handover guide

This section covers the operating layer Sanyam supports: domains, hosting, database services, CRM integrations, API usage, billing and account access. The current-practice summary below should be read alongside the central handover page.

**Start here**

- [Central handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)
- [Responsibilities and recurring work](https://app.notion.com/p/Responsibilities-Systems-Recurring-Work-402522641d3881608d4ee7f34794f256?pvs=21)
- [Operating rules and incident SOPs](https://app.notion.com/p/Operating-Rules-Incident-SOPs-402522641d388149a54feda43da1bc1b?pvs=21)

### Key transfer checks

- Confirm the owner and backup owner for each platform.
- Confirm billing access, renewal date and escalation contact.
- Test the Calendly-to-Zoho booking flow and every live website form.
- Confirm the Gemini API key inventory and monthly usage review.
- Document the outage first-contact list. It is not yet finalised.
- Do not store passwords, recovery codes or API keys in Notion.

---

## Sanyam technical operations — current handover reference (October 2026)

Use this alongside the [consolidated Sanyam handover](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21). Existing child pages below remain unchanged.

- **Domains:** GoDaddy; Tejas provides access. Sanyam handles purchases, DNS, renewals and troubleshooting **as needed**.
- **Calendly → CRM:** Zoho Flow under Jahnvi's account processes five source-specific booking links (LinkedIn, Event Led Growth, Website, WhatsApp and Cold Emailing). New records appear as Zoho CRM **Deals** at **Meeting Scheduled**. If either email or phone already exists in CRM, the flow skips; exact module/matching behavior remains unverified. Current failure detection is reactive: team reports a missing Deal → review Zoho Flow execution history → verify absence and manually add the Deal if required, avoiding duplicates.
- **Make:** Sanyam has not yet built active automations there. Do not treat historical n8n/Zapier references as current ownership without verification.
- **Website forms:** Built in Jahnvi's Zoho Forms account, integrated to Zoho CRM **Leads**. The main lead form alone notifies Slack **#website-leads** directly from Zoho Forms. Failure notifications are not automated. New fields require manual CRM mapping and an end-to-end test. Zoho Forms duplicate handling needs inspection.
- **Supabase:** `aitoolsteejay@gmail.com` account, managed mainly through Supabase Dashboard as needed. Current pre-change backup procedure is **not established**. Confirm backup and recovery before destructive changes; respect the shared project's `myntmore` schema boundary.
- **Client tools:** Requirements usually come through the account manager; Myntmore Vercel generally hosts tools. Each client app gets a distinct Google Gemini key from Google AI Studio, stored in its Vercel environment. All keys currently share a Google Cloud project. Review API consumption monthly; client-specific costs are not automatically isolated. Account manager handles client communication; Sanyam handles technical build and fixes.
- **Billing:** Vercel, Supabase, Claude Teams, GoDaddy and Google AI Studio are monitored for subscription/renewal concerns **as needed**. Escalate billing to Tejas or Jahnvi.
- **Critical outages:** Appropriate first contact varies and is **not yet defined**. For a deployment-caused outage, rollback through Vercel when safe, verify recovery and then fix root cause with Claude Code. Research independently or contact platform support for unresolved issues.
- **Account access:** GitHub, Vercel, Supabase and Google AI Studio are associated with `aitoolsteejay@gmail.com`; Claude Code uses an existing Claude Teams account; Tejas grants Google Analytics/GSC/GoDaddy/YouTube permissions; Jahnvi owns Zoho Forms/Flow access. Grant the intern permissions progressively. **Do not store login secrets or API keys in Notion.**

---

<aside>
🧭

**Use this page when work touches the operating layer.** It brings together infrastructure, proxies, CRM operations, costing, tooling, and recurring technical processes.

</aside>

## Quick guide

- **PROXIES** — proxy setup and maintenance.
- **COSTING** — infrastructure and operating costs.
- **Myntmore Internal** — internal systems and reference material.
- **Cold Calling and Cold Emailing Related** — outreach operations.
- **ZOHO CRM COLD CALLING** — CRM workflows for cold calling.
- **ZOHO Form Ownership tracker** — ownership and accountability for forms.

---

Proxies, technical operations, CRM operations, tooling, costing, and recurring infrastructure.

[PROXIES](05%20%C2%B7%20Infrastructure%20&%20Operations/PROXIES%20207522641d3880a38cacd9243a7b9ad3.md)

[COSTING](05%20%C2%B7%20Infrastructure%20&%20Operations/COSTING%202cc522641d3880f9a39bd946cb7529ea.md)

[Myntmore Internal](05%20%C2%B7%20Infrastructure%20&%20Operations/Myntmore%20Internal%203bb522641d388007b4bbd3ad1a9a5667.md)

[Cold Calling & Cold Emailing Related](05%20%C2%B7%20Infrastructure%20&%20Operations/Cold%20Calling%20&%20Cold%20Emailing%20Related%203bb522641d38808da99ae9b00b28a562.md)

[ZOHO CRM COLD CALLING](05%20%C2%B7%20Infrastructure%20&%20Operations/ZOHO%20CRM%20COLD%20CALLING%203c7522641d388018bccefb870220db4c.md)

[ZOHO Form Ownership tracker](05%20%C2%B7%20Infrastructure%20&%20Operations/ZOHO%20Form%20Ownership%20tracker%203c8522641d3880809006f01b0d1e7bf5.md)

## Subscription renewal record

- **ChatGPT:** Renews on the **22nd of every month**.
- **Billing account:** `aitoolsteejay@gmail.com`.
- **Tracking note:** Treat the 22nd as the monthly renewal date and check billing status around that date. Do not store account passwords or payment details in this page.

## Claude Teams renewal record

- **Subscription:** Claude Teams
- **Renewal:** 25th of every month
- **Organisation head:** Jahnvi Jhaveri
- **Organisation account:** `growth@myntmore.com`
- **Tracking note:** Confirm billing status and renewal with the organisation head around the 25th. Do not store passwords or payment details in this page.