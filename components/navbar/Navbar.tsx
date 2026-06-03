'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CountrySelector } from './CountrySelector'
import { UserMenu } from './UserMenu'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  countryPrefix?: string
}

type Profile = { full_name: string | null; photo_url: string | null; role: string }

const COUNTRY_PREFIXES = ['sv', 'gt', 'hn', 'ni', 'cr', 'pa']

export function Navbar({ countryPrefix: propPrefix }: NavbarProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const pathname = usePathname()

  const detectedPrefix = COUNTRY_PREFIXES.find(
    (c) => pathname === `/${c}` || pathname?.startsWith(`/${c}/`),
  )
  const countryPrefix = propPrefix ?? detectedPrefix

  useEffect(() => {
    const supabase = createClient()

    const fetchProfile = (userId: string) => {
      supabase
        .from('profiles')
        .select('full_name, photo_url, role')
        .eq('id', userId)
        .single()
        .then(({ data }) => setProfile(data))
    }

    // Subscribe to auth state — fires immediately with current session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const base = countryPrefix ? `/${countryPrefix}` : '/sv'

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={base} className="text-xl font-black uppercase tracking-tight text-[#1B3A6B]">
          K1BO
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/nosotros"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Nosotros
          </Link>
          <Link
            href={`${base}#categorias`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Categorías
          </Link>
          <Link
            href={`${base}#profesionales-destacados`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Profesionales
          </Link>
          <Link
            href={`${base}#como-funciona`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cómo funciona
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <CountrySelector currentPrefix={countryPrefix} />
          {profile ? (
            <UserMenu profile={profile} countryPrefix={countryPrefix} />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/registro/cliente">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
