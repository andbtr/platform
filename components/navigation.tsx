"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
              alt="Morenada Huajsapata"
              width={48}
              height={48}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-primary/30"
            />
            <div className="hidden sm:block">
              <p className="font-serif font-bold text-foreground text-sm md:text-base">Morenada Huajsapata</p>
              <p className="text-xs text-primary">Gestion 2026-2027</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("info")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Información
            </button>
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              Mi Panel
            </Link>
            <Link 
              href="/admin"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/inscription"
            >
              <Button className="bg-accent hover:bg-accent/90 text-white font-bold">
                Inscribirme
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-card border-primary/30 w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
                      alt="Morenada Huajsapata"
                      width={40}
                      height={40}
                      className="rounded-full border border-primary/30"
                    />
                    <div>
                      <p className="font-serif font-bold text-foreground text-sm">Huajsapata</p>
                      <p className="text-xs text-primary">2026-2027</p>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/inscription"
                  onClick={() => setIsOpen(false)}
                  className="mb-6"
                >
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold">
                    Inscribirme Ahora
                  </Button>
                </Link>

                <nav className="flex flex-col gap-4">
                  <button 
                    onClick={() => scrollToSection("info")}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 text-foreground transition-colors text-left"
                  >
                    Información
                  </button>
                  <div className="h-px bg-primary/20 my-2" />
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
                  >
                    <User className="w-5 h-5 text-primary" />
                    Mi Panel de Socio
                  </Link>
                  <Link 
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
                  >
                    <Shield className="w-5 h-5 text-accent" />
                    Panel Administrador
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
