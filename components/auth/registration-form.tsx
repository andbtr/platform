"use client"

import { useState, useCallback, useEffect } from "react"
import { Check, ChevronRight, ChevronLeft, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { PersonalInfoStep } from "@/components/auth/personal-info-step"
import { BlockSelectionStep } from "@/components/auth/block-selection-step"
import { PaymentStep } from "@/components/auth/payment-step"

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
  cuotas: number
  voucher: File | null
}

export function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: "",
    residencia: "",
    bloque: "",
    cuotas: 8,
    voucher: null,
  })
  const [dragActive, setDragActive] = useState(false)
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
  }, [])

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
    setStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({ ...prev, voucher: e.dataTransfer.files[0] }))
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, voucher: e.target.files![0] }))
    }
  }

  const selectedBloque = bloques.find((b) => String(b.id) === String(formData.bloque))
  const monthlyAmount = selectedBloque ? Math.ceil(selectedBloque.total_price / formData.cuotas) : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("¡Inscripción enviada! Te contactaremos pronto. ¡Bienvenido a la familia Huajsapata!")
  }

  return (
    <section className="relative py-20 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050A18] via-[#0A1535] to-[#050A18]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4FB8C4]/50 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gold-gradient">Inscríbete Ahora</span>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Únete a más de 500 danzantes que mantienen viva la tradición de la Morenada en Puno
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 max-w-md mx-auto">
          {[1, 2, 3].map((s) => (
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
              {s < 3 && (
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

              {/* Step 3: Payment */}
              {step === 3 && (
                <PaymentStep 
                  formData={formData}
                  selectedBloque={selectedBloque}
                  monthlyAmount={monthlyAmount}
                  dragActive={dragActive}
                  handleDrag={handleDrag}
                  handleDrop={handleDrop}
                  handleFileChange={handleFileChange}
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

                {step < 3 ? (
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
                    Completar Inscripción
                    <Sparkles className="w-5 h-5" />
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

