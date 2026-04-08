import { HeroSection } from "@/components/hero-section"
import { InfoSection } from "@/components/info-section"
import { BlocksSection } from "@/components/blocks-section"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { getBlocks } from "@/lib/supabase-server"

export default async function Home() {
  const blocks = await getBlocks()

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <InfoSection />
      <BlocksSection blocks={blocks} />
      <Footer />
    </main>
  )
}
