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
  color: '#D4963A',
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
]

export function Footer({ countryPrefix }: FooterProps) {
  const base = countryPrefix ? `/${countryPrefix}` : '/sv'

  return (
    <footer style={{ backgroundColor: '#1E1E1E' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 48px 32px' }}>

        {/* Grid 5 columnas */}
        <div className="ax7-footer-grid">

          {/* Col 1 — Brand */}
          <div className="ax7-footer-brand" style={{ borderRight: COL_DIVIDER }}>
            <p style={{ color: '#F2F0ED', marginBottom: '8px' }}>
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
            {/* Redes sociales */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>

              <a href="https://www.artifex7.net" target="_blank" rel="noopener noreferrer" title="Sitio web"
                style={{ color: '#F2F0ED60', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
                className="footer-social-link">
                <Globe style={{ width: 20, height: 20 }} />
              </a>

              <a href="https://www.facebook.com/Artifex7/" target="_blank" rel="noopener noreferrer" title="Facebook"
                style={{ color: '#F2F0ED60', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
                className="footer-social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              <a href="https://www.linkedin.com/company/artifex7/" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                style={{ color: '#F2F0ED60', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
                className="footer-social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>

              <a href="https://www.instagram.com/artifex7net/" target="_blank" rel="noopener noreferrer" title="Instagram"
                style={{ color: '#F2F0ED60', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
                className="footer-social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              <a href="https://www.tiktok.com/@artifex7net" target="_blank" rel="noopener noreferrer" title="TikTok"
                style={{ color: '#F2F0ED60', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
                className="footer-social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>

            </div>
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
                <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#D4963A', fontWeight: 600 }}>
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
        .hover-footer-link:hover { color: #F2F0ED !important; }
        .footer-social-link:hover { color: #C4581A !important; }

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
