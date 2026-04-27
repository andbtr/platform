"use client"

import { Check, X, CreditCard, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useSupabase } from "@/components/providers/supabase-provider"

interface PaymentProofModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedPago: any
  handleAprobarPago: (pagoId: number) => void
  handleRechazarPago: (pagoId: number) => void
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="glass-card border-primary/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-foreground">Verificar Comprobante</DialogTitle>
          <DialogDescription>
            Revisa el comprobante de pago adjunto para verificar la transacción.
          </DialogDescription>
        </DialogHeader>
        
        {selectedPago && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-primary/10 rounded-xl">
              <div>
                <p className="text-xs text-muted-foreground">Socio</p>
                <p className="font-medium text-foreground">{selectedPago.nombre}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">DNI</p>
                <p className="font-medium text-foreground">{selectedPago.dni}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Concepto</p>
                <p className="font-medium text-foreground">{selectedPago.concepto}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monto</p>
                <p className="font-bold text-accent">S/ {selectedPago.monto}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Nombre de Cuenta Bancaria</p>
                <p className="font-medium text-foreground">{selectedPago.bankAccountName || 'No proporcionado'}</p>
              </div>
              {selectedPago.additionalCode && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Código Adicional</p>
                  <p className="font-medium text-foreground">{selectedPago.additionalCode}</p>
                </div>
              )}
            </div>

            {/* Payment Proof Image */}
            <div className="aspect-[3/4] bg-muted rounded-xl flex items-center justify-center border border-primary/20 overflow-hidden relative">
              {loadingPaymentProof ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Cargando comprobante...</p>
                </div>
              ) : paymentProofUrl ? (
                <img 
                  src={paymentProofUrl} 
                  alt="Comprobante de pago" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Este pago no tiene comprobante adjunto</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={() => handleAprobarPago(selectedPago.id)}
              >
                <Check className="w-5 h-5 mr-2" />
                Aprobar Pago
              </Button>
              <Button 
                variant="destructive"
                className="flex-1"
                onClick={() => handleRechazarPago(selectedPago.id)}
              >
                <X className="w-5 h-5 mr-2" />
                Rechazar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
