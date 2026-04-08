import { RegistrationForm } from "@/components/registration-form"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function InscriptionPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <RegistrationForm />
      <Footer />
    </main>
  )
}

