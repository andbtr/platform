import Link from "next/link"
import Image from "next/image"
import { Download, Bell, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function AdminHeader() {
  return (
    <header className="relative z-10 border-b border-primary/20 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
                alt="Morenada Huajsapata"
                width={40}
                height={40}
                className="rounded-full border border-primary/30 hover:scale-105 transition-transform"
              />
              <div className="hidden md:block">
                <p className="font-medium text-foreground">Panel Administrador</p>
                <p className="text-xs text-muted-foreground">Gestion 2026-2027</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 border-l border-primary/20 pl-6">
              <Link href="/admin" className="text-sm font-medium text-foreground">Mi panel</Link>
              <Link href="/admin#pagos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pagos</Link>
              <Link href="/admin#estado" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Estado</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex border-primary/30">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex border-primary/30 ml-2">
              <User className="w-4 h-4 mr-2" />
              Mi Perfil
            </Button>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Menú Administrador</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link href="/admin" className="text-lg font-medium">Mi panel</Link>
                    <Link href="/admin#pagos" className="text-lg font-medium text-muted-foreground hover:text-foreground">Pagos</Link>
                    <Link href="/admin#estado" className="text-lg font-medium text-muted-foreground hover:text-foreground">Estado</Link>
                    <div className="h-px bg-border my-4" />
                    <Button variant="outline" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Mi Perfil
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
