"use client"

import Image from "next/image"
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative py-16 bg-[#030712]">
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="text-center md:text-left logo-container">
            <Image
              src="/huajsapata_negro.png"
              alt="Morenada Huajsapata"
              width={100}
              height={100}
              loading="eager"
              className="w-20 h-20 object-contain mx-auto md:mx-0 mb-4"
            />
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-gold-gradient mb-2">
              Morenada Huajsapata
            </h3>
            <p className="text-white/60 text-sm italic">
              "Herencia que trasciende generaciones"
            </p>
            <p className="text-white/40 text-[10px] mt-4 uppercase tracking-widest">
              Gestión 2026 - 2027
            </p>
          </div>

          {/* Contact */}
          <div className="text-center">
            <h4 className="text-[#4FB8C4] font-semibold mb-4 uppercase tracking-wider text-sm">Próximos Ensayos</h4>
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-gold-gradient uppercase tracking-widest font-bold">Llamado a la agrupación</span>
                <p className="text-sm text-white/70">Síguenos en nuestras redes sociales para estar al tanto de las fechas de ensayo.</p>
              </div>
              
              <div className="pt-2">
                <a href="mailto:morenadahuajsapata@gmail.com" className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-sm">morenadahuajsapata@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <h4 className="text-[#4FB8C4] font-semibold mb-4 uppercase tracking-wider text-sm">Síguenos</h4>
            <div className="flex items-center justify-center md:justify-end gap-4">
              <a
                href="https://www.facebook.com/share/1B18LMA55v/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[#4FB8C4]/20 transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[#E91E8C]/20 transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-red-500/20 transition-all hover:scale-110"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-white/40 text-xs mt-4">
              @morenadahuajsapata
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            © 2026 Morenada Huajsapata. Todos los derechos reservados.
          </p>
          <p className="text-[#C5A059]/60 text-xs mt-2">
            Con orgullo puneño para el mundo
          </p>
        </div>
      </div>
    </footer>
  )
}
