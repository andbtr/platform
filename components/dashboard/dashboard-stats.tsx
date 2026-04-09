import { Wallet, CreditCard, TrendingUp, Calendar, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DashboardStatsProps {
  socio: any
  saldoPendiente: number
  progresoPago: number
}

export function DashboardStats({ socio, saldoPendiente, progresoPago }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Monto Total Pagado */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-green-400" />
          </div>
          <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
            {socio.cuotasPagadas || 0}/{socio.cuotasTotales || 0} cuotas
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-1">Total Pagado</p>
        <p className="text-3xl font-bold text-foreground">S/ {socio.montoPagado || 0}</p>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progreso</span>
            <span>{progresoPago.toFixed(0)}%</span>
          </div>
          <Progress value={progresoPago} className="h-2" />
        </div>
      </div>

      {/* Saldo Pendiente */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-accent" />
          </div>
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm mb-1">Saldo Pendiente</p>
        <p className="text-3xl font-bold text-foreground">S/ {saldoPendiente}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {(socio.cuotasTotales || 0) - (socio.cuotasPagadas || 0)} cuotas restantes de S/ {socio.cuotasTotales ? (socio.montoTotal || 0) / socio.cuotasTotales : 0}
        </p>
      </div>

      {/* Proximo Vencimiento */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-yellow-400" />
          </div>
          <Clock className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-muted-foreground text-sm mb-1">Próximo Vencimiento</p>
        <p className="text-2xl font-bold text-foreground">
          {new Date(socio.proximoVencimiento).toLocaleDateString("es-PE", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })}
        </p>
        <p className="text-xs text-yellow-400 mt-2">Cuota #{(socio.cuotasPagadas || 0) + 1}</p>
      </div>
    </div>
  )
}
