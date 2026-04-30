import { Wallet, CreditCard, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DashboardStatsProps {
  socio: any
  saldoPendiente: number
  progresoPago: number
}

export function DashboardStats({ socio, saldoPendiente, progresoPago }: DashboardStatsProps) {
  const cuotasTotales = socio.cuotasTotales || 0
  const cuotasPagadas = socio.cuotasPagadas || 0
  const isSaldoFavor = saldoPendiente <= 0
  const saldoDisplay = Math.abs(saldoPendiente)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Monto Total Pagado */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-green-400" />
          </div>
          <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
            {progresoPago.toFixed(0)}% completado
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-1">Total Pagado</p>
        <p className="text-3xl font-bold text-foreground">S/ {socio.montoPagado || 0}</p>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Avance referencial</span>
            <span>{cuotasPagadas} de {cuotasTotales} meses</span>
          </div>
          <Progress value={progresoPago} className="h-2" />
        </div>
      </div>

      {/* Saldo Pendiente */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isSaldoFavor ? "bg-green-500/20" : "bg-accent/20"
          }`}>
            {isSaldoFavor ? (
              <Wallet className="w-6 h-6 text-green-400" />
            ) : (
              <CreditCard className="w-6 h-6 text-accent" />
            )}
          </div>
          <TrendingUp className={`w-5 h-5 ${isSaldoFavor ? "text-green-400" : "text-muted-foreground"}`} />
        </div>
        <p className={`text-sm mb-1 ${isSaldoFavor ? "text-green-400" : "text-muted-foreground"}`}>
          {isSaldoFavor ? "Saldo a favor" : "Saldo Pendiente"}
        </p>
        <p className={`text-3xl font-bold ${isSaldoFavor ? "text-green-400" : "text-foreground"}`}>
          S/ {saldoDisplay}
        </p>
        <p className="text-xs text-muted-foreground mt-2 font-medium">
          {isSaldoFavor ? "Total cubierto:" : "Total a cubrir:"}{" "}
          <span className={isSaldoFavor ? "text-green-400" : "text-foreground"}>
            S/ {socio.montoTotal || 0}
          </span>
        </p>
      </div>
    </div>
  )
}
