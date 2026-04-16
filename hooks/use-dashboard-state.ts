import { useState } from "react"

export function useDashboardState({ initialSocio, initialPayments }: { initialSocio: any; initialPayments: any[] }) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [voucherFile, setVoucherFile] = useState<File | null>(null)
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)
  
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

  const handleSubmitPayment = () => {
    setPaymentSubmitted(true)
    setTimeout(() => {
      setIsPaymentModalOpen(false)
      setPaymentSubmitted(false)
      setVoucherFile(null)
      setVoucherPreview(null)
    }, 2000)
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
    handleFileChange,
    handleDrop,
    handleSubmitPayment
  }
}
