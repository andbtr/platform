import Image from "next/image"

export function PaymentInfo() {
  return (
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
            <p className="font-medium text-foreground">BCP - Banco de Crédito</p>
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
  )
}
