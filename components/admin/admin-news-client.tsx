"use client"

import { useState } from "react"
import { Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsTable } from "@/components/admin/news-table"
import { NewsModal } from "@/components/admin/news-modal"

type NewsItem = {
  id: string
  title: string
  content: string
  image_url: string
  link: string | null
  priority: number
  type: string
  active: boolean
  created_at: string
}

type AdminNewsClientProps = {
  initialNews: NewsItem[]
}

export function AdminNewsClient({ initialNews }: AdminNewsClientProps) {
  const [news] = useState<NewsItem[]>(initialNews)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [editNews, setEditNews] = useState<NewsItem | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleOpenModal = (item?: NewsItem) => {
    setEditNews(item || null)
    setIsNewsModalOpen(true)
  }

  const handleSuccess = () => {
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a1628] to-background" />
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-accent/20">
            <Newspaper className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-gold-gradient">
              Gestión de Noticias
            </h1>
            <p className="text-white/60">Crea, edita y gestiona las noticias de la plataforma</p>
          </div>
        </div>

        <NewsTable 
          onOpenModal={handleOpenModal}
          refreshKey={refreshKey}
        />
      </main>

      <NewsModal 
        isOpen={isNewsModalOpen}
        setIsOpen={setIsNewsModalOpen}
        editNews={editNews}
        onSuccess={handleSuccess}
      />
    </div>
  )
}