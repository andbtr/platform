"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-4">
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
        {/* Espaciador para mantener la posición del título */}
        <div className="h-20 md:h-28 mb-8" aria-hidden="true" />

{/* Main Title */}
        <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-wide uppercase drop-shadow-lg">
          <span className="text-gold-gradient drop-shadow-xl">Morenada Huajsapata</span>
        </h1>
        <h2 className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl lg:text-3xl font-light mb-6 tracking-widest italic text-white drop-shadow-md">
          Herencia que trasciende generaciones
        </h2>
        
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium drop-shadow-md">
          Gestión 2026 - 2027 | Festividad Virgen de la Candelaria
        </p>

        {/* Countdown */}
        <div className="mb-10">
          <p className="text-[#C5A059] text-sm uppercase tracking-widest mb-4 drop-shadow-lg">
            Cuenta regresiva para la Candelaria 2027
          </p>
          {mounted ? (
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <CountdownUnit value={timeLeft.days} label="Días" />
              <span className="text-3xl text-[#C5A059] font-light animate-pulse-glow">:</span>
              <CountdownUnit value={timeLeft.hours} label="Horas" />
              <span className="text-3xl text-[#C5A059] font-light animate-pulse-glow">:</span>
              <CountdownUnit value={timeLeft.minutes} label="Min" />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <CountdownUnit value={0} label="Días" />
              <span className="text-3xl text-[#C5A059] font-light animate-pulse-glow">:</span>
              <CountdownUnit value={0} label="Horas" />
              <span className="text-3xl text-[#C5A059] font-light animate-pulse-glow">:</span>
              <CountdownUnit value={0} label="Min" />
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={navigateToRegistration}
          className="btn-hero-primary btn-hero-glow relative inline-flex items-center justify-center gap-3 px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-[#E91E8C] via-[#FF4081] to-[#E91E8C] bg-[length:200%_100%] rounded-full transition-all duration-300 hover:scale-105 animate-gradient focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050A18]"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="relative z-10">Vive la magia de la Candelaria</span>
        </button>

        {/* Secondary Info */}
        <p className="mt-4 text-[#4FB8C4] text-sm drop-shadow-md">
          Únete a más de 200 bailarines ya inscritos
        </p>
      </div>
    </section>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-digit rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] backdrop-blur-lg">
      <div className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg font-[family-name:var(--font-cinzel)]">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs md:text-sm text-[#4FB8C4] uppercase tracking-wider drop-shadow-md">
        {label}
      </div>
    </div>
  )
}
