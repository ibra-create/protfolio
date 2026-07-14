-- 008_update_rls.sql
-- Ensure public has no direct SELECT access to knowledge items.

-- Drop any existing public SELECT policy on portfolio_knowledge_items
drop policy if exists "Public can read verified knowledge" on public.portfolio_knowledge_items;

-- Re-enable RLS just in case
alter table public.portfolio_knowledge_items enable row level security;

-- From now on, public access is solely mediated through the SECURITY DEFINER RPC `match_portfolio_knowledge`.
