# Monthly maintenance

Loom: *(add link)*

## Proxies (monthly + on demand)

1. Log in to the proxy provider: *(name, login)*
2. Refresh or rotate the proxies: *(which ones, how many, for which tool or client)*
3. Update every tool or client that uses them: *(where the proxy list is kept)*
4. Test the connection

## Supabase storage check

1. Open each Supabase project: *(project names → which app uses each)*
2. Settings → Usage: compare database and storage size to the plan limit
3. If it's over 80%, clean up old data or upgrade: *(who approves)*
4. Confirm backups are on

## Dashboard and connections (Vercel, GitHub, domains)

1. Vercel → each project → Deployments: the latest deploy should be green
2. Vercel → Domains: everything should be Verified ([heymyntmore.com](http://heymyntmore.com) and [myntmorenow.com](http://myntmorenow.com) are not set up yet)
3. GitHub: each repo is still connected to its Vercel project
4. Open [dashboard.myntmore.com](http://dashboard.myntmore.com) and check it shows live data

## Existing tools and API keys

1. Make the monthly changes: *(list what usually changes)*
2. API keys are not rotated. There is one fixed Gemini API key, on the company [aitoolsteejay@gmail.com](mailto:aitoolsteejay@gmail.com) Google AI Studio account: just check the tools still work

## Repo leak check

1. GitHub: all 8 repos are private
2. Scan for committed keys or .env files (GitHub secret scanning or gitleaks)
3. No secret should have a VITE_ or NEXT_PUBLIC_ name unless it's meant to be public (Supabase anon keys are fine; Gemini keys are not)
4. If a key ever leaks, replace it on the same aitoolsteejay account and update it in Vercel straight away

---

## Found in Notion (added 30 Sep 2026)

### Proxy renewal calendar

| Provider | Cost | Renews | Who |
| --- | --- | --- | --- |
| MarsProxies | $2.25/mo each | 29th | TJ LinkedIn, Aditya, Sahil, Hozefa/Punam, Nilesh, JJ |
| Luna Proxy | $5/mo | 14th / 10th / 1st | Sandeep/Vandana (14th), Nizar (10th), Arpit (1st) |
| Dataimpulse | $5 per 5GB | top up | Divya (SKC), Ramesh Iyer |
| Roundproxies | $6 per 2GB | top up | Vinu |
| Decodo | — | — | Hyderabad |
| Geonix | — | needs a new plan | TJ (Mumbai) |

Details: [Proxies database](PROXIES%203eb4ee2c51c181d6a008f68300c65f57.md) · [Proxy pricing](PROXIES/Proxy%20Pricing%203eb4ee2c51c1816eb279cd5d99724eb0.md) · [Costing sheet](COSTING%203eb4ee2c51c181dc8794e58ae0e897b8.md). The credentials there are in plain text; move them to the vault.

### Supabase projects

- gapaawxbkfmpthfesuyw: dashboard (schema myntmore) + website leads
- dbaxhgedupktogldzzpk: Profile Optimizer

### Deploy flow for the website

- Repo aitoolsteejay/ClaudeCode. Work on the workshop-redirect branch, open a PR into master, merge, and Vercel auto-deploys.
- Adding a new AI tool: follow the 8-step checklist in the [Website technical docs](https://app.notion.com/p/Myntmore-Website-Technical-Documentation-3eb4ee2c51c181b6a3abefe0481526d2?pvs=21) (section 5).
- Dashboard deploy and migration SOPs: [Dashboard docs](https://app.notion.com/p/Myntmore-Dashboard-Technical-Documentation-3eb4ee2c51c181de88dfeceaa729a5e6?pvs=21) (sections 15–17).