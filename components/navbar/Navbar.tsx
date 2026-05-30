import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CountrySelector } from './CountrySelector'
import { UserMenu } from './UserMenu'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  countryPrefix?: string
}

export async function Navbar({ countryPrefix }: NavbarProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, photo_url, role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const base = countryPrefix ? `/${countryPrefix}` : ''

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={base || '/'}
          className="text-xl font-black uppercase tracking-tight text-[#1B3A6B]"
        >
          K1BO
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          {countryPrefix && (
            <>
              <Link
                href={`/${countryPrefix}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Categorías
              </Link>
              <Link
                href={`/${countryPrefix}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Profesionales
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <CountrySelector currentPrefix={countryPrefix} />

          {user && profile ? (
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
