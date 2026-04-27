import { Check, Clock } from "lucide-react"

interface PaymentHistoryProps {
  payments: any[]
  paymentsLoading: boolean
  paymentsError: string | null
}

export function PaymentHistory({ payments, paymentsLoading, paymentsError }: PaymentHistoryProps) {
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
            const isApproved = rawStatus === 'aprobado' || rawStatus === 'approved' || p.approved === true
            const status = isApproved ? 'aprobado' : 'pendiente'
            const concept = p.concept || p.concepto || p.description || 'Pago'
            
            return (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    status === 'aprobado' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                  }`}>
                    {status === 'aprobado' ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{concept}</p>
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
    </div>
  )
}
