#!/usr/bin/env python3
"""Serve the AI & Operations wiki locally and save the active/inactive
switches to status.json in this folder.

Run:   python3 serve.py          then open http://localhost:8765
       python3 serve.py 9000     to use another port
Only listens on 127.0.0.1, so it is not reachable from other machines.
"""
import json
import os
import re
import sys
import tempfile
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
STATUS = os.path.join(HERE, 'status.json')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765


def read_status():
    if os.path.exists(STATUS):
        try:
            with open(STATUS, encoding='utf-8') as f:
                data = json.load(f)
            if isinstance(data.get('inactive'), list):
                return data
        except (OSError, ValueError):
            pass
    return {'inactive': []}


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

    def do_GET(self):
        if self.path.split('?')[0] == '/api/status':
            return self._json(200, dict(read_status(), writable=True))
        return super().do_GET()

    def do_POST(self):
        if self.path.split('?')[0] != '/api/status':
            return self._json(404, {'error': 'not found'})
        n = int(self.headers.get('Content-Length') or 0)
        if n > 2_000_000:
            return self._json(413, {'error': 'too large'})
        try:
            ids = json.loads(self.rfile.read(n)).get('inactive')
            if not isinstance(ids, list) or not all(isinstance(i, str) and re.fullmatch(r'[0-9a-f]{32}', i) for i in ids):
                raise ValueError
        except (ValueError, AttributeError):
            return self._json(400, {'error': 'bad request'})
        out = {'inactive': sorted(set(ids)), 'updated': time.strftime('%Y-%m-%d %H:%M:%S')}
        fd, tmp = tempfile.mkstemp(dir=HERE, suffix='.tmp')
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            json.dump(out, f, indent=1)
        os.replace(tmp, STATUS)
        return self._json(200, {'ok': True, 'inactive': len(out['inactive'])})

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    print(f'Wiki running at http://localhost:{PORT}  (Ctrl+C to stop)')
    print(f'Active/inactive switches are saved to {STATUS}')
    ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
