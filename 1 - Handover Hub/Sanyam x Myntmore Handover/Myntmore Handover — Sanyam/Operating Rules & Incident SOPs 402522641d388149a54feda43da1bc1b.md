# Operating Rules & Incident SOPs

<aside>
🛡️

**SAFE OPERATING RULES & INCIDENT RESPONSE**

Read this page before production, database, access, client-data or integration changes. If the approval owner or recovery path is unclear, pause and confirm.

[Myntmore Handover — Sanyam](../Myntmore%20Handover%20%E2%80%94%20Sanyam%203f5522641d38819697c4e985805d92fd.md)

</aside>

## Quick navigation

1. Five-minute triage before any change
2. Website and SEO release
3. Dashboard and Supabase changes
4. Zoho Flow and Zoho Forms
5. Client tools and access
6. Reconciled gaps and unresolved decisions

<aside>
⚠️

Never put passwords, recovery codes, API keys or tokens in Notion. Do not proceed with destructive database work when a tested recovery path is unavailable.

</aside>

---

## Reconciliation and operating rules — 21 October 2026

This page is the current source of truth for Sanyam’s technical handover. The linked technical manuals remain authoritative for implementation detail; older pages, assignments, and generic onboarding checklists are background unless this page or the linked manual explicitly adopts them. Preserve useful historical context, but do not follow a conflicting older instruction without checking with the named owner.

### Five-minute triage before any change

1. Name the system, user or client impact, and whether the request is production, data, access, or documentation work.
2. Find the linked SOP and identify the owner/approver. If the owner or approval boundary is blank, mark the decision unresolved and ask before proceeding.
3. Prefer preview, test records, least-privilege access, and reversible changes. Never paste passwords, recovery codes, API keys, or tokens into Notion.
4. Capture the evidence needed to verify the change: URL/record ID, deployment or execution ID, before/after result, and any skipped check.
5. Update the relevant tracker or runbook with the result and the next owner.

### Concrete SOPs

**SEO / website release:** Start a new Claude Code session from the 13-task weekly checklist for routine audits. For a new or changed page, check metadata, canonical, structured data, internal links, mobile layout, forms, analytics, sitemap and robots output; run the repository checks and a production smoke test after Vercel deploy. Request indexing only after the live URL and canonical are verified. If a release breaks production, restore the last known-good Vercel deployment when safe, verify affected pages, then fix forward. Database migrations are separate and are not undone by a Vercel rollback.

**Dashboard / Supabase change:** Confirm the target client, reporting week, and the `myntmore` schema before reading or writing data. For account work, use the Dashboard Admin Panel; default new users to Team Member, obtain Tejas’s approval before Admin elevation, assign the correct client, test isolation, and disable rather than delete leavers. For data/schema work, take and verify an available backup or export before destructive changes; if no tested recovery path exists, record that as a blocker and stop. Validate route guards, query filters, RLS, client isolation, and the affected user flow after deployment.

**Zoho Flow / Zoho Forms:** For a missing Calendly-created Deal, check the booking source and duplicate status first, then inspect Zoho Flow execution history and create the Deal manually only if absent. For a form issue, submit a controlled test, confirm the Zoho Forms submission, confirm the mapped Zoho CRM Lead fields, and confirm the main website form’s `#website-leads` Slack alert. Test duplicate handling instead of inferring it from Calendly. Record the execution/submission ID and whether the fault was in the form, mapping, CRM, or Slack integration.

**Client tools and access:** Grant only the permissions needed for the current task and record the system, access level, owner, recovery path, and review date in the access tracker. Keep client Gemini keys separate by project in Vercel environment variables; review usage monthly and escalate suspected compromise immediately. Do not invent an owner, backup owner, credential location, or escalation contact. Use `UNRESOLVED — confirm with Tejas/Jahnvi` where the workspace does not establish one.

### Reconciled gaps

The following remain open decisions or verification tasks: intern reporting line and Sanyam’s future involvement; training length, readiness/sign-off, first independent assignment, documentation owner and approval boundaries; first-call outage contacts; exact Calendly matching and repeat-booking behavior; Zoho Forms duplicate handling; tested Supabase backup/recovery; current Claude integrations; and the pending project inventory. Historical pages may mention [Make.com](http://Make.com), n8n, Zapier, Waalaxy, or other tools; treat them as applicable only when a current page or live verification confirms they are active.