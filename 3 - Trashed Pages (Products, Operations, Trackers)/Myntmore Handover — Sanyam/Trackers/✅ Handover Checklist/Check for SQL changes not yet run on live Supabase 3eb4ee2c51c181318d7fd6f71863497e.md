# Check for SQL changes not yet run on live Supabase (dashboard-myntmore supabase/*.sql, outreach-tool migrations)

Area: Tech & infra
Notes: Neither repo applies database changes on deploy. Dashboard SQL files are run by hand in the Supabase SQL editor; outreach-tool migrations must be run against the live project. outreach.campaigns and outreach.lead_files were created by hand before their migrations, so described defaults may not be live.
Phase: 1. Map everything
Priority: Medium
Status: Done
System: Infra & proxies