# Deploying the AI & Operations wiki to Vercel

The wiki is a static site (`index.html`, `data.js`, `assets/`) with:

- `middleware.js`: asks for a username and password on **every** request, including pages, data, images and the API. If `SITE_PASSWORD` is not set, the site refuses everything, so it can never go public by accident.
- `api/status.js`: stores the active/inactive switches so everyone sees the same ones. It needs a Redis store (Upstash). Without one, the site still works and switches save in each person's browser.

The content includes client names, staff emails and internal notes. Keep the password on.

## 1. Deploy

### Option A: from GitHub (recommended)

The code is in `github.com/aitoolsteejay/sanyam-documentation` on `main`.

1. Vercel dashboard → Add New → Project → import `aitoolsteejay/sanyam-documentation`.
2. Framework preset: **Other**. Root directory: `./`. Leave the build and output settings empty.
3. Before clicking Deploy, open **Environment Variables** and add `SITE_PASSWORD` (step 2 below). Then deploy.

Every push to `main` redeploys automatically.

### Option B: from this folder with the CLI

```bash
cd "/Users/sanyamgolechha/Downloads/Private & Shared 4/AI-Ops-Website"
vercel login          # once
vercel                # first run: creates the project, makes a preview deployment
```

When asked: set up and deploy → yes, link to existing project → no, project name → e.g. `ai-ops-wiki`, directory → `./`, override settings → no.

## 2. Set the password (required)

Vercel dashboard → the project → Settings → Environment Variables. Add these for Production and Preview:

| Name | Value |
| --- | --- |
| `SITE_PASSWORD` | a strong password you choose |
| `SITE_USER` | optional, defaults to `myntmore` |

Or from the terminal:

```bash
vercel env add SITE_PASSWORD
```

## 3. Shared active/inactive switches (optional but recommended)

Vercel dashboard → the project → Storage → Create / Connect → **Upstash for Redis** (free tier is enough) → connect it to this project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.

The first time the site loads, it starts from the switches in `status.json` (whatever you set locally). After that, changes are saved to Redis.

## 4. Go live

```bash
vercel --prod
```

Open the URL. The browser asks for the username and password.

## Updating content later

1. Drop a new Notion export into `Private & Shared 4/` (replacing the old `AI & Operations` folder and page).
2. `python3 build.py` (rebuilds `data.js` and `assets/`, and hides secrets again).
3. Commit and push to `main` (Vercel redeploys), or run `vercel --prod`.

Note: the GitHub repository is public. The Vercel password protects the website, but anyone can read the files in the repository.

## Running locally (no Vercel)

```bash
python3 serve.py      # http://localhost:8765, switches save to status.json
```

## What is uploaded

Everything in this folder except what `.vercelignore` lists (`build.py`, `serve.py`, this file, `.env*`). That's about 67 MB, mostly the 53 screenshots in `assets/`.
