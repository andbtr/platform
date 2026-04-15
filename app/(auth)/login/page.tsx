import { Navigation } from '@/components/layout/navigation'
import LoginForm from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#081426]">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#050A18]/95 via-[#081426]/92 to-[#0F1B2E]/95" />

      <div className="relative z-20">
        <Navigation />
      </div>

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2 pt-16 md:pt-20">
        <section className="px-6 md:px-10 py-14 md:py-20 flex items-center border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 mb-7">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/huajsapata.png-ETs04yCnOGaA9a5tqHdj4RSxflUMNS.jpeg"
                alt="Morenada Huajsapata"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="text-white/90 text-sm tracking-wide">Morenada Huajsapata</span>
            </div>

            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold leading-tight text-white mb-4">
              <span className="text-gold-gradient">Tu participación,</span>
              <br />
              sin fricción.
            </h1>

            <p className="text-white/75 text-base md:text-lg mb-8 max-w-lg">
              Organiza tu inscripción, revisa pagos y mantén tu estado al día en una sola plataforma.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="text-[#C5A059] text-xs uppercase tracking-[0.12em] mb-1">Proceso claro</p>
                <p className="text-white/80 text-sm">Seguimiento simple de cuotas e inscripción.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="text-[#C5A059] text-xs uppercase tracking-[0.12em] mb-1">Todo en un panel</p>
                <p className="text-white/80 text-sm">Información y acciones en segundos.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-8 py-12 md:py-20 flex items-center">
          <div className="w-full max-w-xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold mb-2 text-white">
                <span className="text-gold-gradient">Accede a tu cuenta</span>
              </h2>
              <p className="text-white/70">Gestiona tus pagos y tu inscripción desde tu panel personal.</p>
            </div>

            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  )
}
