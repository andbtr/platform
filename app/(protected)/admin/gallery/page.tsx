"use client"

import { useState, useRef } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { AdminHeader } from "@/components/admin/admin-header"
import { Image as ImageIcon, Upload, Loader2, CheckCircle, X, Circle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GalleryTable } from "@/components/admin/gallery-table"
import { PhotoModal } from "@/components/admin/photo-modal"
import { cn } from "@/lib/utils"

type PhotoItem = {
  id: string
  title: string
  image_url: string
  active: boolean
  created_at: string
}

type UploadStatus = "pending" | "uploading" | "success" | "error"

export default function GalleryPage() {
  const supabase = useSupabase()
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [editPhoto, setEditPhoto] = useState<PhotoItem | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [bulkFiles, setBulkFiles] = useState<File[]>([])
  const [bulkTitle, setBulkTitle] = useState("")
  const [uploadStatus, setUploadStatus] = useState<Map<string, UploadStatus>>(new Map())
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleOpenModal = (photo?: PhotoItem) => {
    setEditPhoto(photo || null)
    setIsPhotoModalOpen(true)
  }

  const handleSuccess = () => {
    setRefreshKey(k => k + 1)
  }

  const handleBulkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        return false
      }
      if (file.size > 3 * 1024 * 1024) {
        return false
      }
      return true
    })

    if (validFiles.length === 0) {
      setError("Los archivos seleccionados deben ser imágenes de máximo 3MB")
      return
    }

    setBulkFiles(validFiles)
    setError(null)
    setSuccess(null)
    
    const initialStatus = new Map<string, UploadStatus>()
    validFiles.forEach(f => initialStatus.set(f.name, "pending"))
    setUploadStatus(initialStatus)
    setProgress(0)
  }

  const handleBulkUpload = async () => {
    if (!supabase || bulkFiles.length === 0) return

    if (!bulkTitle.trim()) {
      setError("El título es requerido")
      return
    }

    setError(null)
    setSuccess(null)
    
    const status = new Map<string, UploadStatus>()
    bulkFiles.forEach(f => status.set(f.name, "uploading"))
    setUploadStatus(status)

    let uploaded = 0
    const errors: string[] = []

    for (let i = 0; i < bulkFiles.length; i++) {
      const file = bulkFiles[i]
      
      try {
        status.set(file.name, "uploading")
        setUploadStatus(new Map(status))

        const filePath = `gallery/${crypto.randomUUID()}-${file.name}`
        
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, file)

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filePath)

        const { error: dbError } = await supabase.from("photos").insert({
          title: bulkTitle,
          image_url: publicUrl,
          active: true,
        })

        if (dbError) {
          throw new Error(dbError.message)
        }

        status.set(file.name, "success")
        uploaded++
      } catch (err: any) {
        status.set(file.name, "error")
        errors.push(`${file.name}: ${err.message}`)
      }

      setProgress(Math.round(((i + 1) / bulkFiles.length) * 100))
      setUploadStatus(new Map(status))
    }

    if (uploaded === bulkFiles.length) {
      setSuccess(`¡${uploaded} imágenes subidas con éxito!`)
      setBulkFiles([])
      setBulkTitle("")
      handleSuccess()
      setTimeout(() => {
        setIsBulkModalOpen(false)
      }, 1500)
    } else if (uploaded > 0) {
      setError(`Se subieron ${uploaded} de ${bulkFiles.length} imágenes. Errores: ${errors.join(", ")}`)
    } else {
      setError(`Error al subir las imágenes: ${errors.join(", ")}`)
    }
  }

  const clearBulkFiles = () => {
    setBulkFiles([])
    setBulkTitle("")
    setUploadStatus(new Map())
    setProgress(0)
    setError(null)
    setSuccess(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <div className="relative z-20">
        <AdminHeader activeSection="galeria" />
      </div>

      <div className="pt-16 md:pt-20 min-h-screen bg-background">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a1628] to-background" />
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full" />
        </div>

        <main className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-accent/20">
              <ImageIcon className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-gold-gradient">
                Galería de Imágenes
              </h1>
              <p className="text-white/60">Gestiona las imágenes de la plataforma</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsBulkModalOpen(true)}
                className="border-primary/30"
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir Múltiples
              </Button>
              <Button onClick={() => handleOpenModal()} className="bg-accent hover:bg-accent/80">
                <ImageIcon className="w-4 h-4 mr-2" />
                Nueva Imagen
              </Button>
            </div>
          </div>

          <GalleryTable 
            onOpenModal={handleOpenModal}
            refreshKey={refreshKey}
          />
        </main>
      </div>

      <PhotoModal 
        isOpen={isPhotoModalOpen}
        setIsOpen={setIsPhotoModalOpen}
        editPhoto={editPhoto}
        onSuccess={handleSuccess}
      />

      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBulkModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg mx-4 bg-[#0a1628] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gold-gradient">
                Subir Múltiples Imágenes
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsBulkModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#C5A059] mb-2">
                  Título <span className="text-white/40">(se aplicará a todas las imágenes)</span>
                </label>
                <Input
                  value={bulkTitle}
                  onChange={(e) => setBulkTitle(e.target.value)}
                  placeholder="Ej: Procesión 2026, Ensayo general, etc..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C5A059] mb-2">
                  Seleccionar Imágenes
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBulkFileSelect}
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#4FB8C4]/50 hover:bg-white/5 transition-all"
                >
                  <Upload className="h-8 w-8 text-white/30 mb-2" />
                  <p className="text-sm text-white/60">
                    <span className="text-[#4FB8C4]">Click para seleccionar</span> o arrastra archivos
                  </p>
                  <p className="text-xs text-white/40 mt-1">Múltiples archivos, máx 3MB cada uno</p>
                </div>
              </div>

              {bulkFiles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-white/60">{bulkFiles.length} archivos seleccionados</p>
                    <Button variant="ghost" size="sm" onClick={clearBulkFiles} className="text-white/60 hover:text-white">
                      Limpiar
                    </Button>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {bulkFiles.map((file, idx) => {
                      const status = uploadStatus.get(file.name)
                      return (
                        <div key={idx} className="flex items-center gap-2 text-sm text-white/80 p-2 rounded bg-white/5">
                          {status === "uploading" && <Loader2 className="w-4 h-4 animate-spin text-[#4FB8C4]" />}
                          {status === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {status === "error" && <XCircle className="w-4 h-4 text-red-500" />}
                          {status === "pending" && <Circle className="w-4 h-4 text-white/30" />}
                          <span className="truncate flex-1">{file.name}</span>
                          <span className="text-xs text-white/40">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Progreso</span>
                    <span className="text-white">{progress}%</span>
                  </div>
                  <Progress value={progress} className="bg-white/10" />
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-[#4FB8C4]/10 border-[#4FB8C4]/30">
                  <AlertTitle className="text-[#4FB8C4]">Éxito</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsBulkModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleBulkUpload} 
                  disabled={!bulkTitle.trim() || bulkFiles.length === 0 || Array.from(uploadStatus.values()).some(s => s === "uploading")}
                  className="flex-1 bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E]"
                >
                  {Array.from(uploadStatus.values()).some(s => s === "uploading") ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Subir {bulkFiles.length} imágenes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}