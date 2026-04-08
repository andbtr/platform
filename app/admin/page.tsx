"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, Search, Check, X, Eye, Users, CreditCard, 
  AlertCircle, ChevronDown, Filter, Download, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const mockSocios = [
  { 
    id: 1, 
    nombre: "Juan Carlos Mamani Quispe", 
    dni: "70123456", 
    bloque: "Morenos", 
    telefono: "999888777",
    montoPagado: 450, 
    montoTotal: 900, 
    cuotasPagadas: 5,
    estado: "al_dia"
  },
  { 
    id: 2, 
    nombre: "Maria Elena Condori Huanca", 
    dni: "70234567", 
    bloque: "Chinas", 
    telefono: "988777666",
    montoPagado: 270, 
    montoTotal: 900, 
    cuotasPagadas: 3,
    estado: "al_dia"
  },
  { 
    id: 3, 
    nombre: "Pedro Alejandro Quispe Mamani", 
    dni: "70345678", 
    bloque: "Sajamas", 
    telefono: "977666555",
    montoPagado: 90, 
    montoTotal: 900, 
    cuotasPagadas: 1,
    estado: "atrasado"
  },
  { 
    id: 4, 
    nombre: "Rosa Luz Apaza Torres", 
    dni: "70456789", 
    bloque: "Chinas", 
    telefono: "966555444",
    montoPagado: 540, 
    montoTotal: 900, 
    cuotasPagadas: 6,
    estado: "al_dia"
  },
  { 
    id: 5, 
    nombre: "Carlos Alberto Flores Ramos", 
    dni: "70567890", 
    bloque: "Morenos", 
    telefono: "955444333",
    montoPagado: 180, 
    montoTotal: 900, 
    cuotasPagadas: 2,
    estado: "atrasado"
  },
]

const mockPagosPendientes = [
  {
    id: 1,
    socioId: 1,
    nombre: "Juan Carlos Mamani Quispe",
    dni: "70123456",
    bloque: "Morenos",
    monto: 90,
    concepto: "Cuota #6",
    fecha: "2026-03-19",
    voucherUrl: "/images/voucher-sample.jpg",
    estado: "pendiente"
  },
  {
    id: 2,
    socioId: 3,
    nombre: "Pedro Alejandro Quispe Mamani",
    dni: "70345678",
    bloque: "Sajamas",
    monto: 180,
    concepto: "Cuotas #2 y #3",
    fecha: "2026-03-18",
    voucherUrl: "/images/voucher-sample.jpg",
    estado: "pendiente"
  },
  {
    id: 3,
    socioId: 2,
    nombre: "Maria Elena Condori Huanca",
    dni: "70234567",
    bloque: "Chinas",
    monto: 90,
    concepto: "Cuota #4",
    fecha: "2026-03-17",
    voucherUrl: "/images/voucher-sample.jpg",
    estado: "pendiente"
  },
]

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBloque, setSelectedBloque] = useState<string>("todos")
  const [selectedPago, setSelectedPago] = useState<typeof mockPagosPendientes[0] | null>(null)
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false)
  const [pagosPendientes, setPagosPendientes] = useState(mockPagosPendientes)

  // Stats
  const totalSocios = mockSocios.length
  const totalRecaudado = mockSocios.reduce((acc, s) => acc + s.montoPagado, 0)
  const sociosAlDia = mockSocios.filter(s => s.estado === "al_dia").length
  const sociosAtrasados = mockSocios.filter(s => s.estado === "atrasado").length

  // Filter socios
  const filteredSocios = mockSocios.filter(socio => {
    const matchesSearch = 
      socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.dni.includes(searchTerm)
    const matchesBloque = selectedBloque === "todos" || socio.bloque === selectedBloque
    return matchesSearch && matchesBloque
  })

  const handleAprobarPago = (pagoId: number) => {
    setPagosPendientes(prev => prev.filter(p => p.id !== pagoId))
    setIsVoucherModalOpen(false)
    setSelectedPago(null)
  }

  const handleRechazarPago = (pagoId: number) => {
    setPagosPendientes(prev => prev.filter(p => p.id !== pagoId))
    setIsVoucherModalOpen(false)
    setSelectedPago(null)
  }

  const openVoucherModal = (pago: typeof mockPagosPendientes[0]) => {
    setSelectedPago(pago)
    setIsVoucherModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a1628] to-background" />
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-primary/20 bg-card/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
              <div className="h-6 w-px bg-primary/30" />
              <div className="flex items-center gap-3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
                  alt="Morenada Huajsapata"
                  width={40}
                  height={40}
                  className="rounded-full border border-primary/30"
                />
                <div className="hidden md:block">
                  <p className="font-medium text-foreground">Panel Administrador</p>
                  <p className="text-xs text-muted-foreground">Gestion 2026-2027</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-primary/30">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-6">
        {/* Stats Cards */}
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

        {/* Tabs */}
        <Tabs defaultValue="pagos" className="space-y-6">
          <TabsList className="glass-card p-1 w-full md:w-auto">
            <TabsTrigger value="pagos" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              Pagos Pendientes
              {pagosPendientes.length > 0 && (
                <Badge className="ml-2 bg-accent/20 text-accent">{pagosPendientes.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="socios" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Socios
            </TabsTrigger>
          </TabsList>

          {/* Pagos Pendientes Tab */}
          <TabsContent value="pagos" className="space-y-4">
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
          </TabsContent>

          {/* Socios Tab */}
          <TabsContent value="socios" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o DNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card/50 border-primary/30"
                />
              </div>
              <Select value={selectedBloque} onValueChange={setSelectedBloque}>
                <SelectTrigger className="w-full md:w-48 bg-card/50 border-primary/30">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por bloque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los bloques</SelectItem>
                  <SelectItem value="Morenos">Morenos</SelectItem>
                  <SelectItem value="Chinas">Chinas</SelectItem>
                  <SelectItem value="Sajamas">Sajamas</SelectItem>
                  <SelectItem value="Achachis">Achachis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Socios Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Socio</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">DNI</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Bloque</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pagado</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {filteredSocios.map((socio) => (
                      <tr key={socio.id} className="hover:bg-primary/5 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-foreground">{socio.nombre}</p>
                            <p className="text-xs text-muted-foreground md:hidden">DNI: {socio.dni}</p>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <p className="text-foreground">{socio.dni}</p>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <Badge variant="outline" className="border-primary/30">{socio.bloque}</Badge>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-foreground">S/ {socio.montoPagado}</p>
                            <p className="text-xs text-muted-foreground">{socio.cuotasPagadas}/10 cuotas</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            className={socio.estado === "al_dia" 
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            }
                          >
                            {socio.estado === "al_dia" ? "Al dia" : "Atrasado"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredSocios.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No se encontraron socios.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Voucher Modal */}
      <Dialog open={isVoucherModalOpen} onOpenChange={setIsVoucherModalOpen}>
        <DialogContent className="glass-card border-primary/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-foreground">Verificar Voucher</DialogTitle>
          </DialogHeader>
          
          {selectedPago && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-primary/10 rounded-xl">
                <div>
                  <p className="text-xs text-muted-foreground">Socio</p>
                  <p className="font-medium text-foreground">{selectedPago.nombre}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">DNI</p>
                  <p className="font-medium text-foreground">{selectedPago.dni}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Concepto</p>
                  <p className="font-medium text-foreground">{selectedPago.concepto}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monto</p>
                  <p className="font-bold text-accent">S/ {selectedPago.monto}</p>
                </div>
              </div>

              {/* Voucher Image Placeholder */}
              <div className="aspect-[3/4] bg-muted rounded-xl flex items-center justify-center border border-primary/20">
                <div className="text-center p-8">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Imagen del voucher</p>
                  <p className="text-sm text-muted-foreground/60">Vista a pantalla completa</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleAprobarPago(selectedPago.id)}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Aprobar Pago
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleRechazarPago(selectedPago.id)}
                >
                  <X className="w-5 h-5 mr-2" />
                  Rechazar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
