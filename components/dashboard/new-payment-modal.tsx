import Image from "next/image"
import { Check, Clock, Upload, X, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  nextInstallmentNumber
}: any) {
  const handleSetToday = () => {
    setPaymentDate(new Date().toISOString().split('T')[0])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-primary/30 max-w-md max-h-[85vh] overflow-y-auto">
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
                    <SelectItem value={`cuota${nextInstallmentNumber}`}>
                      Cuota #{nextInstallmentNumber} (Sugerido)
                    </SelectItem>
                    <SelectItem value="otro">Otro concepto</SelectItem>
                  </SelectContent>
                </Select>
                {concept === "otro" ? (
                  <p className="text-[10px] text-yellow-500 mt-1 italic leading-tight">
                    Nota: Usa esta opcion solo si el administrador lo indico.
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-foreground leading-tight mt-1">
                    Se usara automaticamente la cuota sugerida.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Monto (S/)</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  placeholder="S/ 0.00"
                  className="bg-primary/10 border-primary/30"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                {submitAttempted && !amount && (
                  <p className="text-[10px] text-red-400 leading-tight">
                    Campo obligatorio.
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Debe coincidir exactamente con tu comprobante.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Fecha del pago</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="date" 
                    className="flex-1 bg-primary/10 border-primary/30 text-foreground [color-scheme:dark]"
                    placeholder="Selecciona una fecha"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-3"
                    onClick={handleSetToday}
                  >
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Hoy
                  </Button>
                </div>
                {submitAttempted && !paymentDate && (
                  <p className="text-[10px] text-red-400 leading-tight">
                    Campo obligatorio.
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Debe coincidir con la fecha del comprobante.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Metodo de pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-primary/10 border-primary/30">
                    <SelectValue placeholder="Selecciona un método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QR_YAPE_PLIN">Yape / Plin</SelectItem>
                    <SelectItem value="TRANSFERENCIA_BANCARIA">Transferencia bancaria</SelectItem>
                    <SelectItem value="TRANSFERENCIA_INTERBANCARIA">Transferencia interbancaria</SelectItem>
                    <SelectItem value="OTRAS_BILLETERAS_DIGITALES">Otro</SelectItem>
                  </SelectContent>
                </Select>
                {submitAttempted && !paymentMethod && (
                  <p className="text-[10px] text-red-400 leading-tight">
                    Campo obligatorio.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Nombre del titular de la cuenta</Label>
                <Input 
                  type="text" 
                  placeholder="Ej: Juan Pérez" 
                  className="bg-primary/10 border-primary/30"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  required
                />
                {submitAttempted && !bankAccountName.trim() && (
                  <p className="text-[10px] text-red-400 leading-tight">
                    Campo obligatorio.
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Tal como aparece en el comprobante.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Codigo adicional (opcional)</Label>
                <Input 
                  type="text" 
                  placeholder="Ej: 123456" 
                  className="bg-primary/10 border-primary/30"
                  value={additionalCode}
                  onChange={(e) => setAdditionalCode(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Solo si el administrador te proporciono uno.
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
                {submitAttempted && !paymentProofFile && (
                  <p className="text-[10px] text-red-400 leading-tight mt-2">
                    Campo obligatorio.
                  </p>
                )}
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
  )
}
