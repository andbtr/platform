import { Check, Clock, Eye, X, Loader2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSupabase } from "@/components/providers/supabase-provider"

interface PaymentHistoryProps {
  payments: any[]
  paymentsLoading: boolean
  paymentsError: string | null
  onReportPaymentClick: () => void
}

export function PaymentHistory({ payments, paymentsLoading, paymentsError, onReportPaymentClick }: PaymentHistoryProps) {
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null)
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false)
  const { supabase } = useSupabase()

  const handleViewPaymentProof = async (path: string) => {
    if (!path || !supabase) return
    
    setIsGeneratingUrl(true)
    try {
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(path, 60)

      if (error) throw error
      if (data?.signedUrl) {
        setSelectedPaymentProof(data.signedUrl)
      }
    } catch (err) {
      console.error("Error generating signed URL:", err)
    } finally {
      setIsGeneratingUrl(false)
    }
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden mb-8">
      <div className="p-6 border-b border-primary/20 flex items-center justify-between gap-4 md:items-center">
        <h2 className="text-xl font-serif font-bold leading-none text-foreground">Historial de Pagos</h2>
        <Button
          type="button"
          onClick={onReportPaymentClick}
          className="hidden md:inline-flex h-10 items-center gap-2 self-center rounded-lg bg-emerald-500 px-4 font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.18)] ring-1 ring-emerald-300/10 hover:bg-emerald-400 hover:shadow-[0_12px_28px_rgba(16,185,129,0.24)]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Reportar Pago
        </Button>
      </div>
      <div className="divide-y divide-primary/10">
        {paymentsLoading ? (
          <div className="p-4">Cargando pagos...</div>
        ) : paymentsError ? (
          <div className="p-4 text-red-400">Error cargando pagos: {paymentsError}</div>
        ) : payments.length === 0 ? (
          <div className="p-4 text-muted-foreground">No hay pagos registrados.</div>
        ) : (
          payments.map((p: any) => {
            const date = new Date(p.created_at || p.fecha || p.date)
            const amount = p.amount_paid || p.amount || p.monto || p.total || 0
            const rawStatus = (p.status || p.estado || '').toLowerCase()
            const isApproved = rawStatus === 'approved' || p.approved === true
            const isRejected = rawStatus === 'rejected' || p.rejected === true
            const status = isRejected ? 'REJECTED' : (isApproved ? 'APPROVED' : 'PENDING')
            const concept = p.concept || p.concepto || p.description || 'Pago'
            const proofUrl = p.proof_url || p.voucher_url || p.voucher
            const adminNotes = p.admin_notes || p.adminNotes

            const getStatusIcon = (estado: string) => {
              switch (estado) {
                case 'APPROVED': return { icon: Check, bgColor: 'bg-green-500/20', iconColor: 'text-green-400' }
                case 'REJECTED': return { icon: X, bgColor: 'bg-red-500/20', iconColor: 'text-red-400' }
                case 'PENDING': default: return { icon: Clock, bgColor: 'bg-yellow-500/20', iconColor: 'text-yellow-400' }
              }
            }
            
            const getStatusBadge = (estado: string) => {
              switch (estado) {
                case 'APPROVED': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aprobado</Badge>
                case 'REJECTED': return <Badge variant="destructive">Rechazado</Badge>
                case 'PENDING': default: return <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">Pendiente</Badge>
              }
            }
            
            const statusInfo = getStatusIcon(status)
            const StatusIcon = statusInfo.icon

            return (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bgColor}`}>
                    <StatusIcon className={`w-5 h-5 ${statusInfo.iconColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{concept}</p>
                      {getStatusBadge(status)}
                      {proofUrl && (
                        <button
                          onClick={() => handleViewPaymentProof(proofUrl)}
                          disabled={isGeneratingUrl}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-md text-primary disabled:opacity-50"
                          title="Ver Comprobante"
                        >
                          {isGeneratingUrl ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {p.bank_account_name && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Titular: {p.bank_account_name}
                      </p>
                    )}
                    {status === 'REJECTED' && adminNotes && (
                      <p className="text-xs text-red-400 mt-0.5">
                        Motivo de rechazo: {adminNotes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-accent tracking-tight">S/ {amount}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Lightbox / Modal para el Comprobante */}
      {selectedPaymentProof && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedPaymentProof(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-bold"
              onClick={() => setSelectedPaymentProof(null)}
            >
              CERRAR <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedPaymentProof}
                alt="Comprobante de pago"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
