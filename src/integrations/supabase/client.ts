import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasConfig = supabaseUrl && supabaseAnonKey;

export const supabase = hasConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as ReturnType<typeof createClient>, {
      get(_target, _prop) {
        return () =>
          Promise.reject(new Error("Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file to use the community features."));
      },
    });
