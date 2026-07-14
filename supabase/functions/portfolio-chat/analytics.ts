import { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { Language } from "./types.ts";

export async function logChatEvent(
  supabase: SupabaseClient,
  event: {
    event_type: string;
    language: Language;
    question_category?: string | null;
    matched_project_slug?: string | null;
    answered: boolean;
    source_count: number;
    response_time_ms: number;
    model_name?: string | null;
    error_code?: string | null;
  },
): Promise<void> {
  try {
    const { error } = await supabase.from("portfolio_chat_events").insert(event);
    if (error) console.warn("Analytics insert failed", error.message);
  } catch (error) {
    console.warn("Analytics unavailable", error instanceof Error ? error.message : "unknown");
  }
}
