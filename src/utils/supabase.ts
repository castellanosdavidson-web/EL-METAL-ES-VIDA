import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client for the browser (public)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for the server (admin, bypasses RLS)
export const getServiceSupabase = () => {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!);
};
