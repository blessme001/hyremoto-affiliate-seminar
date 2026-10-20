-- Run ONCE in the dedicated HyreMoto Supabase project's SQL Editor.
-- This is an installation script, not a generated CLI migration.
begin;
create table public.seminar_admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.seminar_admins enable row level security;
revoke all on public.seminar_admins from anon, authenticated;
grant select on public.seminar_admins to authenticated;
create policy "Admins see their own membership" on public.seminar_admins
 for select to authenticated using (user_id = (select auth.uid()));
create table public.seminar_registrations (
 id uuid primary key default gen_random_uuid(),
 event_id text not null check (event_id = 'hyremoto-affiliate-seminar'),
 full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
 email text not null check(email=lower(btrim(email)) and char_length(email) between 3 and 254),
 whatsapp text not null check(whatsapp ~ '^\+[1-9][0-9]{7,14}$'),
 country text not null check(char_length(btrim(country)) between 1 and 100),
 category text not null check(category in ('Individual affiliate','Influencer or content creator','Sales agent or broker','Business owner or company representative','Travel agent or travel business','Corporate partnership representative','Other')),
 company_name text check(char_length(company_name)<=160),
 source text check(char_length(source)<=160),
 consent_version text not null,
 consent_text text not null,
 consent_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 unique(event_id,email),
 check (category not in ('Business owner or company representative','Travel agent or travel business','Corporate partnership representative') or char_length(btrim(company_name))>0 and company_name is not null)
);
alter table public.seminar_registrations enable row level security;
revoke all on public.seminar_registrations from anon, authenticated;
grant select on public.seminar_registrations to authenticated;
create policy "Only approved seminar admins read registrations" on public.seminar_registrations
 for select to authenticated using (exists (select 1 from public.seminar_admins where user_id=(select auth.uid())));
create index seminar_registration_created_idx on public.seminar_registrations(event_id,created_at desc,id);
-- Short-lived rate-limit keys are salted hashes, never raw IP addresses.
create table public.seminar_rate_limits (
 key text primary key,
 attempts integer not null,
 expires_at timestamptz not null
);
alter table public.seminar_rate_limits enable row level security;
revoke all on public.seminar_rate_limits from anon, authenticated;
grant all on public.seminar_registrations, public.seminar_rate_limits to service_role;
create function public.consume_seminar_limit(limit_key text) returns boolean
 language plpgsql security invoker set search_path = '' as $$
declare current_attempts integer;
begin
 delete from public.seminar_rate_limits where expires_at < now();
 insert into public.seminar_rate_limits as counters(key,attempts,expires_at)
 values(limit_key,1,now()+interval '10 minutes')
 on conflict(key) do update set attempts=counters.attempts+1
 returning attempts into current_attempts;
 return current_attempts<=5;
end;
$$;
revoke all on function public.consume_seminar_limit(text) from public, anon, authenticated;
grant execute on function public.consume_seminar_limit(text) to service_role;
commit;
-- Create the admin user in Authentication > Users, then explicitly approve their UUID:
-- insert into public.seminar_admins(user_id) values ('REAL-ADMIN-USER-UUID');
-- Never grant membership based on user-editable metadata or permit public membership inserts.
