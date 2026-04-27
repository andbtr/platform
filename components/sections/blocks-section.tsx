"use client"

import { Users, Music, Shield } from "lucide-react"

type Block = {
  id: string | number
  name: string
  total_price: number
  dances?: string
  members_count?: number
}

type Props = { blocks: Block[] }

export function BlocksSection({ blocks }: Props) {
  const loading = false
  const error: string | null = null

  return (
    <section id="bloques" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-[#050A18] to-[#0F1B2E]" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#4FB8C4]/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-32 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#4FB8C4] text-sm uppercase tracking-widest mb-3">Nuestros Bloques</p>
          <h2 className="font-[--font-cinzel] text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gold-gradient">Bloques Morenada Huajsapata</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Conoce los bloques que conforman nuestra Morenada. 
            Cada uno con su identidad, historia y espíritu.
          </p>
        </div>

        {/* Empty State */}
        {!loading && blocks.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-white/60 mb-4">No hay bloques disponibles en este momento.</p>
          </div>
        )}

        {/* Blocks Grid */}
        {!loading && blocks.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="group relative overflow-hidden rounded-2xl glass hover:glass-hover transition-all duration-300 border border-[#C5A059]/20 hover:border-[#C5A059]/50 p-8"
              >
                {/* Gradient accent */}
                <div className="absolute inset-0 bg-linear-to-br from-[#4FB8C4]/5 to-[#C5A059]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Block Name */}
                  <h3 className="font-[--font-cinzel] text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#C5A059] transition-colors">
                    {block.name}
                  </h3>

                  {/* Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-10 h-10 rounded-lg bg-[#4FB8C4]/20 flex items-center justify-center">
                        <Music className="w-5 h-5 text-[#4FB8C4]" />
                      </div>
                      <div>
                        <p className="text-xs text-white/60">Tradición y Danza</p>
                        <p className="font-semibold text-lg">Bloque Oficial</p>
                      </div>
                    </div>

                    {block.members_count && (
                      <div className="flex items-center gap-3 text-white/80">
                        <div className="w-10 h-10 rounded-lg bg-[#4FB8C4]/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#4FB8C4]" />
                        </div>
                        <div>
                          <p className="text-xs text-white/60">Integrantes</p>
                          <p className="font-semibold">{block.members_count}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button className="w-full mt-6 px-6 py-3 rounded-xl bg-linear-to-r from-[#4FB8C4] to-[#0F2167] text-white font-semibold hover:shadow-lg hover:shadow-[#4FB8C4]/25 transition-all duration-300 group/btn">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

