#!/usr/bin/env python3
"""Serve the AI & Operations wiki locally.

Works like the Vercel deployment, but stores everything in this folder
instead of Supabase:
  status.json  active/inactive switches
  edits.json   pages and tables edited on the website (plus their history)

Run:   python3 serve.py          then open http://localhost:8765
       python3 serve.py 9000     to use another port
Only listens on 127.0.0.1, so it is not reachable from other machines.
"""
import json
import os
import re
import sys
import tempfile
import threading
import time
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
STATUS = os.path.join(HERE, 'status.json')
EDITS = os.path.join(HERE, 'edits.json')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
ID = re.compile(r'[0-9a-f]{32}')
LOCK = threading.Lock()


def load(path, default):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def dump(path, data):
    fd, tmp = tempfile.mkstemp(dir=HERE, suffix='.tmp')
    with os.fdopen(fd, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
    os.replace(tmp, path)


def is_id(v):
    return isinstance(v, str) and ID.fullmatch(v)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=HERE, **k)

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _body(self, limit):
        n = int(self.headers.get('Content-Length') or 0)
        if n > limit:
            raise ValueError('too large')
        return json.loads(self.rfile.read(n))

    def do_GET(self):
        p = self.path.split('?')[0]
        if p == '/api/status':
            return self._json(200, {'inactive': load(STATUS, {}).get('inactive', []), 'writable': True})
        if p == '/api/content':
            return self._json(200, {'pages': load(EDITS, {}).get('pages', {}), 'writable': True})
        if p.startswith('/edits.json') or p.startswith('/serve.py'):
            return self._json(404, {'error': 'not found'})
        return super().do_GET()

    def do_POST(self):
        p = self.path.split('?')[0]
        try:
            if p == '/api/status':
                return self._status(self._body(2_000_000))
            if p == '/api/content':
                return self._content(self._body(4_000_000))
        except (ValueError, AttributeError, TypeError):
            return self._json(400, {'error': 'bad request'})
        return self._json(404, {'error': 'not found'})

    def _status(self, b):
        off, on = b.get('off') or [], b.get('on') or []
        if not all(is_id(i) for i in off + on):
            raise ValueError
        with LOCK:
            cur = set(load(STATUS, {}).get('inactive', []))
            cur = (cur | set(off)) - set(on)
            dump(STATUS, {'inactive': sorted(cur), 'updated': time.strftime('%Y-%m-%d %H:%M:%S')})
        return self._json(200, {'ok': True})

    def _content(self, b):
        pid = b.get('id')
        if not is_id(pid):
            raise ValueError
        by = (b.get('by') or None) and str(b['by'])[:80]
        now = datetime.now(timezone.utc).isoformat()
        with LOCK:
            data = load(EDITS, {})
            pages, hist = data.setdefault('pages', {}), data.setdefault('history', [])
            cur = pages.get(pid)
            if b.get('revert'):
                if cur:
                    hist.append(dict(cur, action='revert', saved_at=now, saved_by=by))
                    del pages[pid]
                    dump(EDITS, data)
                return self._json(200, {'ok': True, 'reverted': True})
            if cur and b.get('since') != cur['updated_at']:
                return self._json(409, {'error': 'conflict', 'current': cur})
            row = {k: b.get(k) for k in ('title', 'md', 'cols', 'rows', 'row_ids')}
            row.update(id=pid, updated_at=now, updated_by=by)
            pages[pid] = row
            hist.append(dict(row, action='save', saved_at=now, saved_by=by))
            dump(EDITS, data)
        return self._json(200, {'ok': True, 'page': row})

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    print(f'Wiki running at http://localhost:{PORT}  (Ctrl+C to stop)')
    print(f'Switches are saved to {STATUS}, website edits to {EDITS}')
    ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
