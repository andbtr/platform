import type { Metadata, Viewport } from 'next'
import { Inter, Cinzel, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AuthProvider from '@/components/providers/auth-provider'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Morenada Huajsapata',
  description: 'La tradición más grande de Puno. Celebrando la Festividad de la Virgen de la Candelaria.',
  url: 'https://morenada.huajsapata.com',
  location: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Puno',
      addressCountry: 'PE',
    },
  },
  sameAs: [
    'https://www.facebook.com/morenadahuajsapata',
    'https://www.instagram.com/morenadahuajsapata',
    'https://www.tiktok.com/@morenadahuajsapata',
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Morenada Huajsapata | Gestión 2026-2027 | Puno',
    template: '%s | Morenada Huajsapata',
  },
  description: 'Únete a la legendaria Morenada Huajsapata en la Festividad de la Virgen de la Candelaria. Inscríbete ahora y sé parte de la tradición más grande de Puno.',
  keywords: ['Morenada', 'Huajsapata', 'Candelaria', 'Puno', 'Festividad', 'Danza', 'Tradición', 'Perú'],
  metadataBase: new URL('https://morenada.huajsapata.com'),
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://morenada.huajsapata.com',
    languages: {
      'es': 'https://morenada.huajsapata.com',
      'en': 'https://morenada.huajsapata.com/en',
    },
  },
  openGraph: {
    title: 'Morenada Huajsapata | Gestión 2026-2027',
    description: 'Vuelve a casa. Vuelve a Huajsapata. Inscríbete y sé leyenda.',
    url: 'https://morenada.huajsapata.com',
    siteName: 'Morenada Huajsapata',
    locale: 'es_PE',
    alternateLocale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morenada Huajsapata | Gestión 2026-2027',
    description: 'Vuelve a casa. Vuelve a Huajsapata. Inscríbete y sé leyenda.',
  },
}

export const viewport: Viewport = {
  themeColor: '#050A18',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabaseUrl = process.env.SUPABASE_URL ?? ""
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? ""

  return (
    <html lang="es" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} ${playfair.variable} font-sans antialiased bg-[#050A18] text-white`}>
        <SupabaseProvider supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </SupabaseProvider>
        <Analytics />
      </body>
    </html>
  )
}
