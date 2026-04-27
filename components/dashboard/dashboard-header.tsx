"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function DashboardHeader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="relative z-10 border-b border-primary/20 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 transition-colors">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
                alt="Morenada Huajsapata"
                width={40}
                height={40}
                loading="eager"
                className="rounded-full border border-primary/30 hover:scale-105 transition-transform"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-foreground">Mi panel</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="outline" size="sm" className="hidden sm:flex border-primary/30">
                <User className="w-4 h-4 mr-2" />
                Mi Perfil
              </Button>
            </Link>
            {mounted && (
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Menú</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-4 mt-8">
                      <Link href="/dashboard" className="text-lg font-medium">Mi panel</Link>
                      <div className="h-px bg-border my-4" />
                      <Link href="/profile">
                        <Button variant="outline" className="w-full justify-start border-primary/30">
                          <User className="w-4 h-4 mr-2" />
                          Mi Perfil
                        </Button>
                      </Link>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
