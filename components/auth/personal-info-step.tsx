import { User } from "lucide-react"
import { cn } from "@/lib/utils"

export function PersonalInfoStep({ formData, setFormData, errors }: any) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4FB8C4] to-[#1E6B7E] flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white">
            Datos de Inscripción
          </h3>
          <p className="text-white/60 text-sm">Paso 1 de 2</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
        <p className="text-white/75 leading-relaxed">
          Completa tus datos con precisión. Esta información se usa para tu registro en el conjunto folklórico.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#C5A059] text-sm mb-2 font-medium">Nombres</label>
          <input
            type="text"
            value={formData.nombres}
            onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
              errors.nombres ? "border-red-500" : "border-white/10"
            )}
            placeholder="Juan Carlos"
          />
          {errors.nombres && <p className="text-red-400 text-xs mt-1">{errors.nombres}</p>}
        </div>
        <div>
          <label className="block text-[#C5A059] text-sm mb-2 font-medium">Apellidos</label>
          <input
            type="text"
            value={formData.apellidos}
            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
              errors.apellidos ? "border-red-500" : "border-white/10"
            )}
            placeholder="Pérez García"
          />
          {errors.apellidos && <p className="text-red-400 text-xs mt-1">{errors.apellidos}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#C5A059] text-sm mb-2 font-medium">Número de Documento de Identidad</label>
          <input
            type="text"
            value={formData.dni}
            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
              errors.dni ? "border-red-500" : "border-white/10"
            )}
            placeholder="Ingresa tu documento"
          />
          {errors.dni && <p className="text-red-400 text-xs mt-1">{errors.dni}</p>}
        </div>
        <div>
          <label className="block text-[#C5A059] text-sm mb-2 font-medium">Teléfono</label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
              errors.telefono ? "border-red-500" : "border-white/10"
            )}
            placeholder="999 888 777"
          />
          {errors.telefono && <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#C5A059] text-sm mb-2 font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
              errors.email ? "border-red-500" : "border-white/10"
            )}
            placeholder="juan.perez@ejemplo.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-[#C5A059] text-sm mb-2 font-medium">Ciudad</label>
          <input
            type="text"
            value={formData.ciudad}
            onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FB8C4] transition-all",
              errors.ciudad ? "border-red-500" : "border-white/10"
            )}
            placeholder="p.e Lima, Arequipa, Cusco..."
          />
          {errors.ciudad && <p className="text-red-400 text-xs mt-1">{errors.ciudad}</p>}
        </div>
      </div>
    </div>
  )
}
