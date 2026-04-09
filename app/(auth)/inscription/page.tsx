import { RegistrationForm } from "@/components/auth/registration-form"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"

export default function InscriptionPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <RegistrationForm />
      <Footer />
    </main>
  )
}

