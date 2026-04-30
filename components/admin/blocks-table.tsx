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
  Edit, Trash2, Plus, Search, Blocks 
} from "lucide-react"

type BlockItem = {
  id: string
  name: string
  total_price: number
  is_active: boolean
  created_at: string
  image_url?: string
}

type BlocksTableProps = {
  onOpenModal: (block?: BlockItem) => void
  refreshKey: number
}

export function BlocksTable({ onOpenModal, refreshKey }: BlocksTableProps) {
  const {supabase} = useSupabase()
  const [blocks, setBlocks] = useState<BlockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchBlocks()
  }, [supabase, refreshKey])

  const fetchBlocks = async () => {
    if (!supabase) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from("blocks")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setBlocks(data)
    }
    setLoading(false)
  }

  const handleToggleActive = async (item: BlockItem) => {
    if (!supabase) return

    const { error } = await supabase
      .from("blocks")
      .update({ is_active: !item.is_active })
      .eq("id", item.id)

    if (!error) {
      setBlocks(blocks.map(b => 
        b.id === item.id ? { ...b, is_active: !b.is_active } : b
      ))
    }
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (!confirm("¿Estás seguro de que deseas eliminar este bloque?")) return

    const { error } = await supabase
      .from("blocks")
      .delete()
      .eq("id", id)

    if (!error) {
      setBlocks(blocks.filter(b => b.id !== id))
    }
  }

  const filteredBlocks = blocks.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Buscar bloques..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onOpenModal()} className="bg-accent hover:bg-accent/80">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Bloque
          </Button>
        </div>
      </div>

      {filteredBlocks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Blocks className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay bloques para mostrar</p>
          <Button 
            variant="link" 
            onClick={() => onOpenModal()}
            className="text-accent"
          >
            Crear primer bloque
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead>Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Precio Total</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlocks.map((item) => (
                <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                        <Blocks className="w-6 h-6 text-white/30" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-white">{item.name}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="font-medium">S/ {item.total_price.toFixed(2)}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => handleToggleActive(item)}
                      />
                      <span className={`text-xs ${item.is_active ? "text-green-400" : "text-red-400"}`}>
                        {item.is_active ? "Activo" : "Inactivo"}
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