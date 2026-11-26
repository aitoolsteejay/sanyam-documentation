// Active / inactive switches, stored in Supabase (table wiki_inactive).
// GET  → { inactive: [ids], writable, editKey }
// POST { off: [ids], on: [ids] } → marks ids inactive / active again.
// Without Supabase configured the site still works: switches come from
// status.json and are saved in each person's browser.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ID_RE, supabase, editAllowed, editKeyRequired, json, readBody } from './_supabase.js';

function seed() {
  try {
    const data = JSON.parse(readFileSync(join(process.cwd(), 'status.json'), 'utf8'));
    if (Array.isArray(data.inactive)) return data.inactive;
  } catch {}
  return [];
}

export async function GET() {
  const db = supabase();
  if (!db) return json({ inactive: seed(), writable: false });
  try {
    const rows = await db('wiki_inactive?select=id');
    return json({ inactive: rows.map((r) => r.id), writable: true, editKey: editKeyRequired() });
  } catch (e) {
    console.error(e);
    return json({ inactive: seed(), writable: false, error: 'Supabase unavailable' });
  }
}

export async function POST(request) {
  const db = supabase();
  if (!db) return json({ error: 'Supabase is not connected. Switches are saved in this browser only.' }, 503);
  if (!editAllowed(request)) return json({ error: 'Edit key required' }, 401);
  let body;
  try {
    body = await readBody(request, 2_000_000);
  } catch (e) {
    return json({ error: e.message }, e.status || 400);
  }
  const ok = (a) => Array.isArray(a) && a.length <= 5000 && a.every((i) => typeof i === 'string' && ID_RE.test(i));
  const off = body.off || [], on = body.on || [];
  if (!ok(off) || !ok(on)) return json({ error: 'bad request' }, 400);
  try {
    if (off.length)
      await db('wiki_inactive?on_conflict=id', {
        method: 'POST',
        body: [...new Set(off)].map((id) => ({ id })),
        prefer: 'resolution=ignore-duplicates,return=minimal',
      });
    const ons = [...new Set(on)];
    for (let i = 0; i < ons.length; i += 200)
      await db(`wiki_inactive?id=in.(${ons.slice(i, i + 200).join(',')})`, { method: 'DELETE', prefer: 'return=minimal' });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not save' }, 502);
  }
  return json({ ok: true });
}
