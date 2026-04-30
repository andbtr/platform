"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { BranchesTable } from "@/components/admin/branches-table"
import { BranchesModal } from "@/components/admin/branches-modal"

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

export function AdminFilialesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editBranch, setEditBranch] = useState<BranchItem | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleOpenModal = (branch?: BranchItem) => {
    setEditBranch(branch || null)
    setIsModalOpen(true)
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
            <MapPin className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-gold-gradient">
              Gestión de Filiales
            </h1>
            <p className="text-white/60">Administra las filiales de la Morenada en diferentes ciudades</p>
          </div>
        </div>

        <BranchesTable 
          onOpenModal={handleOpenModal} 
          refreshKey={refreshKey}
        />

        <BranchesModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          editBranch={editBranch}
          onSuccess={handleSuccess}
        />
      </main>
    </div>
  )
}