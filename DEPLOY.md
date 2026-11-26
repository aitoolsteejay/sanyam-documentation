# Deploying the AI & Operations wiki to Vercel

The wiki is a static site (`index.html`, `data.js`, `assets/`) plus two functions that talk to Supabase:

- `api/status.js`: the active/inactive switches, shared by everyone (table `wiki_inactive`).
- `api/content.js`: pages and tables edited on the website (tables `wiki_pages` and `wiki_history`).

Without Supabase the site still works, but switches save only in each person's browser and the **Edit** buttons are hidden.

There is no login. Anyone with the URL can open the wiki and, once Supabase is connected, edit it. Search engines are told not to index it (`robots.txt` and a `noindex` header). To limit editing, set `WIKI_EDIT_KEY` (see step 2).

## 1. Deploy

The code is in `github.com/aitoolsteejay/sanyam-documentation` on `main`, connected to the Vercel project `sanyam-documentation`. Every push to `main` redeploys automatically.

## 2. Connect Supabase (shared switches + editing)

1. **Create the tables.** Supabase dashboard → the project → SQL Editor → New query → paste all of [`supabase/schema.sql`](supabase/schema.sql) → Run. It only creates `wiki_*` tables and does not touch anything else.
2. **Add the keys to Vercel.** Supabase → Project Settings → API (or API Keys): copy the **Project URL** and the **service_role / secret** key. Then Vercel → `sanyam-documentation` → Settings → Environment Variables, for Production (and Preview if you like):

   | Name | Value |
   | --- | --- |
   | `SUPABASE_URL` | `https://<project-ref>.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | the service_role / secret key |
   | `SUPABASE_SCHEMA` | optional, only if the tables are not in `public` (that schema must be in Supabase's exposed schemas) |
   | `WIKI_EDIT_KEY` | optional: any phrase. If set, people are asked for it once per browser before saving. |

   Or from this folder: `vercel env add SUPABASE_URL production` and `vercel env add SUPABASE_SERVICE_ROLE_KEY production` (it prompts for the value).
3. **Redeploy:** Vercel → Deployments → latest → Redeploy (or push any commit).

Check it: open `https://sanyam-documentation.vercel.app/api/status`. It should say `"writable":true`, and pages should show an **Edit** button.

The service key stays on the server (Vercel functions). The tables have Row Level Security on with no policies, so the public anon key can't read or change them.

## How editing works

- **Edit** (on any page) opens a Markdown editor with Write / Preview and a "Link to a page" picker. **Edit table** opens a grid: change cells, rename or add columns, add or delete rows.
- Saving stores the new version in `wiki_pages` and appends it to `wiki_history`. Every page view merges these edits over the Notion export, and search includes them.
- If two people edit the same page, the second save is stopped and offers "Save mine over theirs" or "Load theirs".
- **Undo all website edits** goes back to the Notion version (the edited version stays in `wiki_history`).

## Updating content from a new Notion export

1. Drop a new Notion export into `Private & Shared 4/` (replacing the old `AI & Operations` folder and page).
2. `python3 build.py` (rebuilds `data.js` and `assets/`; add `--redact` to hide passwords and keys).
3. Commit and push to `main`.

Edits made on the website stay on top of the new export. Page IDs come from Notion, so an edited page keeps its edit. Use **Undo all website edits** on a page to show the new Notion text instead.

## Running locally (no Vercel, no Supabase)

```bash
python3 serve.py      # http://localhost:8765
```

Locally, switches save to `status.json` and edits to `edits.json` in this folder (not committed).
