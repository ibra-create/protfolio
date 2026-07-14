create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_portfolio_projects_updated_at on public.portfolio_projects;
create trigger set_portfolio_projects_updated_at
before update on public.portfolio_projects
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_portfolio_knowledge_items_updated_at on public.portfolio_knowledge_items;
create trigger set_portfolio_knowledge_items_updated_at
before update on public.portfolio_knowledge_items
for each row
execute function public.set_current_timestamp_updated_at();
