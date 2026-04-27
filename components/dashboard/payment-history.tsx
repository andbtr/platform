import { Check, Clock, Eye, X, Loader2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useSupabaseConfig } from "@/components/providers/supabase-provider"
import { createSupabaseClient } from "@/lib/supabase"

interface PaymentHistoryProps {
  payments: any[]
  paymentsLoading: boolean
  paymentsError: string | null
}

export function PaymentHistory({ payments, paymentsLoading, paymentsError }: PaymentHistoryProps) {
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null)
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false)
  const { supabaseUrl, supabaseAnonKey } = useSupabaseConfig()

  const handleViewPaymentProof = async (path: string) => {
    if (!path || !supabaseUrl || !supabaseAnonKey) return
    
    setIsGeneratingUrl(true)
    try {
      const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
      
      // La política requiere que el usuario esté autenticado para ver su carpeta
      // Generamos una URL firmada de corta duración (60 segundos)
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
      <div className="p-6 border-b border-primary/20">
        <h2 className="text-xl font-serif font-bold text-foreground">Historial de Pagos</h2>
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
            const isApproved = rawStatus === 'APPROVED' || rawStatus === 'approved' || p.approved === true
            const isRejected = rawStatus === 'REJECTED' || rawStatus === 'rejected' || p.rejected === true
            const status = isRejected ? 'REJECTED' : (isApproved ? 'APPROVED' : 'PENDING')
            const concept = p.concept || p.concepto || p.description || 'Pago'
            const proofUrl = p.proof_url || p.voucher_url || p.voucher
            
            // Función para obtener el icono y color según el estado (igual que en admin)
            const getStatusIcon = (estado: string) => {
              switch (estado) {
                case 'APPROVED':
                case 'approved':
                  return { icon: Check, bgColor: 'bg-green-500/20', iconColor: 'text-green-400' }
                case 'REJECTED':
                case 'rejected':
                  return { icon: X, bgColor: 'bg-red-500/20', iconColor: 'text-red-400' }
                case 'PENDING':
                case 'pending':
                default:
                  return { icon: Clock, bgColor: 'bg-yellow-500/20', iconColor: 'text-yellow-400' }
              }
            }
            
            // Función para obtener el badge del estado (igual que en admin)
            const getStatusBadge = (estado: string) => {
              switch (estado) {
                case 'APPROVED':
                case 'approved':
                  return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aprobado</Badge>
                case 'REJECTED':
                case 'rejected':
                  return <Badge variant="destructive">Rechazado</Badge>
                case 'PENDING':
                case 'pending':
                default:
                  return <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">Pendiente</Badge>
              }
            }
            
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
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">S/ {amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    status === 'aprobado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {status === 'aprobado' ? 'Aprobado' : 'Pendiente'}
                  </span>
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
