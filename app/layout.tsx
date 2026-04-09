import type { Metadata, Viewport } from 'next'
import { Inter, Cinzel, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AuthProvider from '@/components/providers/auth-provider'
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

export const metadata: Metadata = {
  title: 'Morenada Huajsapata | Gestión 2026-2027 | Puno',
  description: 'Únete a la legendaria Morenada Huajsapata en la Festividad de la Virgen de la Candelaria. Inscríbete ahora y sé parte de la tradición más grande de Puno.',
  keywords: ['Morenada', 'Huajsapata', 'Candelaria', 'Puno', 'Festividad', 'Danza', 'Tradición', 'Perú'],
  openGraph: {
    title: 'Morenada Huajsapata | Gestión 2026-2027',
    description: 'Vuelve a casa. Vuelve a Huajsapata. Inscríbete y sé leyenda.',
    type: 'website',
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
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${cinzel.variable} ${playfair.variable} font-sans antialiased bg-[#050A18] text-white`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
