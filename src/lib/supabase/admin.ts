import { createClient } from "@supabase/supabase-js"

// Admin client with SERVICE_ROLE_KEY — bypasses RLS
// ONLY use server-side for admin operations
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
