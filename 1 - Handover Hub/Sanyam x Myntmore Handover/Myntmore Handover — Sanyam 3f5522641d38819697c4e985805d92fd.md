# Myntmore Handover — Sanyam

<aside>
🧭

**MYNTMORE | TECHNICAL & OPERATIONS HANDOVER**

This is the central handover workspace for transferring Sanyam's technical and operational responsibilities. Start with the overview, then use the system guides and trackers to complete the transfer.

**Outgoing owner:** Sanyam · **Management owner:** Tejas · **Incoming owner:** To be confirmed

**Reference:** Discovery completed 20 October 2026. Handover remains in progress until the successor is trained, critical workflows are tested and ownership is accepted.

</aside>

## Start here

<aside>
1️⃣

**First: understand the role**

Read [Responsibilities, Systems & Recurring Work](Myntmore%20Handover%20%E2%80%94%20Sanyam/Responsibilities,%20Systems%20&%20Recurring%20Work%20402522641d3881608d4ee7f34794f256.md) for the actual operating scope, recurring cadence, account ownership and current practices.

</aside>

<aside>
2️⃣

**Second: learn how to work safely**

Read [Operating Rules & Incident SOPs](Myntmore%20Handover%20%E2%80%94%20Sanyam/Operating%20Rules%20&%20Incident%20SOPs%20402522641d388149a54feda43da1bc1b.md) before making production changes, handling incidents, changing access or working with client data.

</aside>

<aside>
3️⃣

**Third: walk through each system**

Use the product manuals below. Ask Sanyam to demonstrate the workflow, then have the incoming owner repeat it without guidance.

</aside>

## Handover at a glance

| Workstream | Scope being transferred | Evidence required |
| --- | --- | --- |
| Website & deployment | Development, maintenance, domains, DNS, releases | Safe change, production verification and rollback |
| SEO, AEO & GEO | Weekly reporting, technical health, indexing | Independent audit and SEO report |
| Content operations | Website blogs and YouTube Shorts | Draft-to-publication workflow |
| Myntmore Dashboard | Maintenance, users, client access, reporting support | Permission and client-isolation tests |
| Supabase & data | Schema, database, authentication and RLS | Safe-change and recovery demonstration |
| Zoho & lead workflows | Forms, Calendly, Zoho Flow and CRM sync | End-to-end form and booking tests |
| Internal tools & client projects | Tools, landing pages, websites and automations | Scoped build, deployment and test |
| Infrastructure | Hosting, domains, API usage, billing and renewals | Named owners, backup owners and renewal dates |

## Current handover status

These are documentation-based assessments, not independent checks of the live systems.

| Area | What is known | What remains to be done |
| --- | --- | --- |
| Role and recurring work | Documented | Successor to demonstrate understanding |
| Website and deployment | Workflow documented | Practical deployment and rollback test |
| SEO and content | Cadence documented | Complete one cycle independently |
| Dashboard | Technical and non-technical manuals exist | Test live workflows and permissions |
| Supabase backup/recovery | No formal pre-change process documented | **Critical: establish and test recovery** |
| Zoho failure monitoring | Reactive investigation; no automated alerts documented | Assign monitoring and test failure path |
| Website forms | Main form Slack alert documented; other forms differ | Test every live form |
| Access and ownership | Some platform owners documented | Complete named owner and backup review |
| API keys and usage | Monthly review; naming/rotation inconsistent | Confirm controls and accountable owner |
| Successor and training | Successor and readiness criteria unset | Confirm person, training and sign-off |

<aside>
⚠️

**Do not sign off yet:** Supabase recovery, access ownership, critical workflow testing and successor readiness need explicit closure.

</aside>

## Navigation by task

| If you need to… | Open this |
| --- | --- |
| Understand Sanyam's role and weekly/monthly work | [Responsibilities, Systems & Recurring Work](Myntmore%20Handover%20%E2%80%94%20Sanyam/Responsibilities,%20Systems%20&%20Recurring%20Work%20402522641d3881608d4ee7f34794f256.md) |
| Make a safe change or respond to an incident | [Operating Rules & Incident SOPs](Myntmore%20Handover%20%E2%80%94%20Sanyam/Operating%20Rules%20&%20Incident%20SOPs%20402522641d388149a54feda43da1bc1b.md) |
| Understand the products and tools being maintained | [Products](https://app.notion.com/p/3ec4ee2c51c181839db6fcab2eeb5a53?pvs=21) |
| Find operational procedures and workflows | [Operations](https://app.notion.com/p/3ec4ee2c51c1811c9bf1fe48bea6ca56?pvs=21) |
| Find recurring tasks, checklists, domains and access records | [Trackers](https://app.notion.com/p/3ec4ee2c51c18159a6e9cc0bff6ade7e?pvs=21) |
| Change or troubleshoot the website | [Website Technical Documentation](https://app.notion.com/p/Myntmore-Website-Technical-Documentation-3bb522641d38805e9fa6efd74304abd2?pvs=21) · [Website Prompt Library](https://app.notion.com/p/Myntmore-Website-Prompt-Library-32f522641d3880ef98a0d605a4f217cb?pvs=21) |
| Change or troubleshoot the dashboard | [Dashboard Technical Documentation](https://app.notion.com/p/Myntmore-Dashboard-Technical-Documentation-3bb522641d38805b9eb1d49664e84351?pvs=21) · [Dashboard Non-Technical Documentation](https://app.notion.com/p/Myntmore-Dashboard-Non-Technical-Documentation-3bb522641d38804391c6f95f9dc57542?pvs=21) |
| Find historical onboarding examples | [Onboarding Reference & Legacy Checklists](Myntmore%20Handover%20%E2%80%94%20Sanyam/Onboarding%20Reference%20&%20Legacy%20Checklists%20402522641d38813ba1e0c72bd4a5b1b5.md) |

## Recurring operating rhythm

| When | Responsibility | Evidence |
| --- | --- | --- |
| Monday | 13-task website health audit | Completed checklist and issues |
| Weekly | Week-over-week SEO report to Tejas | Search and technical performance |
| 3–4 times/week | Draft blogs; content approval; weekly batch publishing | Approved drafts and live URLs |
| 3 times/week | Repurpose Instagram videos as YouTube Shorts | Published Shorts |
| Monthly | Review Gemini API usage | Usage review and escalations |
| Approx. monthly / as needed | Test website forms | Form, CRM and notification results |
| As needed | Website/dashboard fixes, domains, tools and client projects | Task, test evidence and deployment record |

**Work management:** Slack = requests and updates · ClickUp = tasks and deadlines · Notion = SOPs and technical references. Material requests should be tracked in ClickUp even when they arrive through Slack.

## Priority risks to close

1. **Supabase recovery:** no formal pre-change backup process is documented. Establish and test a safe backup and recovery procedure before destructive work.
2. **Zoho monitoring:** missing Calendly Deals are investigated reactively. No proactive reconciliation or automated failure alerts are documented.
3. **Website forms:** only the main lead form has a documented Slack alert. Test every form's Zoho Forms record, CRM mapping, confirmation and notification.
4. **Access ownership:** confirm current owners and backup access for GitHub, Vercel, Supabase, Google AI Studio, Zoho, domains and analytics.
5. **API keys:** key naming is inconsistent and regular rotation is not established. Confirm secure storage, usage ownership and compromise response.
6. **Credentials in Notion:** proxy usernames and passwords were found in proxy pages and the shared proxy database. They have now been removed from those locations. Rotate or revoke the affected proxy credentials. A separate Notion Passwords page contains linked credential databases; its values have not been inspected or changed. An authorised owner must migrate those entries to the approved company password manager, rotate credentials stored in Notion, and restrict access.
7. **People and approvals:** confirm successor, reporting line, training duration, readiness standard, production approval boundaries and Sanyam's support window.

## Decisions required from Tejas

- [ ]  Confirm the incoming successor and reporting line.
- [ ]  Agree training duration and practical readiness criteria.
- [ ]  Decide Sanyam's post-handover support window and escalation route.
- [ ]  Confirm approval boundaries for production changes.
- [ ]  Approve a Supabase backup/recovery approach.
- [ ]  Confirm named owners and backup owners for accounts, billing and integrations.
- [ ]  Rotate or revoke the proxy credentials previously stored in Notion, then verify replacements in the approved credentials manager.
- [ ]  Assign an authorised owner to migrate entries from the separate Notion Passwords databases into the approved password manager, rotate those credentials, and restrict access.
- [ ]  Assign ongoing ownership for Zoho Flow monitoring and API/subscription reviews.

## Recorded walkthroughs

Historical discussions help explain why certain dashboard changes were requested. They do not prove that the work was completed. Compare each item with the live dashboard and current documentation.

| Date | Recording | Recheck |
| --- | --- | --- |
| 2 June 2026 | [Internal dashboard and client SaaS discussion](https://fathom.video/calls/693217513) | Later-month lead conversion attribution; independent usability test |
| 5 June 2026 | [Dashboard simplification discussion](https://fathom.video/calls/698152973) | Simplified navigation, mandatory targets, client health and high-score alerts |
| 11 June 2026 | [Roles and permissions discussion](https://fathom.video/calls/705245457) | Manager, Super Admin and Client Creator permissions |
| 30 June 2026 | [Client portal review](https://fathom.video/calls/727247131) | Highlights, notifications, PDF report and founder/client access |
| 6 July 2026 | [Monthly dashboard review](https://fathom.video/calls/733364900) | Monthly filters, newsletter analytics, freeze-pane and lead-source attribution |

## Final handover checklist

- [ ]  Successor named; reporting line confirmed.
- [ ]  System owners, backup owners and access levels recorded.
- [ ]  Website audit and SEO report completed independently.
- [ ]  Blog and Shorts workflows completed independently.
- [ ]  Dashboard administration and client-isolation tests passed.
- [ ]  Supabase backup and recovery procedure documented and tested.
- [ ]  Calendly → Zoho Flow → CRM tested, including duplicate and failure scenarios.
- [ ]  Every live website form tested end to end.
- [ ]  Domains, renewals, subscriptions and API usage owners confirmed.
- [ ]  Open issues and technical debt assigned with priorities and review dates.
- [ ]  Sanyam's support window and escalation route agreed.
- [ ]  Final handover accepted by Tejas.

<aside>
✅

**Definition of done:** The successor can independently operate the critical systems, find the runbooks, identify when to escalate and complete routine work without undocumented dependence on Sanyam.

</aside>

## Detailed documentation and archive

The pages below contain the full technical manuals and supporting references. Keep detailed procedures in their relevant pages; use this page as the navigation and management overview.

[Responsibilities, Systems & Recurring Work](Myntmore%20Handover%20%E2%80%94%20Sanyam/Responsibilities,%20Systems%20&%20Recurring%20Work%20402522641d3881608d4ee7f34794f256.md)

[Operating Rules & Incident SOPs](Myntmore%20Handover%20%E2%80%94%20Sanyam/Operating%20Rules%20&%20Incident%20SOPs%20402522641d388149a54feda43da1bc1b.md)

[Onboarding Reference & Legacy Checklists](Myntmore%20Handover%20%E2%80%94%20Sanyam/Onboarding%20Reference%20&%20Legacy%20Checklists%20402522641d38813ba1e0c72bd4a5b1b5.md)