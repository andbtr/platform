import { RegistrationForm } from "@/components/auth/registration-form"
import { Navigation } from "@/components/layout/navigation"

export default function InscriptionPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="relative z-20">
        <Navigation />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <RegistrationForm />
      </div>
    </main>
  )
}
