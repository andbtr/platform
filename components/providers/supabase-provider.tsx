"use client"

import React, { createContext, useContext, useMemo, useState, useEffect } from "react"
import type { SupabaseClient, Session } from "@supabase/supabase-js"
import { createSupabaseClient } from "@/lib/supabase"

type SupabaseProviderProps = {
  children: React.ReactNode
  supabaseUrl: string
  supabaseAnonKey: string
}

type SupabaseContextValue = {
  supabase: SupabaseClient
  session: Session | null
  supabaseUrl: string
  supabaseAnonKey: string
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null)

export function SupabaseProvider({ children, supabaseUrl, supabaseAnonKey }: SupabaseProviderProps) {
  const client = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY")
    }
    return createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }, [supabaseUrl, supabaseAnonKey])

  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    // Obtener la sesión inicial
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [client])

  const value = {
    supabase: client,
    session,
    supabaseUrl,
    supabaseAnonKey,
  }

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)

  if (!context) {
    throw new Error("useSupabase must be used within SupabaseProvider")
  }

  return context
}

export function useSupabaseConfig() {
  const context = useContext(SupabaseContext)

  if (!context) {
    throw new Error("useSupabaseConfig must be used within SupabaseProvider")
  }

  return {
    supabaseUrl: context.supabaseUrl,
    supabaseAnonKey: context.supabaseAnonKey,
  }
}