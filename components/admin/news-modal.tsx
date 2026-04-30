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

type NewsModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  editNews?: NewsItem | null
  onSuccess: () => void
}

export function NewsModal({ isOpen, setIsOpen, editNews, onSuccess }: NewsModalProps) {
  const supabase = useSupabase()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [link, setLink] = useState("")
  const [priority, setPriority] = useState(1)
  const [type, setType] = useState("general")
  const [active, setActive] = useState(true)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (editNews) {
      setTitle(editNews.title)
      setContent(editNews.content)
      setLink(editNews.link || "")
      setPriority(editNews.priority)
      setType(editNews.type)
      setActive(editNews.active)
      setPreviewUrl(editNews.image_url)
      setFile(null)
    } else {
      resetForm()
    }
  }, [editNews, isOpen])

  const resetForm = () => {
    setFile(null)
    setPreviewUrl(null)
    setTitle("")
    setContent("")
    setLink("")
    setPriority(1)
    setType("general")
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
    if (editNews?.image_url) {
      setPreviewUrl(editNews.image_url)
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

    if (!title || !content) {
      setError("El título y contenido son requeridos.")
      return
    }

    if (!editNews && !file && !previewUrl) {
      setError("Por favor, selecciona una imagen para la noticia.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    let imageUrl = previewUrl

    try {
      if (file) {
        const filePath = `news/${crypto.randomUUID()}`
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, file)

        if (uploadError) {
          throw new Error(`Error al subir la imagen: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filePath)
        imageUrl = publicUrl

        if (editNews?.image_url && editNews.image_url !== imageUrl) {
          const oldPath = editNews.image_url.split('/').pop()
          if (oldPath) {
            await supabase.storage.from("photos").remove([`news/${oldPath}`])
          }
        }
      }

      if (editNews && file && editNews.image_url) {
        const oldPath = editNews.image_url.split('/').pop()
        if (oldPath) {
          await supabase.storage.from("photos").remove([`news/${oldPath}`])
        }
      }

      if (editNews) {
        const { error: dbError } = await supabase.from("news").update({
          title,
          content,
          image_url: imageUrl,
          link: link || null,
          priority,
          type,
          active,
        }).eq("id", editNews.id)

        if (dbError) {
          throw new Error(`Error al actualizar la noticia: ${dbError.message}`)
        }

        setSuccess("¡Noticia actualizada con éxito!")
      } else {
        const { error: dbError } = await supabase.from("news").insert({
          title,
          content,
          image_url: imageUrl,
          link: link || null,
          priority,
          type,
          active,
        })

        if (dbError) {
          throw new Error(`Error al guardar la noticia: ${dbError.message}`)
        }

        setSuccess("¡Noticia creada con éxito!")
        resetForm()
      }

      onSuccess()
      
      setTimeout(() => {
        if (editNews) {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a1628] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gold-gradient">
            {editNews ? "Editar Noticia" : "Crear Nueva Noticia"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-[#C5A059] text-sm font-medium mb-2">
                  Título de la Noticia
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
                  placeholder="Escribe un título..."
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-[#C5A059] text-sm font-medium mb-2">
                  Contenido
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                  required
                  rows={4}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent resize-none"
                  placeholder="Contenido de la noticia..."
                />
              </div>

              <div>
                <Label htmlFor="link" className="text-[#C5A059] text-sm font-medium mb-2">
                  Enlace Externo <span className="text-white/40 font-normal">(Opcional)</span>
                </Label>
                <Input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  disabled={loading}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <Label htmlFor="active" className="text-white font-medium">Publicar</Label>
                  <p className="text-white/50 text-xs mt-1">Visible para usuarios</p>
                </div>
                <Switch id="active" checked={active} onCheckedChange={setActive} disabled={loading} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-[#C5A059] text-sm font-medium mb-2">Imagen de Portada</Label>
                
                {previewUrl ? (
                  <div className="relative group">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={300}
                      height={160}
                      className="w-full h-40 object-cover rounded-xl"
                    />
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
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#4FB8C4]/50 hover:bg-white/5 transition-all">
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <UploadCloud className="h-8 w-8 text-white/30 group-hover:text-[#4FB8C4] mb-2" />
                      <p className="text-sm text-white/60">
                        <span className="text-[#4FB8C4]">Sube un archivo</span>
                      </p>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority" className="text-[#C5A059] text-sm font-medium mb-2">
                    Prioridad
                  </Label>
                  <Input
                    id="priority"
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(parseInt(e.target.value, 10) || 1)}
                    disabled={loading}
                    min={1}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#4FB8C4]"
                  />
                </div>

                <div>
                  <Label htmlFor="type" className="text-[#C5A059] text-sm font-medium mb-2">
                    Tipo
                  </Label>
                  <Input
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={loading}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4]"
                    placeholder="general"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !title || !content}
            className="bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] hover:opacity-90"
          >
            {loading ? "Guardando..." : editNews ? "Actualizar" : "Crear Noticia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}