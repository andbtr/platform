import { Navigation } from "@/components/layout/navigation"
import dynamic from "next/dynamic"

const HeroSection = dynamic(() => import("@/components/sections/hero-section").then(mod => mod.HeroSection))
const InfoSection = dynamic(() => import("@/components/sections/info-section").then(mod => mod.InfoSection))
const NewsSection = dynamic(() => import("@/components/sections/news-section").then(mod => mod.NewsSection))
const FilialesSection = dynamic(() => import("@/components/sections/filiales-section").then(mod => mod.FilialesSection))
const GallerySection = dynamic(() => import("@/components/sections/gallery-section").then(mod => mod.GallerySection))
const BlocksSection = dynamic(() => import("@/components/sections/blocks-section").then(mod => mod.BlocksSection))
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <InfoSection />
      <NewsSection />
      <FilialesSection />
      <GallerySection />
      <BlocksSection />
      <Footer />
    </main>
  )
}
