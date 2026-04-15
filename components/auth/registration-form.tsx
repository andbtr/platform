"use client"

import { useState, useEffect } from "react"
import { Check, ChevronRight, ChevronLeft, ShieldCheck, Users, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { PersonalInfoStep } from "@/components/auth/personal-info-step"
import { BlockSelectionStep } from "@/components/auth/block-selection-step"
import { useSupabase } from "@/components/providers/supabase-provider"

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
  residencia: string
  bloque: string
}

export function RegistrationForm() {
  const supabase = useSupabase()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: "",
    residencia: "",
    bloque: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [bloques, setBloques] = useState<Bloque[]>([])
  const [loadingBloques, setLoadingBloques] = useState(true)
  const [errorBloques, setErrorBloques] = useState<string | null>(null)

  useEffect(() => {
    const fetchBloques = async () => {
      try {
        setLoadingBloques(true)
        setErrorBloques(null)
        const { data, error } = await supabase.from("blocks").select("*")
        if (error) {
          setErrorBloques(error.message)
          console.error("Error cargando bloques:", error.message)
          return
        }
        setBloques(data || [])
      } catch (err) {
        setErrorBloques("Error cargando los bloques")
        console.error("Error:", err)
      } finally {
        setLoadingBloques(false)
      }
    }

    fetchBloques()
  }, [supabase])

  const validateDNI = (dni: string) => {
    return /^\d{8}$/.test(dni)
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nombres.trim()) newErrors.nombres = "Ingresa tus nombres"
    if (!formData.apellidos.trim()) newErrors.apellidos = "Ingresa tus apellidos"
    if (!formData.dni.trim()) newErrors.dni = "Ingresa tu DNI"
    else if (!validateDNI(formData.dni)) newErrors.dni = "El DNI debe tener 8 dígitos"
    if (!formData.telefono.trim()) newErrors.telefono = "Ingresa tu teléfono"
    if (!formData.residencia.trim()) newErrors.residencia = "Ingresa tu ciudad de residencia"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.bloque) newErrors.bloque = "Selecciona un bloque"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep((prev) => Math.min(prev + 1, 2))
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Tu postulación ha sido enviada. Nos pondremos en contacto contigo para el proceso de ingreso.")
  }

  const selectedBloque = bloques.find((b) => String(b.id) === String(formData.bloque))

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,184,196,0.14),_transparent_32%),linear-gradient(180deg,_#030712_0%,_#071225_46%,_#030712_100%)]" />
      <div className="absolute top-24 left-[-6rem] h-72 w-72 rounded-full bg-[#4FB8C4]/10 blur-3xl" />
      <div className="absolute bottom-0 right-[-4rem] h-80 w-80 rounded-full bg-[#C5A059]/10 blur-3xl" />
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-4xl rounded-[2rem] border border-[#C5A059]/20 bg-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-6">
            <div className="min-w-0 max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#4FB8C4]">Inscripción formal</p>
              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold leading-tight">
                <span className="text-gold-gradient">Inscríbete en Huajsapata</span>
              </h2>
              <p className="mt-4 text-white/75 md:text-lg leading-relaxed">
                Esta es la inscripción oficial para formar parte del conjunto folklórico Huajsapata. Completa tus datos y elige
                el bloque al que deseas unirte.
              </p>
            </div>

            <div className="grid min-w-0 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="flex min-w-0 h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-[#081429]/70 p-3 sm:min-h-[9.5rem] sm:p-4">
                <ShieldCheck className="mb-2 h-5 w-5 text-[#4FB8C4] sm:mb-3 sm:h-6 sm:w-6" />
                <p className="break-words text-sm font-semibold text-white leading-snug sm:text-base">Datos de inscripción</p>
                <p className="mt-1 break-words text-xs leading-snug text-white/60 sm:mt-2 sm:text-sm">
                  Información precisa para contacto y registro.
                </p>
              </div>
              <div className="flex min-w-0 h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-[#081429]/70 p-3 sm:min-h-[9.5rem] sm:p-4">
                <Users className="mb-2 h-5 w-5 text-[#C5A059] sm:mb-3 sm:h-6 sm:w-6" />
                <p className="break-words text-sm font-semibold text-white leading-snug sm:text-base">Elección de bloque</p>
                <p className="mt-1 break-words text-xs leading-snug text-white/60 sm:mt-2 sm:text-sm">
                  Selecciona el bloque donde deseas inscribirte.
                </p>
              </div>
              <div className="flex min-w-0 h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-[#081429]/70 p-3 sm:min-h-[9.5rem] sm:p-4 sm:col-span-2 xl:col-span-1">
                <Landmark className="mb-2 h-5 w-5 text-[#E91E8C] sm:mb-3 sm:h-6 sm:w-6" />
                <p className="break-words text-sm font-semibold text-white leading-snug sm:text-base">Registro confirmado</p>
                <p className="mt-1 break-words text-xs leading-snug text-white/60 sm:mt-2 sm:text-sm">
                  Tu información queda lista para seguimiento interno.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 max-w-md mx-auto">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                  step >= s
                    ? "bg-gradient-to-br from-[#4FB8C4] to-[#1E6B7E] text-white shadow-lg shadow-[#4FB8C4]/30"
                    : "glass text-white/50"
                )}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 2 && (
                <div
                  className={cn(
                    "w-16 md:w-24 h-1 mx-2 rounded-full transition-all duration-300",
                    step > s ? "bg-gradient-to-r from-[#4FB8C4] to-[#C5A059]" : "bg-white/10"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-strong rounded-3xl p-6 md:p-10 border-gold-glow">
            <form onSubmit={handleSubmit}>
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/70">
                Completa tus datos personales y luego elige el bloque al que deseas inscribirte.
              </div>

              {/* Step 1: Identity */}
              {step === 1 && (
                <PersonalInfoStep 
                  formData={formData} 
                  setFormData={setFormData} 
                  errors={errors} 
                />
              )}

              {/* Step 2: Block Selection */}
              {step === 2 && (
                <BlockSelectionStep 
                  formData={formData} 
                  setFormData={setFormData} 
                  errors={errors}
                  bloques={bloques}
                  loadingBloques={loadingBloques}
                  errorBloques={errorBloques}
                  selectedBloque={selectedBloque}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 text-white/70 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </button>
                ) : (
                  <div />
                )}

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#4FB8C4]/30 transition-all"
                  >
                    Siguiente
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E91E8C] to-[#C5156F] text-white font-bold rounded-full btn-glow transition-all hover:scale-105"
                  >
                    Enviar inscripción
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

