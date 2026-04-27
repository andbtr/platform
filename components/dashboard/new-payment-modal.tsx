import Image from "next/image"
import { Check, Upload, X, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function NewPaymentModal({
  isOpen,
  onOpenChange,
  paymentSubmitted,
  paymentProofPreview,
  paymentProofFile,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onClearPaymentProof,
  onSubmit,
  isSubmitting,
  submitError,
  amount,
  setAmount,
  concept,
  setConcept,
  additionalCode,
  setAdditionalCode,
  bankAccountName,
  setBankAccountName,
  paymentDate,
  setPaymentDate,
  cuotasTotalesCalculadas,
  nextInstallmentNumber
}: any) {
  const handleSetToday = () => {
    setPaymentDate(new Date().toISOString().split('T')[0])
  }

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
                <Select value={concept} onValueChange={setConcept}>
                  <SelectTrigger className="bg-primary/10 border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: cuotasTotalesCalculadas }, (_, i) => (
                      <SelectItem key={i + 1} value={`cuota${i + 1}`}>
                        Cuota #{i + 1} - S/ 90 {nextInstallmentNumber === i + 1 && "(Sugerido)"}
                      </SelectItem>
                    ))}
                    <SelectItem value="adelanto">Adelanto de Cuotas</SelectItem>
                    <SelectItem value="otro">Otro concepto</SelectItem>
                  </SelectContent>
                </Select>
                {nextInstallmentNumber <= cuotasTotalesCalculadas && concept !== `cuota${nextInstallmentNumber}` ? (
                  <p className="text-[10px] text-yellow-500 mt-1 italic leading-tight">
                    Nota: Según tus registros, te corresponde pagar la Cuota #{nextInstallmentNumber}.
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-foreground leading-tight mt-1">
                    Selecciona el número de cuota o concepto que estás pagando.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Monto (Obligatorio)</Label>
                <Input 
                  type="number" 
                  placeholder="90.00" 
                  className="bg-primary/10 border-primary/30"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Ingresa el monto exacto que figura en tu voucher (en Soles).
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Fecha en que realizaste el pago</Label>
                  <button 
                    type="button"
                    onClick={handleSetToday}
                    className="text-xs text-accent hover:underline font-medium"
                  >
                    Usar fecha de hoy
                  </button>
                </div>
                <Input 
                  type="date" 
                  className="bg-primary/10 border-primary/30"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Selecciona la fecha que aparece en tu comprobante. Si acabas de pagar, puedes usar la fecha de hoy.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Nombre del titular de la cuenta de origen (Obligatorio)</Label>
                <Input 
                  type="text" 
                  placeholder="Ej: Juan Pérez" 
                  className="bg-primary/10 border-primary/30"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  required
                />
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Nombre de la persona o entidad desde la cual se realizó la transferencia.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Código Adicional (Opcional)</Label>
                <Input 
                  type="text" 
                  placeholder="Ej: 123456" 
                  className="bg-primary/10 border-primary/30"
                  value={additionalCode}
                  onChange={(e) => setAdditionalCode(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Código adicional brindado por el administrador (si aplica)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Comprobante de Pago</Label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    isDragging ? "border-accent bg-accent/10" : "border-primary/30"
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  {paymentProofPreview ? (
                    <div className="relative">
                      <Image
                        src={paymentProofPreview}
                        alt="Comprobante"
                        width={200}
                        height={200}
                        className="mx-auto rounded-lg"
                      />
                      <button
                        onClick={onClearPaymentProof}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arrastra tu comprobante aquí o
                      </p>
                      <label className="cursor-pointer">
                        <span className="text-accent hover:underline">selecciona un archivo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                      </label>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight mt-2">
                  Sube una foto clara o captura de pantalla de tu comprobante de pago (Máx. 2MB).
                </p>
              </div>

              {submitError && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">
                    {submitError}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={onSubmit}
                disabled={!paymentProofFile || isSubmitting}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  'Enviar Reporte de Pago'
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
