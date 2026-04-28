import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useSupabaseConfig } from "@/components/providers/supabase-provider"
import { createSupabaseClient } from "@/lib/supabase"

export function useDashboardState({ initialSocio, initialPayments, user }: { initialSocio: any; initialPayments: any[]; user: any }) {
  const { supabaseUrl, supabaseAnonKey } = useSupabaseConfig()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  
  const [amount, setAmount] = useState<string>("")
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0])
  
  // Calcular cuotas totales basado en la fecha de registro hasta Febrero 2027
  const calculateTotalInstallments = (regDate: string) => {
    const start = new Date(regDate)
    const end = new Date(2027, 1) // Febrero es mes 1 (0-indexed)
    
    let months = (end.getFullYear() - start.getFullYear()) * 12
    months += end.getMonth() - start.getMonth()
    
    return Math.max(0, months + 1) // +1 para incluir el mes de febrero
  }

  const cuotasTotalesCalculadas = calculateTotalInstallments(initialSocio.registrationDate || new Date().toISOString())
  
  const [concept, setConcept] = useState<string>("")
  const [additionalCode, setAdditionalCode] = useState<string>("")
  const [bankAccountName, setBankAccountName] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")

  useEffect(() => {
    if (isPaymentModalOpen) {
      setPaymentMethod("")
    }
  }, [isPaymentModalOpen])
  
  const [payments, setPayments] = useState<any[]>(initialPayments || [])

  // Sugerir la siguiente cuota basada en el dinero total pagado
  const CUOTA_AMOUNT_SUGGEST = initialSocio.montoMensual || 90
  const approvedPaymentsForSuggest = payments.filter((p: any) => {
    const status = (p.status || p.estado || '').toLowerCase()
    return status === 'aprobado' || status === 'approved' || p.approved === true
  })
  const totalPagadoAcumulado = approvedPaymentsForSuggest.reduce((acc, p) => acc + (p.amount_paid || 0), 0)
  const nextInstallmentNumberValue = Math.floor(totalPagadoAcumulado / CUOTA_AMOUNT_SUGGEST) + 1
  
  const suggestedConcept = `cuota${nextInstallmentNumberValue}`

  // Sincronizar el concepto sugerido cuando cambien los pagos
  useEffect(() => {
    if (concept !== "otro") {
      setConcept(suggestedConcept)
    }
  }, [suggestedConcept, concept])

  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [paymentsError, setPaymentsError] = useState<string | null>(null)
  
  const [socio, setSocio] = useState<any>(initialSocio || {
    nombre: '',
    dni: '',
    bloque: '',
    montoTotal: 0,
    montoPagado: 0,
    cuotasTotales: 0,
    cuotasPagadas: 0,
    proximoVencimiento: new Date().toISOString(),
    registrationDate: '',
    historialPagos: []
  })

  // Actualizar estadísticas basadas en los pagos reales
  useEffect(() => {
    if (!payments) return

    const approvedPayments = payments.filter(p => {
      const status = (p.status || p.estado || '').toLowerCase()
      return status === 'aprobado' || status === 'approved' || p.approved === true
    })

    const montoTotalPagado = approvedPayments.reduce((acc, p) => acc + (p.amount_paid || 0), 0)
    
    // Nueva lógica: Determinar cuotas pagadas basadas en el monto dinámico del socio
    const CUOTA_AMOUNT = initialSocio.montoMensual || 90
    const cuotasCompletas = Math.floor(montoTotalPagado / CUOTA_AMOUNT)
    
    // Calcular próximo vencimiento basado en las cuotas completas cubiertas por el dinero
    const regDate = new Date(initialSocio.registrationDate || new Date())
    const nextDueDate = new Date(regDate)
    nextDueDate.setMonth(regDate.getMonth() + cuotasCompletas)

    // Ajuste para el monto total: usar el precio real del bloque si existe, sino calcularlo
    const totalACubrir = initialSocio.montoTotal || (cuotasTotalesCalculadas * CUOTA_AMOUNT)

    setSocio((prev: any) => ({
      ...prev,
      montoPagado: montoTotalPagado,
      cuotasPagadas: cuotasCompletas, 
      proximoVencimiento: nextDueDate.toISOString(),
      cuotasTotales: cuotasTotalesCalculadas,
      montoTotal: totalACubrir
    }))
  }, [payments, cuotasTotalesCalculadas, initialSocio.registrationDate, initialSocio.montoMensual])

  const fetchPayments = async () => {
    if (!user || !supabaseUrl || !supabaseAnonKey) return
    
    setPaymentsLoading(true)
    try {
      const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      
      if (error) {
        console.error("Fetch payments error:", error)
        throw error
      }
      setPayments(data || [])
    } catch (err: any) {
      setPaymentsError(err.message)
    } finally {
      setPaymentsLoading(false)
    }
  }

  // Escuchar cambios en tiempo real para estados (APPROVED, REJECTED)
  useEffect(() => {
    if (!user || !supabaseUrl || !supabaseAnonKey) return

    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

    const channel = supabase
      .channel('payment_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchPayments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabaseUrl, supabaseAnonKey])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentProofFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPaymentProofPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setPaymentProofFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPaymentProofPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitPayment = async () => {
    setSubmitAttempted(true)
    if (!paymentProofFile || !user) return

    if (!bankAccountName.trim()) {
      setSubmitError("El nombre de la cuenta bancaria es obligatorio")
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      setSubmitError("El monto debe ser mayor a 0")
      return
    }

    if (!paymentDate) {
      setSubmitError("La fecha de pago es obligatoria")
      return
    }

    if (!paymentMethod) {
      setSubmitError("Selecciona el metodo de pago")
      return
    }

    const selectedDate = new Date(paymentDate)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // Permitir hasta el final del día de hoy

    if (selectedDate > today) {
      setSubmitError("No se permiten fechas futuras")
      return
    }

    // Opcional: Limitar a 15 días atrás
    const fifteenDaysAgo = new Date()
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)
    fifteenDaysAgo.setHours(0, 0, 0, 0)

    if (selectedDate < fifteenDaysAgo) {
      setSubmitError("La fecha de pago no puede ser mayor a 15 días de antigüedad")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validar que sea imagen
      if (!paymentProofFile.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen')
      }

      // Validar tamaño máximo 2MB
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (paymentProofFile.size > maxSize) {
        throw new Error('La imagen debe ser menor a 2MB')
      }

      // Crear cliente de Supabase usando el provider/config
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Configuración de Supabase no encontrada')
      }
      
      const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

      // Generar path exacto: payments/{user.id}/{uuid}
      const fileExtension = paymentProofFile.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExtension}`
      const filePath = `payments/${user.id}/${fileName}`

      // Subir archivo a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, paymentProofFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Error al subir la imagen: ${uploadError.message}`)
      }

      // Insertar registro en la tabla payments
      // Determinamos el número de cuota si el concepto lo indica
      let installmentNumber = 0 // Valor por defecto para evitar error de NOT NULL
      if (concept === "otro") {
        installmentNumber = -1
      } else if (concept.startsWith('cuota')) {
        const num = parseInt(concept.replace('cuota', ''))
        if (!isNaN(num)) installmentNumber = num
      }

      const methodValue = paymentMethod.toUpperCase()

      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount_paid: parseFloat(amount),
          installment_number: installmentNumber,
          adittional_code: additionalCode || null,
          bank_account_name: bankAccountName,
          payment_date: paymentDate,
          status: 'PENDING',
          proof_url: filePath,
          method: methodValue,
          is_active: true
        })

      if (insertError) {
        // Opcional: podrías intentar borrar el archivo si la inserción falla, 
        // pero lo más importante es notificar el error de base de datos.
        throw new Error(`Error al registrar el pago: ${insertError.message}`)
      }

      setPaymentSubmitted(true)
      await fetchPayments()
      
      setTimeout(() => {
        setIsPaymentModalOpen(false)
        setPaymentSubmitted(false)
        setSubmitAttempted(false)
        setPaymentProofFile(null)
        setPaymentProofPreview(null)
        setAdditionalCode("")
        setBankAccountName("")
        setPaymentDate(new Date().toISOString().split('T')[0])
        setPaymentMethod("")
        setAmount("")
      }, 2000)

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsSubmitting(false)
    }
  }

  const saldoPendiente = (socio.montoTotal || 0) - (socio.montoPagado || 0)
  const progresoPago = socio.montoTotal ? ((socio.montoPagado || 0) / socio.montoTotal) * 100 : 0

  return {
    socio,
    saldoPendiente,
    progresoPago,
    payments,
    paymentsLoading,
    paymentsError,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentProofFile,
    setPaymentProofFile,
    paymentProofPreview,
    setPaymentProofPreview,
    isDragging,
    setIsDragging,
    paymentSubmitted,
    isSubmitting,
    submitError,
    submitAttempted,
    amount,
    setAmount,
    concept,
    setConcept,
    additionalCode,
    setAdditionalCode,
    bankAccountName,
    setBankAccountName,
    paymentMethod,
    setPaymentMethod,
    paymentDate,
    setPaymentDate,
    cuotasTotalesCalculadas,
    nextInstallmentNumber: nextInstallmentNumberValue,
    handleFileChange,
    handleDrop,
    handleSubmitPayment
  }
}
