import Link from 'next/link'
import { Globe } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

interface FooterProps {
  countryPrefix?: string
}

const FONT_SANS   = 'var(--font-sans, DM Sans, system-ui, sans-serif)'
const COL_DIVIDER = '0.5px solid rgba(245,240,232,0.08)'

const colTitleStyle: React.CSSProperties = {
  fontFamily: FONT_SANS,
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#D4A96A',
  marginBottom: '14px',
  whiteSpace: 'nowrap',
}

const linkStyle: React.CSSProperties = {
  fontFamily: FONT_SANS,
  fontSize: '15px',
  color: 'rgba(245,240,232,0.70)',
  display: 'block',
  lineHeight: 2,
  transition: 'color 0.15s',
  whiteSpace: 'nowrap',        // evita quiebre de texto
}

const INACTIVE_COUNTRIES = [
  { flag: '🇬🇹', name: 'Guatemala' },
  { flag: '🇭🇳', name: 'Honduras' },
  { flag: '🇨🇷', name: 'Costa Rica' },
  { flag: '🇵🇦', name: 'Panamá' },
  { flag: '🇧🇿', name: 'Belice' },
]

export function Footer({ countryPrefix }: FooterProps) {
  const base = countryPrefix ? `/${countryPrefix}` : '/sv'

  return (
    <footer style={{ backgroundColor: '#1C1410' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 48px 32px' }}>

        {/* Grid 5 columnas */}
        <div className="ax7-footer-grid">

          {/* Col 1 — Brand */}
          <div className="ax7-footer-brand" style={{ borderRight: COL_DIVIDER }}>
            <p style={{ color: '#F5F0E8', marginBottom: '8px' }}>
              <Logo size="lg" variant="light" />
            </p>
            <p style={{
              fontFamily: FONT_SANS,
              fontSize: '14px',
              color: 'rgba(245,240,232,0.31)',
              lineHeight: '1.5',
              marginBottom: '16px',
            }}>
              La red de los maestros de la construcción.
            </p>
            <Globe className="h-4 w-4" style={{ color: 'rgba(245,240,232,0.25)' }} />
          </div>

          {/* Col 2 — Plataforma */}
          <div style={{ borderRight: COL_DIVIDER }}>
            <p style={colTitleStyle}>Plataforma</p>
            {[
              { label: 'Nosotros',              href: '/nosotros' },
              { label: 'Cómo funciona',          href: `${base}#como-funciona` },
              { label: 'Categorías',             href: `${base}#categorias` },
              { label: 'Términos y Condiciones', href: '/terminos' },
              { label: 'Política de Privacidad', href: '/privacidad' },
              { label: 'Cancelaciones',          href: '/cancelaciones' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={linkStyle} className="hover-footer-link">
                {label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Profesionales */}
          <div style={{ borderRight: COL_DIVIDER }}>
            <p style={colTitleStyle}>Profesionales</p>
            {[
              { label: 'Directorio',     href: `${base}/profesionales` },
              { label: 'Registrarse',    href: '/registro' },
              { label: 'Iniciar sesión', href: '/login' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={linkStyle} className="hover-footer-link">
                {label}
              </Link>
            ))}
          </div>

          {/* Col 4 — Propietarios */}
          <div style={{ borderRight: COL_DIVIDER }}>
            <p style={colTitleStyle}>Propietarios</p>
            {[
              { label: 'Registrarme',    href: '/registro' },
              { label: 'Iniciar sesión', href: '/login' },
              { label: 'Cómo funciona',  href: '/sv#como-funciona' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={linkStyle} className="hover-footer-link">
                {label}
              </Link>
            ))}
          </div>

          {/* Col 5 — Países */}
          <div className="ax7-footer-countries">
            <p style={colTitleStyle}>Países</p>

            {/* El Salvador — activo */}
            <Link href="/sv" className="hover-footer-link" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', lineHeight: 2 }}>
                <span style={{ fontSize: '18px' }}>🇸🇻</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#D4A96A', fontWeight: 600 }}>
                  El Salvador
                </span>
              </div>
            </Link>

            {/* Países inactivos */}
            {INACTIVE_COUNTRIES.map(({ flag, name }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', lineHeight: 2 }}>
                <span style={{ fontSize: '18px' }}>{flag}</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: 'rgba(245,240,232,0.30)' }}>
                  {name}
                </span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '11px', color: 'rgba(245,240,232,0.18)', fontStyle: 'italic' }}>
                  Próximamente
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: COL_DIVIDER, marginTop: '40px', paddingTop: '24px' }}>
          <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: 'rgba(245,240,232,0.25)' }}>
            © 2026 Artifex7. Todos los derechos reservados.
          </p>
        </div>
      </div>

      <style>{`
        .hover-footer-link:hover { color: #F5F0E8 !important; }

        /* ── Desktop (≥ 768px) ── */
        .ax7-footer-grid {
          display: grid;
          grid-template-columns: 180px 200px 180px 180px 200px;
          gap: 32px;
        }

        /* ── Mobile 2 columnas (< 768px) ── */
        @media (max-width: 767px) {
          .ax7-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .ax7-footer-brand,
          .ax7-footer-countries {
            grid-column: 1 / -1;
          }
          /* Sin dividers verticales en mobile */
          .ax7-footer-grid > div {
            border-right: none !important;
          }
        }

        /* ── Mobile ajuste de padding externo ── */
        @media (max-width: 767px) {
          footer > div {
            padding: 40px 24px 24px !important;
          }
        }
      `}</style>
    </footer>
  )
}
