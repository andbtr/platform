import { Wallet, CreditCard, TrendingUp, Calendar, Clock } from "lucide-react"
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      {/* Proximo Vencimiento */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border-primary/20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-primary/20" />
        
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {isSaldoFavor ? "Sin pagos pendientes" : "Monto Sugerido"}
            </span>
            <p className="text-2xl font-black text-primary drop-shadow-sm">
              {isSaldoFavor ? "—" : `S/ ${socio.montoMensual?.toFixed(2) || "90.00"}`}
            </p>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-1 relative z-10">
          {isSaldoFavor ? "Sin vencimientos pendientes" : "Próximo Vencimiento"}
        </p>
        <p className="text-2xl font-bold text-foreground relative z-10">
          {isSaldoFavor
            ? "—"
            : new Date(socio.proximoVencimiento).toLocaleDateString("es-PE", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
        </p>
        
        <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-2 relative z-10">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-xs font-medium text-muted-foreground">
            Información de pago actualizada
          </p>
        </div>
      </div>
    </div>
  )
}
