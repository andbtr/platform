import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
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
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
              alt="Morenada Huajsapata"
              width={40}
              height={40}
              className="rounded-full border border-primary/30"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[10px] rounded-full flex items-center justify-center text-white">2</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
