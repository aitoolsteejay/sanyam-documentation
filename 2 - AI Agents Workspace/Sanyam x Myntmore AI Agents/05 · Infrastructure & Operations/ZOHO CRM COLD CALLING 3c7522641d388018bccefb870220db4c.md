# ZOHO CRM COLD CALLING

## Navigation & reference status

- **Parent:** [Infrastructure & Operations](../05%20%C2%B7%20Infrastructure%20&%20Operations%203ea522641d3881ca9977cd7d6a079297.md)
- **Central handover:** [Sanyam handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

**Important:** This is a process reference, not proof that the suggested CRM fields, macros, scoring rules, custom views or dialer integrations are configured. Verify the live Zoho setup with the CRM owner before training the team.

**Review before reuse:** Record the owner, review date, test performed, evidence and unresolved issues. Do not assume that a documented workflow is currently enabled or healthy.

---

**1. Build the right calling list (Leads module)**

- Import your raw list into Leads, then run **Deduplicate Records** before anyone touches it — nothing wastes time faster than two reps calling the same number.
- Add a few custom fields that matter for manual calling: **Call Disposition** (Connected / No Answer / Voicemail / Wrong Number / Not Interested / Callback Requested / Qualified), **Call Attempts** (auto-incrementing number), **Best Time to Call**, and **Do Not Call** (checkbox).
- Use **Custom Views** to slice the list into workable chunks — e.g., "Not yet contacted," "Callback due today," "3+ attempts, no connect." Reps should always be working from a filtered view, never the raw list.
- Use **Scoring Rules** to rank leads by fit (title, industry, company size) so reps call the best-fit prospects first when they only have limited hours.

**2. Log calls fast, even without a dialer**

- Every Lead/Contact record has a **Log a Call** button — rep dials manually from their phone, then clicks Log a Call, sets the disposition, adds a note, and it's timestamped on the record automatically. Takes seconds.
- Set up a **Macro** (Zoho CRM's one-click multi-action button) called something like "Call Complete" that, in one click: logs the call, updates disposition, and creates the next follow-up task — so reps aren't doing three separate steps after every dial.
- On mobile, the **Zoho CRM app** lets a rep tap the phone number to launch their native phone dialer, then comes back to the app to log the outcome — same workflow, just from their phone between calls.

**3. Never lose a follow-up**

- **Workflow Rules**: auto-create a Task the moment a rep sets disposition to "Callback Requested," due at the time/date they note. Auto-flag a lead for manager review after N consecutive no-answers.
- Reps should start every day from the **Tasks module filtered to "Due Today"** combined with their fresh call list — that's their whole queue in one place.
- **Blueprint** can enforce process: a lead can't move from "Attempted" to "Connected" to "Qualified" without the disposition field being filled in. Keeps everyone consistent even without a supervisor listening in.

**4. Multi-touch structure without a dialer**

- **Sales Sequences** still work great here — they just orchestrate emails and *tasks* (reminders to call) rather than dialer actions. E.g., Day 1: task "Call + intro email," Day 4: task "Call again," Day 6: "value email," Day 9: "final call." The rep executes the calls manually, but Zoho keeps queuing the reminders.

**5. Scripts and objection handling, in-context**

- Pin your call script and objection-handling notes as a **Note** on the Leads module (or link a doc), so reps have it right next to the record while dialing — no tab-switching.

**6. Track performance without call-log data**

- Since there's no automatic dial/connect data from a phone system, your reports rely on what reps log manually — so disposition-logging discipline is the single most important habit to build. From there:
    - **Reports/Dashboards** on dispositions logged per rep per day (activity)
    - Connect rate = Connected ÷ Total logged calls
    - Qualification rate = Qualified ÷ Connected
    - Funnel report by list/tag source to see which lists are worth calling
- Tag leads by source/campaign on import so you can compare list quality later.

**7. Assignment and territory**

- If multiple reps are calling from the same pool, use **Assignment Rules** (round-robin or territory-based) so leads route automatically and nobody double-dials.