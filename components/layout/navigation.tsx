"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Menu, User, Shield, ArrowLeft, ImageIcon, Newspaper } from "lucide-react"
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
      meta.first_name ||
      null
    return typeof candidate === "string" ? candidate.trim() : null
  })()

  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let mounted = true
    ;(async () => {
      const { data } = await supabase
        .from('members')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single()
      if (mounted && data) {
        setUserName(`${data.first_name || ''} ${data.last_name || ''}`.trim() || null)
      }
    })()
    return () => { mounted = false }
  }, [user])

  const displayNameToUse = userName || displayName

  const firstName = (() => {
    if (!displayNameToUse) return null
    const parts = displayNameToUse.trim().split(" ")
    return parts[0]
  })()

  const isPathActive = (path: string) => pathname === path
  const isSectionActive = (hash: string) => pathname === "/" && currentHash === hash

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
        const { data } = await supabase
          .from('roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle()
        if (mounted) setIsAdmin(!!data)
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

  useEffect(() => {
    if (pathname !== "/") return
    
    const sections = ["info", "noticias", "filiales", "galeria", "bloques"]
    
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(e => e.isIntersecting)
        if (visible) {
          setCurrentHash(`#${visible.target.id}`)
        }
      },
      { threshold: 0.3 }
    )

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [pathname])

  const goToSection = (sectionId: string) => {
    setIsOpen(false)
    const section = document.getElementById(sectionId)

    if (pathname === "/") {
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
        setCurrentHash(`#${sectionId}`)
      }
      return
    }

    router.push(`/#${sectionId}`)
    setTimeout(() => {
      const newSection = document.getElementById(sectionId)
      if (newSection) {
        newSection.scrollIntoView({ behavior: "smooth" })
        setCurrentHash(`#${sectionId}`)
      }
    }, 300)
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
          <button 
            onClick={() => {
              if (pathname !== "/") {
                router.push("/")
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/huajsapata_negro.png"
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
          </button>

          {/* Desktop Navigation */}
          {pathname === "/" && (
            <nav className="hidden md:flex items-center gap-4">
              <button
                onClick={() => goToSection("info")}
                className={cn(
                  "transition-colors text-sm rounded-full px-4 py-2",
                  isSectionActive("#info")
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Información
              </button>
              <button
                onClick={() => goToSection("noticias")}
                className={cn(
                  "transition-colors text-sm rounded-full px-4 py-2",
                  isSectionActive("#noticias")
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Noticias
              </button>
              <button
                onClick={() => goToSection("filiales")}
                className={cn(
                  "transition-colors text-sm rounded-full px-4 py-2",
                  isSectionActive("#filiales")
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Filiales
              </button>
              <button
                onClick={() => goToSection("galeria")}
                className={cn(
                  "transition-colors text-sm rounded-full px-4 py-2",
                  isSectionActive("#galeria")
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Fotos
              </button>
              <button
                onClick={() => goToSection("bloques")}
                className={cn(
                  "transition-colors text-sm rounded-full px-4 py-2",
                  isSectionActive("#bloques")
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Bloques
              </button>
            </nav>
          )}

          {/* Desktop CTA */}
          {pathname !== "/login" && pathname !== "/inscription" && (
            <div className="hidden md:flex items-center gap-3">
              {user && !isAdmin ? (
                <>
                  {firstName && (
                    <span className="hidden lg:inline-flex items-center text-sm text-foreground font-medium">
                      Hola, {firstName}
                    </span>
                  )}
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] hover:from-[#5CCBD4] hover:to-[#2E7B8E] text-white font-semibold shadow-lg shadow-[#4FB8C4]/20">
                      Mi Panel
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={async () => await signOut()}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : !user ? (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="border-primary/30 text-foreground">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/inscription">
                    <Button className={cn(
                      "bg-accent hover:bg-accent/90 text-white font-bold",
                      isPathActive("/inscription") && "ring-2 ring-accent/60"
                    )}>
                      Inscribirme
                    </Button>
                  </Link>
                </>
              ) : null}

              {user && isAdmin && (
                <>
                  {firstName && (
                    <span className="hidden lg:inline-flex items-center text-sm text-foreground font-medium">
                      Hola, {firstName}
                    </span>
                  )}
                  <Link href="/admin">
                    <Button variant="outline" className="border-accent/40 text-foreground">
                      Mi Panel
                    </Button>
                  </Link>
                  {pathname.startsWith("/admin") && (
                    <>
                      <Link href="/admin/gallery">
                        <Button variant="outline" className="border-accent/40 text-foreground">
                          Galería
                        </Button>
                      </Link>
                      <Link href="/admin/news">
                        <Button variant="outline" className="border-accent/40 text-foreground">
                          Noticias
                        </Button>
                      </Link>
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={async () => await signOut()}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    Cerrar sesión
                  </Button>
                </>
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
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    <Button 
                      variant="ghost" 
                      className="justify-start font-bold uppercase tracking-widest text-xs"
                      onClick={() => goToSection("info")}
                    >
                      Información
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start font-bold uppercase tracking-widest text-xs"
                      onClick={() => goToSection("noticias")}
                    >
                      Noticias
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start font-bold uppercase tracking-widest text-xs"
                      onClick={() => goToSection("filiales")}
                    >
                      Filiales
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start font-bold uppercase tracking-widest text-xs"
                      onClick={() => goToSection("galeria")}
                    >
                      Fotos
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start font-bold uppercase tracking-widest text-xs"
                      onClick={() => goToSection("bloques")}
                    >
                      Bloques
                    </Button>

                    <div className="h-px bg-primary/10 my-2" />

                    {user && displayNameToUse && (
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Sesión activa</p>
                        <p className="text-sm text-foreground font-medium truncate">{displayNameToUse}</p>
                      </div>
                    )}

                    <nav className="flex flex-col gap-2">
                      <button 
                        onClick={() => goToSection("info")}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                          isSectionActive("#info") 
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
                            <>
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
                              <Link 
                                href="/admin/gallery"
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                  isPathActive("/admin/gallery") 
                                    ? "bg-accent/15 text-foreground border border-accent/20" 
                                    : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                                )}
                              >
                                <ImageIcon className="w-4 h-4" />
                                Galería
                              </Link>
                              <Link 
                                href="/admin/news"
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                  isPathActive("/admin/news") 
                                    ? "bg-accent/15 text-foreground border border-accent/20" 
                                    : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                                )}
                              >
                                <Newspaper className="w-4 h-4" />
                                Noticias
                              </Link>
                            </>
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
