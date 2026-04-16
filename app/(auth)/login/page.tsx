import { Navigation } from '@/components/layout/navigation'
import LoginForm from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#081426]">
      <div
        className="fixed inset-0 opacity-20 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      />
      <div className="fixed inset-0 pointer-events-none bg-linear-to-b from-[#050A18]/95 via-[#081426]/92 to-[#0F1B2E]/95" />

      <div className="relative z-20">
        <Navigation />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-24">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 mb-6">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
                alt="Morenada Huajsapata"
                loading="eager"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-white/90 text-sm tracking-wide">Morenada Huajsapata</span>
            </div>
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold mb-2 text-white">
              <span className="text-gold-gradient">Accede a tu cuenta</span>
            </h2>
            <p className="text-white/70 text-sm">Gestiona tus pagos y tu inscripción desde tu panel personal.</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  )
}
