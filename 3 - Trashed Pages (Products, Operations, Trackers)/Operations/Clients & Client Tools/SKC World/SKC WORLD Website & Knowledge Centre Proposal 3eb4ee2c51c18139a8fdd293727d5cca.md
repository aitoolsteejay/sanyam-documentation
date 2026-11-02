# SKC WORLD Website & Knowledge Centre Proposal

Prepared by Myntmore

**Executive Overview**

SKC World operates [skc.world](http://skc.world) as the primary digital presence for a business coaching and conscious entrepreneurship practice led by Sameer and Shalini Kamboj — 25+ years of history, a growing portfolio of programmes, and an audience of founders, CXOs, and serious professionals across India.

The current site cannot be patched into a stable foundation. A full rebuild is required — and this is the right moment to build something that does far more than the current site ever could.

This proposal covers two connected digital properties, delivered over 3 months. The brochure site is the commercial front door. The Knowledge Centre is the long-game SEO and authority asset. Together, they establish SKC World as the definitive digital home for Conscious Growth in India.

**What We Are Building**

Two distinct but connected digital properties, delivered over 3 months.

### **Property 1 — Brochure Site  ([skc.world](http://skc.world))**

The primary commercial destination for founders, CXOs, entrepreneurs, and mid-career professionals considering SKC programmes. Every design and content decision on this property serves one purpose: moving a qualified visitor towards an enquiry.

#### **KEY OBJECTIVES**

Fast, conversion-oriented experience with a single clear CTA per page — no competing asks
Programme hierarchy clearly presented: CEP → Envisioning → CSP → Anaavaran → EOS
Sameer and Shalini's credibility front and centre — bios, speaking record, book, GGI partnership
Contact and enquiry forms that work reliably across all devices and automated tools
Mobile-first design throughout — the majority of Indian professional traffic is mobile
No page-builder dependency — fully maintainable by non-technical staff

### **Property 2 — Knowledge Centre**

A knowledge-led editorial hub built for a broader audience: professionals, young adults, families, educators, and the SKC alumni community. This is not a blog. It is a structured, searchable resource that builds a relationship with SKC's thinking long before a visitor considers a programme.

#### KEY OBJECTIVES

11 content hubs across two phases, each with its own landing page and connected resources
200+ content pieces — articles, videos, downloadable guides, self-assessments, community voices
SEO and GEO optimised — structured for Google indexing and citation by AI tools
Conversion stays indirect — downloads and newsletter sign-ups only, not programme sales
Search and filter navigation built into every hub
Designed for non-technical internal management with minimal developer dependency

#### **Knowledge Centre — Content Architecture**

****Eleven hubs across two phases. Each hub is a standalone landing page connected to articles, FAQs, videos, downloadable guides, and community contributions. The two-phase structure allows the most commercially relevant content to launch first, with community and research depth added as the audience grows.

### **Phase 1 — Foundation & Reach  ·  Months 1–3**

Target: 100 content pieces live (20 new, 80 repurposed)  ·  1,500 monthly visitors  ·  150 downloads and subscriptions

Founders' Lens	From Sameer's Desk  |  From Shalini's Desk  |  Featured Talks
Coaches' Corner	Insights  |  Frameworks  |  Video Explainers
Conscious Growth at Work	Leadership & Presence  |  Purpose & Profit  |  Team & Culture  |  Stress & Self-Regulation  |  Case Studies
Young Adults	Resilience  |  Clarity  |  Conscious Growth  |  Parenting & Support  |  Voices & Stories
Tools & Frameworks	Self-Assessments  |  Downloadables  |  Checklists

### **Phase 2 — Depth & Community  ·  Month 3**

Target: 100+ additional pieces  ·  3,000+ monthly visitors  ·  1,500 downloads and subscriptions  ·  20+ external backlinks

Conscious Growth at Home	Conscious Parenting  |  Family Dynamics  |  Living with Awareness
Business & Beyond	Entrepreneurship & Market Shifts  |  Conscious Capitalism  |  Spirituality in Business  |  Collaborations
Programs in Practice	CEP Stories  |  Young Adult Journeys  |  Leadership Transformation Narratives
Research & Perspectives	Whitepapers  |  India-Specific Insights  |  Global Thought Leadership
Community Voices	Alumni Reflections  |  Sadhak Meet Learnings  |  Young Adult Voices
Events & Media	Webinars  |  Podcasts & YouTube Talks  |  Media Coverage  |  SKC in the News

#### Technical Approach

The rebuild moves entirely away from WordPress, page builders, and unmaintained plugin dependencies. The new stack is purpose-built for performance, security, and long-term maintainability by a non-technical team.

#### Frontend & Hosting

Next.js — server-side rendering on all content pages ensures full SEO crawlability from day one
Vercel — global edge deployment, preview URLs for client review before every go-live, instant rollbacks
Cloudflare — DNS management, WAF, DDoS protection, bot filtering, SSL strict mode
All pages built mobile-first and tested across device sizes

#### SEO & GEO

Every page carries a unique title, meta description, canonical URL, and Open Graph tags
Structured data (JSON-LD schema) on all articles and programme pages for Google rich results
Sitemap and robots.txt auto-generated and refreshed on every deployment
Video pages include full transcripts for search indexing
GEO readiness: content structured with FAQ schema, clear authorship, and citation-friendly formatting for AI search tools including Perplexity, ChatGPT, and Gemini

#### Content Management

Sanity CMS — structured content modelling with a clean, non-technical editing interface
All 11 hub types built as reusable templates — adding a new hub requires no code changes
Full rich media support: embedded video, PDF uploads, self-assessment builder
Editorial workflow: draft → review → scheduled publish, manageable entirely by SKC's internal team

#### Security

All secrets managed via Vercel environment variables — nothing sensitive in the codebase
CORS locked to production domain
Cloudflare WAF rules applied to all API routes and form endpoints
Vercel deployment protection — preview builds inaccessible to the public

#### Success Metrics

Metric	Phase 1 Target	Phase 2 Target
Content pieces live	100 (20 new, 80 repurposed)	200+ total
Monthly unique visitors	1,500	3,000+
Downloads & subscriptions	150	1,500+
Avg. time on page	—	> 3 minutes
Return visitor rate	—	20%+
External backlinks	—	20+
Newsletter database	—	3,000+
AI citation presence	—	Cited in Perplexity, ChatGPT & Gemini for conscious leadership queries

#### Engagement Timeline

Month	Milestone
Week 1–2	Discovery, sitemap sign-off, design system, brochure site development begins
Week 3–4	Brochure site complete. Knowledge Centre hub development begins. Content upload and SEO configuration underway.
Month 2–3	Phase 1 launch — 5 hubs live, 100 content pieces, full SEO configuration active