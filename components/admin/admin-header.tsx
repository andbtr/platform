import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminHeader() {
  return (
    <header className="relative z-10 border-b border-primary/20 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
            <div className="h-6 w-px bg-primary/30" />
            <div className="flex items-center gap-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
                alt="Morenada Huajsapata"
                width={40}
                height={40}
                className="rounded-full border border-primary/30"
              />
              <div className="hidden md:block">
                <p className="font-medium text-foreground">Panel Administrador</p>
                <p className="text-xs text-muted-foreground">Gestion 2026-2027</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-primary/30">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
    </header>
  )
}
