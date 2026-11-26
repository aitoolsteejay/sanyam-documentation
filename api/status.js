// Active / inactive switches for the wiki, stored in Redis (Upstash) on Vercel.
// Connect a Redis store from the Vercel Marketplace (Upstash for Redis); it adds
// KV_REST_API_URL and KV_REST_API_TOKEN automatically. Without a store the
// site still works: switches are read from status.json and saved per browser.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY = 'ai-ops-wiki:status';

function seed() {
  try {
    const data = JSON.parse(readFileSync(join(process.cwd(), 'status.json'), 'utf8'));
    if (Array.isArray(data.inactive)) return { inactive: data.inactive };
  } catch {}
  return { inactive: [] };
}

function store() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redis(s, command) {
  const r = await fetch(s.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${s.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!r.ok) throw new Error(`Redis responded ${r.status}`);
  return (await r.json()).result;
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export async function GET() {
  const s = store();
  if (!s) return json({ ...seed(), writable: false });
  try {
    const raw = await redis(s, ['GET', KEY]);
    const data = raw ? JSON.parse(raw) : seed();
    return json({ inactive: data.inactive || [], updated: data.updated, writable: true });
  } catch {
    return json({ ...seed(), writable: false });
  }
}

export async function POST(request) {
  const s = store();
  if (!s) return json({ error: 'No storage connected. Switches are saved in this browser only.' }, 503);
  const text = await request.text();
  if (text.length > 2_000_000) return json({ error: 'too large' }, 413);
  let ids;
  try {
    ids = JSON.parse(text).inactive;
  } catch {
    return json({ error: 'bad request' }, 400);
  }
  if (!Array.isArray(ids) || !ids.every((i) => typeof i === 'string' && /^[0-9a-f]{32}$/.test(i))) {
    return json({ error: 'bad request' }, 400);
  }
  const out = { inactive: [...new Set(ids)].sort(), updated: new Date().toISOString() };
  try {
    await redis(s, ['SET', KEY, JSON.stringify(out)]);
  } catch {
    return json({ error: 'Could not save' }, 502);
  }
  return json({ ok: true, inactive: out.inactive.length });
}
