import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

const TOKEN_ERRORS = [
	'Invalid Refresh Token',
	'Refresh Token Not Found',
	'refresh_token_not_found',
	'invalid_grant',
	'session_not_found',
]

function isTokenError(error: unknown): boolean {
	if (!error || typeof error !== 'object') return false
	const err = error as { message?: string; code?: string }
	const message = (err.message || '').toLowerCase()
	const code = (err.code || '').toLowerCase()
	return TOKEN_ERRORS.some(
		(keyword) => message.includes(keyword.toLowerCase()) || code.includes(keyword.toLowerCase())
	)
}

function handleTokenError() {
	if (typeof window === 'undefined') return

	// Clear auth state
	localStorage.removeItem('sb-auth-token')
	document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

	// Dispatch custom event for auth provider to catch
	window.dispatchEvent(new CustomEvent('auth:token-error'))
}

export function createSupabaseClient(supabaseUrl: string, supabaseAnonKey: string): SupabaseClient {
	if (typeof window === 'undefined') {
		return createClient(supabaseUrl, supabaseAnonKey)
	}

	if (!supabaseClient) {
		supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
			auth: {
				persistSession: true,
				storageKey: 'sb-auth-token',
				autoRefreshToken: true,
				detectSessionInUrl: true,
			},
		})

		// Add interceptor for auth errors
		supabaseClient.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
				handleTokenError()
			}
		})
	}

	return supabaseClient
}

export { isTokenError }