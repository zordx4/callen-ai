-- Call records and per-turn transcripts. Written only by the server
-- (webhook ingestion with service role); members read.

create table public.calls (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  phone_number_id uuid references public.phone_numbers(id) on delete set null,
  provider_call_id text unique,
  direction text not null default 'inbound' check (direction in ('inbound','outbound')),
  from_e164 text,
  to_e164 text,
  status text not null default 'in_progress' check (status in ('in_progress','completed','failed','transferred','no_answer','voicemail','canceled')),
  outcome text check (outcome in ('booked','resolved','escalated','voicemail','missed','abandoned','other')),
  sentiment text check (sentiment in ('positive','neutral','negative')),
  summary text,
  recording_url text,
  ended_reason text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer,
  cost_cents integer,
  created_at timestamptz not null default now()
);
create index calls_workspace_started_idx on public.calls (workspace_id, started_at desc);
create index calls_agent_idx on public.calls (agent_id);

create table public.call_turns (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references public.calls(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  role text not null check (role in ('user','assistant','system','tool')),
  content text not null,
  ms_offset integer,
  created_at timestamptz not null default now()
);
create index call_turns_call_idx on public.call_turns (call_id);
create index call_turns_workspace_idx on public.call_turns (workspace_id);

alter table public.calls enable row level security;
alter table public.call_turns enable row level security;

create policy "members read calls" on public.calls
  for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "members read call turns" on public.call_turns
  for select to authenticated using (private.is_workspace_member(workspace_id));

grant select on public.calls, public.call_turns to authenticated;
grant all on public.calls, public.call_turns to service_role;
