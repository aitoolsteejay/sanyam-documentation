# Myntmore Dashboard — Non Technical Documentation

## Dashboard everyday user guide

This guide is for team members and client-facing users. It explains what the dashboard does and how to use it without requiring technical implementation knowledge.

**Related pages**

- [Technical runbook](Myntmore%20Dashboard%20%E2%80%94%20Technical%20Documentation%203bb522641d38805b9eb1d49664e84351.md)
- [Handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

### Find what you need

| If you need to… | Start with |
| --- | --- |
| Understand account permissions | Who can see what |
| Enter weekly client metrics | How the weekly routine works |
| Understand dashboard sections | What's inside the dashboard |
| Troubleshoot a save or data issue | Things worth knowing / Quick answers |
| Change users or database behavior | Technical runbook; confirm approval first |

**Ownership distinction:** Account managers enter routine client performance data. Technical maintenance and database changes are separate responsibilities.

---

## What is this tool?

This is the internal system Myntmore's team uses every week to track how each client is doing, manage tasks, and keep an eye on the business overall. Think of it as a company control panel — one place to enter numbers, see performance, and spot problems early.

- **Live site:** https://dashboard-myntmore-five.vercel.app

---

## How to use this guide

Start here if you need to understand the dashboard without reading technical implementation details.

1. Read **What is this tool?** for the purpose and main use cases.
2. Read **Who can see what** before helping a user or changing access.
3. Use **How the weekly routine works** for normal operating work.
4. Use **Things worth knowing** and **Quick answers** when something looks wrong.
5. For technical changes, use the [Dashboard Technical Documentation](Myntmore%20Dashboard%20%E2%80%94%20Technical%20Documentation%203bb522641d38805b9eb1d49664e84351.md) and the [Website Prompt Library](../../../07%20%C2%B7%20Events,%20Workshops%20&%20Experiments/Workshop%20Related/%F0%9F%A7%AD%20Myntmore%20Website%20Prompt%20Library%2032f522641d3880ef98a0d605a4f217cb.md).
6. For onboarding, ownership, access, and recurring work, use the [Myntmore Handover](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21).

## Quick contents

- What is this tool?
- Who can see what
- What’s inside the dashboard
- How the weekly routine works
- What’s under the hood
- Keeping client data separate and secure
- Things worth knowing
- Quick answers to common questions

## Who can see what

There are four kinds of accounts, each with a different level of access:

| Account type | What they can do |
| --- | --- |
| **Admin** | Full access — manage clients, team members, targets, passwords, and finances |
| **Team member** | Can do the day-to-day work for the clients they're assigned to, but can't touch finances, admin settings, or manage other people's accounts |
| **Client** | Logs in through a separate client portal and only sees their own company's data — never anyone else's |
| **Disabled account** | Fully blocked — even if they try to log back in on an old browser session, they're locked out |

The system checks who's allowed to see what in three separate places at once (not just one), so even if one safeguard were somehow bypassed, the others still protect the data. This is intentional — it's not a system that relies on just "hiding a button" to keep people out of things they shouldn't see.

---

## What's inside the dashboard

| Section | What it's for |
| --- | --- |
| **Dashboard** | The weekly overview — what's missing, what's on/off target, and a summary of everything |
| **Clients** | The full list of clients and each one's individual workspace |
| **Data Entry** | Where weekly numbers get typed in, or imported from a CSV file |
| **Actionables** | The team's to-do list, with owners and due dates |
| **Monthly Targets** | Setting and tracking monthly goals |
| **Reports** | Bigger-picture performance analysis |
| **Processes** | Internal Myntmore process tracking |
| **Sales & Outreach** | How internal outreach efforts are performing |
| **Myntmore Content** | Performance of Myntmore's own social/content channels |
| **TJ Personal Brand** | TJ's Instagram, YouTube, newsletter, and video performance |
| **Settings** (admin only) | Managing team members, clients, targets, and portal access |
| **Finance** (admin only) | Financial and expense tracking |

---

## How the weekly routine works

Every week, someone on the team:

1. Picks the correct week to report on.
2. Goes to Data Entry and picks a client.
3. Fills in that client's content and lead-generation numbers.
4. Enters campaign results — either by hand, or by importing a CSV file exported from a tool called Waalaxy (this auto-fills some fields, like how many connection requests were sent and accepted, but the team still has to manually fill in things like replies and hot leads).
5. Saves the entry.
6. Repeats for internal metrics (Myntmore's own content, TJ's channels, sales activity, etc.).
7. Checks the dashboard for anything missing or under target.
8. Creates or updates to-do items if something needs attention.
9. Occasionally checks what the client would see in their own portal, to make sure it looks right.

Totals, averages, and percentages shown on the dashboard are always calculated automatically from the raw numbers entered — nobody should be typing in a "final total" separately, since that could get out of sync with the real data.

---

## What's under the hood (in plain terms)

- **Built with:** modern, standard web technologies (React, a routing/data library called TanStack, and Vite) — nothing unusual, just a well-supported way to build a fast internal tool.
- **Where data lives:** a service called Supabase, which handles both the database and the login/security system.
- **Where it's hosted:** Vercel, a common hosting service for this kind of app.

One important detail: **Myntmore's dashboard shares its underlying database service with another internal tool.** To keep the two completely separate, all of the dashboard's data lives inside its own clearly labeled area (called a "schema"), and any technical work must be careful to only touch that area — never the other tool's data.

---

## Keeping client data separate and secure

Because multiple clients' data lives in the same system, there are several deliberate, overlapping safeguards to make sure:

- Client A can never see or accidentally affect Client B's data.
- A team member can't accidentally save one client's edits under a different client if they switch clients quickly while a save is still processing.
- Even if someone tried to access the system directly (bypassing the website), the database itself refuses to hand over data the requester isn't allowed to see.

These protections are intentionally redundant — several independent checks all have to hold up, not just one.

---

## Things worth knowing (in case something looks off)

1. **Autosave is timing-sensitive.** If someone edits Client A's numbers and then quickly switches to Client B before the save finishes, the system is specifically designed to make sure the edit still lands on Client A — not wherever the person happens to be looking a few seconds later. This is tested regularly to make sure it never breaks.
2. **CSV imports don't fill in everything.** Importing a campaign file from Waalaxy only fills in a few specific fields (requests sent, accepted, and replied) — someone still needs to manually add things like hot leads, meetings booked, and notes before saving.
3. **Account and password changes go through a controlled process.** Team accounts and passwords are never edited directly in the database — there's a specific safe workflow for it, precisely so that sensitive credentials are never exposed or logged anywhere they shouldn't be.
4. **If something looks wrong with client data** (e.g. numbers showing up under the wrong client), the standard first response is to stop entering new data in that area and investigate — not to jump straight to fixing or deleting anything, since that could make it harder to figure out what actually happened.
5. **Logging out should immediately hide everything.** If a logout ever leaves dashboard information visible on screen, that's treated as a security issue and looked into right away, not just a visual glitch.

---

## Quick answers to common questions

- **"Can a client see other clients' data?"** No — this is one of the most heavily protected parts of the system, checked at multiple levels.
- **"What if the save fails while entering data?"** Whatever was typed stays visible on screen so nothing is lost — the person can just retry.
- **"Is old historical data safe from being wiped out if the dashboard changes?"** Yes — the system is built so that new features or changes don't erase or break older data; it should keep displaying correctly even if it's missing newer fields.
- **"Who can reset passwords or add new users?"** Only Admin accounts, through a specific secure process — never through directly editing the database.