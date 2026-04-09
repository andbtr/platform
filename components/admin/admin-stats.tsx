import { Users, CreditCard, Check, AlertCircle } from "lucide-react"

interface AdminStatsProps {
  totalSocios: number
  totalRecaudado: number
  sociosAlDia: number
  sociosAtrasados: number
}

export function AdminStats({ totalSocios, totalRecaudado, sociosAlDia, sociosAtrasados }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalSocios}</p>
            <p className="text-xs text-muted-foreground">Total Socios</p>
          </div>
        </div>
      </div>
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">S/ {totalRecaudado.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Recaudado</p>
          </div>
        </div>
      </div>
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{sociosAlDia}</p>
            <p className="text-xs text-muted-foreground">Al Dia</p>
          </div>
        </div>
      </div>
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{sociosAtrasados}</p>
            <p className="text-xs text-muted-foreground">Atrasados</p>
          </div>
        </div>
      </div>
    </div>
  )
}
