import { createClient } from "@supabase/supabase-js";

// Read Supabase project URL and anon public key with safe defaults
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://gaeumdoihkistojerwmh.supabase.co";

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_wcT3-bW5rOkKctwXL0UIMg_MmacsGkY";

let client = null;
if (
  supabaseUrl &&
  !supabaseUrl.includes("your-project-ref") &&
  supabaseKey &&
  !supabaseKey.includes("your-anon-key")
) {
  try {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn("Supabase client init warning:", err);
  }
}

export const supabase = client;
