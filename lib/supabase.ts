import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export function createSupabaseClient(supabaseUrl: string, supabaseAnonKey: string): SupabaseClient {
	if (typeof window === 'undefined') {
		return createClient(supabaseUrl, supabaseAnonKey)
	}

	if (!supabaseClient) {
		supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
	}

	return supabaseClient
}