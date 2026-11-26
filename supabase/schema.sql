-- AI & Operations wiki: tables for shared active/inactive switches and edits
-- made from the website. Run once in Supabase → SQL Editor.
--
-- The site talks to these tables only through its own Vercel functions
-- (api/status.js, api/content.js) using the service role key. Row Level
-- Security is on with no policies, so the public anon key cannot read or
-- write them.

create table if not exists public.wiki_inactive (
  id         text primary key check (id ~ '^[0-9a-f]{32}$'),
  updated_at timestamptz not null default now()
);

create table if not exists public.wiki_pages (
  id         text primary key check (id ~ '^[0-9a-f]{32}$'),
  title      text,
  md         text,                 -- page body (markdown), null = unchanged
  cols       jsonb,                -- table columns, null = unchanged
  rows       jsonb,                -- table rows [[cell,...],...], null = unchanged
  row_ids    jsonb,                -- page id for each row (or null)
  updated_at timestamptz not null default now(),
  updated_by text
);

-- Every save is also kept here, so earlier versions can be recovered.
create table if not exists public.wiki_history (
  hid        bigint generated always as identity primary key,
  id         text not null,
  title      text,
  md         text,
  cols       jsonb,
  rows       jsonb,
  row_ids    jsonb,
  action     text not null default 'save',   -- save | revert
  saved_at   timestamptz not null default now(),
  saved_by   text
);
create index if not exists wiki_history_id on public.wiki_history (id, saved_at desc);

alter table public.wiki_inactive enable row level security;
alter table public.wiki_pages    enable row level security;
alter table public.wiki_history  enable row level security;
