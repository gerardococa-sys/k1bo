'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/client'
import { CountrySelector } from './CountrySelector'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/lib/utils'

interface NavbarProps {
  countryPrefix?: string
}

type Profile = { full_name: string | null; photo_url: string | null; role: string }

const COUNTRY_PREFIXES = ['sv', 'gt', 'hn', 'ni', 'cr', 'pa']

export function Navbar({ countryPrefix: propPrefix }: NavbarProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const detectedPrefix = COUNTRY_PREFIXES.find(
    (c) => pathname === `/${c}` || pathname?.startsWith(`/${c}/`),
  )
  const countryPrefix = propPrefix ?? detectedPrefix
  const base = countryPrefix ? `/${countryPrefix}` : '/sv'

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const panelPath = profile
    ? profile.role === 'professional'
      ? `${base}/profesional-panel/dashboard`
      : profile.role === 'admin'
      ? '/admin/dashboard'
      : `${base}/cliente/dashboard`
    : base

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const propietariosHref = profile
    ? profile.role === 'professional'
      ? `${base}/profesional-panel/dashboard`
      : profile.role === 'admin'
      ? '/admin/dashboard'
      : `${base}/cliente/dashboard`
    : '/login'

  const navLinks = [
    { label: 'Nosotros',      href: '/nosotros' },
    { label: 'Categorías',    href: `${base}#categorias` },
    { label: 'Profesionales', href: `${base}#profesionales-destacados` },
    { label: 'Propietarios',  href: propietariosHref },
    { label: 'Cómo funciona', href: `${base}#como-funciona` },
  ]

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: '#F5F0E8', borderBottom: '0.5px solid rgba(212,169,106,0.25)' }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href={base} style={{ color: '#1C1410' }}>
          <Logo size="md" />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[16px] font-medium transition-colors hover:opacity-100"
              style={{ color: 'rgba(28,20,16,0.7)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1C1410')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(28,20,16,0.7)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Globe — always visible */}
          <CountrySelector currentPrefix={countryPrefix} />

          {/* Authenticated user */}
          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-black/5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.photo_url ?? ''} alt={profile.full_name ?? ''} />
                    <AvatarFallback
                      className="text-xs font-semibold"
                      style={{ backgroundColor: '#B85C1A20', color: '#B85C1A' }}
                    >
                      {getInitials(profile.full_name ?? 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:block" style={{ color: '#1C1410' }}>
                    {profile.full_name?.split(' ')[0] ?? 'Usuario'}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="truncate">{profile.full_name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(panelPath)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Mi Panel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(panelPath.replace('dashboard', 'perfil'))}>
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Auth buttons — desktop only */
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className="font-sans font-medium px-4 py-1.5 transition-opacity hover:opacity-80"
                style={{
                  border: '1.5px solid #B85C1A',
                  color: '#B85C1A',
                  backgroundColor: 'transparent',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="font-sans font-semibold px-4 py-1.5 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: '#B85C1A',
                  color: '#F5F0E8',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="rounded-md p-2 transition-colors hover:bg-black/5 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menú"
          >
            {mobileOpen
              ? <X    className="h-5 w-5" style={{ color: '#1C1410' }} />
              : <Menu className="h-5 w-5" style={{ color: '#1C1410' }} />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="flex flex-col gap-3 px-4 pb-4 pt-2 md:hidden"
          style={{ backgroundColor: '#F5F0E8', borderTop: '0.5px solid rgba(212,169,106,0.25)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[16px] font-medium py-1"
              style={{ color: 'rgba(28,20,16,0.7)' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!profile && (
            <div
              className="flex flex-col gap-2 pt-2 border-t"
              style={{ borderColor: 'rgba(212,169,106,0.25)' }}
            >
              <Link
                href="/login"
                className="font-sans font-medium text-center py-2 transition-opacity hover:opacity-80"
                style={{
                  border: '1.5px solid #B85C1A',
                  color: '#B85C1A',
                  backgroundColor: 'transparent',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                onClick={() => setMobileOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="font-sans font-semibold text-center py-2 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: '#B85C1A',
                  color: '#F5F0E8',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                onClick={() => setMobileOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
