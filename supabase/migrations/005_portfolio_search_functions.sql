create or replace function public.match_portfolio_knowledge(
    query_embedding extensions.vector(384),
    match_threshold float,
    match_count integer,
    filter_language text default null,
    filter_project_slug text default null
)
returns table (
    id bigint,
    stable_key text,
    project_slug text,
    language text,
    content_type text,
    category text,
    title text,
    content text,
    skills text[],
    tools text[],
    source_url text,
    source_label text,
    similarity float,
    metadata jsonb
)
language plpgsql
security definer -- required to bypass RLS when called by anon via Edge Function, if needed. But Edge functions usually use service_role. 
as $$
begin
    return query
    select
        k.id,
        k.stable_key,
        p.slug as project_slug,
        k.language,
        k.content_type,
        k.category,
        k.title,
        k.content,
        k.skills,
        k.tools,
        k.source_url,
        k.source_label,
        1 - (k.embedding <=> query_embedding) as similarity,
        k.metadata
    from public.portfolio_knowledge_items k
    left join public.portfolio_projects p on p.id = k.project_id
    where
        k.verified = true
        and k.approved_for_ai = true
        and k.is_public = true
        and (filter_language is null or k.language = filter_language)
        and (filter_project_slug is null or p.slug = filter_project_slug)
        and 1 - (k.embedding <=> query_embedding) > match_threshold
    order by k.embedding <=> query_embedding
    limit match_count;
end;
$$;

-- Keyword fallback function
create or replace function public.search_portfolio_knowledge_keyword(
    search_query text,
    match_count integer,
    filter_language text default null
)
returns table (
    id bigint,
    stable_key text,
    project_slug text,
    language text,
    content_type text,
    category text,
    title text,
    content text,
    skills text[],
    tools text[],
    source_url text,
    source_label text,
    metadata jsonb
)
language plpgsql
security definer
as $$
begin
    return query
    select
        k.id,
        k.stable_key,
        p.slug as project_slug,
        k.language,
        k.content_type,
        k.category,
        k.title,
        k.content,
        k.skills,
        k.tools,
        k.source_url,
        k.source_label,
        k.metadata
    from public.portfolio_knowledge_items k
    left join public.portfolio_projects p on p.id = k.project_id
    where
        k.verified = true
        and k.approved_for_ai = true
        and k.is_public = true
        and (filter_language is null or k.language = filter_language)
        and (k.title ilike '%' || search_query || '%' or k.content ilike '%' || search_query || '%')
    limit match_count;
end;
$$;
