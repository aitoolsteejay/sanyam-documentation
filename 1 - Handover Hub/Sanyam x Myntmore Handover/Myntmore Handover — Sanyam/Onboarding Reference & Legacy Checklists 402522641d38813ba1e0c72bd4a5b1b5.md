# Onboarding Reference & Legacy Checklists

## Navigation & legacy status

- **Current handover source of truth:** [Myntmore Handover — Sanyam](../Myntmore%20Handover%20%E2%80%94%20Sanyam%203f5522641d38819697c4e985805d92fd.md)
- **Responsibilities and cadence:** [Responsibilities, Systems & Recurring Work](Responsibilities,%20Systems%20&%20Recurring%20Work%20402522641d3881608d4ee7f34794f256.md)
- **Safe operating procedures:** [Operating Rules & Incident SOPs](Operating%20Rules%20&%20Incident%20SOPs%20402522641d388149a54feda43da1bc1b.md)

**Legacy warning:** The onboarding sequence below is a suggested reference only. It is not an agreed training schedule, successor assignment or sign-off. Confirm the incoming owner's skills, reporting line, training duration and readiness criteria before using it as a live plan.

---

This page preserves the previous onboarding reference material. Some generic checklists contain unconfirmed assignments, tools, and timelines; use the current handover guides for actual working practices.

- 🗓️ First-week onboarding path
    
    **Day 1 — Context and access**
    
    - Read **Start Here**, **Products**, **Operations**, and **Trackers**.
    - Confirm access to Notion, GitHub, Vercel, Supabase, Zoho, Waalaxy, n8n, Zapier, domains, and communication tools.
    - Locate the credentials manager and confirm no secrets are stored in this page.
    - Meet the primary technical, operations, and client-facing owners.
    
    **Day 2 — Website and dashboard**
    
    - Review website routes, resources, guides, forms, analytics, and deployment.
    - Review dashboard architecture, roles, client isolation, reporting weeks, imports, metrics, and RLS.
    - Run the dashboard test checklist in a safe environment.
    - Record questions in the handover tracker.
    
    **Day 3 — Automations and data**
    
    - Trace one lead or client record through CRM, automation, database, and notification paths.
    - Review Zoho, Waalaxy, n8n, and Zapier workflows, schedules, failure handling, and ownership.
    - Reconcile one dashboard report or export against its source.
    - Confirm backup, recovery, and incident escalation steps.
    
    **Day 4 — Guided practice**
    
    - Make a small safe website change in preview.
    - Run a test CSV import with synthetic data.
    - Check a permission or client-isolation scenario.
    - Practice finding logs, checking a deployment, and documenting the result.
    
    **Day 5 — Independent handover**
    
    - Complete one change from request through test, review, deployment or rollback, and documentation.
    - Review daily, weekly, and monthly responsibilities.
    - Walk through open issues, technical debt, renewals, and known risks.
    - Mark onboarding items complete and record follow-ups.
- 🔐 Access and ownership inventory
    
    Store passwords, API keys, recovery codes, and secrets only in the approved credentials manager.
    
    | System or asset | Purpose | Owner | Access location | Renewal or review date | Backup owner | Status |
    | --- | --- | --- | --- | --- | --- | --- |
    | Notion workspace | Handover and operating documentation | [name/team] | Workspace invite | [date] | [name] | [status] |
    | GitHub repositories | Website and dashboard source code | [name/team] | Organization repository | [date] | [name] | [status] |
    | Vercel | Website and dashboard deployments | [name/team] | Project and team settings | [date] | [name] | [status] |
    | Supabase | Dashboard database, auth, storage, and RLS | [name/team] | Project dashboard | [date] | [name] | [status] |
    | Zoho CRM | Leads, clients, and CRM workflows | [name/team] | Organization account | [date] | [name] | [status] |
    | Waalaxy | Outreach campaigns and imports | [name/team] | Workspace account | [date] | [name] | [status] |
    | n8n | Workflow automation | [name/team] | Workspace or hosted instance | [date] | [name] | [status] |
    | Zapier | Connected app automations | [name/team] | Team workspace | [date] | [name] | [status] |
    | Domains and DNS | Website and email routing | [name/team] | Registrar and DNS provider | [date] | [name] | [status] |
    | Analytics and search tools | Traffic, conversions, and search reporting | [name/team] | Property or account settings | [date] | [name] | [status] |
    | Billing and subscriptions | Hosting, tools, domains, and renewals | [name/team] | Billing owner account | [date] | [name] | [status] |
    
    > For every row, document the named owner, access level, renewal date, backup owner, and recovery path. Review monthly and after any team change.
    > 
- 🧩 System map
    
    ```jsx
    Visitor or client
          ↓
    Myntmore website
          ├─ forms, resources, guides, analytics, and conversion events
          └─ Vercel deployment, domain, DNS, and monitoring
          ↓
    CRM and automation layer
          ├─ Zoho CRM: leads, clients, pipeline, and ownership
          ├─ Waalaxy: outreach campaigns and CSV exports
          ├─ n8n: multi-step workflows, webhooks, and scheduled jobs
          └─ Zapier: connected app automations and notifications
          ↓
    Myntmore dashboard
          ├─ React/Vite application deployed through Vercel
          ├─ Supabase Auth: sessions and user identity
          ├─ Supabase database: myntmore schema, metrics, campaigns, and client data
          └─ RLS and route guards: access control and client isolation
          ↓
    Outputs
          ├─ client and internal reports
          ├─ exports and reconciliations
          ├─ notifications and follow-up tasks
          └─ documentation, runbooks, and audit records
    ```
    
    For each feature, trace the path from user action or scheduled trigger to source data, transformation, permission check, output, notification, and documentation. Record the owner and failure path for every connection.
    
- 🔑 Credentials and secrets procedure
    
    Use the approved password manager or account owner for all credentials. This page should contain locations, owners, and request steps only.
    
    **Where access is managed**
    
    - Store passwords, API keys, OAuth secrets, recovery codes, service-role keys, and billing credentials in the approved credentials manager.
    - Keep access tied to named users or team accounts where possible; avoid shared personal logins.
    - Record the account owner, backup owner, service, permission level, and recovery method in the access inventory.
    - Review access when someone joins, leaves, changes role, or no longer needs a system.
    
    **How to request access**
    
    1. Identify the system, required role, business reason, and expected duration.
    2. Ask the named owner or backup owner through the approved internal channel.
    3. Grant the minimum access needed and record who approved it.
    4. Test access without copying secrets into Notion, tickets, chat, screenshots, code, or logs.
    5. Remove temporary access when the task is complete and update the inventory.
    
    **Never copy into documentation**
    
    - Passwords, API keys, tokens, cookies, session data, recovery codes, private keys, service-role keys, database connection strings, or full sensitive exports.
    - Screenshots that reveal credentials, personal data, client data, financial details, or security settings.
    - Secrets in source code, environment files committed to Git, browser notes, Loom recordings, or public issue trackers.
    
    **If a secret is exposed**
    
    - Stop using it, notify the owner, rotate or revoke it, check logs and dependent integrations, and record the incident without reproducing the secret.
- 🛠️ Known issues and technical debt
    
    Use this register for problems that are understood but not yet fully fixed. Link each item to the relevant prompt, incident, task, or repository issue.
    
    | Issue or debt | Impact | Current workaround | Owner | Recommended fix | Priority | Status | Review date |
    | --- | --- | --- | --- | --- | --- | --- | --- |
    | [Short problem statement] | [Who or what is affected] | [Safe temporary process] | [Name/team] | [Proposed fix] | Critical / High / Medium / Low | Open / Monitoring / Planned | [Date] |
    | [Example: stale deployment asset] | [Users may see an old or blank page] | [Hard refresh or rollback] | [Name/team] | [Cache-safe deployment and verification] | High | Open | [Date] |
    | [Example: manual import correction] | [Reporting may require rechecking] | [Reconcile against source file] | [Name/team] | [Validation and quarantine workflow] | Medium | Open | [Date] |
    
    **When adding an issue**
    
    - Describe the observable problem and affected systems.
    - State the user, client, revenue, security, or operational impact.
    - Record the workaround and its limits.
    - Assign one owner and a review date.
    - Link the recommended fix, evidence, and acceptance criteria.
    - Close the item only after the fix is verified in the relevant environment and the documentation is updated.
- 🚦 Critical workflows
    
    Use these guides for high-impact tasks. Record the environment, owner, evidence, and follow-up after each run.
    
    - CSV imports
        1. Confirm the client, campaign, reporting week, source file, and destination environment.
        2. Check the file name, headers, row count, date range, encoding, and expected fields.
        3. Compare the source with the import mapping and identify duplicate or invalid rows.
        4. Use a safe preview or test environment first when available.
        5. Import with the correct client and week scope; do not overwrite manual fields without confirming precedence.
        6. Verify inserted and rejected row counts, metrics, ownership, and downstream reports.
        7. Save the source reference, validation result, and any corrections in the tracker.
    - Deployments
        1. Confirm the change, owner, target environment, linked issue, and rollback plan.
        2. Run type checks, tests, build, and relevant route or integration checks.
        3. Review environment variables, migrations, feature flags, redirects, and generated files.
        4. Deploy to preview and test authentication, permissions, client isolation, core workflows, and mobile states.
        5. Compare preview and production configuration before promotion.
        6. Deploy to production during the agreed window and monitor logs, errors, routes, and critical workflows.
        7. Verify the live result, record the deployment reference, and roll back if acceptance checks fail.
    - Client setup
        1. Confirm the client name, owner, scope, contract or project context, required users, and data sources.
        2. Create or verify the client record, identifiers, campaign relationships, reporting week, and required permissions.
        3. Invite users with the minimum appropriate role and confirm the client assignment.
        4. Test the client portal and dashboard with a client-scoped account.
        5. Verify RLS, route guards, exports, notifications, and that another client’s data is inaccessible.
        6. Add the client to recurring tasks, reporting ownership, integrations, and documentation.
        7. Record the setup evidence, unresolved items, and handoff owner.
    - Reporting
        1. Confirm the client, reporting week, date range, source systems, and reporting owner.
        2. Check imports, metric definitions, missing values, duplicates, and stale data.
        3. Reconcile totals and calculated metrics against the source database or files.
        4. Review permissions and ensure the report contains only the intended client’s data.
        5. Compare the dashboard view with the export or client-facing report.
        6. Record discrepancies, corrections, and approval before sharing.
        7. Save the final report location, review date, and follow-up actions.
    - Outreach
        1. Confirm the audience, campaign, offer, sending limits, domains, mailboxes, and approval status.
        2. Validate the source list, deduplication, personalization fields, suppression rules, and client ownership.
        3. Check Waalaxy, Zoho, n8n, Zapier, Smartlead, or related workflow settings before launch.
        4. Run a small test or preview and verify links, variables, reply routing, and notifications.
        5. Launch within the approved schedule and monitor sends, bounces, replies, failures, and provider limits.
        6. Pause the campaign if data, targeting, deliverability, or messaging is wrong.
        7. Record campaign settings, results, owner, and next review in the relevant tracker.
    - Incident response
        1. Identify the symptom, time detected, affected system, users or clients, and severity.
        2. Contain the issue: pause jobs, revoke exposed access, disable a feature, stop an import, or roll back when appropriate.
        3. Preserve evidence such as logs, request IDs, screenshots, deployment references, and affected record IDs without copying secrets.
        4. Notify the technical owner and the relevant security, operations, client, or finance owner.
        5. Diagnose the source across the UI, API, database, RLS, integrations, deployment, and scheduled jobs.
        6. Apply and verify the safest recovery; reconcile affected data and confirm permissions.
        7. Communicate status and impact, document the timeline, assign follow-ups, and update the runbook or known-issues register.