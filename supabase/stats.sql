-- ============================================================
-- drchecker.io — public live stats
-- Run this once in Supabase → SQL Editor → New query → Run.
-- Safe to re-run; it will not wipe existing counts.
-- ============================================================

-- One row per day. Totals are summed from this table.
create table if not exists public.daily_stats (
  day             date primary key,
  domains_checked bigint not null default 0,
  checks_run      bigint not null default 0,
  visitors        bigint not null default 0
);

-- Used only to tell a repeat visitor from a new one, within a single day.
-- Stores a salted hash, never an IP address.
create table if not exists public.visitor_days (
  day          date not null,
  visitor_hash text not null,
  primary key (day, visitor_hash)
);

-- Locked down: no anon/authenticated policies are created, so these tables
-- are reachable only by the service role used in the API routes.
alter table public.daily_stats  enable row level security;
alter table public.visitor_days enable row level security;

-- Atomic increment for a completed DR check.
create or replace function public.bump_stats(p_domains bigint, p_checks bigint)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.daily_stats (day, domains_checked, checks_run)
  values (current_date, p_domains, p_checks)
  on conflict (day) do update
    set domains_checked = daily_stats.domains_checked + excluded.domains_checked,
        checks_run      = daily_stats.checks_run      + excluded.checks_run;
$$;

-- Counts a visitor once per day. Returns true only if this was a new visitor.
create or replace function public.bump_visitor(p_hash text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  insert into public.visitor_days (day, visitor_hash)
  values (current_date, p_hash)
  on conflict do nothing;

  get diagnostics n = row_count;

  if n > 0 then
    insert into public.daily_stats (day, visitors)
    values (current_date, 1)
    on conflict (day) do update
      set visitors = daily_stats.visitors + 1;
    return true;
  end if;

  return false;
end;
$$;

-- What the public counter reads. Aggregates only — no per-visitor data.
create or replace function public.public_stats()
returns table (
  today_domains  bigint,
  total_domains  bigint,
  today_visitors bigint,
  total_visitors bigint,
  total_checks   bigint
)
language sql
security definer
set search_path = public
as $$
  select
    coalesce((select domains_checked from public.daily_stats where day = current_date), 0),
    coalesce((select sum(domains_checked) from public.daily_stats), 0),
    coalesce((select visitors from public.daily_stats where day = current_date), 0),
    coalesce((select sum(visitors) from public.daily_stats), 0),
    coalesce((select sum(checks_run) from public.daily_stats), 0);
$$;

-- Housekeeping: visitor_days only needs ~2 days to do its job.
-- Optional, run occasionally, or schedule with pg_cron if you enable it.
-- delete from public.visitor_days where day < current_date - 2;
