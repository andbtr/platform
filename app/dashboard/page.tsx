"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, CreditCard, Upload, X, Check, Clock, Wallet, TrendingUp, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Mock data - in production this would come from a database
const mockSocioData = {
  nombre: "Juan Carlos Mamani Quispe",
  dni: "70123456",
  bloque: "Morenos",
  fechaInscripcion: "2026-03-15",
  montoTotal: 900,
  montoPagado: 450,
  cuotasTotales: 10,
  cuotasPagadas: 5,
  proximoVencimiento: "2026-04-15",
  historialPagos: [
    { id: 1, fecha: "2026-03-15", monto: 90, estado: "aprobado", concepto: "Cuota 1" },
    { id: 2, fecha: "2026-03-20", monto: 90, estado: "aprobado", concepto: "Cuota 2" },
    { id: 3, fecha: "2026-03-25", monto: 90, estado: "aprobado", concepto: "Cuota 3" },
    { id: 4, fecha: "2026-04-01", monto: 90, estado: "aprobado", concepto: "Cuota 4" },
    { id: 5, fecha: "2026-04-10", monto: 90, estado: "pendiente", concepto: "Cuota 5" },
  ]
}

export default function DashboardPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [voucherFile, setVoucherFile] = useState<File | null>(null)
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)

  const saldoPendiente = mockSocioData.montoTotal - mockSocioData.montoPagado
  const progresoPago = (mockSocioData.montoPagado / mockSocioData.montoTotal) * 100

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVoucherFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setVoucherPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setVoucherFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setVoucherPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitPayment = () => {
    setPaymentSubmitted(true)
    setTimeout(() => {
      setIsPaymentModalOpen(false)
      setPaymentSubmitted(false)
      setVoucherFile(null)
      setVoucherPreview(null)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a1628] to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 blur-3xl rounded-full" />
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
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
                alt="Morenada Huajsapata"
                width={40}
                height={40}
                className="rounded-full border border-primary/30"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[10px] rounded-full flex items-center justify-center text-white">2</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-6 pb-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-muted-foreground text-sm">Bienvenido,</p>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{mockSocioData.nombre}</h1>
          <p className="text-primary text-sm mt-1">Bloque: {mockSocioData.bloque} | DNI: {mockSocioData.dni}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Monto Total Pagado */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                {mockSocioData.cuotasPagadas}/{mockSocioData.cuotasTotales} cuotas
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-1">Total Pagado</p>
            <p className="text-3xl font-bold text-foreground">S/ {mockSocioData.montoPagado}</p>
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
              {mockSocioData.cuotasTotales - mockSocioData.cuotasPagadas} cuotas restantes de S/ {mockSocioData.montoTotal / mockSocioData.cuotasTotales}
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
            <p className="text-muted-foreground text-sm mb-1">Proximo Vencimiento</p>
            <p className="text-2xl font-bold text-foreground">
              {new Date(mockSocioData.proximoVencimiento).toLocaleDateString("es-PE", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </p>
            <p className="text-xs text-yellow-400 mt-2">Cuota #{mockSocioData.cuotasPagadas + 1}</p>
          </div>
        </div>

        {/* Payment History */}
        <div className="glass-card rounded-2xl overflow-hidden mb-8">
          <div className="p-6 border-b border-primary/20">
            <h2 className="text-xl font-serif font-bold text-foreground">Historial de Pagos</h2>
          </div>
          <div className="divide-y divide-primary/10">
            {mockSocioData.historialPagos.map((pago) => (
              <div key={pago.id} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    pago.estado === "aprobado" ? "bg-green-500/20" : "bg-yellow-500/20"
                  }`}>
                    {pago.estado === "aprobado" ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{pago.concepto}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(pago.fecha).toLocaleDateString("es-PE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">S/ {pago.monto}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pago.estado === "aprobado" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {pago.estado === "aprobado" ? "Aprobado" : "Pendiente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-serif font-bold text-foreground mb-4">Datos para Pago</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center p-4 bg-white rounded-xl">
              <Image
                src="/images/yape-qr.png"
                alt="QR Yape"
                width={150}
                height={150}
                className="mb-2"
              />
              <p className="text-black font-medium">Yape: 999 888 777</p>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">Banco</p>
                <p className="font-medium text-foreground">BCP - Banco de Credito</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">Cuenta Ahorros</p>
                <p className="font-medium text-foreground">123-45678901-0-12</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">CCI</p>
                <p className="font-medium text-foreground text-sm">002-123-004567890101-23</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">Titular</p>
                <p className="font-medium text-foreground">Morenada Huajsapata</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg shadow-accent/30">
              <Upload className="w-5 h-5 mr-2" />
              Reportar Pago Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-primary/30 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-foreground">Reportar Pago</DialogTitle>
            </DialogHeader>
            
            {paymentSubmitted ? (
              <div className="py-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Pago Reportado</h3>
                <p className="text-muted-foreground">Tu pago sera verificado en las proximas horas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Concepto</Label>
                  <Select defaultValue="cuota6">
                    <SelectTrigger className="bg-primary/10 border-primary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cuota6">Cuota #6 - S/ 90</SelectItem>
                      <SelectItem value="cuota7">Cuota #7 - S/ 90</SelectItem>
                      <SelectItem value="adelanto">Adelanto de Cuotas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Monto</Label>
                  <Input 
                    type="number" 
                    placeholder="90.00" 
                    className="bg-primary/10 border-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Voucher de Pago</Label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                      isDragging ? "border-accent bg-accent/10" : "border-primary/30"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    {voucherPreview ? (
                      <div className="relative">
                        <Image
                          src={voucherPreview}
                          alt="Voucher"
                          width={200}
                          height={200}
                          className="mx-auto rounded-lg"
                        />
                        <button
                          onClick={() => { setVoucherFile(null); setVoucherPreview(null) }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Arrastra tu voucher aqui o
                        </p>
                        <label className="cursor-pointer">
                          <span className="text-accent hover:underline">selecciona un archivo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitPayment}
                  disabled={!voucherFile}
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold"
                >
                  Enviar Reporte de Pago
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
