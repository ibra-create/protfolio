import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const reqBody = await req.json();
    const items = reqBody.items;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all projects
    const { data: projects, error: pError } = await supabase.from('portfolio_projects').select('id, slug');
    if (pError) throw pError;

    const slugToId = {};
    projects.forEach(p => { slugToId[p.slug] = p.id; });

    // Map project_id
    items.forEach(item => {
      if (item.project_id_slug && item.project_id_slug !== 'NULL') {
        item.project_id = slugToId[item.project_id_slug] || null;
      }
      delete item.project_id_slug;
    });

    const { data, error } = await supabase
      .from('portfolio_knowledge_items')
      .upsert(items, { onConflict: 'stable_key' });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, count: items.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
