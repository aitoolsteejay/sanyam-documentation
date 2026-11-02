# outreach-tool

Branch: main
Flag: Nothing in the app sends LinkedIn requests. Waalaxy's API can only list campaigns/lists and import prospects into an existing campaign, so campaigns and messages are set up in Waalaxy by hand and the team logs into client LinkedIn accounts in a real browser. SECURITY: stores client LinkedIn passwords (encrypted) and 2FA codes (plaintext), accepted as is. Migrations are not applied on deploy. Decision (Oct 2026): stay on Waalaxy, no move to Bindago.
Framework: Next.js
GitHub repo: aitoolsteejay/outreach-tool
Hosted on: Vercel (aitoolsteejay team)
Keys used (names only): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY, WAALAXY_API_KEY, CREDENTIALS_ENCRYPTION_KEY
Live URL: https://outreach.myntmore.com
Owner: Sanyam
Status: In progress
System: Outreach Tool
Type: Internal
What it is: Myntmore Outreach Tool: a done-for-you LinkedIn outreach portal, not self-serve automation. Clients submit a brief (goal, offer, tone, 300-character note + 1–3 follow-ups with delays) and a lead CSV. The team configures and runs the campaign in Waalaxy by hand, then reports results back (typed numbers or a Waalaxy export upload). Also captures client LinkedIn logins (AES-256-GCM encrypted) and relays 2FA codes/phone approvals; alerts, lead labels, CSV export. Next.js 16, Supabase schema outreach.