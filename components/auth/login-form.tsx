"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Eye, EyeOff } from "lucide-react"
import { useToast } from '@/hooks/use-toast'
import { useSupabase } from "@/components/providers/supabase-provider"

export default function LoginForm() {
  const supabase = useSupabase()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos para iniciar sesión.')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      const finalEmail = email.includes('@') ? email : `${email}@huajsapata.com`
      const { error } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password,
      })

      setLoading(false)

      if (error) {
        const errorMessage = error.message.includes('Invalid') 
          ? 'Usuario o contraseña incorrectos. Por favor verifica tus datos e intenta nuevamente.' 
          : error.message
        setError(errorMessage)
        toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      const meta = user?.user_metadata ?? {}
      let isAdmin = false

      if (meta.is_admin || meta.isAdmin || meta.role === 'admin') {
        isAdmin = true
      } else {
        const { data: roleData } = await supabase
          .from('roles')
          .select('role')
          .eq('user_id', user?.id)
          .eq('role', 'admin')
          .maybeSingle()
        
        if (roleData) isAdmin = true
      }

      toast({ title: 'Welcome!', description: 'You have successfully logged in.' })
      
      if (isAdmin) {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setLoading(false)
      const rawMessage = err?.message ?? 'Unknown error'
      const message = rawMessage.includes('Invalid') 
        ? 'Usuario o contraseña incorrectos. Por favor verifica tus datos e intenta nuevamente.' 
        : rawMessage
      setError(message)
      toast({ title: 'Error', description: message, variant: 'destructive' })
    }
  }

  const { toast } = useToast()

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 border-gold-glow max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4FB8C4] to-[#1E6B7E] flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white">Iniciar sesión</h3>
          <p className="text-white/60 text-sm">Accede a tu cuenta para gestionar tus pagos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="flex items-center gap-2 text-[#C5A059] text-sm mb-2 font-medium">
            <User className="w-4 h-4" />
            Usuario
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all"
            placeholder="Tu usuario"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-[#C5A059] text-sm mb-2 font-medium">
            <Lock className="w-4 h-4" />
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] text-white font-semibold"
          >
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </div>
        
        <div className="mt-4 p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20">
          <p className="text-xs text-white/80 text-center">
            ¿Problemas para iniciar sesión? Contacta al administrador para soporte
          </p>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-white/70">
        ¿No tienes cuenta?{' '}
        <Link href="/inscription" className="text-[#C5A059] font-semibold hover:text-[#E2BF7B] transition-colors">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
