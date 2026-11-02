# Work Update Tracker

Branch: main
Flag: Not in use (Oct 2026). Will be handed to the new owner as an incomplete project. The Gemini call moved server-side on 1 Oct 2026 (the README still says client-side). Known limits: permissions enforced only in the React app (no Supabase Auth/RLS), so anyone with the anon key can read or write rows via the API; full-row upserts can race; no automated tests. Next ideas: Supabase Auth, reminders, search, CSV export, trend charts, file uploads.
Framework: Vite
GitHub repo: aitoolsteejay/workupdatetracker
Hosted on: Vercel (aitoolsteejay team)
Keys used (names only): Supabase URL + anon key (main project "workupdatetracker"), Gemini (now server-side)
Live URL: https://workupdatetracker-kappa.vercel.app
Owner: Sanyam
Status: Live - not in use
System: Internal tools
Type: Internal
What it is: Internal tool for daily work logs, updates and AI (Gemini) reports. Built by Sanyam with Claude Code. INCOMPLETE: paused before finishing.