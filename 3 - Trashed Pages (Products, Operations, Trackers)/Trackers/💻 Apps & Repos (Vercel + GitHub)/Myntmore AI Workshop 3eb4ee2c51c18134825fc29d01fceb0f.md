# Myntmore AI Workshop

Flag: SECURITY: api/gemini.ts has no auth or rate limit, and row-level security is off on workshop_sessions. Fixed in Oct 2026: the jewellery PDF crash, the missing jewellery columns, the 3 steps with no timeout and the double-save race. Razorpay paywall and coupons designed but not built.
Framework: Vite
Hosted on: Vercel (aitoolsteejay team)
Keys used (names only): VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID, GEMINI_API_KEY (server-only); planned Razorpay keys
Live URL: https://workshop-vert-omega.vercel.app
Owner: Sanyam → new owner
Status: Live - in use
System: Workshop
Type: Internal
What it is: Free 10-step AI workshop lead magnet (name/email/phone captured up front) that ends in a PDF report: LinkedIn profile, ICPs, value prop, website prompt, GTM, outreach playbook, plus jewellery design/modelling prompts. Vite, React 18, Supabase (workshop_sessions table, session storage only), Gemini 2.5 Flash via one Vercel serverless proxy (api/gemini.ts). Embedded at http://myntmore.com/workshop. Clay and Apollo affiliate links are built in.