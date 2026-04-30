"use client"

import { useState } from "react"
import { Blocks } from "lucide-react"
import { BlocksTable } from "@/components/admin/blocks-table"
import { BlocksModal } from "@/components/admin/blocks-modal"

type BlockItem = {
  id: string
  name: string
  total_price: number
  is_active: boolean
  created_at: string
}

type AdminBlocksClientProps = {
  initialBlocks: BlockItem[]
}

export function AdminBlocksClient({ initialBlocks }: AdminBlocksClientProps) {
  const [blocks] = useState<BlockItem[]>(initialBlocks)
  const [isBlocksModalOpen, setIsBlocksModalOpen] = useState(false)
  const [editBlock, setEditBlock] = useState<BlockItem | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleOpenModal = (item?: BlockItem) => {
    setEditBlock(item || null)
    setIsBlocksModalOpen(true)
  }

  const handleSuccess = () => {
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a1628] to-background" />
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-accent/20">
            <Blocks className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-gold-gradient">
              Gestión de Bloques
            </h1>
            <p className="text-white/60">Crea, edita y gestiona los bloques de la plataforma</p>
          </div>
        </div>

        <BlocksTable 
          onOpenModal={handleOpenModal}
          refreshKey={refreshKey}
        />
      </main>

      <BlocksModal 
        isOpen={isBlocksModalOpen}
        setIsOpen={setIsBlocksModalOpen}
        editBlock={editBlock}
        onSuccess={handleSuccess}
      />
    </div>
  )
}