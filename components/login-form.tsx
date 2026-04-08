"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { User, Lock } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
  }

  const handleReset = async () => {
    if (!email) return setError('Ingresa tu correo para enviar el enlace')
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    setLoading(false)
    if (error) return setError(error.message)
    setInfo('Se envió el correo de restablecimiento si la cuenta existe')
  }

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#C5A059] text-sm mb-2 font-medium">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-[#C5A059] text-sm mb-2 font-medium">Contraseña</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all"
              placeholder="••••••••"
            />
            <Lock className="absolute right-3 top-3 w-4 h-4 text-white/40" />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {info && <p className="text-sm text-green-400">{info}</p>}

        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] text-white font-semibold"
          >
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-3 rounded-xl bg-white/5 text-white/80"
          >
            Olvidé mi contraseña
          </button>
        </div>
      </form>
    </div>
  )
}
