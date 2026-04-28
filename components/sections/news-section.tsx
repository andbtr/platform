"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { NewsModal } from "./news-modal"

type News = {
  id: number
  title: string
  content: string
  image_url: string
  link: string | null
  priority: number
  type: string
  created_at: string
}

type NewsSectionProps = {
  news: News[]
}

export function NewsSection({ news = [] }: NewsSectionProps) {
  const [selectedNews, setSelectedNews] = useState<News | null>(null)

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM, yyyy", { locale: es })
    } catch (error) {
      console.error("Invalid date:", dateString, error)
      return "Fecha inválida"
    }
  }

  return (
    <>
      <section id="noticias" className="relative py-20 md:py-32 overflow-hidden bg-[#050A18]/50">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl text-left">
              <p className="text-[#4FB8C4] text-sm uppercase tracking-[0.3em] mb-3">Actualidad Huajsapata</p>
              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold">
                <span className="text-gold-gradient">Noticias Recientes</span>
              </h2>
            </div>
            <Link href="/noticias" className="inline-flex items-center text-sm font-bold text-[#C5A059] hover:text-[#4FB8C4] transition-colors border-b border-[#C5A059]/30 pb-1 uppercase tracking-widest">
              Ver todas las noticias
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article 
                key={item.id}
                className="group bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/5 hover:border-[#C5A059]/30 transition-all duration-500 shadow-2xl flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-[#4FB8C4] font-bold">
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-4 text-white/40 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#C5A059]" />
                      {formatDate(item.created_at)}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gold-gradient transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-white/60 text-sm leading-relaxed mb-8 line-clamp-3">
                    {item.content}
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={() => setSelectedNews(item)}
                      className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] group-hover:text-[#4FB8C4] transition-colors"
                    >
                      Leer más
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <NewsModal newsItem={selectedNews} isOpen={!!selectedNews} onClose={() => setSelectedNews(null)} />
    </>
  )
}
