// Edits made from the website, stored in Supabase (wiki_pages + wiki_history).
// GET  → { pages: { id: { title, md, cols, rows, row_ids, updated_at, updated_by } }, writable, editKey }
// POST { id, title?, md?, cols?, rows?, row_ids?, by?, since? } → saves an edit.
//      since = the updated_at the editor started from (null for an unedited page);
//      if someone else saved in between, responds 409 with their version.
// POST { id, revert: true, by? } → drops the edit and goes back to the Notion export.

import { ID_RE, supabase, editAllowed, editKeyRequired, json, readBody } from './_supabase.js';

const FIELDS = 'id,title,md,cols,rows,row_ids,updated_at,updated_by';

export async function GET() {
  const db = supabase();
  if (!db) return json({ pages: {}, writable: false });
  try {
    const rows = await db(`wiki_pages?select=${FIELDS}`);
    const pages = {};
    for (const r of rows) pages[r.id] = r;
    return json({ pages, writable: true, editKey: editKeyRequired() });
  } catch (e) {
    console.error(e);
    return json({ pages: {}, writable: false, error: 'Supabase unavailable' });
  }
}

const str = (v, max) => v === undefined || v === null || (typeof v === 'string' && v.length <= max);
const grid = (v) =>
  v === undefined || v === null ||
  (Array.isArray(v) && v.length <= 5000 && v.every((r) => Array.isArray(r) && r.length <= 100 && r.every((c) => typeof c === 'string' && c.length <= 20000)));

export async function POST(request) {
  const db = supabase();
  if (!db) return json({ error: 'Supabase is not connected, so edits cannot be saved.' }, 503);
  if (!editAllowed(request)) return json({ error: 'Edit key required' }, 401);
  let b;
  try {
    b = await readBody(request, 4_000_000);
  } catch (e) {
    return json({ error: e.message }, e.status || 400);
  }
  const by = typeof b.by === 'string' ? b.by.slice(0, 80) : null;
  if (typeof b.id !== 'string' || !ID_RE.test(b.id)) return json({ error: 'bad id' }, 400);
  const id = b.id;

  try {
    const [cur] = await db(`wiki_pages?id=eq.${id}&select=${FIELDS}`);

    if (b.revert) {
      if (cur) {
        await db('wiki_history', { method: 'POST', body: { ...pick(cur), id, action: 'revert', saved_by: by }, prefer: 'return=minimal' });
        await db(`wiki_pages?id=eq.${id}`, { method: 'DELETE', prefer: 'return=minimal' });
      }
      return json({ ok: true, reverted: true });
    }

    const cols = b.cols === undefined ? null : b.cols;
    const colsOk = cols === null || (Array.isArray(cols) && cols.length <= 100 && cols.every((c) => typeof c === 'string' && c.length <= 200));
    const rowIdsOk = b.row_ids == null || (Array.isArray(b.row_ids) && b.row_ids.every((x) => x === null || (typeof x === 'string' && ID_RE.test(x))));
    if (!str(b.title, 300) || !str(b.md, 1_000_000) || !colsOk || !grid(b.rows) || !rowIdsOk)
      return json({ error: 'bad request' }, 400);

    const since = b.since || null;
    const now = cur ? cur.updated_at : null;
    if (now && since !== now && new Date(since).getTime() !== new Date(now).getTime())
      return json({ error: 'conflict', current: cur }, 409);

    const row = {
      id,
      title: b.title ?? null,
      md: b.md ?? null,
      cols,
      rows: b.rows ?? null,
      row_ids: b.row_ids ?? null,
      updated_at: new Date().toISOString(),
      updated_by: by,
    };
    const [saved] = await db('wiki_pages?on_conflict=id', {
      method: 'POST',
      body: row,
      prefer: 'resolution=merge-duplicates,return=representation',
    });
    await db('wiki_history', { method: 'POST', body: { ...pick(row), id, action: 'save', saved_by: by }, prefer: 'return=minimal' });
    return json({ ok: true, page: saved });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not save' }, 502);
  }
}

function pick(r) {
  return { title: r.title, md: r.md, cols: r.cols, rows: r.rows, row_ids: r.row_ids };
}
