import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import config from "@/lib/config"

// Validate required environment variables
if (!config.database.supabaseUrl || !config.database.supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create client-side Supabase client
export const supabase = createClient<Database>(config.database.supabaseUrl, config.database.supabaseAnonKey)

// Create server-side Supabase client with service role key
export const createServerSupabaseClient = () => {
  if (!config.database.supabaseServiceRoleKey) {
    throw new Error("Missing Supabase service role key")
  }

  return createClient<Database>(config.database.supabaseUrl, config.database.supabaseServiceRoleKey)
}
