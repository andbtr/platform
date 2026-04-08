import LoginForm from '@/components/login-form'

export default function LoginPage() {
  return (
    <main className="relative py-20 md:py-32 bg-linear-to-b from-[#050A18] to-[#0F1B2E] min-h-screen flex items-center">
      <div className="absolute inset-0 opacity-30" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold mb-2 text-white">
            <span className="text-gold-gradient">Accede a tu cuenta</span>
          </h2>
          <p className="text-white/70">Gestiona tus pagos y tu inscripción desde tu panel personal.</p>
        </div>

        <div className="max-w-xl mx-auto">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
