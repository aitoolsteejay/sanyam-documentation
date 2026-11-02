# Workshop Payment Gate: Razorpay Setup, Coupons & Free Trials

Design document only — nothing below has been built yet. Covers three things together since they're one system: where Razorpay setup lives, how coupon codes work, and how free trials work.

---

## 1. Where this sits, end to end

Gate point (decided earlier): WelcomeScreen keeps collecting name/email/phone for free — you keep the lead either way — then a **Payment screen** sits between signup and Step 1. Nothing past that point is reachable until the session is marked paid.

```
WelcomeScreen (free, unchanged)
      ↓  creates a workshop_sessions row, paid = false
Payment screen (NEW)
      ↓  coupon check  →  full bypass?  →  mark paid, skip Razorpay
      ↓  no coupon / partial discount
      ↓  Razorpay Checkout popup
      ↓  payment confirmed (verified server-side + webhook)
      ↓  mark paid = true
Step 1 → ... → Step 10 (unchanged)
```

### 1.1 Where the new code physically lives

Following the same pattern the app already uses for `api/gemini.ts` (a Vercel serverless function holding a secret key server-side, called from the client):

- `api/razorpay-order.ts` — creates a Razorpay Order for a session. Decides the amount itself (reads a server-side price constant/env var, optionally reduced by a validated coupon) — never trusts a client-supplied amount.
- `api/razorpay-verify.ts` — called by the client right after the Checkout popup closes successfully. Verifies the payment signature Razorpay handed back, then flips `paid = true` on that session.
- `api/razorpay-webhook.ts` — a separate endpoint, called directly by Razorpay's servers (not by your app) the moment a payment actually settles. This is the source of truth that doesn't depend on the user's browser staying open; it should be able to independently flip `paid = true` even if `razorpay-verify` never got called.
- A new `PaymentScreen.tsx` component (parallel to `WelcomeScreen.tsx`), rendered by `Index.tsx` between signup and Step 1, that loads Razorpay's Checkout script and drives the popup.
- `src/lib/workshop-store.ts` gains a couple of functions alongside the existing session helpers — something like `createOrder(sessionId, couponCode?)` and `verifyPayment(sessionId, razorpayResponse)` — following the same call-the-serverless-function pattern `callGemini` already uses.

### 1.2 Database changes (Supabase)

On `workshop_sessions`:

- `paid boolean not null default false`
- `amount_paid integer, nullable` — what was actually charged, in paise (0 for a free bypass)
- `coupon_code text, nullable` — which code was redeemed, if any
- `razorpay_order_id text, nullable` / `razorpay_payment_id text, nullable` — for reconciliation and support ("I paid but it says I haven't")

A new `coupons` table — full schema in §3.1.

Migrations go in `supabase/migrations/` following the existing timestamped-filename convention already in that folder.

### 1.3 Environment variables — what they are and where they're set

Same split the app already uses for Gemini (client-safe `VITE_`-prefixed vars vs. server-only secrets), configured in the same place: **Vercel → Project Settings → Environment Variables**, for Production/Preview/Development, exactly like `GEMINI_API_KEY` and the Supabase vars are today.

| Variable | Exposed to browser? | Where it's used | Get it from |
| --- | --- | --- | --- |
| `VITE_RAZORPAY_KEY_ID` | Yes (`VITE_`-prefixed, safe to expose — it only identifies which Razorpay account to open Checkout against) | Client: passed to Razorpay's Checkout script to open the popup | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_ID` | No | Server: same value, used server-side when creating orders / verifying signatures | Same as above (yes, you configure the same Key ID twice — once client-safe, once server-only — because the client needs it to open Checkout and the server needs it to sign requests) |
| `RAZORPAY_KEY_SECRET` | No — never prefix with `VITE_` | Server only: signs order-creation requests, verifies payment signatures | Razorpay Dashboard → Settings → API Keys (generated together with the Key ID) |
| `RAZORPAY_WEBHOOK_SECRET` | No | Server only: verifies that a webhook call genuinely came from Razorpay | Razorpay Dashboard → Settings → Webhooks, set when you create the webhook (see 1.5) |
| `WORKSHOP_PRICE_PAISE` | No | Server only: the actual price, read when creating an order. Keeping this server-only (not `VITE_`) means the price the user is charged can never be tampered with from the browser. | You decide the number |

### 1.4 Razorpay dashboard setup, step by step (once you're ready to actually do this)

1. Sign up at [razorpay.com](http://razorpay.com/), complete whatever KYC/business verification they require for a live account (this can take a few days — start it early even if you're not charging yet).
2. **Test mode first, always.** Razorpay gives you a fully separate set of test keys and test card numbers so you can run the whole flow (order → checkout → payment → webhook) without moving real money. Build and verify everything in test mode before touching live keys.
3. Dashboard → **Settings → API Keys** → generate a Key ID + Key Secret. These go into `VITE_RAZORPAY_KEY_ID` / `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.
4. Deploy `api/razorpay-webhook.ts` first (it needs to exist at a real URL before Razorpay can call it) — then Dashboard → **Settings → Webhooks** → add an endpoint pointing at `https://<your-domain>/api/razorpay-webhook`, subscribe it to the `payment.captured` event at minimum. Razorpay shows you the webhook secret at creation time — that's `RAZORPAY_WEBHOOK_SECRET`.
5. Test the whole loop with Razorpay's published test card/UPI numbers before flipping anything to live mode.
6. When ready to charge real money: switch the account to live mode, generate live API keys (separate from test keys), swap the env vars in Vercel's Production environment, keep test keys around for Preview/Development so local/staging work never risks real charges.

### 1.5 The two rules that matter most (repeating because they're the actual security boundary)

- **The server decides the price, always.** `api/razorpay-order.ts` reads `WORKSHOP_PRICE_PAISE` (or a coupon-discounted version of it) itself — it never accepts an amount the client sends.
- **Never trust the client's "it worked" callback alone.** Always verify the signature server-side in `razorpay-verify`, and treat the webhook as the real source of truth, since the client-side callback can be spoofed or simply never fire if the tab closes right after paying.

---

## 2. Coupon codes

### 2.1 Data model

New Supabase table, `coupons`:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid, PK |  |
| `code` | text, unique | Store uppercased/trimmed; compare case-insensitively |
| `discount_type` | text | `"percent"` | `"fixed"` | `"full_bypass"` |
| `discount_value` | numeric, nullable | 0-100 for percent, an amount in paise for fixed, unused for full_bypass |
| `max_redemptions` | integer, nullable | `null` = unlimited |
| `times_redeemed` | integer, default 0 | Incremented atomically (see 2.3) |
| `max_redemptions_per_email` | integer, default 1 | Stops the same person reusing it across sessions |
| `expires_at` | timestamptz, nullable | `null` = no expiry |
| `active` | boolean, default true | Manual kill-switch independent of expiry, for instantly disabling a leaked code |
| `label` | text, nullable | Your own reference note, never shown to the user |
| `created_at` | timestamptz |  |

And on `workshop_sessions`: `coupon_code` and `amount_paid` (already listed in §1.2) give you full attribution.

### 2.2 Where it's entered and how it's validated

A de-emphasized "Have a coupon code?" link on the Payment screen (keep it understated — a loud discount box undercuts the paywall for everyone without a code). On submit, the server (inside `api/razorpay-order.ts`, before creating any order) looks the code up and checks, in this order, returning a specific rejection reason each time rather than a generic "invalid":

1. Exists and `active = true`?
2. `expires_at` null or in the future?
3. `times_redeemed < max_redemptions` (skip if null)?
4. This email hasn't already redeemed this code `max_redemptions_per_email` times (query `workshop_sessions` by `coupon_code` + `user_email`)?

If it passes: `full_bypass` skips Razorpay entirely — mark `paid = true`, `amount_paid = 0`, `coupon_code = X`, go straight to Step 1. `percent`/`fixed` create the Razorpay order for the discounted amount (still server-computed) and continue through the normal Checkout/verify/webhook flow, stamping `coupon_code` once payment confirms.

### 2.3 The race condition worth actually guarding against

A publicly shared, capped coupon can get redeemed past its cap under concurrent traffic if you check-then-increment as two separate steps. Use one atomic statement instead:

```sql
update coupons
set times_redeemed = times_redeemed + 1
where code = $1
  and active = true
  and (expires_at is null or expires_at > now())
  and (max_redemptions is null or times_redeemed < max_redemptions)
returning *;
```

Zero rows back = reject. No read-then-write window for two requests to both slip through a stale count.

### 2.4 The coupon types worth actually having

- **100% bypass, low-volume** — for individual free grants (a warm lead, a partner, a team demo). Issue one code per person rather than one shared code, so a leak is contained to one use.
- **Percentage-off marketing codes** — for launches/referral programs, higher `max_redemptions`, an `expires_at` tied to the campaign.
- **Fixed-amount-off** — less common here, but reads better than an odd percentage for something like "₹200 off."

### 2.5 Managing coupons day to day (no admin UI needed)

- **Supabase Table Editor** — log into the dashboard, edit the `coupons` table directly. Fine at this scale (tens of coupons, not thousands), zero extra code.
- A protected internal route (`/workshop/admin/coupons`, gated by a hardcoded admin password env var) only becomes worth building if dashboard-editing starts feeling tedious — don't build it preemptively.

---

## 3. Free trials

Coupons answer "does *this person/campaign* get in free." Free trials answer "is the gate off *for everyone*, right now." Three approaches, increasing in precision:

### 3.1 Global kill-switch (blunt — use for pre-launch / soft-launch)

One env var, `PAYMENT_GATE_ENABLED=false`. When false, the Payment screen never renders — every session goes straight to Step 1, `paid` set true at creation regardless. Right tool for "not charging yet" or "free week for testimonials before turning payment on." Flip it, redeploy, done. All-or-nothing — can't let some people in free while charging others.

### 3.2 Quota-based (first N signups free)

At session creation, atomically check-and-increment a counter of free sessions issued so far; under the threshold → auto-mark `paid = true, amount_paid = 0`. Over it → normal payment gate. Good for a "first 100 free" launch promo without issuing individual codes. Needs the same atomic increment-and-check as §2.3 — a plain `SELECT count(*)` then a separate write lets a traffic spike blow past the intended cap.

### 3.3 Time-boxed

`FREE_UNTIL=2026-09-01` env var — every session created before that date auto-passes. Self-expiring version of the kill-switch, so you don't have to remember to turn it back off. (A *per-user* trial — free first few steps, pay to unlock the rest — is a genuinely different product shape than a payment wall with exceptions; worth calling out explicitly if that's actually what's wanted, since the gate would move mid-flow instead of staying pre-Step-1.)

### 3.4 Recommendation for this product

Since the workshop is a one-sitting, one-off purchase (not a subscription), the combination that covers realistic cases with the least moving parts: the **global kill-switch** for any period payment isn't actually live, plus **100%-bypass coupons** for individual free-access grants. Skip the quota/time-boxed variants unless there's a specific dated launch promo — a single coupon with a generous `max_redemptions` and an `expires_at` already covers that case without extra counters or cutover logic.

---

## 4. Open questions worth deciding before building any of this

- Should a free/coupon/trial session look different anywhere downstream (FinalScreen CTA nudging toward a paid upgrade or a call) versus a full-price customer?
- Should a coupon-bypassed lead still flow into the same sales/CRM pipeline a paying customer does, or get flagged separately for follow-up prioritization? (The columns above give you the filter either way — this is an operational choice, not a technical blocker.)
- Any compliance/invoicing requirement even for a ₹0 bypass, if this counts as a registered business transaction in India — worth a quick check.
- Live-mode go-live checklist: confirm KYC is complete, swap test keys for live keys in Vercel's Production env only, keep test keys in Preview/Development so staging never risks a real charge.