"use client"

import Image from "next/image"

const galleryImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg",
    alt: "Morenada Huajsapata 1",
    aspect: "aspect-square"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg",
    alt: "Morenada Huajsapata 2",
    aspect: "aspect-video"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg",
    alt: "Morenada Huajsapata 3",
    aspect: "aspect-[4/5]"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg",
    alt: "Morenada Huajsapata 4",
    aspect: "aspect-square"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg",
    alt: "Morenada Huajsapata 5",
    aspect: "aspect-[3/4]"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg",
    alt: "Morenada Huajsapata 6",
    aspect: "aspect-square"
  }
]

export function GallerySection() {
  return (
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

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryImages.map((image, i) => (
            <div 
              key={i} 
              className="relative overflow-hidden rounded-2xl group cursor-pointer border border-white/5 shadow-2xl transition-all duration-700 hover:border-[#C5A059]/30"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors z-10" />
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={800}
                className={`w-full h-auto object-cover transform duration-700 group-hover:scale-110`}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-linear-to-t from-black/80 to-transparent">
                <p className="text-white font-[family-name:var(--font-cinzel)] text-lg mb-1">{image.alt}</p>
                <p className="text-gold-gradient text-xs uppercase tracking-widest font-bold">Morenada Huajsapata</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-3 rounded-full border border-gold-glow text-[#C5A059] text-sm font-bold uppercase tracking-widest hover:bg-[#C5A059]/10 transition-all duration-300">
            Ver Galería Completa en Instagram
          </button>
        </div>
      </div>
    </section>
  )
}
