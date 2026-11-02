# Add new website pages

Area: SEO/AEO/GEO
Frequency: Weekly
Loom recorded: No
System: Website
Tools: ClaudeCode repo → http://www.myntmore.com
Volume: 3–4 pages a week
When / how: Run the triggered checklist in docs/http://seo-aeo-geo-cadence.md on every page add/change: keyword-collision check against docs/http://keyword-map.md (one primary keyword per page), full schema pass (lib/schema.ts), sitemap entry, title/description length, two-way internal links, snippet-style FAQ answers, llms.txt update, no invented stats. Then npx tsc --noEmit + npm run build and push to master.