"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Terminal, UploadCloud, X } from "lucide-react"
import Image from "next/image"

type PhotoItem = {
  id: string
  title: string
  image_url: string
  active: boolean
  created_at: string
}

type PhotoModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  editPhoto?: PhotoItem | null
  onSuccess: () => void
}

export function PhotoModal({ isOpen, setIsOpen, editPhoto, onSuccess }: PhotoModalProps) {
  const supabase = useSupabase()
  const [files, setFiles] = useState<File[]>([])
  const [title, setTitle] = useState("")
  const [active, setActive] = useState(true)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  useEffect(() => {
    if (editPhoto) {
      setTitle(editPhoto.title)
      setActive(editPhoto.active)
      setPreviewUrls([editPhoto.image_url])
      setFiles([])
    } else {
      resetForm()
    }
  }, [editPhoto, isOpen])

  const resetForm = () => {
    setFiles([])
    setPreviewUrls([])
    setTitle("")
    setActive(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    const validFiles = selectedFiles.filter(file => {
      if (!file.type.startsWith("image/")) {
        setError("Todos los archivos deben ser imágenes.")
        return false
      }
      if (file.size > 3 * 1024 * 1024) {
        setError("Las imágenes no deben pesar más de 3MB.")
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setFiles(validFiles)
    setError(null)

    // Crear preview URLs
    const readers = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then(urls => setPreviewUrls(urls))
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previewUrls.filter((_, i) => i !== index)
    setFiles(newFiles)
    setPreviewUrls(newPreviews)
  }

  const handleRemoveCurrentImage = () => {
    setFiles([])
    setPreviewUrls([])
  }

  const handleSubmit = async () => {
    if (!supabase) {
      setError("Supabase client is not available.")
      return
    }

    if (!title) {
      setError("El título es requerido.")
      return
    }

    if (!editPhoto && files.length === 0 && previewUrls.length === 0) {
      setError("Por favor, selecciona al menos una imagen.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Si hay archivos nuevos para subir (modo múltiples)
      if (files.length > 0) {
        const uploads = files.map(async (file) => {
          const filePath = `gallery/${crypto.randomUUID()}`
          const { error: uploadError } = await supabase.storage
            .from("photos")
            .upload(filePath, file)

          if (uploadError) {
            throw new Error(`Error al subir la imagen: ${uploadError.message}`)
          }

          const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filePath)
          
          const { error: dbError } = await supabase.from("photos").insert({
            title,
            image_url: publicUrl,
            active,
          })

          if (dbError) {
            throw new Error(`Error al guardar la imagen: ${dbError.message}`)
          }
        })

        await Promise.all(uploads)
        setSuccess(`¡${files.length} imágenes subidas con éxito!`)
        resetForm()
      } else if (editPhoto && previewUrls.length > 0) {
        // Editar imagen existente
        const { error: dbError } = await supabase.from("photos").update({
          title,
          image_url: previewUrls[0],
          active,
        }).eq("id", editPhoto.id)

        if (dbError) {
          throw new Error(`Error al actualizar la imagen: ${dbError.message}`)
        }

        setSuccess("¡Imagen actualizada con éxito!")
      }

      onSuccess()
      
      setTimeout(() => {
        if (editPhoto) {
          setIsOpen(false)
          resetForm()
        }
        setSuccess(null)
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    resetForm()
    setError(null)
    setSuccess(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#0a1628] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gold-gradient">
            {editPhoto ? "Editar Imagen" : "Subir Nueva Imagen"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 rounded-xl">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-[#4FB8C4]/10 border-[#4FB8C4]/30 rounded-xl">
              <Terminal className="h-4 w-4 text-[#4FB8C4]" />
              <AlertTitle className="text-[#4FB8C4]">Éxito</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Título primero para que pueda escribirse antes de seleccionar imágenes */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#C5A059] text-sm font-medium">
              Título {files.length > 1 ? "(se aplicará a todas las imágenes)" : ""}
              <span className="text-red-400"> *</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
              placeholder="Ej: Procesión 2026, Ensayo general, etc..."
            />
          </div>

          <div>
            <Label className="text-[#C5A059] text-sm font-medium mb-2">
              {editPhoto ? "Imagen" : "Imágenes"}
            </Label>
            
            {previewUrls.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {files.length > 0 && (
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 p-1 bg-destructive/80 hover:bg-destructive rounded-full"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      )}
                      {index === 0 && files.length > 1 && (
                        <div className="absolute bottom-1 left-1 bg-black/60 px-2 py-0.5 rounded text-xs text-white">
                          +{files.length - 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCurrentImage}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Eliminar todas
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#4FB8C4]/50 hover:bg-white/5 transition-all">
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <UploadCloud className="h-10 w-10 text-white/30 mb-2" />
                  <p className="text-sm text-white/60">
                    <span className="text-[#4FB8C4]">Sube archivos</span>
                  </p>
                  <p className="text-xs text-white/40 mt-1">Múltiples imágenes - PNG, JPG hasta 3MB c/u</p>
                </div>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
              <Label htmlFor="active" className="text-white font-medium">Mostrar en galería</Label>
              <p className="text-white/50 text-xs mt-1">La imagen será visible en la web</p>
            </div>
            <Switch id="active" checked={active} onCheckedChange={setActive} disabled={loading} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !title}
            className="bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] hover:opacity-90"
          >
            {loading ? "Guardando..." : editPhoto ? "Actualizar" : files.length > 1 ? `Subir ${files.length} Imágenes` : "Subir Imagen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}