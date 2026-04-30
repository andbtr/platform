import { HeroSection } from "@/components/sections/hero-section"
import { Navigation } from "@/components/layout/navigation"
import { getBlocks, getPhotos, getNews, getBranches } from "@/lib/supabase-server"
import dynamic from "next/dynamic"

const InfoSection = dynamic(() => import("@/components/sections/info-section").then(mod => mod.InfoSection))
const NewsSection = dynamic(() => import("@/components/sections/news-section").then(mod => mod.NewsSection))
const FilialesSection = dynamic(() => import("@/components/sections/filiales-section").then(mod => mod.FilialesSection))
const GallerySection = dynamic(() => import("@/components/sections/gallery-section").then(mod => mod.GallerySection))
const BlocksSection = dynamic(() => import("@/components/sections/blocks-section").then(mod => mod.BlocksSection))
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))

export default async function Home() {
  const blocks = await getBlocks()
  const photos = await getPhotos()
  const news = await getNews()
  const branches = await getBranches()

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <InfoSection />
      <NewsSection news={news} />
      <FilialesSection branches={branches} />
      <GallerySection photos={photos} />
      <BlocksSection blocks={blocks} />
      <Footer />
    </main>
  )
}
