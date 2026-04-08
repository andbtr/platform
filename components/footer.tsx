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
          <div className="text-center md:text-left">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
              alt="Morenada Huajsapata"
              width={100}
              height={100}
              className="w-20 h-20 object-contain mx-auto md:mx-0 mb-4"
            />
            <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-gold-gradient mb-2">
              Morenada Huajsapata
            </h3>
            <p className="text-white/60 text-sm">
              Gestión 2026 - 2027<br />
              Puno, Perú
            </p>
          </div>

          {/* Contact */}
          <div className="text-center">
            <h4 className="text-[#4FB8C4] font-semibold mb-4 uppercase tracking-wider text-sm">Contacto</h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span className="text-sm">Jr. Huajsapata, Puno</span>
              </a>
              <a href="tel:+51999888777" className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span className="text-sm">+51 999 888 777</span>
              </a>
              <a href="mailto:info@huajsapata.com" className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span className="text-sm">info@huajsapata.com</span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <h4 className="text-[#4FB8C4] font-semibold mb-4 uppercase tracking-wider text-sm">Síguenos</h4>
            <div className="flex items-center justify-center md:justify-end gap-4">
              <a
                href="#"
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
