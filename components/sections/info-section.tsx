"use client"

import Image from "next/image"
import { Calendar, MapPin, Users, Music, Award, Heart } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Festividad de la Candelaria",
    description: "Patrimonio Cultural Inmaterial de la Humanidad reconocido por la UNESCO",
  },
  {
    icon: MapPin,
    title: "Puno - Capital del Folklore",
    description: "A orillas del majestuoso Lago Titicaca, cuna de tradiciones milenarias",
  },
  {
    icon: Users,
    title: "Más de 500 Danzantes",
    description: "Unidos por la devoción a la Mamita Candelaria y el amor por la danza",
  },
  {
    icon: Music,
    title: "Bandas de Primera",
    description: "Música en vivo que hace vibrar el corazón de todo el altiplano",
  },
  {
    icon: Award,
    title: "Tradición desde 1965",
    description: "Décadas de historia, orgullo y legado que continúa en cada generación",
  },
  {
    icon: Heart,
    title: "Familia Huajsapata",
    description: "Más que un conjunto, somos una familia unida por la pasión",
  },
]

const stats = [
  { value: "60+", label: "Años de Historia" },
  { value: "500+", label: "Danzantes" },
  { value: "8", label: "Bloques" },
  { value: "7", label: "Días de Fiesta" },
]

export function InfoSection() {
  return (
    <section id="info" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050A18]" />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#4FB8C4]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[#C5A059]/20 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#4FB8C4] text-sm uppercase tracking-widest mb-3">Tradición y Cultura</p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gold-gradient">Morenada Huajsapata</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            La Morenada es la danza emblema de Puno, una expresión de fe, historia y orgullo 
            que se vive con pasión en cada paso durante la Festividad de la Virgen de la Candelaria.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl glass border-gold-glow">
              <div className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold text-gold-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl glass hover:bg-[#0F2167]/40 transition-all duration-300 border border-transparent hover:border-[#C5A059]/30"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4FB8C4]/20 to-[#0F2167]/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-[#4FB8C4]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Cultural Note */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl glass-strong border-gold-glow">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/morenada%20huajsapata-CiQDC1t7E05mib4KDwsfIIaUAjtDbt.png"
                alt="Morenada Huajsapata y Virgen de la Candelaria"
                width={300}
                height={200}
                className="w-auto h-32 md:h-40 object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-white mb-4">
                En Honor a la <span className="text-gold-gradient">Mamita Candelaria</span>
              </h3>
              <p className="text-white/70 leading-relaxed">
                Cada febrero, las calles de Puno se llenan de color, música y devoción. La Morenada 
                Huajsapata danza en honor a la Virgen de la Candelaria, patrona de Puno, en una 
                celebración que fusiona la fe católica con tradiciones andinas ancestrales. 
                Ser parte de esta tradición es llevar en el corazón el orgullo de ser puneño.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
