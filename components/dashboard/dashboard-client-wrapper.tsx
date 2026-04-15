"use client"

import { useDashboardState } from "@/hooks/use-dashboard-state"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { PaymentHistory } from "@/components/dashboard/payment-history"
import { PaymentInfo } from "@/components/dashboard/payment-info"
import dynamic from "next/dynamic"

const NewPaymentModal = dynamic(() => import("@/components/dashboard/new-payment-modal").then(mod => mod.NewPaymentModal))

export function DashboardClientWrapper({ initialSocio, initialPayments, user }: { initialSocio: any, initialPayments: any[], user: any }) {
  const {
    socio,
    saldoPendiente,
    progresoPago,
    payments,
    paymentsLoading,
    paymentsError,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    voucherFile,
    setVoucherFile,
    voucherPreview,
    setVoucherPreview,
    isDragging,
    setIsDragging,
    paymentSubmitted,
    handleFileChange,
    handleDrop,
    handleSubmitPayment
  } = useDashboardState({ initialSocio, initialPayments })

  return (
    <>
      <main className="relative z-10 container mx-auto px-4 py-6 pb-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-muted-foreground text-sm">Bienvenido,</p>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            {socio.nombre || user?.email || 'Usuario'}
          </h1>
          <p className="text-primary text-sm mt-1">
            Bloque: {socio.bloque || '—'} | DNI: {socio.dni || '—'}
          </p>
        </div>

        <DashboardStats 
          socio={socio} 
          saldoPendiente={saldoPendiente} 
          progresoPago={progresoPago} 
        />

        <PaymentHistory 
          payments={payments} 
          paymentsLoading={paymentsLoading} 
          paymentsError={paymentsError} 
        />

        <PaymentInfo />
      </main>

      <NewPaymentModal 
        isOpen={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        paymentSubmitted={paymentSubmitted}
        voucherPreview={voucherPreview}
        voucherFile={voucherFile}
        isDragging={isDragging}
        onDragOver={(e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onFileChange={handleFileChange}
        onClearVoucher={() => { setVoucherFile(null); setVoucherPreview(null) }}
        onSubmit={handleSubmitPayment}
      />
    </>
  )
}
