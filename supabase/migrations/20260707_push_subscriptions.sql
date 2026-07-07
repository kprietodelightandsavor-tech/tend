-- Push notification subscriptions (one row per device)
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  endpoint text not null unique,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

-- The netlify functions use the service key (bypasses RLS); no public policies needed.

-- Currently Reading card (home screen)
alter table profiles add column if not exists reading_title text;
alter table profiles add column if not exists reading_spot  text;
