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

type BranchItem = {
  id: string
  city: string
  name: string
  location: string
  phone: string
  social_url: string | null
  is_active: boolean
  created_at: string
}

type BranchesModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  editBranch?: BranchItem | null
  onSuccess: () => void
}

export function BranchesModal({ isOpen, setIsOpen, editBranch, onSuccess }: BranchesModalProps) {
  const supabase = useSupabase()
  const [city, setCity] = useState("")
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [phone, setPhone] = useState("")
  const [socialUrl, setSocialUrl] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (editBranch) {
      setCity(editBranch.city)
      setName(editBranch.name)
      setLocation(editBranch.location)
      setPhone(editBranch.phone)
      setSocialUrl(editBranch.social_url || "")
      setIsActive(editBranch.is_active)
    } else {
      setCity("")
      setName("")
      setLocation("")
      setPhone("")
      setSocialUrl("")
      setIsActive(true)
    }
  }, [editBranch, isOpen])

  const handleSubmit = async () => {
    if (!supabase) {
      setError("Supabase client is not available.")
      return
    }

    if (!city.trim()) {
      setError("La ciudad es requerida.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (editBranch) {
        const { error: dbError } = await supabase
          .from("branches")
          .update({ 
            city, 
            name: name || null, 
            location: location || null, 
            phone: phone || null, 
            social_url: socialUrl || null,
            is_active: isActive 
          })
          .eq("id", editBranch.id)

        if (dbError) throw new Error(`Error al actualizar: ${dbError.message}`)
        setSuccess("Filial actualizada!")
      } else {
        const { error: dbError } = await supabase
          .from("branches")
          .insert({ 
            city, 
            name: name || null, 
            location: location || null, 
            phone: phone || null, 
            social_url: socialUrl || null,
            is_active: isActive 
          })

        if (dbError) throw new Error(`Error al guardar: ${dbError.message}`)
        setSuccess("Filial creada!")
        setCity("")
        setName("")
        setLocation("")
        setPhone("")
        setSocialUrl("")
        setIsActive(true)
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
            {editBranch ? "Editar Filial" : "Crear Nueva Filial"}
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
            <Label htmlFor="city" className="text-[#C5A059] text-sm font-medium mb-2">
              Ciudad *
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={loading}
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
              placeholder="Ej: Lima, Puno, Arequipa..."
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-[#C5A059] text-sm font-medium mb-2">
              Nombre de la Filial
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
              placeholder="Nombre descriptivo..."
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-[#C5A059] text-sm font-medium mb-2">
              Dirección / Ubicación
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
              placeholder="Dirección completa..."
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-[#C5A059] text-sm font-medium mb-2">
              Teléfono
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
              placeholder="+51 999 999 999"
            />
          </div>

          <div>
            <Label htmlFor="socialUrl" className="text-[#C5A059] text-sm font-medium mb-2">
              URL de Redes Sociales / Mapa
            </Label>
            <Input
              id="socialUrl"
              type="url"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              disabled={loading}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-[#4FB8C4] focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
              <Label htmlFor="isActive" className="text-white font-medium">Activa</Label>
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
            disabled={loading || !city.trim()}
            className="bg-gradient-to-r from-[#4FB8C4] to-[#1E6B7E] hover:opacity-90"
          >
            {loading ? "Guardando..." : editBranch ? "Actualizar" : "Crear Filial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}