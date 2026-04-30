"use client"

import { Clock, Users, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useAdminState } from "@/hooks/use-admin-state"
import { AdminStats } from "@/components/admin/admin-stats"
import dynamic from "next/dynamic"

const PaymentsTable = dynamic(() => import("@/components/admin/payments-table").then(mod => mod.PaymentsTable))
const SociosTable = dynamic(() => import("@/components/admin/socios-table").then(mod => mod.SociosTable))
const PaymentProofModal = dynamic(() => import("@/components/admin/payment-proof-modal").then(mod => mod.PaymentProofModal))

type AdminClientWrapperProps = {
  initialPayments: any[]
  initialTotalCount: number | null
  initialSocios: any[]
}

export function AdminClientWrapper({ initialPayments, initialTotalCount, initialSocios }: AdminClientWrapperProps) {
  const {
    searchTerm,
    selectedBloque,
    setSelectedBloque,
    selectedStatus,
    selectedPago,
    isPaymentProofModalOpen,
    setIsPaymentProofModalOpen,
    pagosPendientes,
    loadingPagos,
    page,
    pageSize,
    totalCount,
    totalSocios,
    totalRecaudado,
    sociosAlDia,
    sociosAtrasados,
    filteredSocios,
    handleSearch,
    handleStatusChange,
    goToPage,
    handlePageSizeChange,
    handleAprobarPago,
    handleRechazarPago,
    openPaymentProofModal
  } = useAdminState({ initialPayments, initialTotalCount, initialSocios })
  
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a1628] to-background" />
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-accent/20">
              <Wallet className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-gold-gradient">
                Gestión de Pagos
              </h1>
              <p className="text-white/60">Administra los pagos de los socios</p>
            </div>
          </div>
          <AdminStats 
            totalSocios={totalSocios}
            totalRecaudado={totalRecaudado}
            sociosAlDia={sociosAlDia}
            sociosAtrasados={sociosAtrasados}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pagos" className="space-y-6">
          <TabsList className="glass-card p-1 w-full md:w-auto">
            <TabsTrigger value="pagos" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              Pagos Pendientes
              {pagosPendientes.length > 0 && (
                <Badge className="ml-2 bg-accent/20 text-accent">{pagosPendientes.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="socios" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Socios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pagos" className="space-y-4">
            <PaymentsTable 
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
              pageSize={pageSize}
              pagosPendientes={pagosPendientes}
              page={page}
              totalCount={totalCount}
              loadingPagos={loadingPagos}
              handleSearch={handleSearch}
              handleStatusChange={handleStatusChange}
              handlePageSizeChange={handlePageSizeChange}
              goToPage={goToPage}
              openPaymentProofModal={openPaymentProofModal}
              handleAprobarPago={handleAprobarPago}
              handleRechazarPago={handleRechazarPago}
            />
          </TabsContent>

          <TabsContent value="socios" className="space-y-4">
            <SociosTable 
              searchTerm={searchTerm}
              selectedBloque={selectedBloque}
              filteredSocios={filteredSocios}
              handleSearch={handleSearch}
              setSelectedBloque={setSelectedBloque}
            />
          </TabsContent>
        </Tabs>
      </main>

      <PaymentProofModal 
        isOpen={isPaymentProofModalOpen}
        setIsOpen={setIsPaymentProofModalOpen}
        selectedPago={selectedPago}
        handleAprobarPago={handleAprobarPago}
        handleRechazarPago={handleRechazarPago}
      />
    </div>
  )
}
