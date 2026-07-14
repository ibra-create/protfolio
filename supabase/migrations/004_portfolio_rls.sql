alter table public.portfolio_projects enable row level security;
alter table public.portfolio_knowledge_items enable row level security;
alter table public.portfolio_suggested_questions enable row level security;
alter table public.portfolio_sources enable row level security;
alter table public.portfolio_chat_events enable row level security;

-- Public can read verified and AI-approved knowledge, but mostly they will use the Edge Function.
-- The instructions state: "Public browser: no direct insert; no direct update; no direct delete; preferably no direct access to the raw knowledge tables; chatbot access will later go through the secure Edge Function."
-- So we can actually restrict SELECT to the service role, or let public only read public info. To strictly follow "preferably no direct access", we grant no public SELECT policies.

-- Administrative/backend role full access (service_role bypassing RLS is default, or we can add specific policies for authenticated admins if needed, but no users exist yet).
-- For now, empty policies means deny all for public access.
