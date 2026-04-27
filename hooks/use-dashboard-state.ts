import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useSupabaseConfig } from "@/components/providers/supabase-provider"
import { createSupabaseClient } from "@/lib/supabase"

export function useDashboardState({ initialSocio, initialPayments, user }: { initialSocio: any; initialPayments: any[]; user: any }) {
  const { supabaseUrl, supabaseAnonKey } = useSupabaseConfig()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [voucherFile, setVoucherFile] = useState<File | null>(null)
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const [amount, setAmount] = useState<string>("90")
  const [concept, setConcept] = useState<string>("cuota6")
  const [operationNumber, setOperationNumber] = useState<string>("")
  
  const [payments] = useState<any[]>(initialPayments || [])
  const [paymentsLoading] = useState(false)
  const [paymentsError] = useState<string | null>(null)
  
  const [socio] = useState<any>(initialSocio || {
    nombre: '',
    dni: '',
    bloque: '',
    montoTotal: 0,
    montoPagado: 0,
    cuotasTotales: 0,
    cuotasPagadas: 0,
    proximoVencimiento: new Date().toISOString(),
    historialPagos: []
  })

  // The server component has already checked auth and fetched data.

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVoucherFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setVoucherPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setVoucherFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setVoucherPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitPayment = async () => {
    if (!voucherFile || !user) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validar que sea imagen
      if (!voucherFile.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen')
      }

      // Validar tamaño máximo 2MB
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (voucherFile.size > maxSize) {
        throw new Error('La imagen debe ser menor a 2MB')
      }

      // Crear cliente de Supabase usando el provider/config
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Configuración de Supabase no encontrada')
      }
      
      const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

      // Generar path exacto: payments/{user.id}/{uuid}
      const fileExtension = voucherFile.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExtension}`
      const filePath = `payments/${user.id}/${fileName}`

      // Subir archivo a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, voucherFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Error al subir la imagen: ${uploadError.message}`)
      }

      // Insertar registro en la tabla payments
      // Determinamos el número de cuota si el concepto lo indica
      let installmentNumber = 0 // Valor por defecto para evitar error de NOT NULL
      if (concept.startsWith('cuota')) {
        const num = parseInt(concept.replace('cuota', ''))
        if (!isNaN(num)) installmentNumber = num
      }

      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          member_id: user.id,
          amount_paid: parseFloat(amount),
          installment_number: installmentNumber,
          operation_number: operationNumber || null,
          status: 'PENDING',
          proof_url: filePath,
          method: 'TRANSFER', // O el método que corresponda por defecto
          is_active: true
        })

      if (insertError) {
        // Opcional: podrías intentar borrar el archivo si la inserción falla, 
        // pero lo más importante es notificar el error de base de datos.
        throw new Error(`Error al registrar el pago: ${insertError.message}`)
      }

      setPaymentSubmitted(true)
      setTimeout(() => {
        setIsPaymentModalOpen(false)
        setPaymentSubmitted(false)
        setVoucherFile(null)
        setVoucherPreview(null)
        setOperationNumber("")
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
    voucherFile,
    setVoucherFile,
    voucherPreview,
    setVoucherPreview,
    isDragging,
    setIsDragging,
    paymentSubmitted,
    isSubmitting,
    submitError,
    amount,
    setAmount,
    concept,
    setConcept,
    operationNumber,
    setOperationNumber,
    handleFileChange,
    handleDrop,
    handleSubmitPayment
  }
}
