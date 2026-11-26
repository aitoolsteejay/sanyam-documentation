// Password-protects the whole site on Vercel (pages, data.js, images and /api).
// Set SITE_PASSWORD (and optionally SITE_USER, default "myntmore") in the
// Vercel project's Environment Variables. Without SITE_PASSWORD every request
// is refused, so the wiki is never public by accident.

export const config = { matcher: '/:path*' };

function safeEqual(a, b) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

function deny(message) {
  return new Response(message, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="AI & Operations wiki", charset="UTF-8"',
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export default function middleware(request) {
  const password = process.env.SITE_PASSWORD;
  const user = process.env.SITE_USER || 'myntmore';
  if (!password) {
    return new Response('This wiki is locked: set SITE_PASSWORD in the Vercel project settings, then redeploy.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    let decoded = '';
    try {
      decoded = atob(header.slice(6));
    } catch {
      return deny('Sign in required.');
    }
    const i = decoded.indexOf(':');
    const u = decoded.slice(0, i);
    const p = decoded.slice(i + 1);
    if (i > -1 && safeEqual(u, user) & safeEqual(p, password)) return; // allowed: continue to the page
  }
  return deny('Sign in required.');
}
