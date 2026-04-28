import { useState } from "react"
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
  openPaymentProofModal: (pago: any) => void
  handleAprobarPago: (pagoId: number) => void
  handleRechazarPago: (pagoId: number, adminNotes: string) => void // Modified signature
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
                                openPaymentProofModal,
                                handleAprobarPago,
                                handleRechazarPago
                              }: PaymentsTableProps) {
  const [rejectingPaymentId, setRejectingPaymentId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Función para obtener el badge del estado
  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'APPROVED':
      case 'aprobado':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aprobado</Badge>
      case 'REJECTED':
      case 'rechazado':
        return <Badge variant="destructive">Rechazado</Badge>
      case 'PENDING':
      case 'pendiente':
      default:
        return <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">Pendiente</Badge>
    }
  }

  // Función para obtener el icono y color según el estado
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'APPROVED':
      case 'aprobado':
        return { icon: Check, bgColor: 'bg-green-500/20', iconColor: 'text-green-400' }
      case 'REJECTED':
      case 'rechazado':
        return { icon: X, bgColor: 'bg-red-500/20', iconColor: 'text-red-400' }
      case 'PENDING':
      case 'pendiente':
      default:
        return { icon: Clock, bgColor: 'bg-yellow-500/20', iconColor: 'text-yellow-400' }
    }
  }
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
              <SelectItem value="PENDING">Pendiente</SelectItem>
              <SelectItem value="APPROVED">Aprobado</SelectItem>
              <SelectItem value="REJECTED">Rechazado</SelectItem>
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
              {pagosPendientes.map((pago) => {
                const statusInfo = getStatusIcon(pago.estado)
                const StatusIcon = statusInfo.icon

                return (
                    <div key={pago.id} className="glass-card p-4 rounded-xl">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Información principal del pago */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`w-12 h-12 rounded-xl ${statusInfo.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <StatusIcon className={`w-6 h-6 ${statusInfo.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-foreground truncate">{pago.nombre}</p>
                              {selectedStatus === 'todos' && getStatusBadge(pago.estado)}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="border-primary/30 text-xs">{pago.concepto}</Badge>
                              <span className="text-lg font-bold text-accent">S/ {pago.monto}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Reportado: {new Date(pago.fecha).toLocaleDateString("es-PE")}
                            </p>
                            {pago.bankAccountName && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Titular: {pago.bankAccountName}
                                </p>
                            )}
                            {pago.adminNotes && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Notas Admin: {pago.adminNotes}
                                </p>
                            )}
                            {pago.additionalCode && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Código Adicional: {pago.additionalCode}
                                </p>
                            )}
                          </div>
                        </div>

                        {/* DNI y Bloque - separados */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                            <div className="p-1 bg-primary/20 rounded">
                              <svg className="w-3 h-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5L7 7l-2 2 8 8.5V22"/><path d="M7 7V2"/><path d="M17 7V2"/><path d="M11 7V2"/><path d="M22 7H2"/><path d="M22 17H19"/></svg>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none">Bloque</p>
                              <p className="text-xs font-bold text-foreground leading-none">{pago.bloque}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                            <div className="p-1 bg-accent/20 rounded">
                              <svg className="w-3 h-3 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none">DNI</p>
                              <p className="text-xs font-bold text-foreground leading-none">{pago.dni}</p>
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción - solo para pagos pendientes */}
                        {(pago.estado === 'PENDING' || pago.estado === 'pendiente') && (
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                              {rejectingPaymentId === pago.id ? (
                                  <div className="flex flex-col gap-2 w-full sm:w-64">
                                    <Input
                                        placeholder="Motivo de rechazo..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="h-8 text-xs bg-card/50 border-primary/30"
                                        autoFocus
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <Button
                                          size="sm"
                                          variant="destructive"
                                          className="h-8 text-xs"
                                          onClick={() => {
                                            handleRechazarPago(pago.id, rejectionReason);
                                            setRejectingPaymentId(null);
                                            setRejectionReason('');
                                          }}
                                          disabled={!rejectionReason.trim()}
                                      >
                                        Confirmar
                                      </Button>
                                      <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8 text-xs"
                                          onClick={() => {
                                            setRejectingPaymentId(null);
                                            setRejectionReason('');
                                          }}
                                      >
                                        Cancelar
                                      </Button>
                                    </div>
                                  </div>
                              ) : (
                                  <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-primary/30"
                                        onClick={() => openPaymentProofModal(pago)}
                                        disabled={!pago.hasPaymentProof}
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      Ver Comprobante
                                    </Button>
                                    <div className="flex gap-2">
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
                                          onClick={() => {
                                            setRejectingPaymentId(pago.id);
                                            setRejectionReason('');
                                          }}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </>
                              )}
                            </div>
                        )}

                        {/* Estado final para pagos no pendientes */}
                        {(pago.estado === 'APPROVED' || pago.estado === 'aprobado' || pago.estado === 'REJECTED' || pago.estado === 'rechazado') && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {getStatusBadge(pago.estado)}
                              {pago.hasPaymentProof && (
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-primary/30"
                                      onClick={() => openPaymentProofModal(pago)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Ver Comprobante
                                  </Button>
                              )}
                            </div>
                        )}
                      </div>
                    </div>
                )
              })}
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