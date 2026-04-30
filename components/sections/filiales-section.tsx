"use client"

import Image from "next/image"
import { MapPin, Phone, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"

type Branch = {
  id: string
  city: string
  name: string
  location: string
  phone: string
  social_url: string | null
  is_active: boolean
}

export function FilialesSection() {
  const { supabase } = useSupabase()
  const [filiales, setFiliales] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFiliales = async () => {
      const { data, error } = await supabase
        .from("branches")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setFiliales(data)
      }
      setLoading(false)
    }

    fetchFiliales()
  }, [supabase])
  return (
    <section id="filiales" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#050A18]" />
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 blur-[120px] rounded-full" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[#4FB8C4] text-sm uppercase tracking-[0.3em] mb-3">Nuestra Presencia</p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gold-gradient">Nuestras Filiales</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            La Morenada Huajsapata trasciende fronteras. Encuéntranos en nuestras diferentes sedes y sé parte de esta gran herencia.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white/60 py-12">Cargando filiales...</div>
        ) : filiales.length === 0 ? (
          <div className="text-center text-white/60 py-12">No hay filiales disponibles</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filiales.map((filial, index) => (
              <div 
                key={filial.id}
                className={`relative group p-8 rounded-3xl transition-all duration-500 border ${
                  index === 0
                  ? 'bg-[#0F2167]/40 border-[#C5A059]/40 shadow-[0_0_30px_rgba(197,160,89,0.1)]' 
                  : 'bg-card/20 border-white/5 hover:border-[#4FB8C4]/30'
                }`}
              >
                {index === 0 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold-gradient rounded-full text-[10px] font-bold text-black uppercase tracking-widest shadow-xl">
                    Filial Destacada
                  </div>
                )}

                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-white group-hover:text-gold-gradient transition-colors">
                      {filial.city}
                    </h3>
                    <div className={`p-3 rounded-2xl ${index === 0 ? 'bg-[#C5A059]/10' : 'bg-white/5'}`}>
                      <MapPin className={`w-6 h-6 ${index === 0 ? 'text-[#C5A059]' : 'text-white/40'}`} />
                    </div>
                  </div>

                  <p className="text-white/60 text-sm mb-8 leading-relaxed">
                    {filial.name || `Filial en ${filial.city}`}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#4FB8C4] mt-1 shrink-0" />
                      <span className="text-sm text-white/80">{filial.location}</span>
                    </div>
                    {filial.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#4FB8C4] shrink-0" />
                        <span className="text-sm text-white/80">{filial.phone}</span>
                      </div>
                    )}
                    
                    {filial.social_url && (
                      <button className="w-full mt-6 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                        Ver en Mapa
                        <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
