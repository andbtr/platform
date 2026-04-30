"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { 
  Eye, EyeOff, Edit, Trash2, Plus, Search, Image as ImageIcon 
} from "lucide-react"

type PhotoItem = {
  id: string
  title: string
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
  const [photoToDelete, setPhotoToDelete] = useState<PhotoItem | null>(null)

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

  const confirmDelete = (photo: PhotoItem) => {
    setPhotoToDelete(photo)
  }

  const handleDelete = async () => {
    if (!supabase || !photoToDelete) return

    const imageUrl = photoToDelete.image_url

    // Extraer el path del archivo de la URL
    const match = imageUrl.match(/photos\/(.+)$/)
    const filePath = match ? match[1] : null

    if (!filePath) {
      console.error('No se pudo extraer el path de la imagen:', imageUrl)
      alert('Error: URL de imagen inválida')
      return
    }

    // Eliminar imagen del storage
    const { error: storageError } = await supabase.storage
      .from('photos')
      .remove([filePath])

    if (storageError) {
      console.error('Error eliminando imagen del storage:', storageError)
      alert('Error al eliminar la imagen del almacenamiento')
      return
    }

    // Eliminar registro de la base de datos
    const { error: dbError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoToDelete.id)

    if (dbError) {
      console.error('Error eliminando registro:', dbError)
      alert('Error al eliminar el registro de la base de datos')
      return
    }

    setPhotos(photos.filter(p => p.id !== photoToDelete.id))
    setPhotoToDelete(null)
  }

  const filteredPhotos = photos.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    
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
                  loading="eager"
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
                    onClick={() => confirmDelete(item)}
                    className="h-8 w-8 bg-black/50 hover:bg-red-600/70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white truncate">{item.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.active 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {item.active ? "Activa" : "Oculta"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent className="glass-card border-gold-glow">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-[family-name:var(--font-cinzel)] text-gold-gradient">
              ¿Eliminar imagen?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              ¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}