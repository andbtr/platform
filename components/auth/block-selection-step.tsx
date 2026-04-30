import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
          Selecciona el bloque donde deseas inscribirte. Esta elección nos ayuda a ubicarte dentro de la estructura del conjunto.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bloques.map((bloque: any) => (
            <button
              key={bloque.id}
              type="button"
              onClick={() => setFormData({ ...formData, bloque: String(bloque.id) })}
              className={cn(
                "group relative overflow-hidden rounded-3xl transition-all duration-300 border-2",
                formData.bloque === String(bloque.id)
                  ? "border-[#C5A059]"
                  : "border-transparent hover:border-[#C5A059]/50"
              )}
            >
              {/* Background Image */}
              {bloque.image_url ? (
                <div className="absolute inset-0">
                  <Image
                    src={bloque.image_url}
                    alt={bloque.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-[#050A18]/50 to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F2167] to-[#050A18]" />
              )}
              
              {/* Content */}
              <div className="relative z-10 p-6 min-h-[200px] flex flex-col justify-end items-center text-center">
                <h3 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-white transition-transform duration-300">
                  {bloque.name}
                </h3>
              </div>

              {/* Selection Indicator */}
              {formData.bloque === String(bloque.id) && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#C5A059]/80 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {!loadingBloques && bloques.length === 0 && !errorBloques && (
        <p className="text-white/60 text-center py-8">No hay bloques disponibles en este momento.</p>
      )}

      {errors.bloque && <p className="text-red-400 text-sm text-center mt-4">{errors.bloque}</p>}
    </div>
  )
}
