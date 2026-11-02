# dashboard-myntmore

Branch: main
Flag: Weekly data-entry routine (see Recurring Tasks). No migration runner: supabase/*.sql files must be run by an admin in the Supabase SQL editor; a deploy never applies DB changes. No automated tests; run npm run check. Row-level security must match UI gating (clients, targets, tj_custom_metrics, myntmore_processes were previously too broad). Custom metrics are in exports/Reports/Monthly Progress and the docs/ folder was refreshed (Oct 2026). Tech debt: two metrics files (src/data/metrics.ts, src/lib/metrics.ts).
Framework: Vite
GitHub repo: aitoolsteejay/dashboard-myntmore
Hosted on: Vercel (aitoolsteejay team)
Keys used (names only): VITE_MYNTMORE_SUPABASE_URL, VITE_MYNTMORE_SUPABASE_PUBLISHABLE_KEY; Supabase service-role key only inside the create-portal-user edge function (never in a VITE_ variable)
Live URL: https://dashboard.myntmore.com
Owner: Sanyam
Status: Live - in use
System: Dashboard
Type: Internal
What it is: Myntmore Command Center: internal ops dashboard + client portal, the system of record for weekly delivery. React 19, Vite 7, TanStack Router, Tailwind 4, Supabase (project gapaawxbkfmpthfesuyw, schema myntmore) called straight from the browser, so row-level security is the real security boundary. Roles: admin, member, client portal. Sections: Dashboard, Data Entry, Clients, Monthly Targets, Leaderboard, High Scores, Reports, Sales & Outreach, Actionables, Processes, Finance, TJ Personal Brand, MM Company Content, Settings.