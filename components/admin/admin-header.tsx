"use client"

import Link from "next/link"
import Image from "next/image"
import { Download, Bell, User, Menu, Users, Image as ImageIcon, Newspaper, Blocks, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"

const navItems = [
  { href: "/admin", label: "Pagos", icon: null },
  { href: "/admin/filiales", label: "Filiales", icon: Users },
  { href: "/admin/bloques", label: "Bloques", icon: Blocks },
  { href: "/admin/gallery", label: "Galería", icon: ImageIcon },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
]

export function AdminHeader() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <header className="relative z-10 border-b border-primary/20 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/huajsapata_negro.png"
                alt="Morenada Huajsapata"
                width={40}
                height={40}
                loading="eager"
                className="rounded-full border border-primary/30 hover:scale-105 transition-transform"
              />
              <div className="hidden md:block">
                <p className="font-medium text-foreground">Panel Administrador</p>
                <p className="text-xs text-muted-foreground">Gestion 2026-2027</p>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-1 border-l border-primary/20 pl-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "px-3 py-1.5 text-sm",
                      isActive(item.href)
                        ? "bg-primary/20 text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground">
                Volver al inicio
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="hidden sm:flex border-primary/30">
                <User className="w-4 h-4 mr-2" />
                Mi Perfil
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={async () => await signOut()}
              className="hidden sm:flex text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
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
                  <nav className="flex flex-col gap-2 mt-8">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant={isActive(item.href) ? "default" : "outline"}
                            className={cn(
                              "w-full justify-start border-primary/30",
                              isActive(item.href) && "bg-primary/20"
                            )}
                          >
                            {Icon && <Icon className="w-4 h-4 mr-2" />}
                            {item.label}
                          </Button>
                        </Link>
                      )
                    })}
                    <div className="h-px bg-border my-4" />
                    <Link href="/">
                      <Button variant="ghost" className="w-full justify-start">
                        Volver al inicio
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full justify-start border-primary/30">
                        <User className="w-4 h-4 mr-2" />
                        Mi Perfil
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={async () => await signOut()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar sesión
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
