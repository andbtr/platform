import { Search, Filter, Check, Clock, Eye, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PaymentsTableProps {
  searchTerm: string
  selectedStatus: string
  pageSize: number
  pagosPendientes: any[]
  page: number
  totalCount: number | null
  loadingPagos: boolean
  handleSearch: (value: string) => void
  handleStatusChange: (value: string) => void
  handlePageSizeChange: (size: number) => void
  goToPage: (pageNum: number) => void
  openVoucherModal: (pago: any) => void
  handleAprobarPago: (pagoId: number) => void
  handleRechazarPago: (pagoId: number) => void
}

export function PaymentsTable({
  searchTerm,
  selectedStatus,
  pageSize,
  pagosPendientes,
  page,
  totalCount,
  loadingPagos,
  handleSearch,
  handleStatusChange,
  handlePageSizeChange,
  goToPage,
  openVoucherModal,
  handleAprobarPago,
  handleRechazarPago
}: PaymentsTableProps) {
  return (
    <div className="space-y-4">
      {/* Pagos toolbar: search, status filter, pageSize */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 md:flex-none md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar pagos (nombre, email, descripción)"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-card/50 border-primary/30"
          />
        </div>

        <Select value={selectedStatus} onValueChange={(v) => handleStatusChange(v)}>
          <SelectTrigger className="w-full md:w-48 bg-card/50 border-primary/30">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="aprobado">Aprobado</SelectItem>
            <SelectItem value="rechazado">Rechazado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={String(pageSize)} onValueChange={(v) => handlePageSizeChange(Number(v))}>
          <SelectTrigger className="w-28 bg-card/50 border-primary/30">
            <SelectValue placeholder="Tamaño" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {pagosPendientes.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Todo al dia</h3>
          <p className="text-muted-foreground">No hay pagos pendientes de verificar.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pagosPendientes.map((pago) => (
            <div key={pago.id} className="glass-card p-4 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{pago.nombre}</p>
                    <p className="text-sm text-muted-foreground">DNI: {pago.dni} | {pago.bloque}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-primary/30">{pago.concepto}</Badge>
                      <span className="text-lg font-bold text-accent">S/ {pago.monto}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reportado: {new Date(pago.fecha).toLocaleDateString("es-PE")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-16 md:ml-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary/30"
                    onClick={() => openVoucherModal(pago)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Voucher
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleAprobarPago(pago.id)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRechazarPago(pago.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          {totalCount !== null ? `Mostrando ${Math.min(page*pageSize, totalCount)} de ${totalCount}` : ''}
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={page <= 1 || loadingPagos} onClick={() => goToPage(Math.max(1, page-1))} variant="outline" size="sm">Anterior</Button>
          <div className="text-sm">Página {page}</div>
          <Button disabled={loadingPagos || (totalCount !== null && page*pageSize >= totalCount)} onClick={() => goToPage(page+1)} variant="outline" size="sm">Siguiente</Button>
        </div>
      </div>
    </div>
  )
}
