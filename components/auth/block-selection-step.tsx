import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, string> = {
  morenos: "🎭",
  sajamas: "👑",
  chinas: "💃",
  figuras: "⭐",
}

const descriptionMap: Record<string, string> = {
  morenos: "El corazón del conjunto",
  sajamas: "Elegancia y tradición",
  chinas: "Gracia y esplendor",
  figuras: "Arte en movimiento",
}

export function BlockSelectionStep({ 
  formData, 
  setFormData, 
  errors, 
  bloques, 
  loadingBloques, 
  errorBloques,
  selectedBloque 
}: any) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#9A7B3F] flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white">
            Elige tu Bloque
          </h3>
          <p className="text-white/60 text-sm">Paso 2 de 3</p>
        </div>
      </div>

      {loadingBloques && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-[#4FB8C4]/30 border-t-[#4FB8C4] rounded-full animate-spin mx-auto mb-2" />
          <p className="text-white/60">Cargando bloques...</p>
        </div>
      )}

      {errorBloques && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-200 text-sm">Error al cargar bloques: {errorBloques}</p>
        </div>
      )}

      {!loadingBloques && bloques.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {bloques.map((bloque: any) => (
            <button
              key={bloque.id}
              type="button"
              onClick={() => setFormData({ ...formData, bloque: String(bloque.id) })}
              className={cn(
                "p-4 md:p-6 rounded-2xl text-left transition-all duration-300 border",
                formData.bloque === String(bloque.id)
                  ? "bg-gradient-to-br from-[#4FB8C4]/30 to-[#0F2167]/50 border-[#C5A059] shadow-lg shadow-[#4FB8C4]/20"
                  : "glass border-white/10 hover:border-[#4FB8C4]/50"
              )}
            >
              <span className="text-3xl mb-2 block">
                {iconMap[String(bloque.name).toLowerCase().split(" ")[0]] || "🎭"}
              </span>
              <h4 className="font-bold text-white text-lg">{bloque.name}</h4>
              <p className="text-white/60 text-sm">
                {descriptionMap[String(bloque.name).toLowerCase().split(" ")[0]] || "Tradición y danza"}
              </p>
              <p className="text-[#C5A059] font-bold mt-2">S/ {bloque.total_price}</p>
            </button>
          ))}
        </div>
      )}

      {!loadingBloques && bloques.length === 0 && !errorBloques && (
        <p className="text-white/60 text-center py-8">No hay bloques disponibles en este momento.</p>
      )}

      {errors.bloque && <p className="text-red-400 text-sm text-center">{errors.bloque}</p>}

      {formData.bloque && !loadingBloques && (
        <div className="mt-8 p-6 rounded-2xl glass border border-[#C5A059]/30">
          <h4 className="text-[#C5A059] font-semibold mb-4">Número de Cuotas</h4>
          <div className="flex items-center gap-4 mb-4">
            {[8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setFormData({ ...formData, cuotas: num })}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold transition-all duration-300",
                  formData.cuotas === num
                    ? "bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] text-white"
                    : "bg-white/5 text-white/60 hover:text-white"
                )}
              >
                {num} cuotas
              </button>
            ))}
          </div>
          <div className="text-center p-4 rounded-xl bg-[#0F2167]/50">
            <p className="text-white/60 text-sm">Monto mensual</p>
            <p className="text-3xl font-bold text-gold-gradient font-[family-name:var(--font-cinzel)]">
              S/ {selectedBloque ? Math.ceil(selectedBloque.total_price / formData.cuotas) : 0}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
