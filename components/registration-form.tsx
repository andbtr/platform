"use client"

import { useState, useCallback, useEffect } from "react"
import { Check, Upload, User, CreditCard, ChevronRight, ChevronLeft, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

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

const iconMap: Record<string, string> = {
  morenos: "🎭",
  sajamas: "👑",
  chinas: "💃",
  figuras: "⭐",
}

const descriptionMap: Record<string, string> = {
  morenos: "El corazón del conjunto",
  sajamas: "Elegancia y tradición",
  chinas: "Gracia y esplendor",
  figuras: "Arte en movimiento",
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
    // Here you would handle the form submission
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
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4FB8C4] to-[#1E6B7E] flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white">
                        Datos Personales
                      </h3>
                      <p className="text-white/60 text-sm">Paso 1 de 3</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#C5A059] text-sm mb-2 font-medium">Nombres</label>
                      <input
                        type="text"
                        value={formData.nombres}
                        onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
                          errors.nombres ? "border-red-500" : "border-white/10"
                        )}
                        placeholder="Juan Carlos"
                      />
                      {errors.nombres && <p className="text-red-400 text-xs mt-1">{errors.nombres}</p>}
                    </div>
                    <div>
                      <label className="block text-[#C5A059] text-sm mb-2 font-medium">Apellidos</label>
                      <input
                        type="text"
                        value={formData.apellidos}
                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
                          errors.apellidos ? "border-red-500" : "border-white/10"
                        )}
                        placeholder="Quispe Mamani"
                      />
                      {errors.apellidos && <p className="text-red-400 text-xs mt-1">{errors.apellidos}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#C5A059] text-sm mb-2 font-medium">DNI</label>
                      <input
                        type="text"
                        value={formData.dni}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value.replace(/\D/g, "").slice(0, 8) })}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
                          errors.dni ? "border-red-500" : "border-white/10"
                        )}
                        placeholder="12345678"
                        maxLength={8}
                      />
                      {errors.dni && <p className="text-red-400 text-xs mt-1">{errors.dni}</p>}
                    </div>
                    <div>
                      <label className="block text-[#C5A059] text-sm mb-2 font-medium">Teléfono</label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
                          errors.telefono ? "border-red-500" : "border-white/10"
                        )}
                        placeholder="999 888 777"
                      />
                      {errors.telefono && <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#C5A059] text-sm mb-2 font-medium">Email (opcional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C5A059] text-sm mb-2 font-medium">Ciudad de Residencia</label>
                    <input
                      type="text"
                      value={formData.residencia}
                      onChange={(e) => setFormData({ ...formData, residencia: e.target.value })}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
                        errors.residencia ? "border-red-500" : "border-white/10"
                      )}
                      placeholder="Puno, Lima, Arequipa..."
                    />
                    {errors.residencia && <p className="text-red-400 text-xs mt-1">{errors.residencia}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Block Selection */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#9A7B3F] flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white">
                        Elige tu Bloque
                      </h3>
                      <p className="text-white/60 text-sm">Paso 2 de 3</p>
                    </div>
                  </div>

                  {/* Loading State */}
                  {loadingBloques && (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-[#4FB8C4]/30 border-t-[#4FB8C4] rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-white/60">Cargando bloques...</p>
                    </div>
                  )}

                  {/* Error State */}
                  {errorBloques && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                      <p className="text-red-200 text-sm">Error al cargar bloques: {errorBloques}</p>
                    </div>
                  )}

                  {/* Block Selection */}
                  {!loadingBloques && bloques.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {bloques.map((bloque) => (
                        <button
                          key={bloque.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, bloque: String(bloque.id) })}
                          className={cn(
                            "p-4 md:p-6 rounded-2xl text-left transition-all duration-300 border",
                            formData.bloque === String(bloque.id)
                              ? "bg-gradient-to-br from-[#4FB8C4]/30 to-[#0F2167]/50 border-[#C5A059] shadow-lg shadow-[#4FB8C4]/20"
                              : "glass border-white/10 hover:border-[#4FB8C4]/50"
                          )}
                        >
                          <span className="text-3xl mb-2 block">{iconMap[String(bloque.name).toLowerCase().split(" ")[0]] || "🎭"}</span>
                          <h4 className="font-bold text-white text-lg">{bloque.name}</h4>
                          <p className="text-white/60 text-sm">{descriptionMap[String(bloque.name).toLowerCase().split(" ")[0]] || "Tradición y danza"}</p>
                          <p className="text-[#C5A059] font-bold mt-2">S/ {bloque.total_price}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {!loadingBloques && bloques.length === 0 && !errorBloques && (
                    <p className="text-white/60 text-center py-8">No hay bloques disponibles en este momento.</p>
                  )}

                  {errors.bloque && <p className="text-red-400 text-sm text-center">{errors.bloque}</p>}

                  {/* Cuotas Selection */}
                  {formData.bloque && !loadingBloques && (
                    <div className="mt-8 p-6 rounded-2xl glass border border-[#C5A059]/30">
                      <h4 className="text-[#C5A059] font-semibold mb-4">Número de Cuotas</h4>
                      <div className="flex items-center gap-4 mb-4">
                        {[8, 9, 10].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFormData({ ...formData, cuotas: num })}
                            className={cn(
                              "flex-1 py-3 rounded-xl font-bold transition-all duration-300",
                              formData.cuotas === num
                                ? "bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] text-white"
                                : "bg-white/5 text-white/60 hover:text-white"
                            )}
                          >
                            {num} cuotas
                          </button>
                        ))}
                      </div>
                      <div className="text-center p-4 rounded-xl bg-[#0F2167]/50">
                        <p className="text-white/60 text-sm">Monto mensual</p>
                        <p className="text-3xl font-bold text-gold-gradient font-[family-name:var(--font-cinzel)]">
                          S/ {selectedBloque ? Math.ceil(selectedBloque.total_price / formData.cuotas) : 0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E91E8C] to-[#C5156F] flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white">
                        Pago Inicial
                      </h3>
                      <p className="text-white/60 text-sm">Paso 3 de 3</p>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="p-6 rounded-2xl glass border border-[#C5A059]/30 mb-6">
                    <h4 className="text-[#C5A059] font-semibold mb-3">Resumen de Inscripción</h4>
                    <div className="space-y-2 text-white/80">
                      <div className="flex justify-between">
                        <span>Bloque:</span>
                        <span className="font-semibold text-white">{selectedBloque?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-semibold text-white">S/ {selectedBloque?.total_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cuotas:</span>
                        <span className="font-semibold text-white">{formData.cuotas} meses</span>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                        <span>Primera cuota:</span>
                        <span className="font-bold text-[#4FB8C4] text-lg">S/ {monthlyAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Yape QR */}
                    <div className="p-6 rounded-2xl glass border border-[#E91E8C]/30 text-center">
                      <h4 className="text-[#E91E8C] font-semibold mb-3">Paga con Yape</h4>
                      <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center mb-3">
                        <span className="text-gray-400 text-sm">QR Code Yape</span>
                      </div>
                      <p className="text-white/60 text-sm">Escanea el código QR</p>
                    </div>

                    {/* Bank Transfer */}
                    <div className="p-6 rounded-2xl glass border border-[#4FB8C4]/30">
                      <h4 className="text-[#4FB8C4] font-semibold mb-3">Transferencia Bancaria</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-white/60">Banco BCP</p>
                          <p className="text-white font-mono">191-12345678-0-12</p>
                        </div>
                        <div>
                          <p className="text-white/60">CCI</p>
                          <p className="text-white font-mono text-xs">002-191-012345678012-34</p>
                        </div>
                        <div>
                          <p className="text-white/60">Titular</p>
                          <p className="text-white">Morenada Huajsapata</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voucher Upload */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                      "mt-6 p-8 rounded-2xl border-2 border-dashed text-center transition-all duration-300 cursor-pointer",
                      dragActive
                        ? "border-[#E91E8C] bg-[#E91E8C]/10"
                        : formData.voucher
                        ? "border-green-500 bg-green-500/10"
                        : "border-white/20 hover:border-[#4FB8C4]"
                    )}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="voucher-upload"
                    />
                    <label htmlFor="voucher-upload" className="cursor-pointer">
                      <Upload className={cn("w-12 h-12 mx-auto mb-3", formData.voucher ? "text-green-500" : "text-[#C5A059]")} />
                      {formData.voucher ? (
                        <p className="text-green-400">
                          <Check className="inline w-4 h-4 mr-1" />
                          {formData.voucher.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-white font-semibold">Arrastra tu voucher aquí</p>
                          <p className="text-white/60 text-sm mt-1">o haz clic para seleccionar</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
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
