import Image from "next/image"
import { Check, Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NewPaymentModal({
  isOpen,
  onOpenChange,
  paymentSubmitted,
  voucherPreview,
  voucherFile,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onClearVoucher,
  onSubmit
}: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-background via-background to-transparent">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg shadow-accent/30">
            <Upload className="w-5 h-5 mr-2" />
            Reportar Pago Nuevo
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-card border-primary/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-foreground">Reportar Pago</DialogTitle>
          </DialogHeader>
          
          {paymentSubmitted ? (
            <div className="py-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Pago Reportado</h3>
              <p className="text-muted-foreground">Tu pago será verificado en las próximas horas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Concepto</Label>
                <Select defaultValue="cuota6">
                  <SelectTrigger className="bg-primary/10 border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cuota6">Cuota #6 - S/ 90</SelectItem>
                    <SelectItem value="cuota7">Cuota #7 - S/ 90</SelectItem>
                    <SelectItem value="adelanto">Adelanto de Cuotas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Monto</Label>
                <Input 
                  type="number" 
                  placeholder="90.00" 
                  className="bg-primary/10 border-primary/30"
                />
              </div>

              <div className="space-y-2">
                <Label>Voucher de Pago</Label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    isDragging ? "border-accent bg-accent/10" : "border-primary/30"
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  {voucherPreview ? (
                    <div className="relative">
                      <Image
                        src={voucherPreview}
                        alt="Voucher"
                        width={200}
                        height={200}
                        className="mx-auto rounded-lg"
                      />
                      <button
                        onClick={onClearVoucher}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arrastra tu voucher aquí o
                      </p>
                      <label className="cursor-pointer">
                        <span className="text-accent hover:underline">selecciona un archivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={onFileChange}
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>

              <Button 
                onClick={onSubmit}
                disabled={!voucherFile}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold"
              >
                Enviar Reporte de Pago
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
