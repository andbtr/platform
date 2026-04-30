"use client"

import Image from "next/image"
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative py-12 bg-[#030712]">
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />

      <div className="flex justify-between items-start gap-8 px-8 w-full">
        {/* Logo & Description */}
        <div className="flex items-center gap-4 flex-1 max-w-[280px]">
          <Image
            src="/huajsapata_negro.png"
            alt="Morenada Huajsapata"
            width={80}
            height={80}
            loading="eager"
            className="w-16 h-16 object-contain shrink-0"
          />
          <div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-gold-gradient">
              Morenada Huajsapata
            </h3>
            <p className="text-white/60 text-sm italic">"Herencia que trasciende generaciones"</p>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">Gestión 2026-2027</p>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center flex flex-col items-center flex-1 max-w-[320px]">
          <p className="text-[#4FB8C4] font-semibold mb-2 uppercase tracking-wider text-sm">Próximos Ensayos</p>
          <p className="text-white/60 text-base mb-3">Síguenos en redes para fechas de ensayo</p>
          <a href="mailto:morenadahuajsapata@gmail.com" className="text-white/70 text-base hover:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#C5A059]" />
            morenadahuajsapata@gmail.com
          </a>
        </div>

        {/* Social Links */}
        <div className="text-center flex flex-col items-center flex-1 max-w-[320px]">
          <p className="text-[#4FB8C4] font-semibold mb-2 uppercase tracking-wider text-sm">Síguenos</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.facebook.com/share/1B18LMA55v/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[#4FB8C4]/20 hover:scale-110 transition-all"
            >
              <Facebook className="w-6 h-6 text-white" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[#E91E8C]/20 hover:scale-110 transition-all"
            >
              <Instagram className="w-6 h-6 text-white" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-red-500/20 hover:scale-110 transition-all"
            >
              <Youtube className="w-6 h-6 text-white" />
            </a>
          </div>
          <p className="text-white/40 text-sm mt-2">@morenadahuajsapata</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-6 border-t border-white/10 text-center mt-8">
        <p className="text-white/40 text-sm">© 2026 Morenada Huajsapata. Con orgullo puneño para el mundo</p>
      </div>
    </footer>
  )
}
