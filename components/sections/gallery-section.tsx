"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useSupabase } from "@/components/providers/supabase-provider"

type Photo = {
  image_url: string
  title: string
  description: string | null
}

const INITIAL_LOAD = 8
const LOAD_MORE = 8

export function GallerySection() {
  const supabase = useSupabase()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchPhotos() {
      const { data } = await supabase
        .from('photos')
        .select('image_url, title, description')
        .eq('active', true)
        .order('created_at', { ascending: false })
      
      if (data) setPhotos(data)
      setLoading(false)
    }
    fetchPhotos()
  }, [supabase])

  useEffect(() => {
    if (photos.length === 0) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < photos.length) {
          setVisibleCount((prev) => Math.min(prev + LOAD_MORE, photos.length))
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [visibleCount, photos.length])

  if (loading) {
    return (
      <section id="galeria" className="relative py-20 md:py-32 overflow-hidden bg-background">
        <div className="container mx-auto px-4 text-center text-white/60">
          Cargando galería...
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="galeria" className="relative py-20 md:py-32 overflow-hidden bg-background">
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#C5A059] text-sm uppercase tracking-[0.4em] mb-3">Momentos de Nuestra Historia</p>
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold mb-6">
              <span className="text-gold-gradient">Galería de Fotos</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg italic">
              "Donde el paso de la danza se detiene y la fe se hace eterna"
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
            {photos.slice(0, visibleCount).map((photo, i) => (
              <div 
                key={i} 
                className="relative overflow-hidden rounded-xl cursor-pointer border border-white/5 shadow-xl transition-all duration-300 hover:border-[#C5A059]/30 group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo.image_url}
                  alt={photo.title}
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-[family-name:var(--font-cinzel)] text-sm text-center">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < photos.length && (
            <div ref={loaderRef} className="mt-8 text-center text-white/60">
              Cargando más fotos...
            </div>
          )}
          
          <div className="mt-16 text-center">
            <button className="px-8 py-3 rounded-full border border-gold-glow text-[#C5A059] text-sm font-bold uppercase tracking-widest hover:bg-[#C5A059]/10 transition-all duration-300">
              Ver Galería Completa en Instagram
            </button>
          </div>
        </div>
      </section>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
          onClick={() => setSelectedPhoto(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-4xl hover:text-[#C5A059] transition-colors"
            onClick={() => setSelectedPhoto(null)}
          >
            &times;
          </button>
          <Image
            src={selectedPhoto.image_url}
            alt={selectedPhoto.title}
            width={1200}
            height={800}
            className="max-w-[90vw] max-h-[80vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="text-white font-[family-name:var(--font-cinzel)] text-xl mt-4">{selectedPhoto.title}</p>
        </div>
      )}
    </>
  )
}
