"use client"

import { useState, useEffect } from "react"
import { useDashboardState } from "@/hooks/use-dashboard-state"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { PaymentHistory } from "@/components/dashboard/payment-history"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"

const NewPaymentModal = dynamic(() => import("@/components/dashboard/new-payment-modal").then(mod => mod.NewPaymentModal))

export function DashboardClientWrapper({ initialSocio, initialPayments, user }: { initialSocio: any, initialPayments: any[], user: any }) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
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
    submitAttempted,
    amount,
    setAmount,
    concept,
    setConcept,
    additionalCode,
    setAdditionalCode,
    bankAccountName,
    setBankAccountName,
    paymentMethod,
    setPaymentMethod,
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
              {socio.nombre || 'Usuario'}
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

        {/* Two Column Layout: Bank Info Sidebar + Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Bank Accounts (Sidebar) */}
          <div className="md:col-span-1">
            <div className="glass-card p-6 rounded-2xl border border-primary/20 sticky top-24">
              <h3 className="text-xl font-serif font-bold text-foreground mb-4">Cuentas para Depósito</h3>
              <div className="p-4 bg-white rounded-xl mb-4">
                <Image
                  src="/images/yape-qr.png"
                  alt="QR Yape"
                  width={300}
                  height={300}
                  className="w-full h-auto mb-3"
                />
              </div>
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = '/images/yape-qr.png'
                  link.download = 'yape-qr.png'
                  link.click()
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/80 transition-colors mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3v10a3 3 0 003-3v-1M8 20V4a2 2 0 012-2h4a2 2 0 012 2v16M12 12v9" />
                </svg>
                Descargar QR
              </button>
              <div className="space-y-3">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Entidad Financiera</p>
                  <p className="font-bold text-lg">BCP - Banco de Crédito del Perú</p>
                </div>
                <div 
                  className="p-4 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors flex items-center justify-between"
                  onClick={() => { 
                    navigator.clipboard.writeText('123456789123456')
                    setCopiedField('cuenta')
                    setTimeout(() => setCopiedField(null), 2000)
                  }}
                >
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Cuenta Ahorros</p>
                    <p className="font-bold text-lg">123456789123456</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {copiedField === 'cuenta' ? (
                      <span className="text-green-400 font-bold flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copiado
                      </span>
                    ) : (
                      <span className="text-primary font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar
                      </span>
                    )}
                  </div>
                </div>
                <div 
                  className="p-4 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors flex items-center justify-between"
                  onClick={() => { 
                    navigator.clipboard.writeText('00212300456789010123')
                    setCopiedField('cci')
                    setTimeout(() => setCopiedField(null), 2000)
                  }}
                >
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">CCI</p>
                    <p className="font-bold text-lg">00212300456789010123</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {copiedField === 'cci' ? (
                      <span className="text-green-400 font-bold flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copiado
                      </span>
                    ) : (
                      <span className="text-primary font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Titular</p>
                  <p className="font-bold text-lg">Morenada Huajsapata</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-400">Realiza tu transferencia</p>
                    <p className="text-xs text-muted-foreground">Guarda el comprobante para reportarlo después</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats + Payment History */}
          <div className="md:col-span-2">
<DashboardStats
              socio={socio} 
              saldoPendiente={saldoPendiente} 
              progresoPago={progresoPago} 
            />

            <PaymentHistory
              payments={payments} 
              paymentsLoading={paymentsLoading} 
              paymentsError={paymentsError} 
              onReportPaymentClick={() => setIsPaymentModalOpen(true)}
            />
          </div>
        </div>
      </main>

      <div className="fixed bottom-4 left-1/2 z-30 w-auto -translate-x-1/2 px-4 md:hidden">
        <Button
          type="button"
          onClick={() => setIsPaymentModalOpen(true)}
          className="inline-flex h-14 min-w-[220px] items-center justify-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500 px-6 text-base font-semibold text-white shadow-[0_18px_40px_rgba(16,185,129,0.35)] backdrop-blur-md hover:bg-emerald-400"
        >
          <Upload className="h-5 w-5" />
          Reportar Pago
        </Button>
      </div>

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
        submitAttempted={submitAttempted}
        amount={amount}
        setAmount={setAmount}
        concept={concept}
        setConcept={setConcept}
        additionalCode={additionalCode}
        setAdditionalCode={setAdditionalCode}
        bankAccountName={bankAccountName}
        setBankAccountName={setBankAccountName}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        cuotasTotalesCalculadas={cuotasTotalesCalculadas}
        nextInstallmentNumber={nextInstallmentNumber}
      />
    </>
  )
}
