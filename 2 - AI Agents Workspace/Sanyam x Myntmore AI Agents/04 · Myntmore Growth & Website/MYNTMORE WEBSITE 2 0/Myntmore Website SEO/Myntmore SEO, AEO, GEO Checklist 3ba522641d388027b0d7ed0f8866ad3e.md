# Myntmore SEO, AEO, GEO Checklist

## Reporting and execution clarification (October 2026)

- The existing 13-task Monday SEO audit and its Claude Code prompts remain the recurring technical checklist. Sanyam opens a fresh session in the existing Website Claude project each week; Claude runs most checks and proposes fixes for review.
- **Weekly report currently produced:** Claude Code generates a **week-over-week** search-performance and technical-SEO report, shared with Tejas on Slack and discussed verbally. Search: clicks, impressions, CTR, position/rankings. Technical: indexing, site health, broken links, Core Web Vitals.
- **Broader reporting framework (use when sources permit):** Executive summary; consistent KPI scorecard; branded/non-branded GSC; ranking movements; crawling/indexing; technical checks; content; links/referring domains; GA organic engagement; lead/booking/pipeline attribution; AI answer visibility; competition; work completed; prioritized actions and appendix with methodology/data gaps.
- Weekly scorecard/watch items, monthly full evaluation, and quarterly strategy/competitor reviews are **guidance**, not proof those extra reports are already being delivered. Mark missing attribution, backlinks, AI citations and year-on-year baselines as unavailable when they cannot be verified.
- New blogs/landing pages: add to sitemap and request indexing manually in GSC. Check in subsequent audit; typically wait 3–5 days before diagnosing a still-unindexed page.
- The site publishes **3–4 content-team-approved blogs together per week**, without a fixed publishing day. This is distinct from new SEO landing pages, which are added as needed.

## Handover addendum — weekly SEO reporting record

The 13-task checklist is the execution procedure. This page is the evidence record for the weekly handover rhythm.

For each run, record: audit date; comparison date range; clicks, impressions, CTR and average position; indexing and canonical findings; Core Web Vitals; site-health/schema results; pages changed; deployment reference; indexing requests; unresolved issues; and next owner. Use “not available” for missing metrics and include the reason. The full reporting framework is for deeper monthly or quarterly analysis when data permits; it is not a substitute for the current weekly report.

## 1. Technical SEO

### Crawlability & Indexability

- [x]  robots.txt reviewed, nothing important blocked
- [x]  XML sitemap complete and submitted to Google Search Console
- [x]  Bing Webmaster Tools
- [x]  Sitemap contains only indexable, canonical, 200-status URLs
- [ ]  Every real page linked internally somewhere, no orphans (/1-on-1-consultation, /marketing-automation, /seo, /GIAtech-stack, /feedback, /workshop currently qualify)
- [x]  noindex correct on utility pages (/founder-meeting, /thankyou), nothing important accidentally excluded
- [x]  No crawl traps from Zoho iframe embeds or tool query params

### Site Architecture & URLs

- [x]  Flat, logical structure (/services/x, /tools/x, /blog/x, /case-studies/x)
- [x]  Breadcrumbs + BreadcrumbList schema on every page, not just index pages
- [x]  No keyword/topic overlap between the 5 service pages and the 3 industry landing pages (/lp/*) that would cannibalize each other in search

### Indexation & Duplicate Content

- [x]  Canonical tag on every page
- [x]  Duplicate-content sweep across service pages, landing pages, and tool pages
- [x]  Single canonical host ([www.myntmore.com](http://www.myntmore.com/)), HTTP to HTTPS, trailing-slash consistency

### Site Speed & Core Web Vitals

- [ ]  LCP < 2.5s / INP < 200ms / CLS < 0.1, measured via PageSpeed Insights
- [x]  Image compression + next-gen formats (verify Next.js Image is actually optimizing, not just present)
- [x]  Bundle size check on the heaviest tools (ROI Calculator is ~514kB)
- [x]  TTFB on Vercel

### Mobile & UX

- [x]  Full mobile parity, tap targets, viewport meta
- [x]  Lead-gate forms don't trigger Google's intrusive-interstitial penalty (every free tool gates output behind a LeadGate form)

### Security & Infrastructure

- [x]  HTTPS site-wide, valid SSL
- [x]  404 page helpful + real status code
- [x]  Legacy redirects (/about, /contact, /personal-branding) use a real 301/308, not a 307
- [x]  Sitemap + robots.txt cross-reference

### Structured Data

- [x]  Organization schema
- [x]  WebSite schema
- [x]  BreadcrumbList on every page
- [x]  FAQPage schema, expanded beyond the homepage
- [x]  Service schema on all 5 service pages
- [x]  JobPosting schema on the open roles (/careers/*)
- [x]  HowTo schema on every "How it works" step section (service pages + tool pages)
- [x]  Article schema on blog posts
- [x]  Person schema for the founder
- [ ]  Review/AggregateRating deferred until there's a verified third-party review source (Clutch, G2, Google reviews)

## 2. On-Page SEO

### Keyword Strategy

- [x]  Keyword mapped per service page, per tool page, per blog post, no two pages targeting the same primary term
- [x]  Search intent tagged per page (service pages = commercial, tools = transactional, blog = informational)
- [x]  Explicit check that the 3 /lp/* pages don't cannibalize the 5 /services/* pages for the same queries

### Metadata

- [x]  Titles under ~60 characters including the automatic "| Myntmore" suffix
- [x]  Meta descriptions under ~155 characters with a CTA
- [x]  Exactly one H1 per page

### Content Quality

- [x]  Every service/tool page has real substantive copy, not just a feature list
- [x]  Founder E-E-A-T: credentials, real case study numbers, sourced client results
- [x]  Stats stay internally consistent across the site
- [x]  Thin/duplicate pages consolidated

### Images & Media

- [x]  Descriptive file names + alt text
- [x]  A short demo GIF/screenshot per free tool showing it in action

### Internal Linking

- [ ]  Every blog post links to at least one relevant tool and one relevant service
- [x]  Cross-links between the 9 free tools ("try this one next")
- [x]  No broken internal links

### Conversion & UX Signals

- [x]  Clear CTAs
- [x]  Case study / client-result proof visible near CTAs
- [x]  Client logo strip visible where it counts

## 3. Off-Page SEO

- [ ]  Backlink audit + toxic link check (Ahrefs/Semrush)
- [ ]  Competitor gap analysis vs. other B2B outbound/lead-gen agencies
- [ ]  Guest posts on sales/marketing/GTM publications
- [ ]  Correct the stale third-party directory listing (Edverise, showing old pre-pivot stats)
- [ ]  Unlinked brand mention monitoring, ongoing
- [ ]  Press coverage of the 2023-24 e-commerce to B2B pivot story
- [ ]  Social profiles linked via schema sameAs
- [ ]  Community engagement where B2B/GTM people actually are: relevant subreddits, GTM-focused Slack/Discord communities, LinkedIn groups
- [ ]  Google Business Profile for the Mumbai office, if local-intent search matters
- [x]  Blogs

## 4. AEO (Answer Engine Optimization)

- [ ]  FAQ content expanded per-service (pricing model, timeline, minimum engagement) beyond the homepage and comparison page
- [ ]  Question-phrased headers on blog/guide content sections specifically
- [x]  FAQ schema on every page that has FAQ content
- [ ]  HowTo schema on "how it works" sections
- [x]  More comparison tables (e.g. "which tool should I use")
- [ ]  Track which queries you want to own a featured snippet for

## 5. GEO (Generative Engine Optimization)

- [x]  E-E-A-T: keep founder credentials and real client numbers visible and consistent
- [ ]  Publish an original benchmark report using aggregate, anonymized client data (reply rates, meeting-booking timelines, inbox placement)
- [ ]  Fix the external stale-stats listing (same item as Off-Page)
- [x]  llms.txt kept current as pages change
- [ ]  Structured data complete: Organization + Service + FAQ + Person + JobPosting
- [ ]  Manually query ChatGPT/Perplexity/Gemini for "best B2B outbound agency," "cold email agency Mumbai," etc. and track whether Myntmore shows up
- [ ]  Presence on Reddit/Quora where B2B buyers actually research vendors, plus the existing YouTube channel