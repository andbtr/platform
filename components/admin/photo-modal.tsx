"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Terminal, UploadCloud, X } from "lucide-react"
import Image from "next/image"

type PhotoItem = {
  id: string
  title: string
  description: string | null
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
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [active, setActive] = useState(true)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (editPhoto) {
      setTitle(editPhoto.title)
      setDescription(editPhoto.description || "")
      setActive(editPhoto.active)
      setPreviewUrl(editPhoto.image_url)
      setFile(null)
    } else {
      resetForm()
    }
  }, [editPhoto, isOpen])

  const resetForm = () => {
    setFile(null)
    setPreviewUrl(null)
    setTitle("")
    setDescription("")
    setActive(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.")
      return
    }
    if (selectedFile.size > 3 * 1024 * 1024) {
      setError("La imagen no debe pesar más de 3MB.")
      return
    }

    setFile(selectedFile)
    setError(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
    if (editPhoto?.image_url) {
      setPreviewUrl(editPhoto.image_url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleRemoveCurrentImage = () => {
    setFile(null)
    setPreviewUrl(null)
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

    if (!editPhoto && !file && !previewUrl) {
      setError("Por favor, selecciona una imagen.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    let imageUrl = previewUrl

    try {
      if (file) {
        const filePath = `gallery/${crypto.randomUUID()}`
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, file)

        if (uploadError) {
          throw new Error(`Error al subir la imagen: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filePath)
        imageUrl = publicUrl

        if (editPhoto?.image_url && editPhoto.image_url !== imageUrl) {
          const oldPath = editPhoto.image_url.split('/').pop()
          if (oldPath) {
            await supabase.storage.from("photos").remove([`gallery/${oldPath}`])
          }
        }
      }

      if (editPhoto && file && editPhoto.image_url) {
        const oldPath = editPhoto.image_url.split('/').pop()
        if (oldPath) {
          await supabase.storage.from("photos").remove([`gallery/${oldPath}`])
        }
      }

      if (editPhoto) {
        const { error: dbError } = await supabase.from("photos").update({
          title,
          description: description || null,
          image_url: imageUrl,
          active,
        }).eq("id", editPhoto.id)

        if (dbError) {
          throw new Error(`Error al actualizar la imagen: ${dbError.message}`)
        }

        setSuccess("¡Imagen actualizada con éxito!")
      } else {
        const { error: dbError } = await supabase.from("photos").insert({
          title,
          description: description || null,
          image_url: imageUrl,
          active,
        })

        if (dbError) {
          throw new Error(`Error al guardar la imagen: ${dbError.message}`)
        }

        setSuccess("¡Imagen subida con éxito!")
        resetForm()
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

          <div>
            <Label className="text-[#C5A059] text-sm font-medium mb-2">Imagen</Label>
            
            {previewUrl ? (
              <div className="relative group">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <label className="bg-[#4FB8C4]/80 text-white rounded-full p-1.5 hover:bg-[#4FB8C4] transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveCurrentImage}
                    className="p-1.5 bg-destructive/80 hover:bg-destructive rounded-full"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#4FB8C4]/50 hover:bg-white/5 transition-all">
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <UploadCloud className="h-10 w-10 text-white/30 mb-2" />
                  <p className="text-sm text-white/60">
                    <span className="text-[#4FB8C4]">Sube un archivo</span>
                  </p>
                  <p className="text-xs text-white/40 mt-1">PNG, JPG hasta 3MB</p>
                </div>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </label>
            )}
          </div>

          <div>
            <Label htmlFor="title" className="text-[#C5A059] text-sm font-medium mb-2">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
              placeholder="Título de la imagen..."
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#C5A059] text-sm font-medium mb-2">
              Descripción <span className="text-white/40">(Opcional)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent resize-none"
              placeholder="Descripción de la imagen..."
            />
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
            {loading ? "Guardando..." : editPhoto ? "Actualizar" : "Subir Imagen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}