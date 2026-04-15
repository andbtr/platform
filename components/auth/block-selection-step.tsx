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
          <p className="text-white/60 text-sm">Paso 2 de 2</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#C5A059]/20 bg-[#081429]/70 p-5 md:p-6">
        <p className="text-white/75 leading-relaxed">
          Selecciona el bloque donde deseas inscribirte. Esta elección nos ayuda a ubicarte dentro de la estructura del conjunto con orden y respeto por la tradición.
        </p>
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
                "group p-4 md:p-6 rounded-2xl text-left transition-all duration-300 border",
                formData.bloque === String(bloque.id)
                  ? "bg-gradient-to-br from-[#4FB8C4]/20 via-[#0F2167]/50 to-[#050A18] border-[#C5A059] shadow-lg shadow-[#4FB8C4]/20"
                  : "glass border-white/10 hover:border-[#4FB8C4]/50 hover:bg-white/10"
              )}
            >
              <span className="text-3xl mb-2 block transition-transform group-hover:scale-110">
                {iconMap[String(bloque.name).toLowerCase().split(" ")[0]] || "🎭"}
              </span>
              <h4 className="font-bold text-white text-lg">{bloque.name}</h4>
              <p className="text-white/60 text-sm">
                {descriptionMap[String(bloque.name).toLowerCase().split(" ")[0]] || "Tradición y danza"}
              </p>
              <p className="mt-3 inline-flex rounded-full border border-[#C5A059]/25 bg-[#C5A059]/10 px-3 py-1 text-xs font-semibold text-[#E9C57B]">
                Bloque de inscripción
              </p>
            </button>
          ))}
        </div>
      )}

      {!loadingBloques && bloques.length === 0 && !errorBloques && (
        <p className="text-white/60 text-center py-8">No hay bloques disponibles en este momento.</p>
      )}

      {errors.bloque && <p className="text-red-400 text-sm text-center">{errors.bloque}</p>}

      {formData.bloque && !loadingBloques && selectedBloque && (
        <div className="mt-8 p-6 rounded-2xl glass border border-[#C5A059]/30">
          <p className="text-[#C5A059] text-sm uppercase tracking-[0.25em] mb-3">Bloque seleccionado</p>
          <h4 className="text-white font-semibold text-xl mb-2">{selectedBloque.name}</h4>
          <p className="text-white/70 text-sm leading-relaxed">
            Tu inscripción continuará asociada a este bloque. Nuestro equipo se pondrá en contacto contigo para los pasos siguientes.
          </p>
        </div>
      )}
    </div>
  )
}
