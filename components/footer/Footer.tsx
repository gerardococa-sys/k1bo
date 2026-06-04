import Link from 'next/link'
import { Globe } from 'lucide-react'

interface FooterProps {
  countryPrefix?: string
}

const COL_DIVIDER = '0.5px solid rgba(245,240,232,0.08)'

const colTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#D4A96A',
  marginBottom: '12px',
}

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)',
  fontSize: '14px',
  color: 'rgba(245,240,232,0.38)',
  display: 'block',
  transition: 'color 0.15s',
}

export function Footer({ countryPrefix }: FooterProps) {
  const base = countryPrefix ? `/${countryPrefix}` : '/sv'

  return (
    <footer style={{ backgroundColor: '#1C1410' }}>
      <div className="container mx-auto px-4 py-12">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* Col 1 — Brand */}
          <div
            className="md:pr-8"
            style={{ borderRight: COL_DIVIDER }}
          >
            {/* Logo */}
            <p
              className="mb-1"
              style={{
                fontFamily: 'var(--font-serif, Playfair Display, Georgia, serif)',
                fontSize: '20px',
                fontWeight: 700,
                color: '#F5F0E8',
              }}
            >
              Artifex<span style={{ color: '#B85C1A' }}>7</span>
            </p>
            {/* Tagline */}
            <p
              className="mb-4"
              style={{
                fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)',
                fontSize: '12px',
                color: 'rgba(245,240,232,0.25)',
                lineHeight: '1.5',
              }}
            >
              Directorio de servicios para el hogar
            </p>
            {/* Globe icon */}
            <Globe className="h-4 w-4" style={{ color: 'rgba(245,240,232,0.25)' }} />
          </div>

          {/* Col 2 — Plataforma */}
          <div
            className="md:px-8"
            style={{ borderRight: COL_DIVIDER }}
          >
            <p style={colTitleStyle}>Plataforma</p>
            <div className="space-y-2">
              {[
                { label: 'Nosotros',      href: '/nosotros' },
                { label: 'Cómo funciona', href: `${base}#como-funciona` },
                { label: 'Categorías',    href: `${base}#categorias` },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  style={linkStyle}
                  className="hover-footer-link"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Profesionales */}
          <div
            className="md:px-8"
            style={{ borderRight: COL_DIVIDER }}
          >
            <p style={colTitleStyle}>Profesionales</p>
            <div className="space-y-2">
              {[
                { label: 'Registrarse',    href: '/registro/profesional' },
                { label: 'Iniciar sesión', href: '/login' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  style={linkStyle}
                  className="hover-footer-link"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4 — Países */}
          <div className="md:pl-8">
            <p style={colTitleStyle}>Países</p>
            <div className="space-y-2">
              <Link
                href="/sv"
                className="flex items-center gap-2 hover-footer-link"
                style={{
                  fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)',
                  fontSize: '14px',
                  color: '#D4A96A',
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
                    fontSize: '14px',
                    color: 'rgba(245,240,232,0.22)',
                  }}
                >
                  {flag} {name}
                  <span style={{ fontSize: '10px' }}>— Próximamente</span>
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
              fontSize: '11px',
              color: 'rgba(245,240,232,0.25)',
            }}
          >
            © 2026 Artifex7. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Hover styles injected via a global style tag — avoids JS event listeners on every link */}
      <style>{`
        .hover-footer-link:hover { color: #F5F0E8 !important; }
      `}</style>
    </footer>
  )
}
