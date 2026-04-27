"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Menu, User, Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
  const [isScrolled, setIsScrolled] = useState(false)
  const notificationCount = 0

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
      } catch {
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/80 backdrop-blur-xl border-b border-primary/20" 
        : "bg-transparent border-b border-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
              alt="Morenada Huajsapata"
              width={48}
              height={48}
              loading="eager"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-primary/30"
            />
            <div className="hidden sm:block">
              <p className="font-serif font-bold text-foreground text-sm md:text-base">Morenada Huajsapata</p>
              <p className="text-xs text-primary">Gestion 2026-2027</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {pathname !== "/login" && pathname !== "/inscription" && (
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
            </nav>
          )}

          {/* Desktop CTA */}
          {pathname !== "/login" && pathname !== "/inscription" && (
            <div className="hidden md:flex items-center gap-4">
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => router.push('/dashboard')}
                  aria-label={notificationCount > 0 ? `Tienes ${notificationCount} notificaciones` : "Sin notificaciones nuevas"}
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[10px] rounded-full flex items-center justify-center text-white">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Button>
              )}

              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-primary/20 hover:bg-primary/30 text-foreground font-bold">
                    Mi Panel
                  </Button>
                </Link>
              ) : (
                <Link href="/inscription">
                  <Button className={cn(
                    "bg-accent hover:bg-accent/90 text-white font-bold",
                    isPathActive("/inscription") && "ring-2 ring-accent/60"
                  )}>
                    Inscribirme
                  </Button>
                </Link>
              )}

              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline" className="border-accent/40 text-foreground">
                        Admin
                      </Button>
                    </Link>
                  )}
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
          )}

          {/* Mobile Menu */}
          {pathname !== "/login" && pathname !== "/inscription" && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-card border-l border-primary/20 w-[300px] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menú de navegación</SheetTitle>
                  <SheetDescription>Navegación principal del sitio</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col h-full bg-background/60 backdrop-blur-xl">
                  {/* Header */}
                  <div className="p-6 border-b border-primary/10">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
                        alt="Morenada Huajsapata"
                        width={40}
                        height={40}
                        loading="eager"
                        className="rounded-full border border-primary/30"
                      />
                      <div>
                        <p className="font-serif font-bold text-foreground text-sm">Huajsapata</p>
                        <p className="text-xs text-primary">2026-2027</p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {user && displayName && (
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Sesión activa</p>
                          <p className="text-sm text-foreground font-medium truncate">{displayName}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative h-8 w-8 rounded-full bg-background/50"
                          onClick={() => {
                            setIsOpen(false)
                            router.push('/dashboard')
                          }}
                        >
                          <Bell className="w-4 h-4 text-foreground" />
                          {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent text-[9px] rounded-full flex items-center justify-center text-white font-bold">
                              {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                          )}
                        </Button>
                      </div>
                    )}

                    <nav className="flex flex-col gap-2">
                      <button 
                        onClick={goToInfoSection}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                          isInfoActive 
                            ? "bg-primary/15 text-foreground border border-primary/20" 
                            : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                        )}
                      >
                        Información
                      </button>

                      {user ? (
                        <>
                          <Link 
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                              isPathActive("/dashboard") 
                                ? "bg-primary/15 text-foreground border border-primary/20" 
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                            )}
                          >
                            <User className="w-4 h-4" />
                            Mi Panel de Socio
                          </Link>
                          {isAdmin && (
                            <Link 
                              href="/admin"
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                isPathActive("/admin") 
                                  ? "bg-accent/15 text-foreground border border-accent/20" 
                                  : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                              )}
                            >
                              <Shield className="w-4 h-4" />
                              Panel Administrador
                            </Link>
                          )}
                        </>
                      ) : (
                        <div className="pt-2 flex flex-col gap-3">
                          <Link 
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="w-full"
                          >
                            <Button variant="outline" className="w-full border-primary/20 justify-start h-11">
                              Entrar a mi cuenta
                            </Button>
                          </Link>
                        </div>
                      )}
                    </nav>
                  </div>

                  {/* Footer CTA */}
                  <div className="p-6 border-t border-primary/10 bg-background/40">
                    {user ? (
                      <Button
                        variant="ghost"
                        onClick={async () => { setIsOpen(false); await signOut() }}
                        className="w-full text-muted-foreground hover:text-foreground hover:bg-destructive/10"
                      >
                        Cerrar sesión
                      </Button>
                    ) : (
                      <Link 
                        href="/inscription"
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      >
                        <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-11 shadow-lg shadow-accent/20">
                          Inscribirme Ahora
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Back button for Auth pages */}
          {(pathname === "/login" || pathname === "/inscription") && (
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Volver al inicio</span>
                  <span className="sm:hidden">Volver</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
