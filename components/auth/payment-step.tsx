import { CreditCard, Upload, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function PaymentStep({
  formData,
  selectedBloque,
  monthlyAmount,
  dragActive,
  handleDrag,
  handleDrop,
  handleFileChange
}: any) {
  return (
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass border border-[#E91E8C]/30 text-center">
          <h4 className="text-[#E91E8C] font-semibold mb-3">Paga con Yape</h4>
          <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center mb-3">
            <span className="text-gray-400 text-sm">QR Code Yape</span>
          </div>
          <p className="text-white/60 text-sm">Escanea el código QR</p>
        </div>

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
  )
}
