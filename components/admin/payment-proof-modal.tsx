"use client"

import { Check, X, CreditCard, Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Input } from "@/components/ui/input" // Import Input component
interface PaymentProofModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedPago: any
  handleAprobarPago: (pagoId: number) => void
  handleRechazarPago: (pagoId: number, adminNotes: string) => void // Modified signature
}

export function PaymentProofModal({
  isOpen,
  setIsOpen,
  selectedPago,
  handleAprobarPago,
  handleRechazarPago
}: PaymentProofModalProps) {
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null)
  const [loadingPaymentProof, setLoadingPaymentProof] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [showRejectionInput, setShowRejectionInput] = useState(false) // New state for rejection input
  const [rejectionReason, setRejectionReason] = useState<string>('') // New state for rejection reason
  const supabase = useSupabase()

  useEffect(() => {
    if (isOpen && selectedPago?.proofUrl && !selectedPago.paymentProofUrl) {
      // Si no tenemos URL pre-generada, generamos una firmada
      generateSignedUrl()
    } else if (selectedPago?.paymentProofUrl) {
      // Si ya tenemos la URL, la usamos directamente
      setPaymentProofUrl(selectedPago.paymentProofUrl)
    } else {
      setPaymentProofUrl(null)
    }
  }, [isOpen, selectedPago])

  useEffect(() => {
    if (!isOpen) {
      setZoom(1)
      setShowRejectionInput(false) // Reset rejection input state when modal closes
      setRejectionReason('') // Reset rejection reason when modal closes
    }
  }, [isOpen])

  const generateSignedUrl = async () => {
    if (!selectedPago?.proofUrl || !supabase) return
    
    setLoadingPaymentProof(true)
    try {
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(selectedPago.proofUrl, 3600) // 1 hora
      
      if (error) throw error
      if (data?.signedUrl) {
        setPaymentProofUrl(data.signedUrl)
      }
    } catch (err) {
      console.error("Error generating signed URL:", err)
      setPaymentProofUrl(null)
      // Mostrar mensaje de error al usuario
      alert("No se pudo cargar el comprobante. Es posible que el archivo haya sido eliminado o no exista.")
    } finally {
      setLoadingPaymentProof(false)
    }
  }

  const handleConfirmRejection = () => {
    if (selectedPago?.id && rejectionReason.trim()) {
      handleRechazarPago(selectedPago.id, rejectionReason)
      setIsOpen(false) // Close modal after rejection
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className="h-[100dvh] w-[100vw] max-w-none overflow-hidden rounded-none border-0 p-0 bg-background lg:h-[85vh] lg:w-[90vw] lg:max-w-5xl lg:rounded-3xl lg:border lg:border-primary/10">
        {selectedPago && (
          <div className="flex flex-col h-full overflow-y-auto lg:grid lg:overflow-hidden lg:grid-cols-[minmax(0,65%)_minmax(0,35%)]">
            <div className="relative flex flex-col shrink-0 min-h-[60vh] lg:min-h-0 lg:h-full border-b border-primary/10 bg-secondary/20 lg:border-b-0 lg:border-r lg:border-primary/10 overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-primary/10 px-4 py-3 lg:px-6 shrink-0 bg-background/50 backdrop-blur-sm">
                <div className="min-w-0">
                  <DialogTitle className="truncate text-lg font-semibold text-foreground">Comprobante</DialogTitle>
                  <DialogDescription className="truncate text-sm text-muted-foreground">
                    Vista ampliable del archivo subido.
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <Button type="button" variant="outline" size="sm" onClick={() => setZoom((current) => Math.max(1, Number((current - 0.15).toFixed(2))))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setZoom((current) => Math.min(2.5, Number((current + 0.15).toFixed(2))))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setZoom(1)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <div className="lg:hidden h-6 w-px bg-primary/20 mx-1"></div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="lg:hidden h-8 w-8 rounded-full p-0 hover:bg-destructive/10 hover:text-destructive">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Cerrar</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-1 items-stretch justify-center p-4 overflow-hidden">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-primary/10 bg-background/60 p-2 lg:p-4">
                  {loadingPaymentProof ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Cargando comprobante...</p>
                    </div>
                  ) : paymentProofUrl ? (
                    <div className="flex h-full w-full items-center justify-center overflow-hidden origin-center transition-transform duration-200 ease-out" style={{ transform: `scale(${zoom})` }}>
                      <img
                        src={paymentProofUrl}
                        alt="Comprobante de pago"
                        className="block h-full w-full rounded-xl object-contain shadow-xl shadow-black/10"
                      />
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <CreditCard className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                      <p className="text-muted-foreground">Este pago no tiene comprobante adjunto</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col shrink-0 lg:h-full lg:overflow-y-auto bg-background px-5 py-5 lg:px-6">
              <div className="mb-5 flex items-start justify-between border-b border-primary/10 pb-4 shrink-0">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Datos del pago</h3>
                  <p className="text-sm text-muted-foreground">Información y acciones para verificación.</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="hidden lg:flex h-8 w-8 rounded-full p-0 hover:bg-destructive/10 hover:text-destructive shrink-0">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Cerrar</span>
                </Button>
              </div>

              <div className="grid gap-3 flex-1 content-start">
                <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Socio</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedPago.nombre}</p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Monto</p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-accent">S/ {selectedPago.monto}</p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Método</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedPago.method || 'Sin método'}</p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Titular de la cuenta</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedPago.bankAccountName || 'No proporcionado'}</p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Concepto</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedPago.concepto}</p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">DNI</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedPago.dni || '—'}</p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Fecha</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {selectedPago.fecha ? new Date(selectedPago.fecha).toLocaleDateString('es-PE') : '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Código adicional</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedPago.additionalCode || 'Vacio'}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 shrink-0"> {/* Changed to flex-col for better stacking */}
                <Button 
                  className="w-full bg-green-500 text-white hover:bg-green-600"
                  onClick={() => {
                    handleAprobarPago(selectedPago.id)
                    setIsOpen(false) // Close modal after approval
                  }}
                >
                  <Check className="mr-2 h-5 w-5" />
                  Aprobar Pago
                </Button>
                {showRejectionInput ? (
                  <div className="flex flex-col gap-2"> {/* This div will now take full width */}
                    <Input
                      placeholder="Motivo de rechazo"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="bg-card/50 border-primary/30"
                    />
                    <div className="flex flex-col gap-2 mt-2"> {/* Changed to flex-col for vertical stacking */}
                      <Button 
                        variant="destructive"
                        className="w-full"
                        onClick={handleConfirmRejection}
                        disabled={!rejectionReason.trim()}
                      >
                        Confirmar Rechazo
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setShowRejectionInput(false)
                          setRejectionReason('')
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowRejectionInput(true)}
                  >
                    <X className="mr-2 h-5 w-5" />
                    Rechazar
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
