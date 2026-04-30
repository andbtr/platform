"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"

type Block = {
  id: string | number
  name: string
  total_price: number
  dances?: string
  members_count?: number
  image_url?: string
}

export function BlocksSection() {
  const supabase = useSupabase()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlocks() {
      const { data } = await supabase
        .from('blocks')
        .select('id, name, total_price, image_url')
        .eq('is_active', true)
      
      if (data) setBlocks(data)
      setLoading(false)
    }
    fetchBlocks()
  }, [supabase])

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="group relative overflow-hidden rounded-3xl transition-all duration-500 border border-[#C5A059]/20 hover:border-[#C5A059]/50"
              >
                {/* Background Image */}
                {block.image_url ? (
                  <div className="absolute inset-0">
                    <Image
                      src={block.image_url}
                      alt={block.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-[#050A18]/30 to-[#050A18]/10" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0F2167] to-[#050A18]" />
                )}

                {/* Decorative circle */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#C5A059]/10 group-hover:bg-[#C5A059]/20 transition-colors" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-[#4FB8C4]/10 group-hover:bg-[#4FB8C4]/20 transition-colors" />

                {/* Content */}
                <div className="relative z-10 p-8 min-h-[280px] flex flex-col justify-end items-center text-center">
                  {/* Block Name */}
                  <h3 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {block.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

