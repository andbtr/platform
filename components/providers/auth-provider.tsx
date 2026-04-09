"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type AuthContextType = {
  user: any | null
  loading: boolean
  signOut: () => Promise<void>
}
type SessionType = any | null

type AuthContextTypeExtended = AuthContextType & {
  session: SessionType
  accessToken: string | null
}

const AuthContext = createContext<AuthContextTypeExtended | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<SessionType>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const currentUser = data?.session?.user ?? null
        const currentSession = data?.session ?? null
        if (!mounted) return
        setUser(currentUser)
        setSession(currentSession)
        setAccessToken(currentSession?.access_token ?? null)
        if (currentSession?.access_token) {
          document.cookie = `sb-access-token=${currentSession.access_token}; path=/; max-age=31536000; SameSite=Lax; secure`
        }
      } catch (err) {
        console.error("Error getting supabase session", err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setSession(session ?? null)
      setAccessToken(session?.access_token ?? null)

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        document.cookie = `sb-access-token=${session?.access_token}; path=/; max-age=31536000; SameSite=Lax; secure`
      } else if (event === "SIGNED_OUT") {
        document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setAccessToken(null)
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, session, accessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export default AuthProvider
