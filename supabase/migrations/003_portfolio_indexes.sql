create index if not exists idx_portfolio_knowledge_project_id on public.portfolio_knowledge_items (project_id);
create index if not exists idx_portfolio_knowledge_language on public.portfolio_knowledge_items (language);
create index if not exists idx_portfolio_knowledge_content_type on public.portfolio_knowledge_items (content_type);
create index if not exists idx_portfolio_knowledge_category on public.portfolio_knowledge_items (category);
create index if not exists idx_portfolio_knowledge_verified on public.portfolio_knowledge_items (verified);
create index if not exists idx_portfolio_knowledge_approved on public.portfolio_knowledge_items (approved_for_ai);
create index if not exists idx_portfolio_knowledge_is_public on public.portfolio_knowledge_items (is_public);

create index if not exists idx_portfolio_knowledge_skills on public.portfolio_knowledge_items using gin (skills);
create index if not exists idx_portfolio_knowledge_tools on public.portfolio_knowledge_items using gin (tools);
create index if not exists idx_portfolio_knowledge_keywords on public.portfolio_knowledge_items using gin (keywords);

create index if not exists portfolio_knowledge_embedding_hnsw
on public.portfolio_knowledge_items
using hnsw (embedding vector_ip_ops);
