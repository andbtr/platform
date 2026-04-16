"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    setMounted(true)
    
    // Fecha de la Festividad de la Candelaria 2027 (2 de febrero)
    const targetDate = new Date("2027-02-02T00:00:00")

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const navigateToRegistration = () => {
    router.push("/inscription")
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Danzante de Morenada en la Festividad de la Candelaria"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050A18]/70 via-[#050A18]/50 to-[#050A18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2167]/40 via-transparent to-[#0F2167]/40" />
      </div>

      {/* Animated Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-20 animate-float">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4FB8C4] to-transparent blur-2xl" />
      </div>
      <div className="absolute bottom-40 right-10 w-40 h-40 opacity-20 animate-float" style={{ animationDelay: "2s" }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#C5A059] to-transparent blur-2xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Logos */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
            alt="Logo Morenada Huajsapata"
            width={120}
            height={120}
            loading="eager"
            className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Main Title */}
        <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-wide">
          <span className="text-gold-gradient">Vuelve a Casa.</span>
        </h1>
        <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-wide">
          <span className="text-cyan-gradient">Vuelve a Huajsapata.</span>
        </h2>
        
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 font-light">
          Gestión 2026 - 2027 | Festividad Virgen de la Candelaria
        </p>

        {/* Countdown */}
        <div className="mb-10">
          <p className="text-[#C5A059] text-sm uppercase tracking-widest mb-4">
            Cuenta regresiva para la Candelaria 2027
          </p>
          {mounted ? (
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <CountdownUnit value={timeLeft.days} label="Días" />
              <span className="text-3xl text-[#C5A059] font-light animate-pulse-glow">:</span>
              <CountdownUnit value={timeLeft.hours} label="Horas" />
              <span className="text-3xl text-[#C5A059] font-light animate-pulse-glow">:</span>
              <CountdownUnit value={timeLeft.minutes} label="Min" />
              <span className="text-3xl text-[#C5A059] font-light animate-pulse-glow hidden md:block">:</span>
              <div className="hidden md:block">
                <CountdownUnit value={timeLeft.seconds} label="Seg" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <CountdownUnit value={0} label="Días" />
              <span className="text-3xl text-[#C5A059] font-light animate-pulse-glow">:</span>
              <CountdownUnit value={0} label="Horas" />
              <span className="text-3xl text-[#C5A059] font-light animate-pulse-glow">:</span>
              <CountdownUnit value={0} label="Min" />
              <span className="text-3xl text-[#C5A059] font-light animate-pulse-glow hidden md:block">:</span>
              <div className="hidden md:block">
                <CountdownUnit value={0} label="Seg" />
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={navigateToRegistration}
          className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-[#E91E8C] to-[#C5156F] rounded-full btn-glow transition-all duration-300 hover:scale-105"
        >
          <span className="relative z-10">Inscribirme y Ser Leyenda</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E91E8C] to-[#C5156F] blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
        </button>

        {/* Secondary Info */}
        <p className="mt-6 text-[#4FB8C4]/80 text-sm">
          Más de 500 danzantes unidos por la tradición
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-[#C5A059]/60" />
        </div>
      </div>
    </section>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-digit rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] backdrop-blur-lg">
      <div className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-cinzel)]">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs md:text-sm text-[#4FB8C4] uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}
