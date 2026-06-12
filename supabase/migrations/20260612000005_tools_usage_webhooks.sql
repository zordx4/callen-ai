-- Agent tools (transfer, calendar, sms, webhook), usage metering for
-- billing, and raw provider webhook events for idempotency + debugging.

create table public.agent_tools (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  type text not null check (type in ('transfer','calendar','sms','webhook','knowledge')),
  name text not null,
  config jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
create index agent_tools_agent_idx on public.agent_tools (agent_id);
create index agent_tools_workspace_idx on public.agent_tools (workspace_id);

create table public.usage_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  agent_id uuid,
  call_id uuid,
  kind text not null check (kind in ('call_minutes','sms','number_rental','other')),
  quantity numeric not null,
  unit text not null default 'minutes',
  cost_cents integer,
  recorded_at timestamptz not null default now()
);
create index usage_events_workspace_recorded_idx on public.usage_events (workspace_id, recorded_at desc);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  provider_event_id text unique,
  payload jsonb not null,
  processed boolean not null default false,
  error text,
  created_at timestamptz not null default now()
);
create index webhook_events_unprocessed_idx on public.webhook_events (processed) where not processed;

alter table public.agent_tools enable row level security;
alter table public.usage_events enable row level security;
alter table public.webhook_events enable row level security;

create policy "members read agent tools" on public.agent_tools
  for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "members create agent tools" on public.agent_tools
  for insert to authenticated with check (private.is_workspace_member(workspace_id));
create policy "members update agent tools" on public.agent_tools
  for update to authenticated
  using (private.is_workspace_member(workspace_id))
  with check (private.is_workspace_member(workspace_id));
create policy "members delete agent tools" on public.agent_tools
  for delete to authenticated using (private.is_workspace_member(workspace_id));

create policy "members read usage" on public.usage_events
  for select to authenticated using (private.is_workspace_member(workspace_id));

-- webhook_events: service role only. RLS enabled, no policies, no grants
-- to authenticated (intentional; advisor INFO is expected).

grant select, insert, update, delete on public.agent_tools to authenticated;
grant select on public.usage_events to authenticated;
grant all on public.agent_tools, public.usage_events, public.webhook_events to service_role;
