# Work Update Tracker

<aside>
📝

**What it is:** an internal tool where team members log their daily work updates, and admins see a monthly dashboard with AI-written reports (Gemini). Sanyam built it with Claude Code.

**Status: 🚧 in use, but incomplete.** The team uses it right now, but it was paused before it was finished ("no time, will pick up again"). The features below are still to build.

</aside>

## ⏱️ The tool in 60 seconds

| What | Where |
| --- | --- |
| Live app | [workupdatetracker-kappa.vercel.app](http://workupdatetracker-kappa.vercel.app) |
| Code | GitHub aitoolsteejay/workupdatetracker (branch main) |
| Hosting | Vercel project workupdatetracker (company aitoolsteejay account) |
| Database | Supabase main project "workupdatetracker" (logins on the Infrastructure page) |
| AI | Gemini, called server-side (fixed 1 Oct 2026) |
| Built with | React + Vite + TypeScript |

**How it works:** a team member logs their day in the app → the update is saved in Supabase → admins view the monthly snapshot → Gemini writes the AI report.

## 🛠️ Most common jobs

1. **Make a change and deploy it:** edit the code in the repo, check it locally (`tsc --noEmit`, then `vite build`), push to `main`, and Vercel deploys automatically. Then check the live app in the browser.
2. **If the AI report stops working:** check the Gemini key in Vercel → workupdatetracker → Settings → Environment Variables, then redeploy.
3. **If data looks wrong:** open the Supabase main project → Table editor and check the rows. There's no undo and no backups (free plan).

## ⚠️ Known limitations

In short: these are deliberate trade-offs made to ship a working internal tool for a small team, not bugs.

| # | Limitation | What it means | Fix (when picked up) |
| --- | --- | --- | --- |
| 1 | No real login (Supabase Auth) | Permission rules (who can see what) only live in the React app, not the database | Move to Supabase Auth |
| 2 | No database security rules (RLS) | Anyone with the public Supabase key could read or write any row through the API, bypassing the app | Comes with Supabase Auth, or add a backend that writes with the service-role key |
| 3 | Edits overwrite the whole row | Two people editing the same entry at once can overwrite each other | Save only the changed fields |
| 4 | No automated tests | Changes are checked by hand (`tsc --noEmit`, `vite build`, browser) | Add tests |
| 5 | ~~Gemini key in the browser~~ | ✅ Fixed 1 Oct 2026: moved server-side and the key rotated | The README in the repo still describes the old setup, so update it |

## 🗺️ What's left to build

In rough order of value:

- [ ]  Move login to Supabase Auth (unlocks real database security)
- [ ]  Reminders for people who haven't logged their day
- [ ]  Search (the header already shows a "Search (Coming Soon)" placeholder)
- [ ]  CSV/Excel export of logs and reports
- [ ]  Trend charts on the admin dashboard (it currently shows a single month)
- [ ]  Real file uploads for attachments (needs a Supabase Storage bucket)
- [x]  Move the Gemini call server-side (done 1 Oct 2026)

## 📁 Leftover files in the repo

These aren't part of the running app and are safe to ignore or delete:

- `list_models.js`: a one-off script that lists available Gemini models
- `metadata.json`: AI Studio app metadata from the original scaffold
- `models_list.json`, `tsc_output.txt`: old dev outputs
- `global.d.ts`: TypeScript type declarations for Vite's env variables (keep this one)

## ❓ Open questions

- The first half of the README (overview, setup and architecture) hasn't been added yet
- Is the README in the repo updated for the server-side Gemini change?