"use client"

import { useState } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, UploadCloud } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NewsUploadPage() {
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

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
  }

  const resetForm = () => {
    setFile(null)
    setTitle("")
    setContent("")
    setLink("")
    setPriority(1)
    setType("general")
    setActive(true)
    setUploadedImageUrl(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError("Por favor, selecciona una imagen para la noticia.")
      return
    }
    if (!supabase) {
      setError("Supabase client is not available.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    setUploadedImageUrl(null)

    const filePath = `news/${crypto.randomUUID()}`

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, file)

    if (uploadError) {
      setError(`Error al subir la imagen: ${uploadError.message}`)
      setLoading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filePath)

    if (!publicUrl) {
      setError("No se pudo obtener la URL pública de la imagen.")
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase.from("news").insert({
      title,
      content,
      image_url: publicUrl,
      link,
      priority,
      active,
      type,
    })

    if (dbError) {
      setError(`Error al guardar la noticia: ${dbError.message}`)
      setLoading(false)
      return
    }

    setSuccess("¡Noticia creada con éxito!")
    setUploadedImageUrl(publicUrl)
    resetForm()
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Crear Nueva Noticia</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} required />
              </div>
              <div>
                <Label htmlFor="content">Contenido</Label>
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} disabled={loading} required rows={8} />
              </div>
              <div>
                <Label htmlFor="link">Enlace (Opcional)</Label>
                <Input id="link" type="url" value={link} onChange={(e) => setLink(e.target.value)} disabled={loading} placeholder="https://ejemplo.com" />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Label>Imagen de Portada (max 3MB)</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm">
                      <Label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                        <span>Sube un archivo</span>
                        <Input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} disabled={loading} />
                      </Label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs">{file ? file.name : "PNG, JPG, GIF hasta 3MB"}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Input id="priority" type="number" value={priority} onChange={(e) => setPriority(parseInt(e.target.value, 10))} disabled={loading} />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Input id="type" value={type} onChange={(e) => setType(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Switch id="active" checked={active} onCheckedChange={setActive} disabled={loading} />
                <Label htmlFor="active">Publicar al crear</Label>
              </div>
            </div>
          </div>

          {error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          {success && <Alert><Terminal className="h-4 w-4" /><AlertTitle>Éxito</AlertTitle><AlertDescription>{success}</AlertDescription></Alert>}
          
          {uploadedImageUrl && (
            <div className="mt-4 p-4 border rounded-lg bg-secondary/50">
              <h3 className="text-lg font-semibold mb-2">Noticia Creada:</h3>
              <div className="flex items-start gap-4">
                <Image src={uploadedImageUrl} alt={title} width={150} height={100} className="rounded-md object-cover" />
                <div>
                  <h4 className="font-bold">{title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{content}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" disabled={loading || !file} className="w-full">
              {loading ? "Creando Noticia..." : "Crear Noticia"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
