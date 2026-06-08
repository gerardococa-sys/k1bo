'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Globe, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/button'
import { CountrySelector } from '@/components/navbar/CountrySelector'

const ACTIVE_COUNTRIES = [
  { name: 'El Salvador', prefix: process.env.NEXT_PUBLIC_DEFAULT_COUNTRY ?? 'sv', flag: '🇸🇻' },
]

export default function RootPage() {
  const router = useRouter()
  const [detectedCountry, setDetectedCountry] = useState<{ name: string; prefix: string; flag: string } | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('artifex7_country')
    if (saved && ACTIVE_COUNTRIES.find(c => c.prefix === saved)) {
      router.push(`/${saved}`)
      return
    }

    // Try IP-based detection via browser's language/timezone as fallback
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz === 'America/El_Salvador') {
      setDetectedCountry(ACTIVE_COUNTRIES[0])
      setShowBanner(true)
    }
  }, [router])

  const handleConfirmCountry = () => {
    if (detectedCountry) {
      localStorage.setItem('artifex7_country', detectedCountry.prefix)
      router.push(`/${detectedCountry.prefix}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span style={{ color: '#2C2C2C' }}><Logo size="md" /></span>
          <CountrySelector />
        </div>
      </header>

      {/* Country detection banner */}
      {showBanner && detectedCountry && (
        <div className="bg-primary/5 border-b border-primary/20">
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <p className="text-sm">
              👋 Parece que estás en <strong>{detectedCountry.name}</strong> — ¿Quieres ver
              profesionales cerca de ti?
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" onClick={handleConfirmCountry}>
                Sí, ir a <Logo size="sm" /> {detectedCountry.name}
              </Button>
              <button
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setShowBanner(false)}
              >
                No, elegir otro
              </button>
              <button onClick={() => setShowBanner(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="mb-4" style={{ color: '#2C2C2C' }}><Logo size="lg" /></h1>
          <p className="text-xl text-muted-foreground">
            El directorio de profesionales para el hogar en Centroamérica
          </p>
        </div>

        <div>
          <h2 className="text-center text-lg font-semibold mb-6 flex items-center justify-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Selecciona tu país
          </h2>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto sm:grid-cols-3">
            {/* El Salvador - active */}
            <Link
              href="/sv"
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-primary bg-primary/5 p-6 hover:bg-primary/10 transition-colors"
              onClick={() => localStorage.setItem('artifex7_country', process.env.NEXT_PUBLIC_DEFAULT_COUNTRY ?? 'sv')}
            >
              <span className="text-4xl">🇸🇻</span>
              <span className="text-sm font-semibold">El Salvador</span>
            </Link>

            {/* Coming soon countries */}
            {[
              { flag: '🇬🇹', name: 'Guatemala' },
              { flag: '🇭🇳', name: 'Honduras' },
              { flag: '🇨🇷', name: 'Costa Rica' },
              { flag: '🇵🇦', name: 'Panamá' },
            ].map((c) => (
              <div
                key={c.name}
                className="flex flex-col items-center gap-2 rounded-xl border border-border p-6 opacity-50"
              >
                <span className="text-4xl">{c.flag}</span>
                <span className="text-sm font-medium text-muted-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground">Próximamente</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
