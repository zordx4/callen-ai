-- Runtime decision: Retell instead of Vapi. Columns are provider-agnostic;
-- only the defaults change.

alter table public.agents alter column provider set default 'retell';
alter table public.phone_numbers alter column provider set default 'retell';
