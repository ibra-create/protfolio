import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const session = new Supabase.ai.Session('gte-small');

serve(async (req) => {
  try {
    const reqBody = await req.json().catch(() => ({}));

    // If a query is provided, just return its embedding (for testing/RAG runtime)
    if (reqBody.query) {
      const embedding = await session.run(reqBody.query, { mean_pool: true, normalize: true });
      return new Response(JSON.stringify({ embedding }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Otherwise, act as an admin job to populate missing embeddings
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch items with no embedding - strictly limit to 3 to avoid timeouts
    const { data: items, error: fetchError } = await supabase
      .from('portfolio_knowledge_items')
      .select('id, content')
      .is('embedding', null)
      .limit(3);

    if (fetchError) throw fetchError;

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: "No items to process" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    let processed = 0;
    for (const item of items) {
      const embedding = await session.run(item.content, { mean_pool: true, normalize: true });
      
      const { error: updateError } = await supabase
        .from('portfolio_knowledge_items')
        .update({ embedding: JSON.stringify(embedding) })
        .eq('id', item.id);
        
      if (updateError) throw updateError;
      processed++;
    }

    return new Response(JSON.stringify({ processed }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
