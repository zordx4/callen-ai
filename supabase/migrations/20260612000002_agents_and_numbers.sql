-- Agents (synced to the voice runtime) and phone numbers.

create table public.agents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  status text not null default 'draft' check (status in ('draft','active','paused','archived')),
  system_prompt text not null default '',
  greeting text,
  voice_id text,
  language text not null default 'en-US',
  provider text not null default 'vapi',
  provider_agent_id text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index agents_workspace_idx on public.agents (workspace_id);
create trigger agents_updated_at before update on public.agents
for each row execute function public.tg_set_updated_at();

create table public.phone_numbers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  e164 text not null unique,
  provider text not null default 'vapi',
  provider_number_id text,
  status text not null default 'active' check (status in ('provisioning','active','released')),
  monthly_cost_cents integer not null default 0,
  created_at timestamptz not null default now()
);
create index phone_numbers_workspace_idx on public.phone_numbers (workspace_id);

alter table public.agents enable row level security;
alter table public.phone_numbers enable row level security;

create policy "members read agents" on public.agents
  for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "members create agents" on public.agents
  for insert to authenticated with check (private.is_workspace_member(workspace_id));
create policy "members update agents" on public.agents
  for update to authenticated
  using (private.is_workspace_member(workspace_id))
  with check (private.is_workspace_member(workspace_id));
create policy "members delete agents" on public.agents
  for delete to authenticated using (private.is_workspace_member(workspace_id));

-- Numbers are provisioned server-side only (service role); users read.
create policy "members read phone numbers" on public.phone_numbers
  for select to authenticated using (private.is_workspace_member(workspace_id));

grant select, insert, update, delete on public.agents to authenticated;
grant select on public.phone_numbers to authenticated;
grant all on public.agents, public.phone_numbers to service_role;
