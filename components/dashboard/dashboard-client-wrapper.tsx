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
    paymentProofFile,
    setPaymentProofFile,
    paymentProofPreview,
    setPaymentProofPreview,
    isDragging,
    setIsDragging,
    paymentSubmitted,
    isSubmitting,
    submitError,
    amount,
    setAmount,
    concept,
    setConcept,
    additionalCode,
    setAdditionalCode,
    bankAccountName,
    setBankAccountName,
    paymentDate,
    setPaymentDate,
    cuotasTotalesCalculadas,
    nextInstallmentNumber,
    handleFileChange,
    handleDrop,
    handleSubmitPayment
  } = useDashboardState({ initialSocio, initialPayments, user })

  return (
    <>
      <main className="relative z-10 container mx-auto px-4 py-6 pb-24">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">Bienvenido,</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-1">
              {socio.nombre || user?.email || 'Usuario'}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3">
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl backdrop-blur-sm">
              <div className="p-1.5 bg-primary/20 rounded-lg">
                <svg className="w-4 h-4 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5L7 7l-2 2 8 8.5V22"/><path d="M7 7V2"/><path d="M17 7V2"/><path d="M11 7V2"/><path d="M22 7H2"/><path d="M22 17H19"/></svg>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none mb-1">Bloque</p>
                <p className="text-sm font-bold text-foreground leading-none">{socio.bloque || '—'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 rounded-xl backdrop-blur-sm">
              <div className="p-1.5 bg-accent/20 rounded-lg">
                <svg className="w-4 h-4 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none mb-1">DNI / Documento</p>
                <p className="text-sm font-bold text-foreground leading-none">{socio.dni || '—'}</p>
              </div>
            </div>
          </div>
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
      </main>

      <NewPaymentModal 
        isOpen={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        paymentSubmitted={paymentSubmitted}
        paymentProofPreview={paymentProofPreview}
        paymentProofFile={paymentProofFile}
        isDragging={isDragging}
        onDragOver={(e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onFileChange={handleFileChange}
        onClearPaymentProof={() => { setPaymentProofFile(null); setPaymentProofPreview(null) }}
        onSubmit={handleSubmitPayment}
        isSubmitting={isSubmitting}
        submitError={submitError}
        amount={amount}
        setAmount={setAmount}
        concept={concept}
        setConcept={setConcept}
        additionalCode={additionalCode}
        setAdditionalCode={setAdditionalCode}
        bankAccountName={bankAccountName}
        setBankAccountName={setBankAccountName}
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        cuotasTotalesCalculadas={cuotasTotalesCalculadas}
        nextInstallmentNumber={nextInstallmentNumber}
      />
    </>
  )
}
