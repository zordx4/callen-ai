-- Postgres grants EXECUTE to PUBLIC on new functions by default.
-- Lock the RPC surface down to signed-in users only.

revoke execute on function public.create_workspace(text) from public, anon;
revoke execute on function public.match_kb_chunks(extensions.vector, uuid, uuid, int) from public, anon;
revoke execute on function public.tg_set_updated_at() from public, anon, authenticated;
