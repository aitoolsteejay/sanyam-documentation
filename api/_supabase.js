// Small Supabase REST (PostgREST) client for the wiki's Vercel functions.
// Needs two environment variables in the Vercel project:
//   SUPABASE_URL               https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  service role key (server only, never sent to the browser)
// Optional:
//   SUPABASE_SCHEMA            schema holding the wiki_* tables (default "public")
//   WIKI_EDIT_KEY              if set, saving requires this key (people enter it once per browser)

export const ID_RE = /^[0-9a-f]{32}$/;

export function supabase() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  const schema = process.env.SUPABASE_SCHEMA || 'public';
  return async function rest(path, { method = 'GET', body, prefer } = {}) {
    const headers = {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Accept-Profile': schema,
      'Content-Profile': schema,
    };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (prefer) headers.Prefer = prefer;
    const r = await fetch(`${url}/rest/v1/${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await r.text();
    if (!r.ok) throw new Error(`Supabase ${r.status}: ${text.slice(0, 200)}`);
    return text ? JSON.parse(text) : null;
  };
}

export const editKeyRequired = () => !!process.env.WIKI_EDIT_KEY;

export function editAllowed(request) {
  const need = process.env.WIKI_EDIT_KEY;
  return !need || request.headers.get('x-edit-key') === need;
}

export const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export async function readBody(request, limit) {
  const text = await request.text();
  if (text.length > limit) throw Object.assign(new Error('too large'), { status: 413 });
  try {
    return JSON.parse(text);
  } catch {
    throw Object.assign(new Error('bad request'), { status: 400 });
  }
}
