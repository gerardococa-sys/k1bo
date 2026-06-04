import Link from 'next/link'
import { Globe } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

interface FooterProps {
  countryPrefix?: string
}

const COL_DIVIDER = '0.5px solid rgba(245,240,232,0.08)'

const colTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#D4A96A',
  marginBottom: '14px',
}

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)',
  fontSize: '15px',
  color: 'rgba(245,240,232,0.70)',
  display: 'block',
  lineHeight: 2,
  transition: 'color 0.15s',
}

export function Footer({ countryPrefix }: FooterProps) {
  const base = countryPrefix ? `/${countryPrefix}` : '/sv'

  return (
    <footer style={{ backgroundColor: '#1C1410' }}>
      <div className="container mx-auto px-4 py-12">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">

          {/* Col 1 — Brand */}
          <div className="md:pr-8" style={{ borderRight: COL_DIVIDER }}>
            {/* Logo */}
            <p className="mb-1" style={{ color: '#F5F0E8' }}>
              <Logo size="lg" variant="light" />
            </p>
            {/* Tagline */}
            <p
              className="mb-4"
              style={{
                fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)',
                fontSize: '14px',
                color: 'rgba(245,240,232,0.31)',
                lineHeight: '1.5',
              }}
            >
              La red de los maestros de la construcción.
            </p>
            {/* Globe icon */}
            <Globe className="h-4 w-4" style={{ color: 'rgba(245,240,232,0.25)' }} />
          </div>

          {/* Col 2 — Plataforma */}
          <div className="md:px-8" style={{ borderRight: COL_DIVIDER }}>
            <p style={colTitleStyle}>Plataforma</p>
            <div>
              {[
                { label: 'Nosotros',      href: '/nosotros' },
                { label: 'Cómo funciona', href: `${base}#como-funciona` },
                { label: 'Categorías',    href: `${base}#categorias` },
              ].map(({ label, href }) => (
                <Link key={href} href={href} style={linkStyle} className="hover-footer-link">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Profesionales */}
          <div className="md:px-8" style={{ borderRight: COL_DIVIDER }}>
            <p style={colTitleStyle}>Profesionales</p>
            <div>
              {[
                { label: 'Registrarse',    href: '/registro' },
                { label: 'Iniciar sesión', href: '/login' },
              ].map(({ label, href }) => (
                <Link key={href} href={href} style={linkStyle} className="hover-footer-link">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4 — Propietarios */}
          <div className="md:px-8" style={{ borderRight: COL_DIVIDER }}>
            <p style={colTitleStyle}>Propietarios</p>
            <div>
              {[
                { label: 'Registrarme',   href: '/registro' },
                { label: 'Iniciar sesión', href: '/login' },
                { label: 'Cómo funciona', href: '/sv#como-funciona' },
              ].map(({ label, href }) => (
                <Link key={href} href={href} style={linkStyle} className="hover-footer-link">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 5 — Países */}
          <div className="md:pl-8">
            <p style={colTitleStyle}>Países</p>
            <div>
              <Link
                href="/sv"
                className="flex items-center gap-2 hover-footer-link"
                style={{
                  fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#D4A96A',
                  lineHeight: 2,
                }}
              >
                <span>🇸🇻</span> El Salvador
              </Link>
              {[
                { flag: '🇬🇹', name: 'Guatemala' },
                { flag: '🇭🇳', name: 'Honduras' },
                { flag: '🇳🇮', name: 'Nicaragua' },
                { flag: '🇨🇷', name: 'Costa Rica' },
              ].map(({ flag, name }) => (
                <span
                  key={name}
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)',
                    fontSize: '15px',
                    color: 'rgba(245,240,232,0.22)',
                    lineHeight: 2,
                  }}
                >
                  {flag} {name}
                  <span style={{ fontSize: '13px', color: 'rgba(245,240,232,0.19)' }}>
                    — Próximamente
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6"
          style={{ borderTop: '0.5px solid rgba(245,240,232,0.08)' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)',
              fontSize: '13px',
              color: 'rgba(245,240,232,0.25)',
            }}
          >
            © 2026 Artifex7. Todos los derechos reservados.
          </p>
        </div>
      </div>

      <style>{`
        .hover-footer-link:hover { color: #F5F0E8 !important; }
      `}</style>
    </footer>
  )
}
