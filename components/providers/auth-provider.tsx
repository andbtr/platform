"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/providers/supabase-provider"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  accessToken: string | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase, session } = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session !== undefined) {
      setLoading(false)
    }
  }, [session])

  const setAccessTokenCookie = (token: string | undefined) => {
    if (!token) {
      document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      return
    }
    const secureAttr = typeof window !== "undefined" && window.location.protocol === "https:" ? "; secure" : ""
    document.cookie = `sb-access-token=${token}; path=/; max-age=31536000; SameSite=Lax${secureAttr}`
  }

  useEffect(() => {
    setAccessTokenCookie(session?.access_token)
  }, [session])

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.push("/login")
  }

  const value = {
    user: session?.user ?? null,
    session,
    accessToken: session?.access_token ?? null,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export default AuthProvider
