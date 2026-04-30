import { getNews } from "@/lib/supabase-server"
import { NewsList } from "@/components/sections/news-list"
import dynamic from "next/dynamic"

const Navigation = dynamic(() => import("@/components/layout/navigation").then(mod => mod.Navigation))
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))

export const metadata = {
  title: "Noticias - Morenada Huajsapata",
  description: "Todas las noticias de la Morenada Huajsapata",
}

export default async function NewsPage() {
  const news = await getNews()

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <NewsList news={news} />
      <Footer />
    </main>
  )
}