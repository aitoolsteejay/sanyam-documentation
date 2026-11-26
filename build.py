#!/usr/bin/env python3
"""Build the AI & Operations knowledge-base website from the Notion export.

Run:  python3 build.py            show everything, including passwords and keys
      python3 build.py --redact   hide passwords, API keys, tokens and proxy logins
Reads the Notion export in the parent folder, writes data.js + assets/ next to
this script. index.html is the static app shell and is not regenerated.
"""
import csv, hashlib, json, os, re, shutil, sys
from urllib.parse import unquote

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, '..'))
SITE_DIRNAME = os.path.basename(HERE)
ASSETS = os.path.join(HERE, 'assets')
SKIP_PARTS = ['Export Archive']           # duplicate JSON dump of the same workspace
ID_RE = re.compile(r'^(.*?)\s+([0-9a-f]{32})(_all)?\.(md|csv)$')
NOTION_URL_ID = re.compile(r'notion\.so/[^)\s]*?([0-9a-f]{32})')

# ---------------------------------------------------------------- redaction
MASK = '••••••'
REDACT = '--redact' in sys.argv   # passwords/keys are shown unless built with --redact
SECRET_KEY_RE = re.compile(r'(?i)(password|passwd|\bpwd\b|secret|token|api[ _-]?key|private key|access key)')
TOKEN_PATTERNS = [
    re.compile(r'\bsk-(?:proj-|ant-[a-z0-9]+-)?[A-Za-z0-9_\-]{16,}'),
    re.compile(r'\bAIza[0-9A-Za-z_\-]{30,}'),
    re.compile(r'\bgh[pousr]_[A-Za-z0-9]{20,}'),
    re.compile(r'\bgithub_pat_[A-Za-z0-9_]{20,}'),
    re.compile(r'\beyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]*'),
    re.compile(r'\bxox[abpr]-[A-Za-z0-9\-]{10,}'),
    re.compile(r'\b(?:re|rk|sb|whsec|SG|sbp|vercel|hf)_[A-Za-z0-9_\.\-]{16,}'),
    re.compile(r'\bAKIA[0-9A-Z]{16}\b'),
]
LABELLED = re.compile(
    r'(?i)\b(password|passwd|pwd|passcode|secret(?: key)?|api[ _-]?key|token|access key|private key|client secret)'
    r'(\s*(?:\([^)\n]*\))?\s*(?:[:=]|\s[–-]\s)\s*)([^\s|][^\n|]*)')
PROXY_CRED = re.compile(r'\b((?:\d{1,3}\.){3}\d{1,3}|[a-z0-9.\-]+\.[a-z]{2,}):(\d{2,5}):([^\s:|,]+):([^\s|,]+)')
PROXY_AFTER_PORT = re.compile(r'([A-Za-z][\w.\-]*\.[a-z]{2,}:\d{2,5}(?:/?\]\([^)\s]*\))?):([^\s|,]+)')
PORT_USER_PASS = re.compile(r'(?<![\d:])(\d{2,5}):([A-Za-z][^\s:|,]*):([^\s|,]+)')
URL_CRED =re.compile(r'://([^/\s:@]+):([^/\s@]+)@')
HIGH_ENTROPY = re.compile(r'(?<![/\w=.\-])(?=[\w\-]*[A-Z])(?=[\w\-]*[a-z])(?=[\w\-]*\d)[A-Za-z0-9_\-]{36,}\b')


class Redactor:
    def __init__(self):
        self.count = 0

    def _sub(self, rx, repl, text):
        text, n = rx.subn(repl, text)
        self.count += n
        return text

    def text(self, t):
        if not t or not REDACT:
            return t
        for rx in TOKEN_PATTERNS:
            t = self._sub(rx, MASK, t)
        t = self._sub(LABELLED, lambda m: m.group(1) + m.group(2) + MASK, t)
        t = self._sub(PROXY_CRED, lambda m: f'{m.group(1)}:{m.group(2)}:{MASK}:{MASK}', t)
        t = self._sub(PROXY_AFTER_PORT, lambda m: f'{m.group(1)}:{MASK}', t)
        t = self._sub(PORT_USER_PASS, lambda m: f'{m.group(1)}:{MASK}:{MASK}', t)
        t = self._sub(URL_CRED, f'://{MASK}:{MASK}@', t)
        t = self._sub(HIGH_ENTROPY, MASK, t)
        return t

    def value(self, key, v):
        if REDACT and v and v.strip() and SECRET_KEY_RE.search(key or ''):
            self.count += 1
            return MASK
        return self.text(v)


# ---------------------------------------------------------------- scan
nodes = {}       # id -> node
dir_owner = {}   # folder path -> owning node id
path2id = {}

for dirpath, dirnames, filenames in os.walk(SRC):
    rel = os.path.relpath(dirpath, SRC)
    if rel.split(os.sep)[0] == SITE_DIRNAME or any(p in rel for p in SKIP_PARTS):
        dirnames[:] = []
        continue
    dirnames.sort()
    for fn in sorted(filenames):
        m = ID_RE.match(fn)
        if not m or any(p in fn for p in SKIP_PARTS):
            continue
        stem, nid, allv, ext = m.groups()
        full = os.path.join(dirpath, fn)
        path2id[full] = nid
        n = nodes.setdefault(nid, {'id': nid, 'stem': stem, 'dir': dirpath})
        if ext == 'md':
            n['kind'] = 'page'
            n['file'] = full
        else:
            n['kind'] = 'db'
            n['csv_all' if allv else 'csv'] = full
        own = os.path.join(dirpath, stem)
        if ext == 'csv' or own not in dir_owner:
            dir_owner[own] = nid

for n in nodes.values():
    n['parent'] = dir_owner.get(n['dir'])
    n['children'] = []

root_id = None
for n in nodes.values():
    if n['parent'] is None and n['kind'] == 'page' and n['dir'] == SRC:
        root_id = n['id']
if not root_id:
    sys.exit('Could not find the root page')

# ---------------------------------------------------------------- assets
if os.path.isdir(ASSETS):
    shutil.rmtree(ASSETS)
os.makedirs(ASSETS)
asset_map = {}


def asset(full):
    if full not in asset_map:
        ext = os.path.splitext(full)[1].lower()
        name = hashlib.md5(full.encode()).hexdigest()[:12] + ext
        shutil.copy2(full, os.path.join(ASSETS, name))
        asset_map[full] = 'assets/' + name
    return asset_map[full]


# ---------------------------------------------------------------- markdown processing
LINK_RE = re.compile(r'(!?)\[([^\]\n]*)\]\(([^)\n]+?)\)')
WHOLE_DB_LINE = re.compile(r'^\s*\[[^\]]*\]\(([^)]+?\.csv)\)\s*$')
REL_REF = re.compile(r'([^,()]+?) \(([^()]+?\.md)\)')
PROP_RE = re.compile(r'^([A-Za-z][^:\n]{0,48}?): (.*)$')


def resolve(base, href):
    href = href.split('#')[0]
    if not href or re.match(r'^[a-z]+:', href):
        return None
    return os.path.normpath(os.path.join(base, unquote(href)))


def rewrite_links(md, base):
    def db_line(m):
        p = resolve(base, m.group(1))
        nid = path2id.get(p)
        return f'\n<div class="db-embed" data-db="{nid}"></div>\n' if nid else m.group(0)

    md = '\n'.join(WHOLE_DB_LINE.sub(db_line, ln) for ln in md.split('\n'))

    def link(m):
        bang, text, href = m.groups()
        href = href.strip()
        if href.startswith('http'):
            mm = NOTION_URL_ID.search(href)
            if mm and mm.group(1) in nodes:
                return f'{bang}[{text}](#/p/{mm.group(1)})'
            return m.group(0)
        p = resolve(base, href)
        if not p:
            return m.group(0)
        if p in path2id:
            return f'{bang}[{text}](#/p/{path2id[p]})'
        if os.path.isfile(p):
            return f'{bang}[{text}]({asset(p)})'
        return m.group(0)

    return LINK_RE.sub(link, md)


def rewrite_relations(v, base):
    def rel(m):
        p = resolve(base, m.group(2).strip())
        nid = path2id.get(p)
        name = m.group(1).strip()
        return f'[{name}](#/p/{nid})' if nid else name
    return REL_REF.sub(rel, v)


def plain(md):
    t = re.sub(r'```.*?```', ' ', md, flags=re.S)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = re.sub(r'!\[[^\]]*\]\([^)]*\)', ' ', t)
    t = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', t)
    t = re.sub(r'[#*_>`|\-]{1,}', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()


def description(md):
    for para in re.split(r'\n\s*\n', md):
        p = para.strip()
        if not p or p.startswith(('#', '|', '<div', '![', '```')) or re.fullmatch(r'\[[^\]]*\]\(#/p/\w+\)', p):
            continue
        t = plain(p)
        if len(t) > 25:
            return t[:180] + ('…' if len(t) > 180 else '')
    return ''


total_redactions = 0

for n in nodes.values():
    if n['kind'] != 'page':
        continue
    red = Redactor()
    with open(n['file'], encoding='utf-8', errors='replace') as f:
        text = f.read()
    lines = text.split('\n')
    title = n['stem']
    if lines and lines[0].startswith('# '):
        title = lines[0][2:].strip()
        lines = lines[1:]
    i = 0
    while i < len(lines) and not lines[i].strip():
        i += 1
    j = i
    while j < len(lines) and PROP_RE.match(lines[j]):
        j += 1
    props = []
    if j > i and (j == len(lines) or not lines[j].strip()):
        for ln in lines[i:j]:
            k, v = PROP_RE.match(ln).groups()
            v = red.value(k, v)
            v = rewrite_links(rewrite_relations(v, n['dir']), n['dir'])
            props.append([k.strip(), v])
        lines = lines[j:]
    body = red.text('\n'.join(lines).strip('\n'))
    body = rewrite_links(body, n['dir'])
    n.update(title=title, props=props, md=body, red=red.count,
             words=len(plain(body).split()), desc=description(body))
    total_redactions += red.count

# databases
for n in nodes.values():
    if n['kind'] != 'db':
        continue
    red = Redactor()
    src = n.get('csv_all') or n.get('csv')
    with open(src, encoding='utf-8-sig', errors='replace', newline='') as f:
        rows = list(csv.reader(f))
    cols = [c.strip() for c in rows[0]] if rows else []
    owner = nodes.get(n['parent'])
    n['title'] = (owner['title'] if owner and owner.get('title') else n['stem'])
    if n['stem'].lower() != 'untitled':
        n['title'] = n['stem']
    n['desc'] = f'Table · {max(len(rows) - 1, 0)} rows · {len(cols)} columns'
    out = []
    for r in rows[1:]:
        r = r + [''] * (len(cols) - len(r))
        out.append([rewrite_links(rewrite_relations(red.value(cols[k], v), n['dir']), n['dir'])
                    for k, v in enumerate(r[:len(cols)])])
    n.update(cols=cols, rows=out, props=[], md='', red=red.count, words=0)
    total_redactions += red.count

# hierarchy + row linking
for n in nodes.values():
    if n['parent'] in nodes:
        nodes[n['parent']]['children'].append(n['id'])
    else:
        n['parent'] = None if n['id'] == root_id else root_id
        if n['id'] != root_id:
            nodes[root_id]['children'].append(n['id'])

def sort_key(cid):
    c = nodes[cid]
    return (0 if c['kind'] == 'db' else 1, c.get('title', '').lower())

for n in nodes.values():
    n['children'].sort(key=sort_key)
    if n['kind'] == 'db':
        by_title = {}
        for cid in n['children']:
            by_title.setdefault(nodes[cid].get('title', '').strip().lower(), cid)
        n['rowIds'] = [by_title.get((r[0] if r else '').strip().lower()) for r in n['rows']]
        for cid in n['children']:
            nodes[cid]['isRow'] = True

# sections = direct children of root
root = nodes[root_id]
sections = [c for c in root['children'] if nodes[c]['kind'] == 'page']
sections.sort(key=lambda c: nodes[c]['title'])


def mark_section(nid, sid):
    nodes[nid]['sec'] = sid
    for c in nodes[nid]['children']:
        mark_section(c, sid)

for s in sections:
    mark_section(s, s)

# quick finder + shortcuts from the root page
finder, shortcuts, sec_desc = [], {}, {}
cur = desc_pending = None
for ln in root['md'].split('\n'):
    m = re.match(r'^\|\s*(.+?)\s*\|\s*\[([^\]]+)\]\(#/p/(\w+)\)\s*\|', ln)
    if m:
        finder.append([m.group(1), m.group(3)])
    h = re.match(r'^###\s+(.*)$', ln)
    if h:
        cur = next((s for s in sections if nodes[s]['title'].strip() == h.group(1).strip()), None)
        desc_pending = cur
        continue
    if cur and desc_pending == cur and ln.strip() and not ln.lstrip().startswith(('[', '**', '<', '|')):
        sec_desc[cur] = plain(ln)
        desc_pending = None
    if cur and 'Useful shortcuts' in ln:
        shortcuts[cur] = [[t, i] for t, i in re.findall(r'\[([^\]]+)\]\(#/p/(\w+)\)', ln)]
        cur = None

for sid, d in sec_desc.items():
    nodes[sid]['desc'] = d

# hand-written one-line descriptions (descriptions.json: {id: text}); section
# intros from the root page take precedence
DESC_FILE = os.path.join(HERE, 'descriptions.json')
if os.path.exists(DESC_FILE):
    with open(DESC_FILE, encoding='utf-8') as f:
        for nid, d in json.load(f).items():
            if nid in nodes and nid not in sec_desc and d:
                nodes[nid]['desc'] = d

# ---------------------------------------------------------------- write
KEEP = ['id', 'kind', 'title', 'parent', 'children', 'props', 'md', 'red', 'words', 'desc',
        'sec', 'cols', 'rows', 'rowIds', 'isRow']
out = {nid: {k: n[k] for k in KEEP if k in n and n[k] not in (None, [], '', False, 0)}
       for nid, n in nodes.items()}
for nid in out:
    out[nid].setdefault('children', [])
site = {
    'root': root_id, 'sections': sections, 'finder': finder, 'shortcuts': shortcuts,
    'nodes': out, 'redactions': total_redactions, 'images': len(asset_map),
    'built': '25 Nov 2026 export',
}
with open(os.path.join(HERE, 'data.js'), 'w', encoding='utf-8') as f:
    f.write('window.SITE=')
    json.dump(site, f, ensure_ascii=False, separators=(',', ':'))
    f.write(';\n')

pages = sum(1 for n in nodes.values() if n['kind'] == 'page')
dbs = sum(1 for n in nodes.values() if n['kind'] == 'db')
print(f'pages={pages} tables={dbs} sections={len(sections)} images={len(asset_map)} '
      f'redactions={total_redactions} finder={len(finder)} shortcuts={len(shortcuts)}')
