import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "placeholder-key";

if (!process.env.SUPABASE_URL || (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY)) {
  // eslint-disable-next-line no-console
  console.warn("⚠️  Supabase URL or Key not set. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  // eslint-disable-next-line no-console
  console.warn("⚠️  Using placeholder values - API calls will fail until configured.");
}

export const supabase: SupabaseClient = createClient(url, anonKey);


