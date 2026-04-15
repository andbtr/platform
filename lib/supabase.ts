import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function createSupabaseClient(supabaseUrl: string, supabaseAnonKey: string): SupabaseClient {
	return createClient(supabaseUrl, supabaseAnonKey)
}