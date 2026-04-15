"use client"

import React, { createContext, useContext, useMemo } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createSupabaseClient } from "@/lib/supabase"

type SupabaseProviderProps = {
  children: React.ReactNode
  supabaseUrl: string
  supabaseAnonKey: string
}

type SupabaseContextValue = {
  client: SupabaseClient
  supabaseUrl: string
  supabaseAnonKey: string
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null)

export function SupabaseProvider({ children, supabaseUrl, supabaseAnonKey }: SupabaseProviderProps) {
  const value = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY")
    }

    return {
      client: createSupabaseClient(supabaseUrl, supabaseAnonKey),
      supabaseUrl,
      supabaseAnonKey,
    }
  }, [supabaseUrl, supabaseAnonKey])

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)

  if (!context) {
    throw new Error("useSupabase must be used within SupabaseProvider")
  }

  return context.client
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