"use client"

import { useState, useEffect } from "react"
import PrivacyModal from "./privacy-modal"
import { Check, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { PersonalInfoStep } from "@/components/auth/personal-info-step"
import { BlockSelectionStep } from "@/components/auth/block-selection-step"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useRouter } from "next/navigation"

type Bloque = {
  id: string | number
  name: string
  total_price: number
}

type FormData = {
  nombres: string
  apellidos: string
  dni: string
  telefono: string
  email: string
  bloque: string
  ciudad: string
}

export function RegistrationForm() {
  const router = useRouter()
  const { supabase, session } = useSupabase()
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: "",
    bloque: "",
    ciudad: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [bloques, setBloques] = useState<Bloque[]>([])
  const [loadingBloques, setLoadingBloques] = useState(true)
  const [errorBloques, setErrorBloques] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [privacyError, setPrivacyError] = useState("")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  useEffect(() => {
    if (!supabase) return; // No hacer nada si supabase no está listo
    const fetchBloques = async () => {
      try {
        setLoadingBloques(true)
        setErrorBloques(null)
        const { data, error } = await supabase.from("blocks").select("*")
        if (error) throw error
        setBloques(data || [])
      } catch (err: any) {
        setErrorBloques("Error cargando los bloques")
        console.error("Error:", err)
      } finally {
        setLoadingBloques(false)
      }
    }
    fetchBloques()
  }, [supabase])

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nombres.trim()) newErrors.nombres = "Ingresa tus nombres"
    if (!formData.apellidos.trim()) newErrors.apellidos = "Ingresa tus apellidos"
    if (!formData.dni.trim()) newErrors.dni = "Ingresa tu documento"
    if (!formData.telefono.trim()) newErrors.telefono = "Ingresa tu teléfono"
    if (!/^\d{7,15}$/.test(formData.telefono)) newErrors.telefono = "El número de teléfono no es válido"
    if (!formData.email.trim()) newErrors.email = "Ingresa tu email"
    if (!formData.ciudad.trim()) newErrors.ciudad = "Ingresa tu ciudad"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return; // No hacer nada si supabase no está listo
    setPrivacyError("")
    if (!validateStep1() || !acceptedPrivacy) {
      if (!acceptedPrivacy) setPrivacyError("Debes aceptar la Política de Privacidad.")
      return
    }

    setIsSubmitting(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${formData.dni}@huajsapata.com`,
        password: formData.dni,
        options: {
          data: {
            full_name: `${formData.nombres} ${formData.apellidos}`,
            first_name: formData.nombres,
            last_name: formData.apellidos,
            dni: formData.dni,
            phone_number: Number(formData.telefono),
            email: formData.email,
            address: formData.ciudad,
            region: formData.ciudad,
            accepted_privacy: true,
            accepted_privacy_at: new Date().toISOString(),
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("No se pudo crear el usuario.")

      const { error: memberUpdateError } = await supabase
        .from("members")
        .update({
          first_name: formData.nombres,
          last_name: formData.apellidos,
          dni: formData.dni,
          phone_number: formData.telefono,
          email: formData.email,
          region: formData.ciudad,
          accepted_privacy: true,
        })
        .eq("id", authData.user.id)

      if (memberUpdateError) throw memberUpdateError

      setUserId(authData.user.id)
      setRegistrationSuccess(true)
      setTimeout(() => {
        setStep(2)
        setRegistrationSuccess(false)
      }, 2000)
    } catch (error: any) {
      console.error(error)
      alert("Error en el registro: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBlockSelection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return; // No hacer nada si supabase no está listo
    if (!formData.bloque) {
      setErrors({ bloque: "Debes seleccionar un bloque." })
      return
    }
    
    const finalUserId = userId || session?.user?.id
    if (!finalUserId) {
      alert("Error: No se ha podido identificar al usuario.")
      return
    }

    setIsSubmitting(true)
    try {
      const now = new Date();
      let cuotas = 0;
      if (now.getMonth() < 1) cuotas = 2;
      else if (now.getMonth() === 1) cuotas = 1;
      else cuotas = (12 - now.getMonth()) + 2;

      const { error } = await supabase
        .from("members")
        .update({
          block_id: formData.bloque,
          total_installments: cuotas,
        })
        .eq("id", finalUserId)

      if (error) throw error

      router.push("/dashboard")
    } catch (error: any) {
      console.error(error)
      alert("Error al seleccionar el bloque: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!supabase) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#4FB8C4]/30 border-t-[#4FB8C4] rounded-full animate-spin" />
      </div>
    )
  }

  const selectedBloque = bloques.find((b) => String(b.id) === String(formData.bloque))

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-12 max-w-md mx-auto">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300", step >= s ? "bg-gradient-to-br from-[#4FB8C4] to-[#1E6B7E] text-white shadow-lg shadow-[#4FB8C4]/30" : "glass text-white/50")}>
              {registrationSuccess && s === 1 ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 2 && <div className={cn("w-16 md:w-24 h-1 mx-2 rounded-full transition-all duration-300", step > s ? "bg-gradient-to-r from-[#4FB8C4] to-[#C5A059]" : "bg-white/10")} />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="glass-strong rounded-3xl p-6 md:p-10 border-gold-glow">
          <form onSubmit={step === 1 ? handleRegister : handleBlockSelection}>
            {step === 1 && (
              <>
                <PersonalInfoStep formData={formData} setFormData={setFormData} errors={errors} />
                <div className="flex flex-col gap-2 mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center mb-2">
                    <input id="privacy" type="checkbox" checked={acceptedPrivacy} onChange={(e) => { setAcceptedPrivacy(e.target.checked); if (e.target.checked) setPrivacyError(""); }} className="accent-pink-600 w-5 h-5 mr-2 focus:ring-pink-500" />
                    <label htmlFor="privacy" className="text-white/80 text-sm select-none"> Acepto la{' '} <button type="button" className="underline text-pink-400 hover:text-pink-300 focus:outline-none" onClick={() => setShowPrivacyModal(true)}> Política de Privacidad </button> </label>
                  </div>
                  {privacyError && <p className="text-red-400 text-xs mb-2">{privacyError}</p>}
                  <button type="submit" disabled={isSubmitting || !acceptedPrivacy} className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-full btn-glow transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? "Registrando..." : "Registrarse y Continuar"}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <BlockSelectionStep formData={formData} setFormData={setFormData} errors={errors} bloques={bloques} loadingBloques={loadingBloques} errorBloques={errorBloques} selectedBloque={selectedBloque} />
                <div className="mt-8 pt-6 border-t border-white/10">
                  <button type="submit" disabled={isSubmitting || !formData.bloque} className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#4FB8C4]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? "Finalizando..." : "Finalizar Inscripción"}
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
            
            {registrationSuccess && (
              <div className="absolute inset-0 bg-[#0F1B2E]/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">¡Registro Exitoso!</h3>
                <p className="text-white/70">Redirigiendo a la selección de bloque...</p>
              </div>
            )}

            {showPrivacyModal && <PrivacyModal open={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />}
          </form>
        </div>
      </div>
    </div>
  )
}
