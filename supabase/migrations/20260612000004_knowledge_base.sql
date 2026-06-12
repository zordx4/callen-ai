-- Knowledge base: documents uploaded by members, chunks + embeddings
-- written by the ingestion worker (service role). RAG retrieval via
-- match_kb_chunks (embedding dims = 1536, text-embedding-3-small).

create table public.kb_documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  title text not null,
  source_type text not null default 'upload' check (source_type in ('upload','url','text')),
  storage_path text,
  status text not null default 'processing' check (status in ('processing','ready','error')),
  error text,
  created_at timestamptz not null default now()
);
create index kb_documents_workspace_idx on public.kb_documents (workspace_id);

create table public.kb_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.kb_documents(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  agent_id uuid,
  chunk_index integer not null,
  content text not null,
  token_count integer,
  embedding extensions.vector(1536),
  created_at timestamptz not null default now()
);
create index kb_chunks_document_idx on public.kb_chunks (document_id);
create index kb_chunks_workspace_idx on public.kb_chunks (workspace_id);
create index kb_chunks_embedding_idx on public.kb_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

create or replace function public.match_kb_chunks(
  query_embedding extensions.vector(1536),
  target_workspace uuid,
  target_agent uuid default null,
  match_count int default 5
)
returns table (id uuid, document_id uuid, content text, similarity double precision)
language sql stable set search_path = '' as $$
  select
    c.id,
    c.document_id,
    c.content,
    1 - (c.embedding operator(extensions.<=>) query_embedding) as similarity
  from public.kb_chunks c
  where c.workspace_id = target_workspace
    and (target_agent is null or c.agent_id is null or c.agent_id = target_agent)
    and c.embedding is not null
  order by c.embedding operator(extensions.<=>) query_embedding
  limit match_count;
$$;

alter table public.kb_documents enable row level security;
alter table public.kb_chunks enable row level security;

create policy "members read kb documents" on public.kb_documents
  for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "members create kb documents" on public.kb_documents
  for insert to authenticated with check (private.is_workspace_member(workspace_id));
create policy "members update kb documents" on public.kb_documents
  for update to authenticated
  using (private.is_workspace_member(workspace_id))
  with check (private.is_workspace_member(workspace_id));
create policy "members delete kb documents" on public.kb_documents
  for delete to authenticated using (private.is_workspace_member(workspace_id));

create policy "members read kb chunks" on public.kb_chunks
  for select to authenticated using (private.is_workspace_member(workspace_id));

grant select, insert, update, delete on public.kb_documents to authenticated;
grant select on public.kb_chunks to authenticated;
grant all on public.kb_documents, public.kb_chunks to service_role;
grant execute on function public.match_kb_chunks(extensions.vector, uuid, uuid, int) to authenticated, service_role;
