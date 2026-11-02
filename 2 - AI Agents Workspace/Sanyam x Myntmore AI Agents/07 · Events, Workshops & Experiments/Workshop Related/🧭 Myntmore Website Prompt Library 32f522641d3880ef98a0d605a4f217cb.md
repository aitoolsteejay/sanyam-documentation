# 🧭 Myntmore Website Prompt Library

## Website Prompt Library

Reusable prompts for website and dashboard changes. Use these as task-specific instructions, not as permission to make unreviewed production changes. Start with an audit, define scope, preserve existing behavior and finish with validation evidence.

**Related references**

- [Website technical runbook](../../06%20%C2%B7%20Documentation%20&%20Playbooks/DOCUMENTATION/Myntmore%20Website%20%E2%80%94%20User%20Manual/Myntmore%20Website%20%E2%80%94%20Technical%20Documentation%203bb522641d38805e9fa6efd74304abd2.md)
- [Dashboard technical runbook](../../06%20%C2%B7%20Documentation%20&%20Playbooks/DOCUMENTATION/Myntmore%20Dashboard%20-%20User%20Manual/Myntmore%20Dashboard%20%E2%80%94%20Technical%20Documentation%203bb522641d38805b9eb1d49664e84351.md)
- [Handover overview](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21)

### Standard workflow

**Inspect → Scope → Propose → Confirm approval → Implement → Test → Deploy → Verify → Document**

Replace bracketed placeholders before using a prompt. Do not invent claims, client results, integrations or capabilities. Report changed files, checks passed, failed or skipped, and blockers.

---

# 🧭 Myntmore Website Prompt Library

Use this page as the single source of truth for website changes, improvements, and troubleshooting.

## How to use this library

1. Start with the shared instruction in the relevant section.
2. Add the prompt that matches the page, feature, or problem.
3. Replace bracketed placeholders such as `[route]`, `[tool]`, or `[error]`.
4. Ask for an audit before asking for a broad rewrite.
5. End every request with the validation prompt.
6. Report changed files, checks passed, failures, skipped checks, and blockers.

**Related documentation**

- [Dashboard Technical Documentation](../../06%20%C2%B7%20Documentation%20&%20Playbooks/DOCUMENTATION/Myntmore%20Dashboard%20-%20User%20Manual/Myntmore%20Dashboard%20%E2%80%94%20Technical%20Documentation%203bb522641d38805b9eb1d49664e84351.md) — implementation, security, deployment, and incident details.
- [Dashboard Non-Technical Documentation](../../06%20%C2%B7%20Documentation%20&%20Playbooks/DOCUMENTATION/Myntmore%20Dashboard%20-%20User%20Manual/Myntmore%20Dashboard%20%E2%80%94%20Non%20Technical%20Documentation%203bb522641d38804391c6f95f9dc57542.md) — plain-language workflows and user guidance.
- [Myntmore Handover](https://app.notion.com/p/Myntmore-Handover-Sanyam-3f5522641d38819697c4e985805d92fd?pvs=21) — ownership, access, onboarding, and critical workflows.

## Library map

- **1. Quick optimization prompts** — fast conversion, hierarchy, UI, mobile, consistency, and trust improvements.
- **2. Content and copy changes** — headlines, CTAs, FAQs, case studies, proof, tone, factual consistency, and content refreshes.
- **3. Website changes by route** — homepage, navigation, services, landing pages, resources, tools, forms, design, and animation.
- **4. Dashboard and internal product changes** — roles, client isolation, autosave, metrics, imports, database, Supabase security, deployment, accounts, incidents, observability, concurrency, notifications, exports, test environments, feature flags, documentation, performance, security, recovery, integrations, data quality, UX, accessibility, support, releases, analytics, and testing.
- **5. Major website problems** — build, routing, rendering, API, SEO, accessibility, performance, and integration failures.
- **6. Risk, operations, and change management** — analytics, CRM, email, testing, deployment, data, privacy, dependencies, monitoring, recovery, publishing, migrations, and launch ownership.
- **7. Visual design and brand system** — typography, color, layout rhythm, cards, CTAs, motion, accessibility, imagery, and brand voice.
- **8. Final validation** — the checks every request should finish with.

---

- 1. Quick optimization prompts
    - ⚡ 1. Conversion Optimization
        
        **Goal:** Turn your website into a lead-generating machine
        
        **What it fixes:**
        
        - Weak hooks
        - Passive CTAs
        - Low engagement
        
        **Prompt:**
        
        ```
        Optimize this website for maximum conversion. Make the hero section more compelling and ensure CTAs are clear, aggressive, and strategically placed. Improve hook strength, reduce friction, and ensure every section drives action.
        ```
        
        **Pro Tip:**
        
        Use this AFTER your first draft is generated.
        
        ---
        
    - 🧠 2. Visual Hierarchy
        
        **Goal:** Make the page flow naturally and feel easy to read
        
        **What it fixes:**
        
        - Cluttered layout
        - Poor readability
        - No clear flow
        
        **Prompt:**
        
        ```
        Improve the visual hierarchy of this page. Structure the sections so the user's eye naturally flows from problem to solution. Use strong typography contrast, spacing, and section separation to guide attention.
        ```
        
        **Pro Tip:**
        
        If your page feels “heavy” or confusing → run this.
        
        ---
        
    - 🎨 3. Modern UI Upgrade (2024 Aesthetic)
        
        **Goal:** Make your site feel like a premium tech startup
        
        **What it fixes:**
        
        - Outdated design
        - Generic layouts
        - Low perceived value
        
        **Prompt:**
        
        ```
        Upgrade the UI aesthetic to feel like a premium, modern tech startup from 2024. Use subtle gradients, bento-box layouts, glassmorphism, smooth hover states, and clean minimal spacing.
        ```
        
        **Pro Tip:**
        
        Stack this with your brand colors for best results.
        
        ---
        
    - 📱 4. Mobile-First Optimization
        
        **Goal:** Ensure perfect experience on mobile devices
        
        **What it fixes:**
        
        - Broken layouts
        - Poor spacing
        - Bad readability on phones
        
        **Prompt:**
        
        ```
        Optimize this entire page for a mobile-first layout. Define responsive stack orders, font sizes, spacing, and section padding specifically for smaller screens. Ensure clarity and usability on mobile devices.
        ```
        
        **Pro Tip:**
        
        Most users will see your site on mobile first. Don’t skip this.
        
        ---
        
    - 🧩 5. Consistency Check
        
        **Goal:** Make everything feel like one cohesive brand
        
        **What it fixes:**
        
        - Mixed tone
        - Inconsistent design
        - Weak brand identity
        
        **Prompt:**
        
        ```
        Review and rewrite the copy to maintain a bold, authoritative, yet approachable B2B tone across all sections. Ensure consistency in messaging, color usage, and design system.
        ```
        
        **Pro Tip:**
        
        Run this at the END to polish everything.
        
        ---
        
    - 🔒 6. Trust Markers & Social Proof
        
        **Goal:** Increase credibility and reduce user hesitation
        
        **What it fixes:**
        
        - Lack of trust
        - Low conversions
        - Skepticism
        
        **Prompt:**
        
        ```
        Enhance trust-building across the page. Add realistic placeholders for client logos, testimonials, case studies, and data-backed claims. Ensure trust elements are strategically placed near CTAs.
        ```
        
        **Pro Tip:**
        
        Trust = conversions. This is non-negotiable.
        
        ---
        
        # 🧠 Recommended Usage Flow
        
        Run these in order for best results:
        
        1. Conversion Optimization
        2. Visual Hierarchy
        3. Modern UI Upgrade
        4. Mobile Optimization
        5. Consistency Check
        6. Trust Markers
        
        ---
        
        # ⚡ Final Note
        
        These are not optional tweaks.
        
        This is how you go from:
        
        **“AI generated website” → “High-converting growth asset”**
        
        Use them.
        
        ---
        
- 2. Content & Copy Changes
    - Shared content instruction
        
        > Update the copy on `[route/section]` using the supplied facts and approved source material. Preserve the page’s primary search intent, existing information architecture, metadata, canonical URL, schema, internal links, CTA destination, and responsive layout. Make the writing clear, direct, outcome-focused, and consistent with Myntmore’s founder-aware B2B voice. Do not invent statistics, client results, testimonials, certifications, offices, partnerships, quotes, or product capabilities. Mark anything that requires approval or a source before publishing.
        > 
    - Headlines and hero copy
        
        > Rewrite the headline and supporting copy for `[route]`. Make the first screen answer who Myntmore helps, what it does, and what outcome it creates. Provide three headline options, each with a short rationale. Keep the claim specific and verifiable, avoid vague growth language, and preserve the existing CTA and keyword intent unless explicitly asked to change them.
        > 
    - CTA changes
        
        > Improve the CTAs on `[route]`. Identify the page’s single primary conversion goal, then propose a primary CTA and supporting secondary CTAs that describe the next action clearly. Preserve the existing destinations and form/booking behavior unless a destination change is explicitly requested. Avoid vague labels such as “Learn more,” “Click here,” or “Submit.” Check desktop, mobile, keyboard focus, and repeated CTA consistency.
        > 
    - FAQ changes
        
        > Add or improve FAQs for `[route]` using only questions the page can answer accurately. Cover buyer objections, fit, process, timing, inputs, limitations, and what happens next. Keep answers concise and useful, avoid repeating the body copy, and add FAQ schema only when every answer is visibly present on the page. Do not create FAQs solely to target keywords.
        > 
    - Case study changes
        
        > Add or update `[case-study route]` using only approved client material. Structure the story around starting problem, context and ICP, work performed, timeline, result, lessons, and relevant service links. Preserve confidentiality and NDA constraints. Use verified results only; if no public result exists, describe the work honestly without inventing a number. Keep the narrative specific, evidence-led, and easy to scan.
        > 
    - Proof and social proof
        
        > Audit and improve the proof on `[route]`. Separate verified results, client quotes, logos, credentials, process evidence, and qualitative observations. Place proof near the claim or CTA it supports. Confirm the source, date, permission, and exact wording for each item before publishing. If proof is unavailable, use an honest explanation of the method or deliverable instead of creating a placeholder that looks like a real claim.
        > 
    - Tone and consistency
        
        > Rewrite `[route/section]` to match Myntmore’s voice: direct, confident, practical, specific, slightly conversational, and founder-aware. Remove corporate filler, empty growth language, fake urgency, excessive jargon, and aggressive sales language. Explain the mechanism behind the result rather than only promising the result. Keep terminology, capitalization, service names, and CTA language consistent with the rest of the site.
        > 
    - Unsupported claims and factual consistency
        
        > Audit `[claim/page]` across page copy, metadata, JSON-LD, case studies, guides, `public/llms.txt`, and internal links. Compare every statistic, client result, testimonial, founder credential, service capability, location statement, and “best” or “only” claim against an approved source. Keep only claims that can be verified. Replace unsupported claims with a precise qualitative statement or flag them for approval. Report every changed claim and its source.
        > 
    - Copy editing and clarity
        
        > Edit `[route/section]` for clarity and conversion without changing the underlying facts. Remove repetition, passive phrasing, filler, unexplained acronyms, and overly long sentences. Keep the strongest information near the top, use descriptive headings, preserve important keywords naturally, and make every section answer one question: problem, mechanism, deliverable, fit, proof, objection, or next step.
        > 
    - Content refresh
        
        > Refresh `[page/article/guide]` using the supplied updated facts. Preserve the page’s canonical URL, author, publication and modified dates, citations, schema, internal links, sitemap membership, and existing conversion path. Identify stale claims before rewriting, distinguish new evidence from opinion, and list any facts that still need source verification.
        > 
    - Content change validation
        
        > After changing copy, verify the rendered heading hierarchy, title, description, canonical, Open Graph fields, JSON-LD, visible proof, FAQ content, internal links, CTA destinations, sitemap membership, mobile wrapping, accessibility labels, and keyword intent. Confirm that no unsupported claim or unrelated copy changed.
        > 
        > 
        > ---
        > 
- 3. Website Changes by Route and Feature
    - Homepage
        
        > Update `/`. Improve the requested homepage section while preserving the existing section order, brand hierarchy, service links, proof points, testimonials, tools, and primary CTA. The hero must immediately explain who Myntmore helps, what it does, and the business outcome. Keep all statistics source-backed. Check desktop, mobile, SEO metadata, Organization/WebSite schema, internal links, and the homepage smoke test.
        > 
    - Navigation and footer
        
        > Update `app/components/Navbar.tsx` and/or `app/components/Footer.tsx`. Make the requested navigation change accessible by keyboard, pointer, and mobile touch. Preserve existing route destinations, outside-click behavior, mobile accordions, CTA logic, active states, and submenu hover behavior. Verify that flyout menus remain open while the pointer moves into them. Test desktop and mobile navigation.
        > 
    - Service index
        
        > Update `/services`. Keep all seven core services distinct and linked to their canonical pages. Improve the requested cards, ordering, copy, or CTA without creating keyword overlap. Preserve Service and Breadcrumb schema, internal links, and the service index metadata. Confirm that every service card points to a real route.
        > 
    - Core service page
        
        Use this for:
        
        - `/services/linkedin-outreach`
        - `/services/cold-email`
        - `/services/sales-intelligence`
        - `/services/ai-lead-generation`
        - `/services/account-based-marketing`
        - `/services/personal-branding`
        - `/services/gtm-strategy`
        
        > Rework `[service route]` using the Cold Email page’s visual rhythm: cream hero, clear outcome-led headline, stat strip using verified numbers, problem section, solution/system section, deliverables, process, audience fit, FAQ, and strong consultation CTA. Do not add pricing unless explicitly requested. Preserve the existing accent color, Inter typography, cream/ink/gold brand system, Service/Breadcrumb/FAQ/HowTo schema, canonical metadata, relevant case-study links, and sitemap entry. Keep all claims factual.
        > 
    - DIY service page
        
        > Update `/services/do-it-yourself`. Clearly distinguish self-serve work from managed services. Preserve the existing special CTA behavior, plan links, pricing only if explicitly supplied, metadata, schema, mobile behavior, and conversion flow. Do not accidentally change the shared service pages.
        > 
    - Industry landing page
        
        Use this for `/lp/agencies-it`, `/lp/agency-partners`, `/lp/financial-services`, `/lp/fundraising`, `/lp/insurance`, `/lp/manufacturers-exporters`, `/lp/pharma`, `/lp/recruitment-firms`, or `/lp/saas-founders`.
        
        > Update `[route]` for `[industry]` using the supplied industry facts and approved case studies. Keep the page specific to the vertical: ICP, pain points, offer, proof, objections, FAQs, and CTA. Do not duplicate generic service copy. Preserve industry-specific metadata, schema, internal links, mobile layout, and related case-study links. Do not invent industry statistics.
        > 
    - City page
        
        Use this for `/b2b-lead-generation-mumbai`, `/b2b-lead-generation-delhi`, `/b2b-lead-generation-bengaluru`, `/b2b-lead-generation-pune`, `/b2b-lead-generation-hyderabad`, `/b2b-lead-generation-chennai`, `/b2b-lead-generation-kolkata`, or `/b2b-lead-generation-ahmedabad`.
        
        > Update `[city route]` with the supplied local-market context. Make the copy genuinely specific to `[city]`, but state accurately that Myntmore serves the market from Mumbai unless a physical office is verified. Preserve LocalBusiness/Service/Breadcrumb/FAQ schema, canonical URL, unique keyword intent, and local internal links. Avoid doorway-page duplication.
        > 
    - About page
        
        > Update `/about-us` with the supplied company story, proof, founder relationship, and service links. Keep all claims consistent with Organization schema, founder pages, `public/llms.txt`, and sitewide metadata. Explain who Myntmore serves, what it does, and how its outbound systems work. Preserve the consultation CTA.
        > 
    - Founder profile
        
        Use this for `/tejasjhaveri`, `/jahnvijhaveri`, or `/enwilfernandes`.
        
        > Update `[profile route]` with the supplied biography, role, links, and approved image. Preserve Person schema, employer relationship, image alt text, social links, vCard behavior, and factual consistency across About, author metadata, and `llms.txt`. Do not add unsupported achievements.
        > 
    - Contact and consultation pages
        
        > Update `[route]` while preserving all form fields, validation, consent language, success/error states, booking embeds, fallback links, analytics, and privacy behavior. Make the page clearly explain who the visitor is speaking with, what happens next, and what information is needed. Check mobile form usability and accessible labels.
        > 
    - Careers
        
        Use this for `/careers` or `/careers/[role]`.
        
        > Update the careers index or `[role]` page with the supplied role information. Preserve application behavior, JobPosting schema where valid, location and remote wording, compensation facts, closing status, canonical metadata, and links to the careers hub. Remove expired roles from internal links and sitemap only when the intended redirect or 404 behavior is clear.
        > 
    - Events
        
        Use this for `/events` or `/events/[event]`.
        
        > Update `[event route]` using the supplied event data. Preserve date, timezone, organizer, location, registration CTA, Event schema, event status, and mobile registration behavior. Past events must not appear as upcoming events. Use the site’s client timezone when displaying dates.
        > 
    - Blog post
        
        Use this for any `/blog/*` page.
        
        > Update `[blog route]` using the supplied source material. Preserve the article’s primary search intent, author, publication date, modified date, citations, headings, Article schema, FAQ schema where applicable, canonical URL, and related links. Start with a direct answer. Cite authoritative sources, distinguish evidence from opinion, and do not fabricate statistics. Link to one relevant service, one guide, and one related article.
        > 
    - Guide
        
        Use this for any `/resources/guides/*` page.
        
        > Update `[guide route]` as an evergreen reference. Preserve the guide template, table of contents, anchor links, author details, citations, HowTo/Article schema where valid, related service CTA, canonical metadata, and internal links. Make the opening section answer the title directly. Add examples, limitations, and source notes.
        > 
    - Glossary term
        
        Use this for any `/resources/glossary/*` page.
        
        > Update the term through `components/glossary/GlossaryTerm.tsx` and the relevant term page. Do not fork the shared component. Define `[term]` in the first paragraph, add synonyms, examples, related concepts, a concise FAQ, and links to relevant services and articles. Preserve DefinedTerm, Breadcrumb, canonical, sitemap, and keyword-collision requirements.
        > 
    - Case study
        
        Use this for `/case-studies/[slug]`.
        
        > Add or update `[case-study route]` using only the supplied approved client material. Preserve confidentiality and NDA constraints. Use verified results only. If there is no public result, describe the work honestly without inventing a number. Include the starting problem, ICP, work performed, timeline, result, lessons, service links, industry tags, breadcrumbs, and appropriate schema. Update the case-study index and sitemap.
        > 
    - Resource hubs
        
        Use this for `/resources`, `/resources/blogs`, `/resources/guides`, `/resources/tools`, or `/resources/feed`.
        
        > Update the requested hub while preserving crawlable HTML links, filters, card destinations, canonical URLs, metadata, pagination behavior, and resource taxonomy. Keep private, noindex, or externally rewritten tools out of public listings where required. Every featured resource must link to a valid route and have a relevant reciprocal internal link.
        > 
    - AI tool
        
        Use this for `/tools/icp-builder`, `/tools/dm-angle-generator`, `/tools/battle-card-generator`, `/tools/case-study-generator`, `/tools/lead-magnet-ideas`, or `/tools/founder-presence-analyzer`.
        
        > Update `[tool route]` across its landing page, client components, API route, prompt/sanitization code, and registry as needed. Preserve server-side key handling, rate limits, same-origin checks, input limits, privacy copy, loading/error states, lead capture, related tools, and mobile behavior. Test invalid input, missing credentials, successful response handling, and one representative user flow without printing secrets.
        > 
    - Client-only tool
        
        Use this for `/tools/roi-calculator`, `/tools/linkedin-optimizer`, or `/tools/posting-rhythm-builder`.
        
        > Update `[tool route]` while preserving input validation, calculations, loading states, exports, accessible controls, result semantics, lead capture if present, related tools, and mobile layout. Do not describe estimates as guaranteed outcomes. Test one representative input and one invalid or empty state.
        > 
    - Menti
        
        Use this for `/menti` or `/menti/room`.
        
        > Update `[route]` without weakening the admin password gate, cookie settings, rate limiting, reset flow, logout flow, or realtime data handling. Keep admin functionality out of public metadata and sitemap. Test unauthenticated, invalid-password, authenticated, reset, and logout states using environment-provided credentials only.
        > 
    - Private plans
        
        > Update `/plans/[code]` only for the supplied plan code. Preserve code validation, private/noindex behavior, currency rules, access assumptions, and redirects. Never expose private plan URLs in navigation, sitemap, public `llms.txt`, or promotional components unless explicitly requested.
        > 
    - Comparison page
        
        Use this for `/agency-vs-in-house` or a new comparison page.
        
        > Update the comparison page with balanced, evidence-based tradeoffs. Keep tables accessible and horizontally scrollable. Explain which option fits which buyer, include limitations and cost considerations only when verified, and link each option to the appropriate service or consultation page. Avoid unsupported universal claims.
        > 
    - Framework or methodology page
        
        Use this for `/myntmore-framework`.
        
        > Update the framework page using the supplied methodology. Preserve named stages, diagrams, citations, visual hierarchy, related service links, and framework-specific schema. Make every stage understandable without the visual diagram. Keep the framework’s primary keyword unique.
        > 
    - SEO, robots, sitemap, or schema
        
        > Audit the requested technical SEO change across metadata, canonical tags, `app/robots.ts`, `app/sitemap.ts`, `lib/schema.ts`, redirects, and affected pages. Do not add schema that is not visibly supported. Verify titles, descriptions, canonicals, robots behavior, JSON-LD validity, sitemap membership, redirects, and a production build.
        > 
    - `llms.txt` or GEO content
        
        > Update `public/llms.txt` with the supplied verified company, service, methodology, or research information. Keep descriptions factual, concise, and consistent with canonical pages. Add links to original research, case studies, service pages, and author pages. Do not add unsupported performance claims. Check that every linked URL exists.
        > 
    - Design refresh
        
        > Refresh `[route/section]` to match the Cold Email service page: cream sections, ink headings, restrained accent color, warm gold highlights, rounded cards, subtle shadows, generous spacing, strong CTA hierarchy, and Inter typography. Preserve all copy, routes, forms, metadata, schema, and CTA destinations. Add only subtle animation with `prefers-reduced-motion` support. Check desktop, mobile, keyboard focus, and layout shift.
        > 
    - Animation request
        
        > Add animation to `[route/section]` using the existing `FadeIn` and hero animation patterns. Use staggered reveal timing, subtle hover lifts, and restrained transitions. Do not animate essential content indefinitely. Respect `prefers-reduced-motion`, preserve keyboard focus, avoid layout shifts, and verify the page when JavaScript is delayed or unavailable.
        > 
- 8. Final Validation
    
    ## Final validation prompt
    
    End every request with:
    
    > Run `git diff --check` and `npx tsc --noEmit`. If the change affects a production route, run `npm run build` or explain the exact blocker. Smoke-test the changed URL and one relevant CTA. Verify title, description, canonical, robots, breadcrumbs, JSON-LD, internal links, sitemap membership, mobile behavior, keyboard focus, and reduced-motion behavior. Confirm that no unrelated files changed. Report passed, failed, skipped, and blocked checks separately.
    > 
    
    ---
    
- 4. Dashboard & Internal Product Changes
    
    The Myntmore dashboard is a separate internal product from the public website. It is a Vite 7, React 19, TypeScript, TanStack Router, TanStack Query, and Supabase application.
    
    The browser communicates directly with Supabase using a publishable key. There is no application server between the browser and Supabase for normal reads and writes. Because of this, Supabase Row Level Security is the primary security boundary. Route guards and hidden buttons improve the user experience but do not provide complete security.
    
    The main dashboard repository is:
    
    ```
    aitoolsteejay/dashboard-myntmore
    ```
    
    Important directories include:
    
    ```
    src/routes/                    TanStack Router route definitions
    src/components/                Feature and UI components
    src/hooks/                     Autosave and effective-metric hooks
    src/lib/auth.tsx               AuthProvider and session/role logic
    src/lib/workspace.tsx          WorkspaceProvider and selected week
    src/integrations/supabase/     Supabase client and generated database types
    src/data/                      Metric definitions
    src/utils/                     Calculations, scoping, imports, exports, and helpers
    supabase/                      SQL migrations, RLS policies, and Edge Functions
    vercel.json                    Deployment configuration
    vite.config.ts                Vite and router configuration
    src/routeTree.gen.ts           Generated route tree; never edit manually
    ```
    
    The database schema is `myntmore`. Every Supabase query, migration, type reference, and RLS policy must target that schema explicitly.
    
    ---
    
    - Quick-start decision tree
        
        > Start with the symptom: access or data visibility → Roles and permissions or Client isolation; wrong or missing numbers → Metrics or Data quality; save or edit problem → Reporting week and autosave or Concurrency; import or export problem → Waalaxy CSV imports or Data exports; deployment or outage → Deployment or Incident runbooks; planned change → Foundation, Database, Feature flags, or Release governance.
        > 
        
        > Then identify the affected role, client, reporting week, route, source table, integration, and environment. Reproduce with the smallest safe test case, capture evidence, choose the relevant prompt, and finish with verification and rollback notes.
        > 
    - Permissions matrix
        
        > Maintain a single matrix for Admin, Member, Client, Finance, Disabled, and Anonymous users. For each route and action, record whether the role can view, create, edit, delete, import, export, invite, configure, or administer. Keep the matrix aligned with route guards, query and mutation checks, and Supabase RLS policies; test denied actions directly.
        > 
    - Definition of done
        
        > A dashboard change is complete only when the intended UI, data flow, client and reporting-week scope, permissions, RLS, loading and error states, migrations, integrations, tests, deployment checks, observability, documentation, and rollback path have been verified. Record evidence, reviewer, environment, and any known follow-up.
        > 
    - Dependency map
        
        > For each feature, map route → component → hook/query key → Supabase table, view, RPC, or Edge Function → RLS policy → integration or scheduled job → export, report, or portal consumer. Note generated files, environment variables, migrations, and downstream dependencies before changing the feature.
        > 
    - Prompt metadata
        
        > Add these fields when creating or revising a prompt: category, intended user, trigger or symptom, affected roles, routes and data, risk level, required evidence, environment, expected output, rollback or recovery step, owner, last reviewed date, and related prompts. Retire or revise prompts when the product changes.
        > 
    - Glossary
        
        > Keep plain-language definitions for client scope, reporting week, RLS, route guard, query key, mutation, optimistic update, stale data, reconciliation, idempotency, feature flag, backfill, migration, service-role key, synthetic data, and audit log. Link each term to the relevant category or prompt.
        > 
    - Escalation guide
        
        > Escalate security, cross-client access, credential exposure, or data loss immediately to the technical owner and security owner. Escalate migration, deployment, integration, or performance failures to engineering. Escalate metric, import, export, or reconciliation discrepancies to the data or operations owner. Escalate client-facing workflow, permission, or reporting issues to the product or account owner. Include severity, impact, evidence, containment, owner, and next update time.
        > 
    - Changelog
        
        > Record each meaningful dashboard or documentation change with the date, change summary, affected category or prompts, reason, owner, related migration or release, and any follow-up. Note when a prompt is added, revised, superseded, or retired so the library’s history remains clear.
        > 
    - Recurring review checklist
        
        > Review this library on a recurring schedule and after major releases, incidents, migrations, integrations, or permission changes. Check that routes, roles, tables, RLS policies, metrics, imports, exports, scheduled jobs, feature flags, runbooks, glossary terms, owners, and links still match the product. Test one high-risk prompt, archive stale guidance, update the changelog, and assign unresolved gaps.
        > 
    - Review schedule
        
        
        | Dashboard category | Owner | Frequency | Last reviewed | Next review |
        | --- | --- | --- | --- | --- |
        | Foundation and architecture | Technical owner | Quarterly and after major architecture changes | Not yet reviewed | Set after first review |
        | Roles and permissions | Security or technical owner | Monthly and after permission changes | Not yet reviewed | Set after first review |
        | Client isolation | Security or technical owner | Monthly and after incidents | Not yet reviewed | Set after first review |
        | Reporting week and autosave | Dashboard owner | Monthly | Not yet reviewed | Set after first review |
        | Metrics and calculations | Data or operations owner | Monthly and after metric changes | Not yet reviewed | Set after first review |
        | Waalaxy CSV imports | Operations owner | Monthly and after import changes | Not yet reviewed | Set after first review |
        | Database schema and migrations | Technical owner | Before every migration and quarterly | Not yet reviewed | Set after first review |
        | Supabase security | Security or technical owner | Monthly and after auth changes | Not yet reviewed | Set after first review |
        | Dashboard deployment | Technical owner | Before each release and monthly | Not yet reviewed | Set after first review |
        | Password and account management | Technical or operations owner | Quarterly and after auth changes | Not yet reviewed | Set after first review |
        | Dashboard incident runbooks | Operations owner | Quarterly and after every incident | Not yet reviewed | Set after first review |
        | Testing, reliability, and operations | Dashboard owner | Monthly and before major releases | Not yet reviewed | Set after first review |
        
        > Replace the owner labels with named people or teams. After each review, update the last reviewed date, calculate the next review date from the frequency, record any changed prompts in the changelog, and assign unresolved gaps.
        > 
    - 1. Foundation and architecture
        
        > Covers the dashboard’s architecture, core data flow, route structure, Supabase boundaries, and safe change principles.
        > 
        > - 1. Dashboard change instruction
        >     
        >     > Use this prompt before making any dashboard change. State the affected route, data, roles, integrations, risks, tests, and rollback plan.
        >     > 
        > - 2. Dashboard architecture prompt
        >     
        >     > Explain the affected feature across Vite, React, TypeScript, TanStack Router, TanStack Query, Supabase, and the myntmore schema.
        >     > 
    - Roles and permissions
        
        > Covers role capabilities, route guards, user management, client access, finance access, and RLS enforcement.
        > 
    - 3. Role and permission change prompt
        
        > Review this permission change across all authorization layers.
        > 
        
        > 
        > 
        
        > Identify whether the requested behavior affects:
        > 
        
        > 
        > 
        
        > - Admin access
        > 
        
        > - Member access
        > 
        
        > - Client portal access
        > 
        
        > - Disabled accounts
        > 
        
        > - Finance access
        > 
        
        > - User-management access
        > 
        
        > - Route guards
        > 
        
        > - Supabase queries
        > 
        
        > - Supabase mutations
        > 
        
        > - RLS policies
        > 
        
        > - Edge Functions
        > 
        
        > 
        > 
        
        > Verify all of the following:
        > 
        
        > 
        > 
        
        > - Admin-only routes are blocked for members and clients.
        > 
        
        > - Internal member routes are blocked for client accounts.
        > 
        
        > - Finance pages remain admin-only.
        > 
        
        > - User administration remains admin-only.
        > 
        
        > - Clients can access only their own client portal data.
        > 
        
        > - Disabled accounts cannot authenticate or continue using a valid-looking existing session.
        > 
        
        > - Direct URL entry is blocked, not merely sidebar navigation.
        > 
        
        > - Unauthorized reads and writes fail at the database layer.
        > 
        
        > - A user cannot bypass the restriction by modifying browser requests.
        > 
        
        > 
        > 
        
        > Hiding a button is not security. Check route guards, query filters, mutation ownership, and RLS independently.
        > 
    - 4. Admin access prompt
        
        > Audit admin access for the requested route or action.
        > 
        
        > 
        > 
        
        > Check:
        > 
        
        > 
        > 
        
        > - `requireAdmin` or the appropriate admin guard.
        > 
        
        > - Direct navigation to the route.
        > 
        
        > - Browser refresh while already on the route.
        > 
        
        > - TanStack Query requests made before or after the guard resolves.
        > 
        
        > - Supabase read and write permissions.
        > 
        
        > - Whether members can call the underlying Data API directly.
        > 
        
        > - Whether a stale session or cached profile incorrectly grants admin access.
        > 
        
        > - Whether revoking admin access takes effect without requiring unsafe client-side assumptions.
        > 
        
        > 
        > 
        
        > Test as an admin, member, client, disabled user, and anonymous user.
        > 
    - 5. Member access prompt
        
        > Verify that members can access permitted operational features while being denied admin-only features.
        > 
        
        > 
        > 
        
        > Check:
        > 
        
        > 
        > 
        
        > - Internal route guards.
        > 
        
        > - Sidebar and navigation visibility.
        > 
        
        > - Direct URL access.
        > 
        
        > - Queries used by operational pages.
        > 
        
        > - Finance and user-management restrictions.
        > 
        
        > - Mutation permissions.
        > 
        
        > - RLS behavior for member sessions.
        > 
        
        > - Session changes after a member is promoted or demoted.
        > 
        
        > 
        > 
        
        > Confirm that a member’s access is determined by the authenticated profile and database policies, not only by React state.
        > 
    - 6. Client portal access prompt
        
        > Audit client portal access.
        > 
        
        > 
        > 
        
        > Verify:
        > 
        
        > 
        > 
        
        > - The user is linked to exactly one intended client identity.
        > 
        
        > - Portal queries include the authenticated client relationship.
        > 
        
        > - Client A cannot read Client B’s rows.
        > 
        
        > - Client A cannot update Client B’s actionables, campaigns, metrics, or reports.
        > 
        
        > - Internal-only data is excluded.
        > 
        
        > - Direct URL parameters cannot change the client scope.
        > 
        
        > - Direct Supabase API calls are rejected by RLS.
        > 
        
        > - Client navigation cannot reach internal pages.
        > 
        
        > - Portal data is cleared after logout.
        > 
        
        > 
        > 
        
        > Test with two clients and direct Data API requests.
        > 
    - 7. Disabled account prompt
        
        > Review disabled-account behavior across authentication, session persistence, routing, queries, and RLS.
        > 
        
        > 
        > 
        
        > Check:
        > 
        
        > 
        > 
        
        > - A disabled user cannot sign in.
        > 
        
        > - An already-authenticated disabled user is rejected on the next session check.
        > 
        
        > - Protected routes redirect safely.
        > 
        
        > - Existing cached data is cleared.
        > 
        
        > - Data requests fail or are blocked.
        > 
        
        > - Refreshing the browser does not restore access.
        > 
        
        > - Re-enabling the user restores only the intended permissions.
        > 
        
        > 
        > 
        
        > Never rely solely on a disabled flag checked in one React component.
        > 
    - 8. Finance access prompt
        
        > Audit finance access.
        > 
        
        > 
        > 
        
        > Finance is an admin-only area. Check:
        > 
        
        > 
        > 
        
        > - The finance route uses the admin guard.
        > 
        
        > - Members cannot open the route directly.
        > 
        
        > - Clients cannot open it through URL manipulation.
        > 
        
        > - Finance queries do not execute for unauthorized users.
        > 
        
        > - Finance mutations are protected by RLS.
        > 
        
        > - Export or report endpoints do not expose finance data.
        > 
        
        > - Cached finance data is cleared on logout or role change.
        > 
    - 9. User-management access prompt
        
        > Audit team and user-management operations.
        > 
        
        > 
        > 
        
        > Verify that inviting users, disabling users, changing admin status, creating portal users, and managing profiles require admin authorization.
        > 
        
        > 
        > 
        
        > Check:
        > 
        
        > 
        > 
        
        > - Route guards.
        > 
        
        > - Component actions.
        > 
        
        > - Supabase mutations.
        > 
        
        > - Edge Function permissions.
        > 
        
        > - RLS policies.
        > 
        
        > - Auditability and safe error messages.
        > 
        
        > - No service-role credential appears in browser code, logs, or `VITE_` variables.
        > 
    - 10. Route guard prompt
        
        > Review the route guard for this page.
        > 
        
        > 
        > 
        
        > Check:
        > 
        
        > 
        > 
        
        > - Which guard is used: internal-user or admin.
        > 
        
        > - Whether `beforeLoad` executes before protected data is loaded.
        > 
        
        > - Whether direct URLs are blocked.
        > 
        
        > - Whether browser refresh is blocked.
        > 
        
        > - Whether loading auth state causes accidental flashes of protected data.
        > 
        
        > - Whether client accounts are redirected to the portal.
        > 
        
        > - Whether errors and redirects preserve safe application state.
        > 
        
        > - Whether route generation remains correct.
        > 
        
        > 
        > 
        
        > Never manually edit `src/routeTree.gen.ts`.
        > 
    - 11. RLS permission prompt
        
        > Review the corresponding Supabase RLS policies in the `myntmore` schema.
        > 
        
        > 
        > 
        
        > For every operation, identify:
        > 
        
        > 
        > 
        
        > - Who may select?
        > 
        
        > - Who may insert?
        > 
        
        > - Who may update?
        > 
        
        > - Who may delete?
        > 
        
        > - Which profile or role is checked?
        > 
        
        > - Which client ownership relationship is checked?
        > 
        
        > - Whether disabled accounts are excluded?
        > 
        
        > - Whether `NULL` ownership creates an unintended access path?
        > 
        
        > - Whether service-role operations are intentionally isolated to an Edge Function?
        > 
        
        > 
        > 
        
        > Test the policy with admin, member, client A, client B, disabled user, and anonymous sessions.
        > 
        
        ---
        
- Client isolation
    
    > Covers client scoping, ownership, cache keys, cross-client leakage, and direct database access.
    > 
    - 12. Client isolation audit prompt
        
        > Audit or test 12. client isolation audit prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 13. Client A sees Client B data prompt
        
        > Audit or test 13. client a sees client b data prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 14. Incorrect `client_id` filter prompt
        
        > Audit or test 14. incorrect `client_id` filter prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 15. Cross-client cache prompt
        
        > Audit or test 15. cross-client cache prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 16. Campaign ownership prompt
        
        > Audit or test 16. campaign ownership prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 17. Direct Supabase access prompt
        
        > Audit or test 17. direct supabase access prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 18. Autosave writes to the wrong client prompt
        
        > Audit or test 18. autosave writes to the wrong client prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
- Reporting week and autosave
    
    > Covers week selection, draft state, autosave timing, stale data, failed saves, and historical reporting.
    > 
    - 19. Autosave audit prompt
        
        > Audit or test 19. autosave audit prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 20. Switching clients while autosave is pending
        
        > Audit or test 20. switching clients while autosave is pending across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 21. Switching weeks while autosave is pending
        
        > Audit or test 21. switching weeks while autosave is pending across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 22. Failed saves prompt
        
        > Audit or test 22. failed saves prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 23. Stale data prompt
        
        > Audit or test 23. stale data prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 24. Historical data prompt
        
        > Audit or test 24. historical data prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
- Metrics and calculations
    
    > Covers metric definitions, source data, formulas, derived values, totals, averages, and rounding.
    > 
    - 25. Metric change prompt
        
        > Audit or test 25. metric change prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 26. Metric definitions prompt
        
        > Audit or test 26. metric definitions prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 27. Metric code prompt
        
        > Audit or test 27. metric code prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 28. Derived metrics prompt
        
        > Audit or test 28. derived metrics prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 29. Totals and averages prompt
        
        > Audit or test 29. totals and averages prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 30. Achievement percentage prompt
        
        > Audit or test 30. achievement percentage prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 31. LinkedIn impression prompt
        
        > Audit or test 31. linkedin impression prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 32. Disabled service metrics prompt
        
        > Audit or test 32. disabled service metrics prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
- Waalaxy CSV imports
    
    > Covers CSV parsing, validation, campaign and week mapping, manual fields, and source-file reconciliation.
    > 
    - 33. Waalaxy import audit prompt
        
        > Audit or test 33. waalaxy import audit prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 34. Invalid CSV prompt
        
        > Audit or test 34. invalid csv prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 35. Wrong campaign or week prompt
        
        > Audit or test 35. wrong campaign or week prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 36. Manual fields and import prompt
        
        > Audit or test 36. manual fields and import prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 37. Source-file comparison prompt
        
        > Audit or test 37. source-file comparison prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
- Database schema and migrations
    
    > Covers schema changes, tables, columns, backfills, constraints, RLS migrations, and partial migration recovery.
    > 
    - 38. Database change prompt
        
        > Audit or test 38. database change prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 39. Add a table prompt
        
        > Audit or test 39. add a table prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 40. Add or rename a column prompt
        
        > Audit or test 40. add or rename a column prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 41. Backfill prompt
        
        > Audit or test 41. backfill prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 42. RLS migration prompt
        
        > Audit or test 42. rls migration prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 43. Campaign/client integrity prompt
        
        > Audit or test 43. campaign/client integrity prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 44. Partial migration prompt
        
        > Audit or test 44. partial migration prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
- Supabase security
    
    > Covers authentication, RLS, anonymous access, service-role keys, disabled accounts, and exposed data.
    > 
    - 45. Supabase security audit prompt
        
        > Audit or test 45. supabase security audit prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 46. Service-role key prompt
        
        > Audit or test 46. service-role key prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 47. Anonymous access prompt
        
        > Audit or test 47. anonymous access prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 48. Disabled authenticated user prompt
        
        > Audit or test 48. disabled authenticated user prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
- Dashboard deployment
    
    > Covers builds, Vercel routing, environment differences, stale assets, production checks, and rollback.
    > 
    - 49. Deployment audit prompt
        
        > Audit or test 49. deployment audit prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 50. Vite build failure prompt
        
        > Audit or test 50. vite build failure prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 51. Vercel rewrite prompt
        
        > Audit or test 51. vercel rewrite prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 52. Stale chunk prompt
        
        > Audit or test 52. stale chunk prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 53. Preview versus production prompt
        
        > Audit or test 53. preview versus production prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 54. Deployment rollback prompt
        
        > Audit or test 54. deployment rollback prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
- Password and account management
    
    > Covers invitations, account creation, logout, session expiry, disabling users, and account recovery.
    > 
    - 55. Account-management prompt
        
        > Audit or test 55. account-management prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 56. Create portal user prompt
        
        > Audit or test 56. create portal user prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 57. Logout prompt
        
        > Audit or test 57. logout prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 58. Session expiration prompt
        
        > Audit or test 58. session expiration prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
- Dashboard incident runbooks
    
    > Covers response steps for data leaks, failed saves, bad imports, access failures, blank deployments, and migration issues.
    > 
    - 59. Wrong client data
        
        > Audit or test 59. wrong client data across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 60. Saving failed
        
        > Audit or test 60. saving failed across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 61. Logout leaves dashboard data visible
        
        > Audit or test 61. logout leaves dashboard data visible across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 62. CSV import is wrong
        
        > Audit or test 62. csv import is wrong across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 63. Member can access admin pages
        
        > Audit or test 63. member can access admin pages across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 64. Client can access another client
        
        > Audit or test 64. client can access another client across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 65. Blank page after deployment
        
        > Audit or test 65. blank page after deployment across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 66. Migration partially succeeds
        
        > Audit or test 66. migration partially succeeds across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
- Dashboard testing checklist
    
    > Covers full acceptance testing plus observability, concurrency, notifications, exports, test environments, releases, and ongoing operations.
    > 
    - 67. Full dashboard test prompt
        
        > Audit or test 67. full dashboard test prompt across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 68. Minimum acceptance criteria
        
        > Audit or test 68. minimum acceptance criteria across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 69. Observability and audit logs
        
        > Audit or test 69. observability and audit logs across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 70. Concurrency and conflict handling
        
        > Audit or test 70. concurrency and conflict handling across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 71. Notifications and scheduled jobs
        
        > Audit or test 71. notifications and scheduled jobs across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 72. Data exports and reconciliation
        
        > Audit or test 72. data exports and reconciliation across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 73. Safe test environments
        
        > Audit or test 73. safe test environments across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 74. Feature flags and staged releases
        
        > Audit or test 74. feature flags and staged releases across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 75. Documentation maintenance
        
        > Audit or test 75. documentation maintenance across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 76. Performance and cost control
        
        > Audit or test 76. performance and cost control across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 77. Security and privacy review
        
        > Audit or test 77. security and privacy review across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 78. Backup and disaster recovery
        
        > Audit or test 78. backup and disaster recovery across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 79. Integration and API contracts
        
        > Audit or test 79. integration and api contracts across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 80. Data quality and validation
        
        > Audit or test 80. data quality and validation across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 81. User experience and workflows
        
        > Audit or test 81. user experience and workflows across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 82. Accessibility and localization
        
        > Audit or test 82. accessibility and localization across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 83. Incident response and support
        
        > Audit or test 83. incident response and support across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 84. Release governance
        
        > Audit or test 84. release governance across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 
    - 85. Usage analytics and product feedback
        
        > Audit or test 85. usage analytics and product feedback across the dashboard UI, data layer, permissions, failure states, and recovery path. Document expected behaviour and evidence.
        > 

</details>

- 5. Major Website Problems & Diagnostic Prompts
    - Production build fails
        
        > `npm run build` is failing with this error: `[paste complete error]`. Run the build and isolate the first meaningful failure. Check recent changes, imports, route conventions, TypeScript errors, Next.js version behavior, metadata, and generated files. Do not hide the error or skip verification. Fix the root cause and rerun the production build.
        > 
    - Google Fonts or external font failure
        
        > The build cannot fetch `[font]` from Google Fonts. Confirm whether the failure is network-policy related or code related. Preserve the approved brand typography. If the environment cannot reliably fetch the font, evaluate the existing self-hosting or fallback approach and implement the smallest supported fix. Do not disable TLS or silently replace the brand font without checking visual impact. Re-run the build and verify font loading.
        > 
    - `.next` cache corruption
        
        > The Next.js dev/build output appears corrupted or stale. Check for a running `next dev` process and whether build and dev processes are using the same `.next` directory. Stop only processes started for this task, remove the project’s generated `.next` directory if necessary, restart the correct command, and verify the changed route. Do not modify tracked source files to work around generated cache errors.
        > 
    - Zombie development server
        
        > The browser appears to show stale code or the dev port is occupied. Identify the process listening on port 3100, compare its working directory and command, and stop only the stale project process. Restart the dev server from `/workspace/ClaudeCode`, request the changed route, and confirm the response reflects the current source.
        > 
    - TypeScript error
        
        > Fix this TypeScript error: `[paste error]`. Trace the type through the relevant component, data source, API response, or route parameter. Preserve strict typing and do not solve it with `any`, `@ts-ignore`, or disabled compiler settings unless there is a documented, justified exception. Run `npx tsc --noEmit` after the fix.
        > 
    - Hydration mismatch
        
        > The route `[URL]` reports a hydration mismatch. Reproduce it in development and identify the server/client output difference. Inspect dates, random values, browser-only APIs, viewport checks, local storage, animation state, invalid HTML nesting, and third-party components. Fix the mismatch while preserving SSR and SEO content. Verify with a fresh reload and client navigation.
        > 
    - Page is blank or crashes at runtime
        
        > The route `[URL]` renders a blank page or crashes with `[error]`. Reproduce it, inspect the browser/server stack trace, and identify the first failing component or data dependency. Check imports, route params, environment variables, client/server boundaries, image sources, and conditional rendering. Add a graceful error state only where appropriate. Verify the route through a fresh load and direct navigation.
        > 
    - Route returns 404
        
        > `[URL]` returns 404 unexpectedly. Confirm whether the route file exists, whether its folder maps to the intended URL, whether a dynamic parameter is valid, and whether redirects or rewrites override it. Check case sensitivity and route generation. Fix the correct route or redirect, update sitemap and internal links if needed, and test the exact URL.
        > 
    - Route redirects incorrectly
        
        > `[URL]` redirects to `[destination]` unexpectedly. Inspect `next.config.js`, page-level redirects, middleware if present, canonical metadata, and links pointing to the route. Determine whether the redirect should be permanent, temporary, or removed. Preserve old-link behavior where needed and test status code, destination, query strings, and canonical output.
        > 
    - Deleted route still appears
        
        > The route `[deleted URL]` still appears in navigation, sitemap, site-audit output, redirects, or internal links. Search the repository for every reference, distinguish source files from generated files, and remove or update the references consistently. Decide explicitly whether the old URL should 404 or redirect to a valid replacement. Run the site-map generator, build, and a direct route check.
        > 
    - Sitemap error
        
        > Audit `app/sitemap.ts` for `[URL]`. Confirm every sitemap URL is canonical, indexable, live, and intentionally public. Remove private, deleted, duplicate, redirected, or noindex URLs. Update `lastModified` from the actual page change date, not the current time. Validate the generated sitemap and run a production build.
        > 
    - Robots or indexing problem
        
        > Investigate why `[URL]` is or is not being indexed. Check page metadata, canonical, `robots.txt`, sitemap membership, redirects, noindex directives, route status, and internal links. Do not use robots blocking to hide a page that should rank. Make the smallest correction and report exactly what crawlers will see.
        > 
    - Wrong title, description, or canonical
        
        > Fix the metadata for `[URL]`. Inspect inherited layout metadata and page-level metadata. Set one accurate title, description, canonical, Open Graph title/description/image, and index/follow policy. Keep the title under the site’s length target and the description concise with a useful CTA. Verify the generated `<head>` output.
        > 
    - JSON-LD or rich-result error
        
        > Audit the structured data on `[URL]`. Compare JSON-LD with the visible page content and use only schema types supported by the page. Check required properties, URLs, dates, author/provider relationships, breadcrumbs, FAQ answers, and duplicate scripts. Fix invalid or misleading schema and validate the generated JSON-LD.
        > 
    - Missing breadcrumb or internal-link issue
        
        > Audit `[URL]` for navigation and internal-link quality. Add visible breadcrumbs and matching BreadcrumbList schema where appropriate. Link to one relevant service, one supporting resource, one proof page, and the appropriate CTA. Use descriptive anchor text and avoid circular, irrelevant, or orphaned links.
        > 
    - API route returns 500
        
        > `[API route]` returns HTTP 500 with `[error]`. Reproduce it using a safe representative request. Inspect input parsing, validation, environment-variable presence by name only, upstream response status, timeout behavior, error handling, and server/client boundaries. Preserve rate limits and secret handling. Add a useful non-sensitive error response, then test valid, invalid, missing-configuration, and upstream-failure paths.
        > 
    - Gemini or AI tool failure
        
        > The AI tool `[tool]` fails during `[step]`. Inspect the client component, API route, prompt builder, sanitization, rate limiting, and upstream Gemini response handling. Do not expose or print API keys, weaken same-origin checks, remove input limits, or claim success on an empty response. Preserve a useful loading/error state and test missing-key, invalid-input, rate-limit, upstream-error, and successful-response behavior.
        > 
    - Supabase lead capture failure
        
        > Lead capture fails on `[tool/route]`. Inspect `LeadGate`, `lib/supabase.ts`, the schema, source value, insert/update payload, RLS assumptions, and environment-variable presence by name only. Preserve user privacy and do not print submitted lead data or credentials. Make the UI communicate failure clearly and verify both a successful capture and a controlled failure when Supabase is unavailable.
        > 
    - Menti authentication failure
        
        > Menti authentication is failing at `[route]`. Inspect `mentiAuth`, cookie options, password environment binding, rate limiting, request parsing, login, logout, reset, and room access checks. Preserve fail-closed behavior and do not add a default password or log secrets. Test unauthenticated, invalid-password, valid-password, cookie validation, logout, and reset flows.
        > 
    - Image or `next/image` error
        
        > `[URL]` reports an image or `next/image` error. Check that the file exists under `public`, the source path is correct, dimensions and `alt` text are present, and remote-image configuration is required only when appropriate. Preserve aspect ratio and avoid layout shift. Test the route at desktop and mobile widths.
        > 
    - Mobile layout breaks
        
        > The page `[URL]` breaks at `[viewport]`. Reproduce at mobile, tablet, and desktop widths. Inspect grids, fixed widths, overflow, long headings, tables, flyouts, sticky elements, cards, images, and CTA wrapping. Preserve the intended visual hierarchy, add mobile-first layout rules, and verify horizontal scrolling only where it is intentional.
        > 
    - Navigation menu disappears
        
        > The `[menu]` submenu closes before it can be clicked. Reproduce the pointer path. Inspect parent `mouseenter`/`mouseleave`, submenu gaps, absolute positioning, timers, outside-click handlers, stacking contexts, and mobile behavior. Add a safe hover bridge or close delay, preserve keyboard and touch interaction, and test moving from trigger to submenu, submenu to submenu item, outside click, Escape, and mobile accordion behavior.
        > 
    - Animation causes accessibility or performance problems
        
        > Improve or fix animation on `[URL]`. Use the existing `FadeIn` and hero animation patterns. Respect `prefers-reduced-motion`, avoid infinite motion for essential content, avoid layout shifts, preserve keyboard focus, and stop observers/timers/animation frames on unmount. Test reduced-motion and normal-motion behavior.
        > 
    - Slow page or poor Core Web Vitals
        
        > Audit performance for `[URL]`. Identify the largest contentful element, render-blocking fonts, oversized images, client JavaScript, third-party scripts, animations, and unnecessary network requests. Preserve visual quality and functionality while reducing the critical path. Measure before and after and report LCP, CLS, and INP observations.
        > 
    - Broken external embed
        
        > The `[Calendly/video/analytics/embed]` integration is failing. Confirm whether the external service is reachable and whether the failure is due to configuration, policy, or application code. Preserve a usable fallback CTA, privacy expectations, and no console errors where possible. Do not replace the service with a fabricated success state.
        > 
    - Form does not submit
        
        > The form on `[URL]` does not submit correctly. Reproduce empty, invalid, valid, duplicate, slow-network, and server-error states. Inspect client validation, request payload, API route, response handling, success redirect, analytics, and consent. Keep accessible labels and clear error messages. Do not silently discard user input.
        > 
    - Broken links or orphaned pages
        
        > Audit `[route or section]` for broken and orphaned internal links. Resolve every local link against the actual route tree, redirects, and dynamic parameters. Repair incorrect paths, remove deleted destinations, and add meaningful inbound links to important pages. Do not use the sitemap as the only inbound link source.
        > 
    - SEO keyword collision
        
        > Audit the primary keyword for `[URL]` against `docs/keyword-map.md` and related pages. Determine whether the new copy creates search-intent overlap. Keep one primary intent per page, adjust the heading/title/internal links if needed, and preserve secondary topical coverage without creating competing pages.
        > 
    - Unsupported proof or inconsistent statistic
        
        > Audit `[claim/stat]` across the site. Search all source, metadata, schema, `llms.txt`, case studies, and guides for conflicting versions. Keep only the verified source-backed value. If the claim cannot be verified, replace it with a precise qualitative statement or explicitly say that public data is unavailable. Do not invent a replacement number.
        > 
    - Security issue
        
        > Investigate this security concern: `[issue]`. Inspect the affected route and data flow. Preserve authentication, authorization, rate limits, input validation, same-origin checks, secure cookies, secret handling, TLS verification, and error redaction. Fix the narrowest root cause, test authorized and unauthorized paths, and do not expose credentials or sensitive user data in logs, responses, or source.
        > 
    - Production-only failure
        
        > `[URL]` works locally but fails in production with `[error]`. Compare build mode, Node/Next versions, environment-variable names, case-sensitive paths, dynamic rendering, external network policy, image/font fetching, and Vercel runtime behavior. Reproduce with a production build locally when possible. Fix the environmental or code difference and verify the production-compatible path without copying secrets into files.
        > 
    - Final validation prompt
        
        > Run `git diff --check` and `npx tsc --noEmit`. If the change affects production rendering, run `npm run build` or explain the exact blocker. Smoke-test the changed URL and one relevant CTA. Verify title, description, canonical, robots, breadcrumbs, JSON-LD, internal links, sitemap membership, mobile behavior, keyboard focus, reduced-motion behavior, and console/server errors. Confirm no unrelated files changed. Report passed, failed, skipped, and blocked checks separately.
        > 
        > 
        > ---
        > 
- 6. Risk, Operations & Change Management
    - Shared instruction for risk and change work
        
        > You are working on the Myntmore Next.js website in `/workspace/ClaudeCode`. Inspect the relevant route, components, API handlers, environment-variable names, analytics integrations, database schema, deployment configuration, and existing documentation before changing anything. Preserve existing user changes and unrelated behavior. Never print, hard-code, or commit secrets. Preserve validation, security, consent, rate limits, TLS verification, accessibility, SEO metadata, schema, canonical URLs, redirects, and responsive behavior. Reproduce the issue before editing, fix the root cause, and run `git diff --check`, `npx tsc --noEmit`, the relevant tests or smoke flows, and a production build when the change affects deployment. Report the cause, files changed, checks passed, failures, and any unresolved external dependency.
        > 
        > 
        > ---
        > 
        > ## Analytics and attribution
        > 
    - What can go wrong
        - GA4 and Meta Pixel both fire the same conversion.
            - A form submission fires once on the client and again after redirect.
            - GTM and hard-coded analytics scripts track duplicate page views.
            - UTM parameters disappear after navigation.
            - Attribution is lost when a visitor submits a form after several page views.
            - Events fire on validation failure instead of successful submission.
            - Consent is not respected before analytics or marketing scripts load.
            - Internal navigation incorrectly creates new page views.
            - Calendly conversions are counted without distinguishing completed bookings from opens.
            - Server-side and client-side events use different names or parameters.
            
            The current site uses GA4, Meta Pixel, Vercel Analytics, and Ahrefs Analytics. Audit the actual event implementation before adding another tracking layer.
            
    - Prompt: analytics audit
        
        > Audit analytics and attribution across the Myntmore website. Inventory every GA4, GTM, Meta Pixel, Vercel Analytics, Ahrefs, Calendly, form, and conversion event implementation. Build an event map showing event name, trigger, destination, parameters, consent requirement, and source file. Identify duplicate page views, duplicate conversions, missing UTM persistence, inconsistent event names, and events firing on failed submissions. Do not change behavior yet. Report the highest-risk tracking problems and propose a canonical event model.
        > 
    - Prompt: fix duplicate conversion events
        
        > Fix duplicate conversion tracking for `[conversion]`. Reproduce the event in a clean browser session and identify every place it fires. Make one successful conversion produce one canonical event with stable parameters such as `conversion_type`, `source`, `medium`, `campaign`, `page_path`, and a non-sensitive event ID where deduplication is needed. Do not track passwords, message contents, API keys, or unnecessary personal data. Verify success, validation failure, refresh, back navigation, and duplicate-submit behavior.
        > 
    - Prompt: preserve UTM attribution
        
        > Add reliable UTM attribution for `[form or CTA]`. Capture approved UTM parameters on the first landing page, preserve them through internal navigation, and attach them to the final lead or conversion event. Define expiry and overwrite behavior for a later campaign visit. Do not store sensitive data in URLs or local storage. Verify direct visits, multi-page journeys, refreshes, consent refusal, and form submission.
        > 
    - Prompt: consent-aware analytics
        
        > Audit and correct consent handling for analytics and marketing scripts. Identify which scripts are necessary, analytics, advertising, or third-party embeds. Ensure non-essential scripts and events do not run before the required consent state. Preserve a usable site when consent is refused. Document consent state, event behavior, deletion/reset behavior, and verify with a clean browser and disabled consent.
        > 
    - Prompt: Calendly attribution
        
        > Instrument `[Calendly CTA or booking flow]` so clicks, widget opens, completed bookings, cancellations, and failures are distinguishable. Do not count a button click as a completed booking. Preserve the external booking fallback and privacy behavior. Test direct links, embedded bookings, blocked third-party scripts, return navigation, and duplicate events.
        > 
        > 
        > ---
        > 
        > ## CRM and lead routing
        > 
    - What can go wrong
        - Leads go to the wrong sales owner.
            - Source or campaign fields are missing.
            - Duplicate contacts are created for the same person.
            - A form creates a lead but fails to create an opportunity.
            - Notifications go to the wrong person or fail silently.
            - Pipeline stages do not match the actual customer journey.
            - A tool lead is routed differently from a contact-form lead without documentation.
            - Personal information is copied into logs or analytics.
            - CRM API failures are hidden from both the visitor and the team.
            
            The repository documents Zoho CRM as a primary lead record and Supabase as secondary storage, but the live CRM integration should be verified before changing routing.
            
    - Prompt: CRM routing audit
        
        > Audit lead routing for `[form/tool/source]` from browser submission to CRM, Supabase, notification, and pipeline stage. Map every field, owner rule, source value, duplicate rule, retry behavior, and failure state. Inspect actual API handlers and environment-variable names without printing values. Do not change routing yet. Report where leads can be lost, duplicated, misassigned, or silently fail.
        > 
    - Prompt: change lead ownership
        
        > Change routing for `[lead type]` so it is assigned to `[owner/team/rule]`. Preserve source, campaign, landing page, consent, and original submission timestamp. Define what happens when the owner is unavailable, the CRM rejects the request, or the lead already exists. Implement idempotency and safe retry behavior where possible. Test new lead, duplicate lead, missing owner, CRM failure, and notification failure.
        > 
    - Prompt: fix duplicate contacts
        
        > Fix duplicate contact creation for `[flow]`. Determine the matching keys permitted by the CRM policy, such as normalized email or approved CRM ID. Preserve existing records and never merge contacts automatically without a documented rule. Make retries idempotent. Test repeated submission, same email with changed details, simultaneous requests, CRM timeout, and partial failure.
        > 
    - Prompt: pipeline-stage correction
        
        > Update the pipeline mapping for `[source/form/tool]`. Define the exact stage transitions and the event that causes each transition. Preserve manual sales overrides and avoid moving existing opportunities backward without an explicit migration. Update documentation and test every valid and invalid transition.
        > 
        > 
        > ---
        > 
        > ## Email deliverability
        > 
    - What can go wrong
        - Contact-form messages never arrive.
            - SPF, DKIM, or DMARC is missing or misaligned.
            - Reply-to uses untrusted user input.
            - Notifications are sent from a domain that fails authentication.
            - Contact emails land in spam.
            - A form silently succeeds while email delivery fails.
            - There is no fallback inbox or notification.
            - User-submitted content appears in headers and enables header injection.
            - Transactional and marketing emails use the same sender reputation.
    - Prompt: contact email audit
        
        > Audit contact-form email delivery from `[route]`. Trace validation, API handling, sender address, recipient address, reply-to behavior, SPF/DKIM/DMARC alignment, provider response, timeout, retry, logging, and user-facing failure state. Prevent header injection and do not expose submitted message contents in logs. Report whether the site needs a fallback notification channel and test success, provider failure, malformed input, and reply behavior.
        > 
    - Prompt: deliverability configuration
        
        > Review the approved sending domain for SPF, DKIM, DMARC, alignment, bounce handling, reply-to, and notification fallback. Use authoritative DNS/provider documentation. Do not weaken DMARC, disable TLS, or put user input into a sender address. Propose a staged change, test with a non-production mailbox, and document rollback.
        > 
    - Prompt: notification fallback
        
        > Add a fallback for failed contact notifications. The visitor should receive a clear non-sensitive message and an alternative contact path. The team should receive an alert without exposing unnecessary personal data. Make retries idempotent, avoid notification loops, and test provider timeout, rejection, duplicate delivery, and recovery.
        > 
        > 
        > ---
        > 
        > ## Accessibility audits
        > 
    - What can go wrong
        - Menus cannot be operated with a keyboard.
            - Focus disappears when a modal or dropdown opens.
            - Buttons are implemented as links or vice versa.
            - Icon-only buttons lack accessible names.
            - Color contrast fails against cream or gradient backgrounds.
            - Headings skip levels.
            - Form errors are not announced.
            - FAQ answers are visually hidden but still confusing to screen readers.
            - Motion continues under reduced-motion settings.
            - Mobile flyouts trap or lose focus.
    - Prompt: accessibility audit
        
        > Audit `[route/component]` for keyboard navigation, focus visibility, screen-reader names, heading order, contrast, semantic landmarks, form labels, error announcements, dialog behavior, menus, accordions, and reduced motion. Use the existing component patterns where possible. Report each issue with severity, affected element, recommended fix, and manual verification steps before editing.
        > 
    - Prompt: fix navigation accessibility
        
        > Fix accessibility for the `[menu]`. Support keyboard open/close, Escape, arrow navigation where appropriate, focus visibility, outside click, touch interaction, and focus return. Ensure submenu triggers have correct roles and expanded state. Preserve the existing visual design and test keyboard-only and screen-reader-friendly behavior.
        > 
    - Prompt: accessible form fix
        
        > Fix `[form]` accessibility. Add explicit labels, descriptions, required state, input types, autocomplete where appropriate, error IDs, `aria-invalid`, and a live region for submission errors. Preserve validation and data handling. Test keyboard submission, empty fields, invalid fields, server errors, and successful completion.
        > 
    - Prompt: modal and focus fix
        
        > Fix the `[modal/dialog]` focus behavior. Move focus into the dialog, keep focus contained while open, close on Escape where appropriate, restore focus to the trigger, and ensure background content is not misleadingly interactive. Preserve mobile layout and reduced motion.
        > 
        > 
        > ---
        > 
        > ## Testing prompts
        > 
    - What can go wrong
        - A page compiles but the route is broken.
            - Tests cover implementation details but not user behavior.
            - Forms work only with a warm browser session.
            - A dependency update breaks dynamic routes or APIs.
            - Mobile navigation is never tested.
            - A build passes while production-only environment behavior fails.
            - A zero-test run is reported as success.
            - Generated sitemap or schema is not checked after route changes.
    - Prompt: route smoke test
        
        > Create or run a meaningful smoke test for `[route]`. Verify HTTP status, primary heading, metadata, canonical, JSON-LD, one primary CTA, one interactive element, and expected error behavior. Test a clean direct load and a client navigation where relevant. Report actual assertions and distinguish passed, failed, skipped, and unrun checks.
        > 
    - Prompt: end-to-end conversion test
        
        > Test the complete `[conversion flow]` from landing page to success state. Cover first visit, UTM capture, consent, form validation, API request, CRM/lead capture, analytics event, redirect, refresh, duplicate submit, timeout, and provider failure. Use test data only. Do not print secrets or personal data.
        > 
    - Prompt: dependency-update regression
        
        > After updating `[package]`, run typecheck, build, route smoke tests, interactive tool flows, navigation tests, and relevant API tests. Compare behavior before and after the update. Inspect deprecated APIs, lockfile changes, security advisories, bundle impact, and Node-version compatibility. Do not accept a green install as proof of compatibility.
        > 
        > 
        > ---
        > 
        > ## Deployment and rollback
        > 
    - What can go wrong
        - Preview and production use different environment variables.
            - A build passes in preview but fails after deployment.
            - A deployment changes routes or redirects unexpectedly.
            - A database migration runs before application code is ready.
            - Rollback restores code but not database state.
            - A deployment is declared successful before health checks finish.
            - Build-time and runtime variables are confused.
            - A rollback removes a needed migration or generated asset.
    - Prompt: deployment readiness
        
        > Prepare `[change]` for deployment. Compare required build-time and runtime environment variables, network destinations, Node/Next versions, route output, redirects, migrations, analytics, and external integrations between preview and production. Create a pre-deploy checklist, smoke tests, owner/rollback plan, and post-deploy verification. Do not copy secret values into files or logs.
        > 
    - Prompt: failed deployment diagnosis
        
        > Diagnose the failed deployment `[deployment/error]`. Identify the first failure, whether it is code, dependency, environment, network, build resource, or external-service related. Reproduce locally or in preview where possible. Fix the root cause, rerun the build, and document whether an environment setting or a code change is required.
        > 
    - Prompt: rollback decision
        
        > Evaluate whether `[deployment]` should be rolled back. Compare the impact, reversibility, database compatibility, user-visible failures, analytics effects, and current mitigation. If rollback is appropriate, define the exact version and post-rollback checks. If rollback is unsafe because of a migration or data change, propose a forward fix and explain why.
        > 
        > 
        > ---
        > 
        > ## Database and data migrations
        > 
    - What can go wrong
        - Existing leads cannot be read after a schema change.
            - A migration drops or renames data.
            - Backfills create duplicates.
            - Old application code cannot work with the new schema.
            - A migration succeeds partially.
            - RLS policies block valid reads or writes.
            - A rollback cannot restore transformed data.
            - Large backfills lock tables or time out.
    - Prompt: migration plan
        
        > Design a migration for `[schema change]`. Inventory current tables, columns, constraints, indexes, RLS policies, application reads/writes, and existing records. Provide an additive, backward-compatible sequence: expand schema, deploy compatible code, backfill in batches, verify, then contract only after evidence. Include checksums/counts, duplicate handling, rollback limits, and a recovery plan. Do not run destructive SQL without explicit approval.
        > 
    - Prompt: safe backfill
        
        > Implement a backfill for `[field/table]` using idempotent batches. Preserve existing non-null values, define how missing or conflicting records are handled, record progress, and make reruns safe. Measure before/after row counts and duplicates. Test on a small sample before the full operation and document rollback limitations.
        > 
    - Prompt: RLS/data access issue
        
        > Diagnose the `[table/operation]` access failure. Inspect client/server boundaries, Supabase keys, RLS policies, source values, and payload shape without printing credentials or personal data. Preserve least privilege. Test anonymous, authenticated, invalid, and unauthorized cases and document the intended policy.
        > 
        > 
        > ---
        > 
        > ## Privacy and compliance
        > 
    - What can go wrong
        - Analytics loads before consent.
            - Forms collect more data than necessary.
            - Lead data is sent to third parties without disclosure.
            - Deletion requests do not remove all copies.
            - Personal data appears in logs, URLs, analytics, or error responses.
            - Privacy-policy links are missing near forms.
            - AI tools retain user input unexpectedly.
            - Cookies are set without an appropriate consent state.
            - A third-party embed loads before the user accepts its category.
    - Prompt: privacy audit
        
        > Audit `[route/flow]` for data collection, analytics, cookies, AI prompts, CRM transfers, Supabase storage, third-party scripts, retention, deletion, consent, and privacy-policy links. Create a data-flow map and identify unnecessary or undocumented personal data. Do not change legal wording without the approved source. Recommend the smallest compliant implementation changes.
        > 
    - Prompt: deletion request
        
        > Implement a deletion workflow for `[data type]`. Identify every stored copy, backup retention rule, CRM record, analytics identifier, and derived record. Verify authorization, prevent deleting another person’s data, record a safe audit event, and report what cannot be immediately removed. Do not expose personal data in logs or responses.
        > 
    - Prompt: third-party script audit
        
        > Audit third-party scripts on `[route/site]`. Classify each as necessary, analytics, advertising, embedded content, or functional dependency. Ensure consent and loading strategy match the classification. Preserve fallback behavior, performance, and privacy-policy disclosure. Report scripts that should be removed, deferred, or isolated.
        > 
        > 
        > ---
        > 
        > ## Dependency and package problems
        > 
    - What can go wrong
        - `package-lock.json` conflicts with `package.json`.
            - A Next.js or React update changes rendering behavior.
            - Node version differs between local, cloud, and production.
            - A deprecated package breaks after a transitive update.
            - A security upgrade introduces a type or runtime regression.
            - A package is installed without integrity verification.
            - A library is imported in the wrong server/client boundary.
            - Build size increases unexpectedly.
    - Prompt: dependency upgrade
        
        > Evaluate upgrading `[package]` from `[old]` to `[new]`. Inspect release notes, peer dependencies, Node/Next compatibility, lockfile changes, security advisories, API deprecations, bundle impact, and affected routes. Create a compatibility plan, apply the smallest supported change, run install with lockfile verification, typecheck, build, route smoke tests, and relevant interactive flows. Do not bypass package or TLS verification.
        > 
    - Prompt: broken dependency diagnosis
        
        > Diagnose the `[package/error]` failure. Check the lockfile, installed version, Node version, import boundary, package documentation, and recent transitive changes. Do not randomly downgrade or delete the lockfile. Fix the smallest root cause, explain compatibility risk, and rerun installation and validation.
        > 
        > 
        > ---
        > 
        > ## Monitoring and alerts
        > 
    - What should be monitored
        - Production uptime and route health
            - Build and deployment failures
            - 5xx responses
            - API latency and error rate
            - Gemini, Supabase, CRM, email, and Calendly failures
            - Form conversion drops
            - Lead-routing failures
            - Duplicate conversion events
            - Search indexing errors
            - Core Web Vitals
            - Database size, connection failures, and migration status
            - Authentication failures and rate-limit spikes
    - How to avoid noisy alerts
        
        Alert on sustained thresholds, not single events. Group duplicate errors, suppress known transient failures, define severity, and include a runbook link. Every alert should have an owner and a clear next action.
        
    - Prompt: monitoring plan
        
        > Create a monitoring and alerting plan for `[system/flow]`. Define the signal, metric, threshold, evaluation window, severity, owner, notification channel, deduplication rule, maintenance suppression, and runbook. Cover route health, 5xx errors, API failures, lead capture, email delivery, analytics conversion drops, database health, and security events. Avoid alerts that cannot lead to an action.
        > 
    - Prompt: incident runbook
        
        > Write an incident runbook for `[failure]`. Include detection, first checks, containment, logs or dashboards to inspect, safe mitigation, escalation owner, rollback decision, customer-facing message, recovery verification, and post-incident documentation. Never include secrets or personal data in the runbook.
        > 
        > 
        > ---
        > 
        > ## Backup and recovery
        > 
    - What should be backed up
        - Supabase/database data
            - Database schema and migrations
            - Uploaded or generated assets
            - Repository and deployment configuration
            - DNS/email configuration documentation
            - CRM exports or provider-supported recovery data
            - Analytics configuration and conversion definitions
            - Critical environment-variable names and ownership metadata, never values
            
            A backup is only useful if restoration is tested.
            
    - Prompt: backup plan
        
        > Design a backup and recovery plan for `[system]`. Identify data, code, assets, configuration, retention, encryption, access control, backup frequency, owner, recovery point objective, recovery time objective, and provider limitations. Separate secrets from restorable configuration and do not place secret values in the plan.
        > 
    - Prompt: restore test
        
        > Perform a controlled restore test for `[backup]` in an isolated environment. Verify schema, records, relationships, RLS, application reads/writes, assets, routes, and critical integrations. Measure recovery time and data loss window. Do not overwrite production data. Document gaps and the steps required for a real recovery.
        > 
        > 
        > ---
        > 
        > ## Content publishing workflow
        > 
    - What can go wrong
        - Draft content is accidentally published.
            - Author or reviewer data is missing.
            - Images are too large or lack alt text.
            - Old pages retain stale facts.
            - Content changes bypass SEO checks.
            - A published article has no sitemap or internal links.
            - Content cannot be rolled back cleanly.
            - Multiple pages make conflicting claims.
    - Prompt: publishing workflow
        
        > Design a draft-to-published workflow for `[content type]`. Define author, reviewer, source verification, image optimization, metadata, schema, internal links, sitemap, `llms.txt`, preview, approval, publication, rollback, and post-publication checks. Keep the workflow compatible with the current file-based Next.js content structure and do not introduce a CMS unless explicitly approved.
        > 
    - Prompt: content update
        
        > Update `[page/article]` with the supplied approved content. Preserve author attribution, source links, image dimensions and alt text, modified date, canonical, schema, internal links, sitemap membership, and rollback visibility. Run the featured-snippet and keyword-collision checks if the page’s intent or headings change.
        > 
        > 
        > ---
        > 
        > ## URL migrations and redirects
        > 
    - What can go wrong
        - Old URLs become 404s.
            - Redirects form chains or loops.
            - Query strings are dropped.
            - Canonicals still point to old URLs.
            - Sitemaps include redirected URLs.
            - Internal links use legacy routes.
            - A bulk migration changes private URLs accidentally.
            - Redirect rules conflict with dynamic routes or rewrites.
    - Prompt: URL migration
        
        > Plan a migration from `[old route pattern]` to `[new route pattern]`. Build a complete redirect map with status code, query-string behavior, canonical updates, internal-link updates, sitemap cleanup, and expected 404s. Avoid redirect chains and loops. Preserve private/noindex behavior where relevant. Test representative old URLs, query strings, trailing slashes, dynamic parameters, and the final destination.
        > 
    - Prompt: redirect audit
        
        > Audit redirects in `next.config.js` for loops, chains, conflicting rules, incorrect status codes, deleted destinations, query-string loss, and private-route exposure. Produce a report before editing. Then apply only the necessary corrections and test every affected source and destination.
        > 
        > 
        > ---
        > 
        > ## Third-party integrations
        > 
    - What can go wrong
        - Calendly is unavailable but the page appears functional.
            - Video embeds fail due to privacy or network restrictions.
            - CRM or email providers time out.
            - Analytics scripts block rendering.
            - Payment or booking tools return success without completing the action.
            - External rewrites expose uncontrolled subpaths.
            - Provider API changes break parsing.
    - Prompt: integration audit
        
        > Audit `[integration]` from the user action to the provider response. Document request, response, timeout, retry, consent, error, fallback, analytics, and privacy behavior. Show a useful fallback when the provider is unavailable. Do not claim completion until the provider confirms success. Test success, timeout, rejection, blocked script, malformed response, refresh, and retry.
        > 
    - Prompt: integration replacement
        
        > Replace `[integration]` with `[new provider]` only after comparing data handling, APIs, consent, pricing, failure behavior, migration, and rollback. Preserve the existing user journey and tracking semantics. Implement an adapter where possible so provider-specific details remain isolated. Test both providers only if the migration requires dual running.
        > 
        > 
        > ---
        > 
        > ## Performance budgets
        > 
    - Suggested budgets
        
        For important marketing pages, establish budgets such as:
        
        - Initial JavaScript: define a route-specific target and fail review when it materially grows.
        - Hero image: use responsive formats and avoid oversized originals.
        - Fonts: load only used weights and avoid unnecessary external requests.
        - Third-party scripts: defer non-critical scripts.
        - CLS: avoid layout shifts from fonts, images, embeds, and dynamic banners.
        - LCP: optimize the hero heading, image, font, and first meaningful content.
        - INP: reduce heavy client components, event handlers, and animation work.
        
        The exact numbers should be measured against production hardware rather than assumed.
        
    - Prompt: performance audit
        
        > Audit performance for `[route]`. Measure build output, client JavaScript, hero image/font cost, third-party scripts, network requests, LCP, CLS, and INP. Identify the largest contributors, propose a budget, and fix only the highest-impact issues without reducing content quality or accessibility. Re-measure before and after and report the differences.
        > 
    - Prompt: page became heavier
        
        > `[route]` became slower after `[change]`. Compare the route before and after the change. Inspect imports, client/server boundaries, images, fonts, animations, analytics, embeds, and bundle size. Identify the regression, reduce critical-path cost, and verify visual and functional parity.
        > 
        > 
        > ---
        > 
        > ## Launch checklist and ownership
        > 
    - What should be defined
        
        Every meaningful change should have:
        
        - A requester
        - An implementer
        - A reviewer
        - A technical owner
        - A content owner when copy is involved
        - A deployment owner
        - An analytics owner when tracking changes
        - An incident owner if external systems are involved
        - A rollback decision-maker
        - A documentation update owner
    - Prompt: launch checklist
        
        > Create a launch checklist for `[change]`. Include scope, owner, reviewer, source-of-truth content, affected routes, metadata/schema, internal links, analytics events, CRM routing, email notifications, privacy/consent, accessibility, responsive behavior, tests, build, deployment variables, migration safety, monitoring, rollback, and post-launch verification. Assign an owner to each check and distinguish required from optional checks.
        > 
    - Prompt: post-launch verification
        
        > Verify the deployed change `[deployment/route]`. Check the production URL, status code, title, canonical, robots, JSON-LD, primary CTA, forms, analytics event behavior, CRM/notification delivery, mobile layout, accessibility basics, Core Web Vitals, redirects, and error logs. Compare against the intended release scope and report any regression with severity and owner.
        > 
    - Prompt: incident review
        
        > Write a post-incident review for `[incident]`. Include timeline, user impact, detection gap, root cause, contributing factors, mitigation, recovery, data integrity, missed alerts, permanent fix, test added, monitoring change, ownership, and follow-up date. Keep the review blameless and exclude secrets or unnecessary personal data.
        > 
        > 
        > ---
        > 
        > ## One prompt for a full website health audit
        > 
        > > Perform a full health audit of the Myntmore website in `/workspace/ClaudeCode`. Inspect all public route families, shared navigation/footer, metadata, canonicals, sitemap, robots, redirects, JSON-LD, internal links, forms, analytics, attribution, CRM/lead routing, email notifications, AI APIs, Supabase, Menti authentication, third-party embeds, accessibility, mobile layouts, performance, dependencies, deployment assumptions, privacy, backups, monitoring, and rollback readiness. Reproduce only safe read-only checks first. Produce a prioritized table with severity, evidence, affected routes/files, business impact, recommended fix, owner, and validation command. Do not change code until the audit report is complete. Then fix only the approved high-priority issues and rerun all affected checks.
        > > 
        > 
        > ---
        > 
- 7. Visual Design & Brand System
    
    Use this section as the visual source of truth for all future website changes.
    
    The Myntmore website has a warm, editorial B2B growth aesthetic. It combines a premium consulting feel with energetic startup motion and approachable, founder-led messaging.
    
    The core design idea is:
    
    Calm, credible, high-contrast presentation with bright moments of energy that make growth, movement, and momentum feel visible.
    
    - Colors
        
        The main visual foundation is:
        
        - Warm cream background: #F8F6F2
        - Deep ink headings: #0f0f14 or #0a0a0a
        - Charcoal body text: #52525B
        - Muted supporting text: #6B6B6B and #8C8279
        - Warm gold accent: #F5B731
        - Pale gold background: #FEF9EC
        - Light border: #E8E2D9
        - White content cards: #FFFFFF
        
        The website should feel warm rather than cold or overly technical. White cards sit on cream backgrounds, while dark sections are used for emphasis, proof, process, and final CTAs.
        
        The design uses accent colors by category:
        
        - Gold for the core Myntmore brand and primary actions
        - Green for cold email and deliverability
        - LinkedIn blue #0077B5 for LinkedIn services
        - Purple for selected AI or strategic sections
        - Teal, orange, red, and indigo for specific tools or content categories
        
        Accent colors should identify a page or service, not compete across the entire page. A page should usually have one dominant accent plus gold as a secondary highlight.
        
        Dark sections create contrast and signal importance.
        
        They are used for:
        
        - Why Myntmore sections
        - Founder sections
        - Final CTAs
        - Trust statements
        - Strong closing messages
        
        Common dark backgrounds include:
        
        - #0a0a0a
        - #07141c
        - #102c3b
        - Warm dark brown gradients
        - Deep navy or charcoal gradients
        
        Dark sections typically use:
        
        - White headings
        - Cream or muted blue-grey body text
        - Gold eyebrow labels
        - Gold buttons
        - Soft blurred accent blobs
        
        Avoid using dark sections for every major block. They are effective because they are occasional.
        
    - Typography
        
        The primary font is Inter, loaded through next/font.
        
        The type hierarchy is strong and editorial:
        
        - Large black hero headings
        - Tight line-height
        - Negative letter spacing on display headings
        - Heavy weights for important statements
        - Medium or semibold body copy
        - Small uppercase eyebrow labels with wide letter spacing
        - Italic words used selectively for emphasis
        
        Typical heading characteristics:
        
        - Large mobile-to-desktop scaling
        - font-black
        - Tight line-height around 0.95–1.05
        - Slightly negative letter spacing
        - One highlighted word or phrase in the page accent color
        
        The design should avoid:
        
        - Too many font families
        - Thin decorative fonts for core content
        - Long uppercase paragraphs
        - Low-contrast grey text
        - Multiple competing headline colors
        - Dense blocks without visual breaks
    - Layout
        
        The typical hero has:
        
        1. Breadcrumbs or a small context line
        2. Eyebrow label
        3. Large outcome-focused headline
        4. Supporting explanation
        5. One main CTA
        6. Optional secondary CTA or visual system diagram
        7. Soft decorative gradient blobs
        
        The hero should answer three questions immediately:
        
        - Who is this for?
        - What does Myntmore do?
        - What business outcome does it create?
        
        Cold Email uses a more visual split hero with a process illustration. Other service pages can use:
        
        - An abstract system diagram
        - A customer journey
        - A channel flow
        - A simple metric panel
        - A structured visual showing inputs, execution, and outcome
        
        Avoid opening a page with vague claims such as “Unlock your potential” or “Transform your business.” Use concrete language such as:
        
        - “Cold email that actually lands in the inbox.”
        - “Build a personal brand that fills your calendar.”
        - “Turn a vague market into a focused ICP.”
        - “Create a predictable flow of qualified conversations.”
        
        The site uses a repeating visual rhythm:
        
        1. Cream hero
        2. White or bordered stat strip
        3. Cream problem section
        4. White or cream solution section
        5. Cards or process grid
        6. Dark proof or CTA section
        7. FAQ
        8. Final CTA
        
        Sections should have generous vertical spacing, usually around py-20, py-24, or py-28.
        
        A section normally contains:
        
        - A small eyebrow
        - A strong heading
        - A short explanatory paragraph
        - A grid, visual, process, or proof element
        
        Avoid placing too many unrelated sections back to back. Every section should answer one question:
        
        - What is the problem?
        - How does the system work?
        - What do we deliver?
        - Who is it for?
        - Why trust Myntmore?
        - What happens next?
    - Cards
        
        Cards are a major part of the design system.
        
        Typical card properties:
        
        - White or near-white background
        - Light cream border
        - Rounded corners between roughly 20px and 32px
        - Subtle shadow
        - Generous internal padding
        - Small icon or numbered marker
        - Clear title
        - Short supporting text
        - Hover lift or border-color transition
        
        Common card treatments include:
        
        - Numbered process cards
        - Service cards
        - AI capability cards
        - Case-study metric cards
        - Industry cards
        - Tool cards
        - FAQ rows
        
        Cards should not become overly decorative. The content should remain more prominent than the ornament.
        
        Preferred hover behavior:
        
        - Slight upward movement
        - Subtle border-color change
        - Soft shadow increase
        - Icon or number emphasis
        
        Avoid aggressive scaling, excessive glow, or distracting permanent motion.
        
    - CTAs
        
        Primary buttons are rounded pills with strong weight.
        
        The main CTA usually uses:
        
        - Cream or pale-gold gradient
        - Gold border
        - Dark text
        - Small upward hover movement
        - Light shimmer or shadow effect
        
        Common CTA destinations:
        
        - /founder-meeting
        - /1-on-1-consultation
        - /case-studies
        - A relevant service page
        - An approved external Calendly URL
        
        CTA copy should describe the next action:
        
        - “Book a free strategy call”
        - “Get a free deliverability audit”
        - “See real results”
        - “Explore the process”
        - “Build your growth system”
        
        Avoid vague CTAs such as:
        
        - Learn more
        - Click here
        - Submit
        - Get started
        
        Each page should have one main conversion goal. Secondary CTAs should support that goal rather than compete with it.
        
    - Animation
        
        The site uses decoration to add energy without overwhelming the content:
        
        - Blurred radial gradient blobs
        - Dot grids
        - Thin connector lines
        - Numbered circles
        - Soft glow effects
        - Gold underlines
        - Marquees
        - Floating badges
        - Flow diagrams
        - Small animated indicators
        
        Decorative elements should:
        
        - Be marked aria-hidden when non-informational
        - Sit behind content
        - Avoid causing layout shift
        - Remain subtle on mobile
        - Stop or simplify under prefers-reduced-motion
        
        Do not add decoration just to fill empty space. Each visual should reinforce a concept such as movement, targeting, flow, signal, or growth.
        
        The website’s preferred motion is restrained and directional:
        
        - Hero elements fade upward in sequence
        - Sections reveal as they enter the viewport
        - Cards lift slightly on hover
        - Blobs drift slowly in the background
        - Marquees move continuously but quietly
        - Flow diagrams show movement from input to outcome
        - Underlines draw in after the heading appears
        - Stats count up when visible
        
        Use the existing:
        
        - hero-fade
        - hero-fade-d1
        - hero-fade-d2
        - hero-fade-d3
        - hero-fade-d4
        - FadeIn
        - .reveal
        - .reveal-visible
        
        Every new animation should include reduced-motion behavior. Essential content must remain visible without animation.
        
        Avoid:
        
        - Constant bouncing
        - Fast scaling
        - Large movement
        - Motion behind important text
        - Animations that delay access to content
        - Infinite animations on mobile without a clear purpose
    - Accessibility and interaction
        
        The navigation is clean and desktop-first:
        
        - Fixed header
        - Cream or translucent background after scrolling
        - Dark text
        - Gold underline on hover
        - Dropdown menus with white cards
        - Rounded borders
        - Soft shadow
        - Mobile accordion navigation
        
        Dropdowns should remain open while the pointer moves from the trigger into the submenu. Menus must also work through keyboard focus and touch.
        
        Do not introduce a hover-only interaction that cannot be reached on mobile or with a keyboard.
        
        Forms should feel calm and straightforward:
        
        - Clear labels
        - Generous spacing
        - Rounded inputs
        - Visible focus state
        - Inline errors
        - Clear success state
        - Strong but non-aggressive CTA
        - Short explanations near sensitive fields
        
        Interactive tools use a more product-like layout, but should still retain:
        
        - Cream backgrounds
        - White cards
        - Rounded controls
        - Gold primary actions
        - Clear step indicators
        - Helpful loading states
        - Friendly error messages
        
        The visitor should always understand:
        
        - What to enter
        - Why it is needed
        - What happens next
        - Whether the submission succeeded
    - Imagery
        
        Images should support trust and context:
        
        - Founder imagery should feel real and approachable
        - Client logos should remain consistent in treatment
        - Case-study imagery should relate to the industry
        - Tool illustrations should clarify the workflow
        - Decorative images should not compete with the headline
        
        All images should have:
        
        - Correct dimensions
        - Stable layout space
        - Descriptive alt text when meaningful
        - Empty alt text when purely decorative
        - Optimized formats
        - No unnecessary large originals
        
        Avoid generic stock photography that makes the site feel like a template.
        
    - Brand voice
        
        The voice is direct, confident, practical, and founder-aware.
        
        It should sound:
        
        - Clear
        - Smart
        - Energetic
        - Grounded
        - Specific
        - Slightly conversational
        
        It should avoid:
        
        - Corporate filler
        - Empty growth language
        - Overpromising
        - Aggressive sales language
        - Fake urgency
        - Unsupported statistics
        - Excessive jargon
        
        Preferred language:
        
        - “We build and run”
        - “You provide”
        - “We handle”
        - “Here is what happens”
        - “This is for you if”
        - “This is not for you if”
        - “The goal is”
        - “The system works by”
        
        The website should explain the mechanism behind the result, not only claim the result.
        
    - Page-family differences
        
        The website should not make every page identical.
        
        Service pages should feel:
        
        - Strategic
        - Outcome-focused
        - Structured
        - Conversion-oriented
        - Proof-led
        
        Blog posts should feel:
        
        - Editorial
        - Readable
        - Citation-rich
        - Calm
        - Source-backed
        
        Guides should feel:
        
        - Comprehensive
        - Instructional
        - Search-friendly
        - Well structured
        - Easy to scan
        
        Glossary pages should feel:
        
        - Definition-first
        - Compact
        - Educational
        - Internally linked
        
        Case studies should feel:
        
        - Evidence-led
        - Narrative
        - Specific
        - Trustworthy
        - Structured around problem, approach, result, and outcome
        
        Tools should feel:
        
        - Useful
        - Interactive
        - Clear
        - Product-like
        - Focused on a single task
        
        Industry and city pages should feel:
        
        - Locally or vertically relevant
        - Specific
        - Trustworthy
        - Less generic than the core service page
    - Design rules for future changes
        
        Use this prompt whenever requesting a visual change:
        
        Update [route/section] using Myntmore’s existing design system. Keep Inter typography, cream #F8F6F2 backgrounds, ink #0f0f14 headings, charcoal body copy, warm gold #F5B731, light cream borders, rounded cards, generous spacing, and the page’s existing accent color. Match the Cold Email service page’s hierarchy: strong outcome-led hero, clear stat or proof strip, problem/solution contrast, structured process, FAQ, and decisive CTA. Use existing components and animation classes where possible. Preserve copy, routes, forms, metadata, schema, accessibility, responsive behavior, reduced-motion support, and internal links unless explicitly changing them.
        
        The main design discipline for Myntmore is consistency through structure rather than making every page look identical. Pages should share the same typography, spacing, card language, CTA treatment, and motion behavior while using different accents and layouts to communicate different services and content types.