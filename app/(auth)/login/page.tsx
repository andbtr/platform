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
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
