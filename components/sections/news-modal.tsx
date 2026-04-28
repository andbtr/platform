"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Calendar, ExternalLink, Tag, X } from "lucide-react"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from "next/link"

type News = {
  id: number
  title: string
  content: string
  image_url: string
  link: string | null
  priority: number
  type: string
  created_at: string
}

type NewsModalProps = {
  newsItem: News | null
  isOpen: boolean
  onClose: () => void
}

export function NewsModal({ newsItem, isOpen, onClose }: NewsModalProps) {
  if (!newsItem) return null

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es })
    } catch (error) {
      return "Fecha inválida"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">{newsItem.title}</DialogTitle>
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          {newsItem.image_url && (
            <div className="relative h-64 md:h-96">
              <Image
                src={newsItem.image_url}
                alt={newsItem.title}
                fill
                className="object-contain"
              />
            </div>
          )}
          <article className="p-6 md:p-10">
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-bold font-serif text-gold-gradient mb-4">{newsItem.title}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(newsItem.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="capitalize">{newsItem.type}</span>
                </div>
              </div>
            </div>
            <div className="prose prose-invert lg:prose-xl max-w-none mx-auto text-foreground/80">
              {newsItem.content}
            </div>
            {newsItem.link && (
              <div className="mt-12 pt-8 border-t border-primary/20">
                <h3 className="text-lg font-semibold mb-4">Enlace de Interés</h3>
                <Link href={newsItem.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>{newsItem.link}</span>
                </Link>
              </div>
            )}
          </article>
        </div>
      </DialogContent>
    </Dialog>
  )
}
