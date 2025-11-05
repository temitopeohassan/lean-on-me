import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? "";
const anonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn("Supabase URL or Key not set. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
}

export const supabase = createClient(url, anonKey);


