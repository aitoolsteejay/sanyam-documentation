#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    os.chdir(DIRECTORY)
    port = PORT
    httpd = None
    for p in range(PORT, PORT + 20):
        try:
            httpd = socketserver.TCPServer(("", p), Handler)
            port = p
            break
        except OSError:
            continue

    if not httpd:
        print("Could not bind to any port between 8080 and 8100.")
        sys.exit(1)

    url = f"http://localhost:{port}/index.html"
    print(f"==================================================")
    print(f"  MYNTMORE Operations & Handover Web Portal")
    print(f"  Running locally at: {url}")
    print(f"  Open this in your browser: {url}")
    print(f"  Press Ctrl+C to stop the server")
    print(f"==================================================")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == '__main__':
    run()
