"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  Eye, EyeOff, Edit, Trash2, Plus, Search, Newspaper 
} from "lucide-react"

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

type NewsTableProps = {
  onOpenModal: (news?: NewsItem) => void
  refreshKey: number
}

export function NewsTable({ onOpenModal, refreshKey }: NewsTableProps) {
  const supabase = useSupabase()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all")

  useEffect(() => {
    fetchNews()
  }, [supabase, refreshKey])

  const fetchNews = async () => {
    if (!supabase) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setNews(data)
    }
    setLoading(false)
  }

  const handleToggleActive = async (item: NewsItem) => {
    if (!supabase) return

    const { error } = await supabase
      .from("news")
      .update({ active: !item.active })
      .eq("id", item.id)

    if (!error) {
      setNews(news.map(n => 
        n.id === item.id ? { ...n, active: !n.active } : n
      ))
    }
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (!confirm("¿Estás seguro de que deseas eliminar esta noticia?")) return

    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id)

    if (!error) {
      setNews(news.filter(n => n.id !== id))
    }
  }

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterActive === "active") return matchesSearch && item.active
    if (filterActive === "inactive") return matchesSearch && !item.active
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar noticias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterActive === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive("all")}
          >
            Todos
          </Button>
          <Button
            variant={filterActive === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive("active")}
          >
            <Eye className="w-4 h-4 mr-1" />
            Activas
          </Button>
          <Button
            variant={filterActive === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive("inactive")}
          >
            <EyeOff className="w-4 h-4 mr-1" />
            Inactivas
          </Button>
          <Button onClick={() => onOpenModal()} className="ml-2 bg-accent hover:bg-accent/80">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Noticia
          </Button>
        </div>
      </div>

      {filteredNews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay noticias para mostrar</p>
          <Button 
            variant="link" 
            onClick={() => onOpenModal()}
            className="text-accent"
          >
            Crear primera noticia
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="w-24">Imagen</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map((item) => (
                <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-white/10">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white line-clamp-1">{item.title}</p>
                      <p className="text-sm text-white/50 line-clamp-1">{item.content}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/20">
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={item.active}
                        onCheckedChange={() => handleToggleActive(item)}
                      />
                      <span className={`text-xs ${item.active ? "text-green-400" : "text-red-400"}`}>
                        {item.active ? "Visible" : "Oculto"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenModal(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}