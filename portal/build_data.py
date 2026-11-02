import csv
import json
import os
import re

def clean_val(v):
    if v is None:
        return ""
    return v.strip()

def parse_csv(path):
    rows = []
    if not os.path.exists(path):
        return rows
    with open(path, 'r', encoding='utf-8-sig', errors='ignore') as f:
        reader = csv.DictReader(f)
        for r in reader:
            cleaned = {}
            for k, v in r.items():
                if k:
                    cleaned[k.strip()] = clean_val(v)
            if any(cleaned.values()):
                rows.append(cleaned)
    return rows

def read_text(path):
    if not os.path.exists(path):
        return ""
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

base_dir = "."
trackers_dir = os.path.join(base_dir, "3 - Trashed Pages (Products, Operations, Trackers)/Trackers")

# 1. Apps & Repos
apps_file = os.path.join(trackers_dir, "💻 Apps & Repos (Vercel + GitHub) c38cf1ff94a94ff4901e4f8ef270dba0.csv")
apps_data = parse_csv(apps_file)

# 2. Domains
domains_file = os.path.join(trackers_dir, "🌐 Domains cd3c49bf488e438385e7a2e375ba06fb.csv")
domains_data = parse_csv(domains_file)

# 3. Systems & Access
systems_file = os.path.join(trackers_dir, "🔐 Systems & Access 7cd1a87e3e144a389f96190db58dd3c3.csv")
systems_data = parse_csv(systems_file)

# 4. Recurring Tasks
tasks_file = os.path.join(trackers_dir, "🔁 Recurring Tasks 8ca740ba253b458784073907050d3c6b.csv")
tasks_data = parse_csv(tasks_file)

# 5. Loom Videos with Rich WorkDrive Links Parsing & Categorization
looms_file = os.path.join(trackers_dir, "🎥 Loom Videos to Record fc74d12d9bc544078f7d3e4d582d7541.csv")
raw_looms = parse_csv(looms_file)

video_descriptions = {
    20: "Cloning repos from the aitoolsteejay GitHub organization, setting up local environment variables (.env), navigating code with Claude Code CLI, and making automated pull requests / commits.",
    15: "Setting up custom domains inside Google Workspace and Zoho Mail, provisioning user mailboxes, and configuring core DNS authentication records: SPF, DKIM, and DMARC.",
    14: "Step-by-step walkthrough of purchasing domains on GoDaddy for cold outreach, selecting clean TLDs (.com, .io, .co), avoiding spam registry flags, and configuring initial DNS nameservers.",
    16: "Navigating Google Account Security, enabling 2FA, generating custom 16-character App Passwords, and hooking inboxes directly into Smartlead for automated email warmup and campaign sequencing.",
    6: "Comprehensive architectural tour of the myntmore.com Next.js codebase, page routing, SEO head tags, Lead Magnet embed locations, and dynamic blog generation architecture.",
    4: "Adding a new downloadable resource, cheat sheet, or tool to myntmore.com: creating the asset, adding the gated form, connecting leads to Supabase/Zoho, and deploying live on Vercel.",
}

video_categories = {
    1: "Stack & Cloud",
    2: "Stack & Cloud",
    20: "Stack & Cloud",
    4: "Website & SEO",
    6: "Website & SEO",
    7: "Website & SEO",
    8: "Command Center Dashboard",
    9: "Command Center Dashboard",
    14: "Cold Email & Domains",
    15: "Cold Email & Domains",
    16: "Cold Email & Domains",
    17: "Content & Media"
}

multi_part_definitions = {
    1: [
        {
            "part": 1,
            "title": "Part 1: GitHub aitoolsteejay Organization & Repos",
            "url": "https://workdrive.zohoexternal.com/external/1dce32f093a24f26bce2b959cfae5d7ed2d51396c442d83e463a30731e6ad5f3"
        },
        {
            "part": 2,
            "title": "Part 2: Vercel Deployments & Environment Configuration",
            "url": "https://workdrive.zohoexternal.com/external/7c7ca0a74e9178ab4a0048e227e212c4b0a1df292eb33a643486bf2179a6aa29"
        }
    ],
    9: [
        {
            "part": 1,
            "title": "Part 1: Admin Settings, Adding Clients & Portal Users",
            "url": "https://workdrive.zohoexternal.com/external/60ea91024f866035e19003fb2dd201e0a72a282e3269f102e4518646798da518"
        },
        {
            "part": 2,
            "title": "Part 2: Setting Weekly Targets & Performance Tracking",
            "url": "https://workdrive.zohoexternal.com/external/d69cdcd8cb24f768027119936e0dfc194bd6cff6a56ec0f884c5fdf8922835ca"
        }
    ]
}

looms_data = []

for idx, r in enumerate(raw_looms):
    name = r.get('Video', '').strip()
    if not name:
        continue
    primary_link = r.get('Loom link', '').strip()
    what = r.get('What to show', '').strip()
    
    # Extract leading video number if present
    match = re.search(r'^(\d+)', name)
    vid_num = int(match.group(1)) if match else None
    
    # Collect all workdrive links
    all_links = []
    if primary_link and 'workdrive' in primary_link:
        all_links.append(primary_link)
    
    extra_links = re.findall(r'https://workdrive\.zohoexternal\.com/external/[a-zA-Z0-9]+', what)
    for el in extra_links:
        if el not in all_links:
            all_links.append(el)
            
    # Enrich description if empty
    if vid_num and vid_num in video_descriptions and not what:
        what = video_descriptions[vid_num]
        r['What to show'] = what
        
    category = video_categories.get(vid_num, r.get('System', 'General'))
    
    # Build structured parts
    parts = []
    if vid_num and vid_num in multi_part_definitions:
        parts = multi_part_definitions[vid_num]
    elif all_links:
        for p_idx, lk in enumerate(all_links):
            parts.append({
                "part": p_idx + 1,
                "title": f"Part {p_idx + 1}" if len(all_links) > 1 else "Full Walkthrough",
                "url": lk
            })
            
    r['id'] = f"video_{vid_num if vid_num is not None else idx+1}"
    r['videoNumber'] = vid_num
    r['category'] = category
    r['parts'] = parts
    r['primaryWorkdriveLink'] = primary_link if primary_link else (all_links[0] if all_links else '')
    r['workdriveLinks'] = all_links
    r['hasWorkdrive'] = len(all_links) > 0
    looms_data.append(r)

# Sort looms: WorkDrive videos first (sorted numerically 01, 02, 04... 20), then pending videos sorted numerically
def sort_key(item):
    has_wd = 0 if item.get('hasWorkdrive') else 1
    num = item.get('videoNumber') if item.get('videoNumber') is not None else 999
    return (has_wd, num, item.get('Video', ''))

looms_data.sort(key=sort_key)

# Cross-reference WorkDrive videos with Apps
for app in apps_data:
    app_proj = (app.get('Project') or '').lower()
    app_sys = (app.get('System') or '').lower()
    matched_vids = []
    if 'dashboard' in app_proj or 'dashboard' in app_sys:
        matched_vids.extend([v for v in looms_data if v.get('videoNumber') in (8, 9)])
    elif 'website' in app_proj or 'myntmore' in app_proj or 'myntmore-com' in app_proj:
        matched_vids.extend([v for v in looms_data if v.get('videoNumber') in (4, 6, 7)])
    elif 'claude' in app_proj or 'repo' in app_proj:
        matched_vids.extend([v for v in looms_data if v.get('videoNumber') in (1, 20)])
    elif 'outreach' in app_proj or 'smartlead' in app_proj or 'email' in app_proj:
        matched_vids.extend([v for v in looms_data if v.get('videoNumber') in (14, 15, 16)])
    elif 'workshop' in app_proj:
        matched_vids.extend([v for v in looms_data if v.get('videoNumber') in (2, 19)])
        
    app['associatedVideos'] = [
        {
            "num": v.get('videoNumber'),
            "title": v.get('Video'),
            "url": v.get('primaryWorkdriveLink'),
            "hasWorkdrive": v.get('hasWorkdrive')
        }
        for v in matched_vids
    ]

# Cross-reference WorkDrive videos with Recurring SOP Tasks
for task in tasks_data:
    t_name = (task.get('Task') or '').lower()
    matched_vid = None
    if 'dashboard' in t_name and 'entry' in t_name:
        matched_vid = next((v for v in looms_data if v.get('videoNumber') == 8), None)
    elif 'blog' in t_name:
        matched_vid = next((v for v in looms_data if v.get('videoNumber') == 7), None)
    elif 'youtube' in t_name or 'short' in t_name:
        matched_vid = next((v for v in looms_data if v.get('videoNumber') == 17), None)
    elif 'domain' in t_name or 'inbox' in t_name:
        matched_vid = next((v for v in looms_data if v.get('videoNumber') == 15), None)
    elif 'resource' in t_name or 'deploy' in t_name:
        matched_vid = next((v for v in looms_data if v.get('videoNumber') == 4), None)
        
    if matched_vid:
        task['associatedVideo'] = {
            "num": matched_vid.get('videoNumber'),
            "title": matched_vid.get('Video'),
            "url": matched_vid.get('primaryWorkdriveLink'),
            "hasWorkdrive": matched_vid.get('hasWorkdrive')
        }

# 6. Historical Fathom Calls from Handover Overview
fathom_recordings = [
    {
        "date": "2 June 2026",
        "title": "Internal Dashboard and Client SaaS Architecture",
        "url": "https://fathom.video/calls/693217513",
        "topic": "Later-month lead conversion attribution, client usability testing, and SaaS feature requirements.",
        "platform": "Fathom"
    },
    {
        "date": "5 June 2026",
        "title": "Dashboard Simplification Discussion",
        "url": "https://fathom.video/calls/698152973",
        "topic": "Simplified navigation, mandatory weekly targets, client health scoring, and high-score alerts.",
        "platform": "Fathom"
    },
    {
        "date": "11 June 2026",
        "title": "Roles & Permissions Governance",
        "url": "https://fathom.video/calls/705245457",
        "topic": "Manager, Super Admin, and Client Creator access boundaries, RLS rules and client isolation.",
        "platform": "Fathom"
    },
    {
        "date": "30 June 2026",
        "title": "Client Portal Walkthrough & Review",
        "url": "https://fathom.video/calls/727247131",
        "topic": "Weekly highlights, notification flows, automated PDF export, and founder/client access tests.",
        "platform": "Fathom"
    },
    {
        "date": "6 July 2026",
        "title": "Monthly Dashboard Performance Review",
        "url": "https://fathom.video/calls/733364900",
        "topic": "Monthly filters, newsletter analytics, freeze-pane usability, and lead-source attribution.",
        "platform": "Fathom"
    }
]

# 7. Handover Checklist
checklist_file = os.path.join(trackers_dir, "✅ Handover Checklist bfde3c59483f4d5893b05e0b39f45d62.csv")
checklist_data = parse_csv(checklist_file)

# 8. Lovable Links & Tools
lovable_file = os.path.join(base_dir, "2 - AI Agents Workspace/Sanyam x Myntmore AI Agents/01 · Command Center/MASTER TRACKER/ALL LOVABLE Vercel LINKS/Untitled 2f6522641d38801ca24cedb72e62c411.csv")
lovable_data = parse_csv(lovable_file)

# 9. Core Documents Content
docs = {
    "handover_overview": {
        "title": "Myntmore Handover — Sanyam (Overview)",
        "category": "Management",
        "path": "1 - Handover Hub/Sanyam x Myntmore Handover/Myntmore Handover — Sanyam 3f5522641d38819697c4e985805d92fd.md",
        "content": read_text(os.path.join(base_dir, "1 - Handover Hub/Sanyam x Myntmore Handover/Myntmore Handover — Sanyam 3f5522641d38819697c4e985805d92fd.md"))
    },
    "responsibilities": {
        "title": "Responsibilities, Systems & Recurring Work",
        "category": "Operations",
        "path": "1 - Handover Hub/Sanyam x Myntmore Handover/Myntmore Handover — Sanyam/Responsibilities, Systems & Recurring Work 402522641d3881608d4ee7f34794f256.md",
        "content": read_text(os.path.join(base_dir, "1 - Handover Hub/Sanyam x Myntmore Handover/Myntmore Handover — Sanyam/Responsibilities, Systems & Recurring Work 402522641d3881608d4ee7f34794f256.md"))
    },
    "incident_sops": {
        "title": "Operating Rules & Incident SOPs",
        "category": "SOPs",
        "path": "1 - Handover Hub/Sanyam x Myntmore Handover/Myntmore Handover — Sanyam/Operating Rules & Incident SOPs 402522641d388149a54feda43da1bc1b.md",
        "content": read_text(os.path.join(base_dir, "1 - Handover Hub/Sanyam x Myntmore Handover/Myntmore Handover — Sanyam/Operating Rules & Incident SOPs 402522641d388149a54feda43da1bc1b.md"))
    },
    "website_bible": {
        "title": "Website Bible (www.myntmore.com)",
        "category": "Product Bible",
        "path": "3 - Trashed Pages (Products, Operations, Trackers)/Products/Website/Website Bible 3eb4ee2c51c1816395c4f569bc88f4f2.md",
        "content": read_text(os.path.join(base_dir, "3 - Trashed Pages (Products, Operations, Trackers)/Products/Website/Website Bible 3eb4ee2c51c1816395c4f569bc88f4f2.md"))
    },
    "dashboard_bible": {
        "title": "Dashboard Bible (dashboard.myntmore.com)",
        "category": "Product Bible",
        "path": "3 - Trashed Pages (Products, Operations, Trackers)/Products/Dashboard/Dashboard Bible 3eb4ee2c51c18161b1e8d6c9675d423c.md",
        "content": read_text(os.path.join(base_dir, "3 - Trashed Pages (Products, Operations, Trackers)/Products/Dashboard/Dashboard Bible 3eb4ee2c51c18161b1e8d6c9675d423c.md"))
    },
    "workshop_bible": {
        "title": "Workshop Bible (myntmore.com/workshop)",
        "category": "Product Bible",
        "path": "3 - Trashed Pages (Products, Operations, Trackers)/Products/Workshop/Workshop Bible 3eb4ee2c51c181f5a30fc4655feee4c5.md",
        "content": read_text(os.path.join(base_dir, "3 - Trashed Pages (Products, Operations, Trackers)/Products/Workshop/Workshop Bible 3eb4ee2c51c181f5a30fc4655feee4c5.md"))
    },
    "outreach_bible": {
        "title": "Outreach Tool Bible (outreach.myntmore.com)",
        "category": "Product Bible",
        "path": "3 - Trashed Pages (Products, Operations, Trackers)/Products/Outreach Tool/Outreach Tool Bible 3eb4ee2c51c1819a9496df8bbabba1d7.md",
        "content": read_text(os.path.join(base_dir, "3 - Trashed Pages (Products, Operations, Trackers)/Products/Outreach Tool/Outreach Tool Bible 3eb4ee2c51c1819a9496df8bbabba1d7.md"))
    },
    "lead_magnet_logic": {
        "title": "Lead Magnet Logic (Free Tools)",
        "category": "Product Guide",
        "path": "3 - Trashed Pages (Products, Operations, Trackers)/Products/Website/Lead Magnet Logic (Free Tools) 3ec4ee2c51c181ddb8a5f14259886650.md",
        "content": read_text(os.path.join(base_dir, "3 - Trashed Pages (Products, Operations, Trackers)/Products/Website/Lead Magnet Logic (Free Tools) 3ec4ee2c51c181ddb8a5f14259886650.md"))
    },
    "seo_checklist": {
        "title": "SEO / AEO / GEO Checklist & Audit",
        "category": "Growth",
        "path": "2 - AI Agents Workspace/Sanyam x Myntmore AI Agents/04 · Myntmore Growth & Website/SEO Checklist 3f3522641d3880b99ed2f833956aa1b7.md",
        "content": read_text(os.path.join(base_dir, "2 - AI Agents Workspace/Sanyam x Myntmore AI Agents/04 · Myntmore Growth & Website/SEO Checklist 3f3522641d3880b99ed2f833956aa1b7.md"))
    },
    "intern_hiring": {
        "title": "Technical Operations Intern Job Description",
        "category": "Hiring",
        "path": "2 - AI Agents Workspace/Sanyam x Myntmore AI Agents/08 · Team & Hiring/Technical Operations & AI Automations Intern 3e9522641d38801e8f73d3e03eb0a0b6.md",
        "content": read_text(os.path.join(base_dir, "2 - AI Agents Workspace/Sanyam x Myntmore AI Agents/08 · Team & Hiring/Technical Operations & AI Automations Intern 3e9522641d38801e8f73d3e03eb0a0b6.md"))
    },
    "intern_assignment": {
        "title": "Round 2 Technical Assignment & Rubric",
        "category": "Hiring",
        "path": "2 - AI Agents Workspace/Sanyam x Myntmore AI Agents/08 · Team & Hiring/Round 2 Assignment Myntmore Tech Ops & AI Automati 3f2522641d38800cb91bf8edffa4f27c.md",
        "content": read_text(os.path.join(base_dir, "2 - AI Agents Workspace/Sanyam x Myntmore AI Agents/08 · Team & Hiring/Round 2 Assignment Myntmore Tech Ops & AI Automati 3f2522641d38800cb91bf8edffa4f27c.md"))
    }
}

# Client Projects Summary
client_projects = [
    {
        "name": "KMS Pharma (Dr. Ganesan)",
        "scope": "The Four-Month Model: BA/BE study ROI calculator + ₹20k/mo SEO retainer (₹6k website maintenance + ₹14k SEO)",
        "deliverables": "Static 1,450-line index.html wizard, 13 markets, 12 currencies, jsPDF report, Microsoft Bookings CTA. 4 blogs + 8–10 backlinks/month.",
        "status": "In progress (email gate complete on Myntmore side)",
        "url": "https://kms-pharma-roi.vercel.app",
        "repo": "aitoolsteejay/kms-pharma-roi"
    },
    {
        "name": "Vimana (Ramesh Iyer)",
        "scope": "SEO, AEO & GEO Retainer (₹30,000/month)",
        "deliverables": "Weekly: 2 blogs, 20 keyword rankings tracking, competitor checks, review replies. Monthly: 10–15 outreach sites for 2–4 backlinks, 10 AI queries, 5 FAQs, Reddit/Quora answers.",
        "status": "Active retainer",
        "url": "",
        "repo": ""
    },
    {
        "name": "Amey (InsightLLM)",
        "scope": "Candidate Mind Reader client tool",
        "deliverables": "Next.js application powered by Gemini 2.5 Flash for recruiter candidate persona analysis.",
        "status": "Live - in use",
        "url": "https://candidate-mind-reader.vercel.app",
        "repo": "aitoolsteejay/candidate-mind-reader"
    },
    {
        "name": "Vinu",
        "scope": "Target Genome & Hiring Funnel Leak Tool",
        "deliverables": "Next.js tool with Gemini API to calculate hiring funnel drop-offs and ICP qualification.",
        "status": "Live - in use",
        "url": "https://target-genome.vercel.app",
        "repo": "aitoolsteejay/target-genome"
    },
    {
        "name": "SKC World",
        "scope": "Website & Knowledge Centre Rebuild + Gamification",
        "deliverables": "Competitor teardown, knowledge hub proposal, interactive gamification modules in Lovable.",
        "status": "Proposal / In progress",
        "url": "",
        "repo": ""
    },
    {
        "name": "Aditya Gupta",
        "scope": "WhatsApp Outreach Automation",
        "deliverables": "Automated WhatsApp prospect follow-up and notification pipeline.",
        "status": "Completed / Live",
        "url": "",
        "repo": ""
    },
    {
        "name": "Nizar",
        "scope": "Vacant Seat Cost Calculator & Cheat Sheet",
        "deliverables": "Lovable-built interactive calculator demonstrating the hidden cost of unfilled corporate roles.",
        "status": "In progress",
        "url": "",
        "repo": ""
    },
    {
        "name": "Zazou",
        "scope": "Shopify Integrations",
        "deliverables": "E-commerce integration workflows, pixel tracking, and product catalog sync.",
        "status": "Completed",
        "url": "",
        "repo": ""
    }
]

# Quick overview metadata
workdrive_recorded_count = sum(1 for v in looms_data if v.get('hasWorkdrive'))

metadata = {
    "agency": "Myntmore (Growth Marketing Agency)",
    "founder": "Tejas Jhaveri (4x entrepreneur, ex-Flintstop)",
    "outgoing_lead": "Sanyam (Technical Operations & AI Automations)",
    "incoming_role": "Technical Operations & AI Automations Intern (Worli, Mumbai · ₹3–6 LPA)",
    "export_date": "2026-11-02",
    "discovery_date": "2026-10-20",
    "stats": {
        "apps_count": len(apps_data),
        "domains_count": len(domains_data),
        "systems_count": len(systems_data),
        "recurring_tasks_count": len(tasks_data),
        "looms_count": len(looms_data),
        "workdrive_count": workdrive_recorded_count,
        "fathom_count": len(fathom_recordings),
        "checklist_count": len(checklist_data),
        "lovable_count": len(lovable_data),
        "docs_count": len(docs)
    }
}

full_data = {
    "metadata": metadata,
    "apps": apps_data,
    "domains": domains_data,
    "systems": systems_data,
    "recurring_tasks": tasks_data,
    "looms": looms_data,
    "fathom_calls": fathom_recordings,
    "checklist": checklist_data,
    "lovable_tools": lovable_data,
    "client_projects": client_projects,
    "docs": docs
}

os.makedirs("portal", exist_ok=True)
with open("portal/data.json", "w", encoding="utf-8") as f:
    json.dump(full_data, f, indent=2, ensure_ascii=False)

js_content = "window.PORTAL_DATA = " + json.dumps(full_data, ensure_ascii=False) + ";\n"
with open("portal/data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Data generation complete! Exported to portal/data.json & portal/data.js")
print(f"WorkDrive Recorded Videos: {workdrive_recorded_count} | Fathom Calls: {len(fathom_recordings)}")
