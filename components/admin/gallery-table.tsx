"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Eye, EyeOff, Edit, Trash2, Plus, Search, Image as ImageIcon 
} from "lucide-react"

type PhotoItem = {
  id: string
  title: string
  description: string | null
  image_url: string
  active: boolean
  created_at: string
}

type GalleryTableProps = {
  onOpenModal: (photo?: PhotoItem) => void
  refreshKey: number
}

export function GalleryTable({ onOpenModal, refreshKey }: GalleryTableProps) {
  const supabase = useSupabase()
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all")

  useEffect(() => {
    fetchPhotos()
  }, [supabase, refreshKey])

  const fetchPhotos = async () => {
    if (!supabase) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setPhotos(data)
    }
    setLoading(false)
  }

  const handleToggleActive = async (item: PhotoItem) => {
    if (!supabase) return

    const { error } = await supabase
      .from("photos")
      .update({ active: !item.active })
      .eq("id", item.id)

    if (!error) {
      setPhotos(photos.map(p => 
        p.id === item.id ? { ...p, active: !p.active } : p
      ))
    }
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (!confirm("¿Estás seguro de que deseas eliminar esta imagen?")) return

    const { error } = await supabase
      .from("photos")
      .delete()
      .eq("id", id)

    if (!error) {
      setPhotos(photos.filter(p => p.id !== id))
    }
  }

  const filteredPhotos = photos.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar imágenes..."
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
            Visibles
          </Button>
          <Button
            variant={filterActive === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive("inactive")}
          >
            <EyeOff className="w-4 h-4 mr-1" />
            Ocultas
          </Button>
        </div>
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay imágenes en la galería</p>
          <Button 
            variant="link" 
            onClick={() => onOpenModal()}
            className="text-accent"
          >
            Subir primera imagen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((item) => (
            <div 
              key={item.id} 
              className={`group relative glass-strong rounded-2xl overflow-hidden border border-white/10 transition-all hover:border-accent/50 ${
                !item.active ? "opacity-60" : ""
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`absolute top-3 left-3 z-10 p-2 rounded-full transition-all ${
                    item.active 
                      ? "bg-green-500/80 hover:bg-green-500" 
                      : "bg-red-500/80 hover:bg-red-500"
                  }`}
                  title={item.active ? "Ocultar" : "Mostrar"}
                >
                  {item.active ? (
                    <Eye className="w-4 h-4 text-white" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-white" />
                  )}
                </button>

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => onOpenModal(item)}
                    className="h-8 w-8 bg-black/50 hover:bg-black/70"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 bg-black/50 hover:bg-red-600/70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-white truncate">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-white/60 line-clamp-2 mt-1">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}