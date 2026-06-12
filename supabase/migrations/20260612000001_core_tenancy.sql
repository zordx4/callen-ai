-- Core multi-tenancy: workspaces, members, RLS helpers, signup bootstrap.
-- Applied to project raxwswizxwtnmzbfimcw on 2026-06-12 via MCP.

create extension if not exists vector with schema extensions;

create schema if not exists private;

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  industry text,
  plan text not null default 'trial' check (plan in ('trial','starter','growth','enterprise')),
  settings jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index workspace_members_user_idx on public.workspace_members (user_id);

-- Security-definer helpers: these bypass RLS internally, which is what
-- makes membership-based policies possible without infinite recursion.
create or replace function private.is_workspace_member(ws uuid)
returns boolean language sql security definer stable set search_path = '' as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws and m.user_id = (select auth.uid())
  );
$$;

create or replace function private.is_workspace_admin(ws uuid)
returns boolean language sql security definer stable set search_path = '' as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws and m.user_id = (select auth.uid())
      and m.role in ('owner','admin')
  );
$$;

create or replace function private.is_workspace_owner(ws uuid)
returns boolean language sql security definer stable set search_path = '' as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws and m.user_id = (select auth.uid())
      and m.role = 'owner'
  );
$$;

create or replace function public.tg_set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger workspaces_updated_at before update on public.workspaces
for each row execute function public.tg_set_updated_at();

-- Every new signup gets their own workspace (kills the shared demo tenant).
-- Exception-safe: a bootstrap failure must never block account creation.
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  ws_id uuid;
  ws_name text;
begin
  ws_name := coalesce(nullif(trim(new.raw_user_meta_data->>'business'), ''), 'My workspace');
  insert into public.workspaces (name, slug, created_by)
  values (
    ws_name,
    lower(regexp_replace(ws_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(gen_random_uuid()::text, 1, 8),
    new.id
  )
  returning id into ws_id;
  insert into public.workspace_members (workspace_id, user_id, role)
  values (ws_id, new.id, 'owner');
  return new;
exception when others then
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

-- RPC for creating additional workspaces from the app.
create or replace function public.create_workspace(workspace_name text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  ws_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'not authenticated';
  end if;
  insert into public.workspaces (name, slug, created_by)
  values (
    workspace_name,
    lower(regexp_replace(workspace_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(gen_random_uuid()::text, 1, 8),
    (select auth.uid())
  )
  returning id into ws_id;
  insert into public.workspace_members (workspace_id, user_id, role)
  values (ws_id, (select auth.uid()), 'owner');
  return ws_id;
end;
$$;

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create policy "members read their workspaces" on public.workspaces
  for select to authenticated using (private.is_workspace_member(id));
create policy "admins update workspaces" on public.workspaces
  for update to authenticated
  using (private.is_workspace_admin(id))
  with check (private.is_workspace_admin(id));
create policy "owners delete workspaces" on public.workspaces
  for delete to authenticated using (private.is_workspace_owner(id));

create policy "members read memberships" on public.workspace_members
  for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "admins add members" on public.workspace_members
  for insert to authenticated with check (private.is_workspace_admin(workspace_id));
create policy "admins update members" on public.workspace_members
  for update to authenticated
  using (private.is_workspace_admin(workspace_id))
  with check (private.is_workspace_admin(workspace_id));
create policy "admins remove members" on public.workspace_members
  for delete to authenticated using (private.is_workspace_admin(workspace_id));

grant select, update, delete on public.workspaces to authenticated;
grant select, insert, update, delete on public.workspace_members to authenticated;
grant all on public.workspaces, public.workspace_members to service_role;
grant execute on function public.create_workspace(text) to authenticated;
