# Responsibilities, Systems & Recurring Work

<aside>
🧭

**ROLE & OPERATING RHYTHM**

This page explains what Sanyam currently owns, how the work is performed and how often it happens. Use it to transfer responsibilities, not as proof that a task has been completed or that a successor is trained.

**Use this page for:** role scope · recurring work · current tools · ownership boundaries · unresolved decisions.

[Myntmore Handover — Sanyam](../Myntmore%20Handover%20%E2%80%94%20Sanyam%203f5522641d38819697c4e985805d92fd.md)

</aside>

## At a glance

| Topic | What this page establishes |
| --- | --- |
| Role | Website, SEO/content, dashboard/Supabase, Zoho workflows, domains, tools and client technical work |
| Work rhythm | Weekly, monthly and as-needed responsibilities |
| Working tools | Slack for requests, ClickUp for tasks, Notion for procedures |
| Training | Gradual access and autonomy based on demonstrated skill |
| Not yet decided | Successor, reporting line, training length, readiness test and Sanyam's future involvement |

**Handover rule:** For each responsibility, Sanyam should demonstrate the process, the successor should repeat it independently, and the evidence/result should be recorded in the handover tracker.

---

## Sanyam → Incoming Technical Intern | Consolidated Operating Handover

**Discovery complete: 20 October 2026.** This is the current operating reference based on Sanyam's answers. Use the existing sections and technical manuals linked below for detailed procedures. *Current practice* and *recommended improvements* are different. The intern is not yet hired; their skill level, reporting line and training duration are unknown. Sanyam will train and guide them, but his longer-term involvement is undecided.

### Role and onboarding

The intern will eventually take over **all** Sanyam's work: website stability and SEO/AEO/GEO; blogs and YouTube Shorts; Myntmore Dashboard, user accounts and Supabase; Zoho Flow, Zoho Forms and website leads; domains; new internal tools and occasional client technical projects; and technical subscription/usage monitoring. Start with an overview of the systems and existing Notion documentation, then demonstrations and practical tasks. Access and production independence increase **gradually** based on skill. Initial tasks, readiness criteria and sign-off are not yet set.

**Work management:** Slack = requests/updates; ClickUp = task assignments, deadlines and progress; Notion = SOPs/technical references. Some quick Slack requests are handled without ClickUp. Prioritize Tejas's needs alongside urgency, business impact and deadlines. Small verified documentation corrections may be made independently; major procedural edits need review.

### Established recurring work

- **Every Monday:** Run the existing 13-task [Weekly](https://app.notion.com/p/Weekly-3f3522641d3880af9b04ee0a524e5932?pvs=21). In the Website Claude Code project, begin a **new session** and follow the checklist's prompts. Claude Code performs most checks; review recommendations before implementing fixes.
- **Every week:** Produce a **week-over-week SEO report** via Claude Code covering search performance (clicks, impressions, CTR and rankings) and technical SEO (indexing, site health, links and Core Web Vitals). Share with Tejas on Slack and discuss verbally. The separate full SEO reporting framework covers executive summary, KPI scorecard, brand/nonbrand GSC, rankings, indexing, technical, content, backlinks, business outcomes, AI visibility, competitors, work shipped, actions and methodological limits. Use deeper monthly/quarterly views where data permits; **do not fabricate missing metrics or present the entire framework as the current weekly deliverable**.
- **3–4 website blogs per week:** A dedicated Claude project draws on TJ's existing LinkedIn newsletters and Myntmore website blogs to draft new posts. Share drafts in **Notion for content-team approval**. Publish the approved blogs **together in one weekly batch**, with **no fixed day**, using Claude Code → GitHub → Vercel.
- **3 YouTube Shorts per week:** Repurpose videos already published on Tejas's Instagram, without changing the video; write YouTube-specific titles, descriptions and hashtags. Upload manually in YouTube Studio. **No fixed posting days**; Tejas manages channel access.
- **Monthly:** Review client-specific Gemini API key usage in Google AI Studio.
- **Monthly approximately, plus when issues arise:** Check website forms through manual test submissions.
- **As needed:** Website/dashboard stability, domain and database work, new pages, apps and features, client technical work, billing/renewal checks and troubleshooting. There is no blanket daily check for every system.

### Website, SEO and deployment

Development uses **Claude Code → GitHub → automatic Vercel deployment**. Some smaller changes go straight to main; larger changes may use branches, reviews and Vercel preview deployments. Claude Code generates commit messages; GitHub history is the primary change record. Approval depends on **business impact, technical complexity and visibility**; some major changes require Tejas, others may proceed independently. The intern's autonomy grows over time.

**Website upkeep:** Pages load, links work, deployments succeed, page speed and Core Web Vitals improve. Monitor with Google Search Console, Vercel and Google Analytics via Claude Code (MCP/API/CLI setup). Sanyam occasionally checks proactively and responds to issues. New SEO/AEO/GEO pages are made **as needed**, based on GSC, Claude research and manual judgment; Claude drafts/builds, Sanyam reviews and refines content/design/SEO.

**New-page indexing:** Update sitemap; verify live URL/canonical; manually request indexing through Search Console; review during weekly audit. If not indexed, usually wait **3–5 days**, then investigate with GSC and Claude Code.

**Speed changes:** Claude Code investigates/implements improvements; verify using PageSpeed Insights before/after, Claude technical tests and manual checks. **No fixed score target.** Current post-deployment checks are mostly functional; the technical manuals provide more comprehensive SEO/mobile/performance validation.

**Rollback:** When a new deployment breaks production, first restore the last functioning **Vercel deployment** when safe. Check Vercel logs/status and manually verify affected pages; then diagnose/fix with Claude Code, test and redeploy. Rollback will not undo database migrations.

### Calendly bookings and Zoho Flow

**Zoho Flow**, under Jahnvi's account, handles Calendly booking → Zoho CRM **Deal** creation at **Meeting Scheduled**. Five distinct Calendly booking-link sources: **LinkedIn, Event Led Growth, Website, WhatsApp, Cold Emailing**. If **either email OR phone** matches an existing CRM record, the booking is **skipped**. The exact matching modules, source-to-link mappings and repeat-booking behavior need verification. [**Make.com](http://Make.com) has no automations built by Sanyam yet**; older n8n/Zapier references should not be assumed active.

**Failure process:** Reactive. Someone reports a missing Deal; open Zoho Flow execution history, investigate and manually create a missing Deal as needed **after checking for duplicates**. No confirmed routine proactive reconciliation.

### Website forms and lead notifications

Forms are made in **Zoho Forms under Jahnvi's Zoho account**. Submissions are stored there and synced to Zoho CRM as **Leads**. Duplicate Lead handling is **unknown** and must be tested, not inferred from Calendly.

**Only the main website lead-generation form** sends successful-submission alerts to Slack **#website-leads**, through a **direct Zoho Forms–Slack integration**. Other forms do not have Slack notifications; **no automated failure alerts** are configured.

Sanyam changes form questions/fields in Zoho Forms; edits appear on the website automatically, without a website code deploy. New fields require **manual Zoho CRM Lead field mapping**. Test website submission → correct CRM Lead fields → #website-leads Slack alert. Investigate faults in Zoho Forms and via Claude Code; for missing Slack alerts first check Zoho Forms integration settings. Minor edits may eventually be done independently; major edits require the appropriate approver depending on purpose.

### Myntmore Dashboard and Supabase

Dashboard issues come from team reports or Sanyam's own occasional checks. **Describe bug to Claude Code → diagnose/fix → manually verify → GitHub → automatic Vercel deployment.** New features arise occasionally; small ones can be done independently, major ones discussed with Tejas. Account managers enter client performance data; **the technical intern does not own routine metric entry**.

**User admin:** Create users in Dashboard Admin Panel → Settings; new accounts default to **Team Member**. **Only Tejas approves Admin elevation.** Assign client accounts to the correct client and test that other clients' data is inaccessible. When employment/client relationships end, **disable accounts rather than deleting**. Password resets: Admin Panel/Settings is preferred; authorized Supabase Authentication admin is fallback, never direct password-table edits.

**Database:** Sanyam primarily uses the **Supabase Dashboard** directly as needed for data, schema, troubleshooting, authentication and RLS. Zoho CRM administration is **rare**. The Dashboard shares its Supabase project with another tool: scope technical changes to the documented `myntmore` schema. **No formal pre-change backup process exists**; establish and test one before destructive work.

### Domains, new apps and client work

**GoDaddy** (Tejas grants access): Buy domains, configure DNS records, monitor renewals and troubleshoot **as needed**.

**New tools:** Requirements arrive from Tejas, other team members or Sanyam's initiatives. Build in Claude Code, push GitHub, deploy Vercel. Use Claude technical checks plus manual testing; larger work is discussed with Tejas.

**Client tools:** Occasional landing pages, sites and automations. Account manager typically briefs requirements, handles client communication and user walkthroughs; Sanyam builds, deploys, tests and maintains. Sign-off varies. Prioritize problems by severity, client impact and account manager input.

**Gemini:** Client projects usually deploy on Myntmore's Vercel account, and each has a **separate Gemini API key** from Google AI Studio, configured in the project's Vercel environment variables. All keys sit under **one Google Cloud project**; key names indicate client projects but no uniform naming convention exists. Separate keys do **not** guarantee separate bills/quotas. Usage is reviewed **monthly**; abnormal usage is investigated with AI Studio/Claude Code, mitigated as appropriate and escalated to Tejas if needed. Key retention after project closure depends on project; no regular rotation. Immediately escalate suspected key compromise.

### Access, subscriptions and support

| Platform | Owner / access arrangement |
| --- | --- |
| GitHub, Vercel, Supabase, Google AI Studio | Associated with `aitoolsteejay@gmail.com` |
| Zoho Forms and Zoho Flow | Jahnvi's Zoho account |
| Claude Code | Existing Claude Teams account; some configurations reused, others set up afresh |
| Google Analytics and Search Console | Tejas grants access |
| GoDaddy and Tejas's YouTube | Tejas grants access |

Access should be supplied **gradually** with the minimum permissions needed; do not publish passwords, recovery codes or API keys in Notion.

Sanyam monitors billing/renewals of Vercel, Supabase, Claude Teams, GoDaddy and AI Studio **as needed**, escalating payment issues to Tejas/Jahnvi. For unsolved technical faults, independently research or contact platform support. First-call contacts for critical outages are **not finalized**; inform relevant stakeholders based on affected system.

### Deferred decisions and known gaps

**Undecided:** Intern reporting structure, future role of Sanyam, training duration, readiness/sign-off criteria, first independent assignment, documentation owner, handover success priorities, first outage escalation contacts, approval boundaries, and pending project inventory (deferred).

**Verify before treating as fact:** Detailed account access and handover subpages; Zoho Forms duplicate handling; exact Calendly record matching and link mapping; full website form behavior; Claude integrations; backup availability and rollback scenarios.

**Proposed improvements, not current process:** Safe Supabase backup/recovery SOP; proactive Calendly/CRM reconciliation and form-failure alerts; stable Gemini key naming; a durable SEO reporting record; minimum technical documentation for new tools.

---