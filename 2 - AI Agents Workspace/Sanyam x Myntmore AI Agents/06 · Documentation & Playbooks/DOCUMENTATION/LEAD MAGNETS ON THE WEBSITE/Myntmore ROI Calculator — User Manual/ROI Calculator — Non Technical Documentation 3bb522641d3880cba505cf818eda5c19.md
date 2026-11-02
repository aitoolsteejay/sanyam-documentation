# ROI Calculator — Non Technical Documentation

## Navigation & document status

- **Product hub:** [ROI Calculator](../Myntmore%20ROI%20Calculator%20%E2%80%94%20User%20Manual%203b4522641d388084a37bf70898bba2bb.md)
- **Related guide:** [Technical guide](ROI%20Calculator%20%E2%80%94%20Technical%20Documentation%203bb522641d38805ca398f783eca54f72.md)
- **Central handover:** [Sanyam handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

**Verification note:** Confirm the live screens, permissions, labels and workflow before relying on this user-facing guide.

**Maintenance rule:** Record the date, owner, tested environment, evidence, and any unverified or skipped checks when updating this document.

---

## What is this tool?

This is an interactive calculator that shows a sales team what kind of return they could get from LinkedIn outreach. You move some sliders and type in a few numbers, and it instantly shows you how many outreach connections turn into replies, meetings, deals, and ultimately revenue — plus your projected ROI (return on investment). You can also export the results as a nicely branded PDF to share with a client or prospect.

This is a completely self-contained tool — nothing gets saved anywhere, and it doesn't rely on any outside servers or databases. Everything happens instantly, right in the browser, as you adjust the inputs.

---

## What you enter

- **Currency** — which currency to show numbers in
- **Monthly Outreach Volume** — how many connection requests get sent per month
- **Duration** — the time window to calculate over (1, 3, 6, or 12 months)
- **Conversion rates** (as sliders):
    - Connection Acceptance Rate
    - Response Rate
    - Positive Response Rate
    - Meeting Show-Up Rate
    - Sales Conversion Rate
- **Average Deal Value**
- **Invoices Raised per Year** (how often a customer gets billed)
- **Customer Retention Period** (how many months a customer typically stays)
- **Monthly Investment with Myntmore** (what the outreach service costs per month)

---

## What it shows you

As you adjust the sliders, the calculator instantly updates:

- A **funnel** — visually showing how your outreach numbers shrink at each stage (requests → accepted → replies → meetings → deals)
- A **line chart** — projecting revenue, cost, and profit month by month across your chosen time window
- **Total Revenue and ROI** — the headline numbers
- **Lifetime Value (LTV)** cards — see below for what these mean
- A few supporting numbers (total requests, accepted connections, replies, meetings, deals)

When you're happy with the numbers, click **Export Results** to download a branded PDF version to send along or keep for reference.

---

## A couple of things worth understanding about the math

**1. There's a small built-in "conversion boost."**
Whatever Sales Conversion Rate you type in, the calculator quietly adds one extra percentage point before using it in the final deal calculation (capped at 100%). This is done on purpose, not a bug — and the tool shows both your original number and the "adjusted" number side by side, so nothing is hidden. If someone asks "why don't my numbers exactly match my own math," this is usually why.

**2. There are two different lifetime value numbers, and that's intentional.**

- **Full Lifetime Value** — what a customer is worth over their *entire* time as a customer (regardless of the time window you picked).
- **Effective Lifetime Value** — the portion of that value that actually falls within your chosen time window. For example, if a customer typically stays 12 months but you're only calculating a 3-month ROI window, only a quarter of their lifetime value counts toward the revenue shown for that window.

This exists so the calculator doesn't overstate revenue just because someone picked a short time window with a long customer retention period.

---

## Things worth knowing

1. **Nothing is saved.** If you refresh the page, everything resets to the defaults — there's no way to save a scenario for later inside the tool itself (aside from exporting the PDF).
2. **The funnel is always gold-colored, no matter the color theme.** This was a deliberate design choice, since gold is Myntmore's brand color, and the funnel is meant to stand out consistently.
3. **The logo isn't shown on the page anymore, but it still shows up on the exported PDF.** This was intentional — the logo was removed from the on-screen header, but it was kept in the PDF export so shared results still look branded.
4. **There's no backend at all.** Everything — the math, the charts, the PDF creation — happens directly in your browser. Nothing gets sent to a server, which also means there's no risk of data being stored or leaked anywhere.

---

## Quick answers to common questions

- **"Can I save a scenario and come back to it later?"** Not currently — you'd need to export it as a PDF or note down the numbers, since refreshing resets everything.
- **"Why doesn't my ROI match a quick manual calculation?"** Most likely the small "+1%" conversion boost mentioned above — the tool clearly displays both the original and adjusted rate so you can see the difference.
- **"Does this tool require login or setup?"** No — it's a simple, no-login calculator anyone with the link can use immediately.
- **"Is any of my data being tracked or stored?"** No — since there's no backend, nothing entered into the calculator is saved, sent anywhere, or tracked.