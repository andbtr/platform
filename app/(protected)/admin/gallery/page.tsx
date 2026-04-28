"use client"

import { useState } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import Image from "next/image"

export default function GalleryUploadPage() {
  const supabase = useSupabase()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError("Por favor, selecciona una imagen.")
      return
    }

    if (!supabase) {
      setError("Supabase client is not available.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)
    setUploadedImageUrl(null)

    const filePath = `gallery/${crypto.randomUUID()}`

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      setError(`Error al subir la imagen: ${uploadError.message}`)
      setLoading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(filePath)

    if (!publicUrl) {
      setError("No se pudo obtener la URL pública de la imagen.")
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase.from("photos").insert({
      image_url: publicUrl,
      title,
      description,
      active: true,
    })

    if (dbError) {
      setError(`Error al guardar en la base de datos: ${dbError.message}`)
      setLoading(false)
      return
    }

    setSuccess("¡Imagen subida y guardada con éxito!")
    setUploadedImageUrl(publicUrl)
    setFile(null)
    setTitle("")
    setDescription("")
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Subir a Galería</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Imagen (max 3MB)
          </label>
          <Input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            disabled={loading}
          />
        </div>

        {loading && (
          <div className="space-y-2">
            <p className="text-sm text-center">Subiendo... {uploadProgress}%</p>
            <Progress value={uploadProgress} />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Éxito</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {uploadedImageUrl && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Vista Previa:</h3>
            <Image
              src={uploadedImageUrl}
              alt="Vista previa de la imagen subida"
              width={500}
              height={300}
              className="rounded-md object-cover"
            />
          </div>
        )}

        <Button type="submit" disabled={loading || !file} className="w-full">
          {loading ? "Subiendo..." : "Subir Imagen"}
        </Button>
      </form>
    </div>
  )
}
