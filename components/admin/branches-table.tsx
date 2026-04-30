"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  Edit, Trash2, Plus, Search, MapPin
} from "lucide-react"

type BranchItem = {
  id: string
  city: string
  name: string | null
  location: string | null
  phone: string | null
  social_url: string | null
  is_active: boolean
  created_at: string
}

type BranchesTableProps = {
  onOpenModal: (branch?: BranchItem) => void
  refreshKey: number
}

export function BranchesTable({ onOpenModal, refreshKey }: BranchesTableProps) {
  const {supabase} = useSupabase()
  const [branches, setBranches] = useState<BranchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchBranches()
  }, [supabase, refreshKey])

  const fetchBranches = async () => {
    if (!supabase) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setBranches(data)
    }
    setLoading(false)
  }

  const handleToggleActive = async (item: BranchItem) => {
    if (!supabase) return

    const { error } = await supabase
      .from("branches")
      .update({ is_active: !item.is_active })
      .eq("id", item.id)

    if (!error) {
      setBranches(branches.map(b => 
        b.id === item.id ? { ...b, is_active: !b.is_active } : b
      ))
    }
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (!confirm("¿Estás seguro de que deseas eliminar esta filial?")) return

    const { error } = await supabase
      .from("branches")
      .delete()
      .eq("id", id)

    if (!error) {
      setBranches(branches.filter(b => b.id !== id))
    }
  }

  const filteredBranches = branches.filter(item => 
    item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar filiales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onOpenModal()} className="bg-accent hover:bg-accent/80">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Filial
          </Button>
        </div>
      </div>

      {filteredBranches.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay filiales para mostrar</p>
          <Button 
            variant="link" 
            onClick={() => onOpenModal()}
            className="text-accent"
          >
            Crear primera filial
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead>Ciudad</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.map((item) => (
                <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <p className="font-medium text-white">{item.city}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-white/70">{item.name || "-"}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-white/70">{item.location || "-"}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-white/70">{item.phone || "-"}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => handleToggleActive(item)}
                      />
                      <span className={`text-xs ${item.is_active ? "text-green-400" : "text-red-400"}`}>
                        {item.is_active ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenModal(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}