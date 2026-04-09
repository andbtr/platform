import { HeroSection } from "@/components/sections/hero-section"
import { Navigation } from "@/components/layout/navigation"
import { getBlocks } from "@/lib/supabase-server"
import dynamic from "next/dynamic"

const InfoSection = dynamic(() => import("@/components/sections/info-section").then(mod => mod.InfoSection))
const BlocksSection = dynamic(() => import("@/components/sections/blocks-section").then(mod => mod.BlocksSection))
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))

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
