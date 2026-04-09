import { Check, X, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VoucherModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedPago: any
  handleAprobarPago: (pagoId: number) => void
  handleRechazarPago: (pagoId: number) => void
}

export function VoucherModal({
  isOpen,
  setIsOpen,
  selectedPago,
  handleAprobarPago,
  handleRechazarPago
}: VoucherModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="glass-card border-primary/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-foreground">Verificar Voucher</DialogTitle>
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
            </div>

            {/* Voucher Image Placeholder */}
            <div className="aspect-[3/4] bg-muted rounded-xl flex items-center justify-center border border-primary/20">
              <div className="text-center p-8">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Imagen del voucher</p>
                <p className="text-sm text-muted-foreground/60">Vista a pantalla completa</p>
              </div>
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
