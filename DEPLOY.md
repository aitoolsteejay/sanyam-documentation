# Deploying the AI & Operations wiki to Vercel

The wiki is a static site (`index.html`, `data.js`, `assets/`) plus one function:

- `api/status.js`: stores the active/inactive switches so everyone sees the same ones. It needs a Redis store (Upstash). Without one, the site still works and switches save in each person's browser.

There is no login. Anyone with the URL can open the wiki. Search engines are told not to index it (`robots.txt` and a `noindex` header).

## 1. Deploy

### Option A: from GitHub (recommended)

The code is in `github.com/aitoolsteejay/sanyam-documentation` on `main`.

1. Vercel dashboard → Add New → Project → import `aitoolsteejay/sanyam-documentation`.
2. Framework preset: **Other**. Root directory: `./`. Leave the build and output settings empty.
3. Deploy.

Every push to `main` redeploys automatically.

### Option B: from this folder with the CLI

```bash
cd "/Users/sanyamgolechha/Downloads/Private & Shared 4/AI-Ops-Website"
vercel login          # once
vercel --prod
```

## 2. Shared active/inactive switches (optional but recommended)

Vercel dashboard → the project → Storage → Create / Connect → **Upstash for Redis** (free tier is enough) → connect it to this project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. Redeploy once afterwards.

The first time the site loads, it starts from the switches in `status.json`. After that, changes are saved to Redis.

## Updating content later

1. Drop a new Notion export into `Private & Shared 4/` (replacing the old `AI & Operations` folder and page).
2. `python3 build.py` (rebuilds `data.js` and `assets/`; add `--redact` to hide passwords and keys).
3. Commit and push to `main` (Vercel redeploys), or run `vercel --prod`.

## Running locally (no Vercel)

```bash
python3 serve.py      # http://localhost:8765, switches save to status.json
```
