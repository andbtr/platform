"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Terminal } from "lucide-react"

type BlockItem = {
  id: string
  name: string
  total_price: number
  is_active: boolean
  created_at: string
  image_url?: string
}

type BlocksModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  editBlock?: BlockItem | null
  onSuccess: () => void
}

export function BlocksModal({ isOpen, setIsOpen, editBlock, onSuccess }: BlocksModalProps) {
  const {supabase} = useSupabase()
  const [name, setName] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (editBlock) {
      setName(editBlock.name)
      setTotalPrice(editBlock.total_price)
      setIsActive(editBlock.is_active)
      setPreviewUrl(editBlock.image_url || null)
      setFile(null)
    } else {
      setName("")
      setTotalPrice(0)
      setIsActive(true)
      setFile(null)
      setPreviewUrl(null)
    }
  }, [editBlock, isOpen])

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
    if (editBlock?.image_url) {
      setPreviewUrl(editBlock.image_url)
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

    if (!name.trim()) {
      setError("El nombre del bloque es requerido.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      let imageUrl = previewUrl || null

      if (file) {
        const filePath = `blocks/${crypto.randomUUID()}`
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, file)

        if (uploadError) {
          throw new Error(`Error al subir la imagen: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filePath)
        imageUrl = publicUrl
      }

      if (editBlock && file && editBlock.image_url) {
        const oldPath = editBlock.image_url.split('/').pop()
        if (oldPath) {
          await supabase.storage.from("photos").remove([`blocks/${oldPath}`])
        }
      }

      if (editBlock) {
        const updateData: any = { name, total_price: totalPrice, is_active: isActive }
        if (imageUrl) {
          updateData.image_url = imageUrl
        }

        const { error: dbError } = await supabase
          .from("blocks")
          .update(updateData)
          .eq("id", editBlock.id)

        if (dbError) throw new Error(`Error al actualizar: ${dbError.message}`)
        setSuccess("Bloque actualizado!")
      } else {
        const { error: dbError } = await supabase
          .from("blocks")
          .insert({ name, total_price: totalPrice, is_active: isActive, image_url: imageUrl })

        if (dbError) throw new Error(`Error al guardar: ${dbError.message}`)
        setSuccess("Bloque creado!")
        setName("")
        setTotalPrice(0)
        setIsActive(true)
        setFile(null)
        setPreviewUrl(null)
      }

      onSuccess()

      setTimeout(() => {
        setIsOpen(false)
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
    setError(null)
    setSuccess(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-[#0a1628] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gold-gradient">
            {editBlock ? "Editar Bloque" : "Crear Nuevo Bloque"}
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
            <Label htmlFor="name" className="text-[#C5A059] text-sm font-medium mb-2">
              Nombre del Bloque
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
              placeholder="Nombre del bloque..."
            />
          </div>

          <div>
            <Label className="text-[#C5A059] text-sm font-medium mb-2">
              Imagen del Bloque
            </Label>
            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <label className="bg-[#4FB8C4]/80 text-white rounded-full p-1 hover:bg-[#4FB8C4] transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveCurrentImage}
                    disabled={loading}
                    className="bg-red-500/80 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-[#4FB8C4]/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-white/60 text-sm">Haz clic para subir una imagen</p>
                <p className="text-white/40 text-xs mt-1">Máximo 3MB</p>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="totalPrice" className="text-[#C5A059] text-sm font-medium mb-2">
              Precio Total (S/)
            </Label>
            <Input
              id="totalPrice"
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(parseFloat(e.target.value) || 0)}
              disabled={loading}
              min={0}
              step={0.01}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
              <Label htmlFor="isActive" className="text-white font-medium">Activo</Label>
              <p className="text-white/50 text-xs mt-1">Visible para usuarios</p>
            </div>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={loading} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] hover:opacity-90"
          >
            {loading ? "Guardando..." : editBlock ? "Actualizar" : "Crear Bloque"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}