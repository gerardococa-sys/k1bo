import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { GlobalShell } from '@/components/GlobalShell'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Artifex7 — Directorio de profesionales para el hogar en Centroamérica',
  description:
    'Encuentra profesionales verificados para tu hogar en Centroamérica. Cielos falsos, pintura, fontanería, electricidad y más.',
  openGraph: {
    siteName: 'Artifex7',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <GlobalShell>
          {children}
        </GlobalShell>
        <Toaster />
      </body>
    </html>
  )
}
