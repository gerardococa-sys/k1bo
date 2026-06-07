import Link from 'next/link'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

interface CtaProfesionalProps {
  countryName?: string
}

export function CtaProfesional({ countryName = 'El Salvador' }: CtaProfesionalProps) {
  return (
    <section className="py-16" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="container mx-auto px-4 text-center">
        <h2
          style={{
            fontFamily: FONT_SERIF,
            fontSize: '38px',
            fontWeight: 700,
            color: '#1C1410',
            marginBottom: '12px',
          }}
        >
          ¿Eres profesional?
        </h2>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: '18px',
            color: '#6B7B6E',
            marginBottom: '28px',
            maxWidth: '480px',
            margin: '0 auto 28px',
          }}
        >
          Únete a Artifex7 y llega a más propietarios en {countryName}.
        </p>
        <Link
          href="/registro"
          style={{
            display: 'inline-block',
            backgroundColor: '#1C1410',
            color: '#D4A96A',
            fontFamily: FONT_SANS,
            fontSize: '16px',
            fontWeight: 700,
            borderRadius: '8px',
            padding: '14px 32px',
            textDecoration: 'none',
          }}
        >
          Registra tu negocio gratis
        </Link>
      </div>
    </section>
  )
}
