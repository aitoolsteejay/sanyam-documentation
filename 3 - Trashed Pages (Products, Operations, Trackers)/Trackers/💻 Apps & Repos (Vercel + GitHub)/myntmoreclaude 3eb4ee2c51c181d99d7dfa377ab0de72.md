# myntmoreclaude

Branch: master
Flag: Deploys from master; no staging and no tests, so run npx tsc --noEmit + npm run build before pushing. Work happens on the workshop-redirect branch; merging into master is a manual PR. http://HANDOFF.md was retired in Oct 2026 (the Website Bible replaces it). Supabase leads table allows anonymous inserts/updates. next.config.js rewrites /tools/dm-angle-generator to an external Lovable app (may hide the new DM Angle page). Push over SSH, not HTTPS. SEO cadence in docs/http://seo-aeo-geo-cadence.md.
Framework: Next.js
GitHub repo: aitoolsteejay/ClaudeCode
Hosted on: Vercel (aitoolsteejay team)
Keys used (names only): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, GEMINI_API_KEY, MENTI_ADMIN_PASSWORD (no .env.example committed)
Live URL: https://www.myntmore.com
Owner: Sanyam
Status: Live - in use
System: Website
Type: Internal
What it is: Main marketing site: Next.js 14 (App Router) + TypeScript + Tailwind on Vercel. About 165 routes: 7 services + DIY, 9 /lp vertical landing pages, 8 city pages, 26 blogs, 26 case studies, 30-term glossary, guides, 9 free AI tools (/tools/*, Gemini), unlisted pricing at /plans/alpha (USD) and /plans/beta (INR), /menti live Q&A, team vCard pages, /workshop iframe. Leads: Zoho CRM forms (primary) + Supabase leads table (secondary).