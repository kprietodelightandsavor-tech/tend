-- Tend · schedule persistence (school-year weekday blocks)
-- Run once in the Supabase SQL editor. Safe to re-run (uses IF NOT EXISTS).

create table if not exists public.schedule_blocks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  day         text not null,
  subject     text not null default 'Untitled',
  time        text not null default '',
  note        text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.schedule_blocks enable row level security;

drop policy if exists "Users manage their own schedule blocks" on public.schedule_blocks;
create policy "Users manage their own schedule blocks"
  on public.schedule_blocks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists schedule_blocks_user_day_idx
  on public.schedule_blocks (user_id, day, sort_order);
