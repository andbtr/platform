"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/providers/auth-provider"
import { useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navigation() {
  const supabase = useSupabase()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState("")
  const { user, signOut } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  const displayName = (() => {
    if (!user) return null
    const meta = (user as any).user_metadata ?? {}
    const candidate =
      meta.full_name ||
      meta.name ||
      meta.display_name ||
      meta.username ||
      (typeof user.email === "string" ? user.email.split("@")[0] : null)
    return typeof candidate === "string" ? candidate.trim() : null
  })()

  const isPathActive = (path: string) => pathname === path
  const isInfoActive = pathname === "/" && currentHash === "#info"

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!user) {
        if (mounted) setIsAdmin(false)
        return
      }

      const meta = (user as any).user_metadata ?? {}
      if (meta.is_admin || meta.isAdmin || meta.role === 'admin') {
        if (mounted) setIsAdmin(true)
        return
      }

      try {
        const { data } = await supabase.from('members').select('is_admin').eq('id', user.id).maybeSingle()
        if (mounted) setIsAdmin(Boolean(data?.is_admin))
      } catch (e) {
        if (mounted) setIsAdmin(false)
      }
    })()
    return () => { mounted = false }
  }, [user])

  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash)
    updateHash()
    window.addEventListener("hashchange", updateHash)
    return () => window.removeEventListener("hashchange", updateHash)
  }, [pathname])

  const goToInfoSection = () => {
    setIsOpen(false)

    if (pathname === "/") {
      document.getElementById("info")?.scrollIntoView({ behavior: "smooth" })
      setCurrentHash("#info")
      return
    }

    router.push("/#info")
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
              onClick={goToInfoSection}
              className={cn(
                "transition-colors text-sm rounded-full px-3 py-1.5",
                isInfoActive
                  ? "bg-primary/20 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Información
            </button>
            <Link 
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 transition-colors text-sm rounded-full px-3 py-1.5",
                isPathActive("/dashboard")
                  ? "bg-primary/20 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="w-4 h-4" />
              Mi Panel
            </Link>
            {isAdmin && (
              <Link 
                href="/admin"
                className={cn(
                  "flex items-center gap-2 transition-colors text-sm rounded-full px-3 py-1.5",
                  isPathActive("/admin")
                    ? "bg-accent/20 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/inscription"> 
              <Button className={cn(
                "bg-accent hover:bg-accent/90 text-white font-bold",
                isPathActive("/inscription") && "ring-2 ring-accent/60"
              )}>
                Inscribirme
              </Button>
            </Link>

            {user ? (
              <>
                {displayName && (
                  <span className="hidden lg:inline-flex items-center rounded-full bg-primary/15 border border-primary/30 px-3 py-1.5 text-sm text-foreground">
                    Hola, {displayName}
                  </span>
                )}
                <Button variant="ghost" onClick={async () => await signOut()}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className={cn(
                    isPathActive("/login") && "bg-primary/15 border-primary/40 text-foreground"
                  )}
                >
                  Entrar
                </Button>
              </Link>
            )}
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

                {user && displayName && (
                  <div className="mb-6 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2">
                    <p className="text-xs text-primary uppercase tracking-wide">Sesión activa</p>
                    <p className="text-sm text-foreground font-medium truncate">{displayName}</p>
                  </div>
                )}

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
                    onClick={goToInfoSection}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-foreground transition-colors text-left",
                      isInfoActive ? "bg-primary/20" : "hover:bg-primary/10"
                    )}
                  >
                    Información
                  </button>
                  <div className="h-px bg-primary/20 my-2" />
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-foreground transition-colors",
                      isPathActive("/dashboard") ? "bg-primary/20" : "hover:bg-primary/10"
                    )}
                  >
                    <User className="w-5 h-5 text-primary" />
                    Mi Panel de Socio
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg text-foreground transition-colors",
                        isPathActive("/admin") ? "bg-accent/20" : "hover:bg-primary/10"
                      )}
                    >
                      <Shield className="w-5 h-5 text-accent" />
                      Panel Administrador
                    </Link>
                  )}
                  {user ? (
                    <button
                      onClick={async () => { setIsOpen(false); await signOut() }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 text-foreground transition-colors text-left"
                    >
                      Cerrar sesión
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg text-foreground transition-colors",
                        isPathActive("/login") ? "bg-primary/20" : "hover:bg-primary/10"
                      )}
                    >
                      Entrar
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
