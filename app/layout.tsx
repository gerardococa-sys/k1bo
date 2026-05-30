import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'K1BO — Directorio de profesionales para el hogar en Centroamérica',
  description:
    'Encuentra profesionales verificados para tu hogar en Centroamérica. Cielos falsos, pintura, fontanería, electricidad y más.',
  openGraph: {
    siteName: 'K1BO',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
