import Link from 'next/link'
import { HardHat, Home } from 'lucide-react'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

export function CtaProfesional() {
  return (
    <section style={{ backgroundColor: '#F2F0ED', padding: '64px 24px' }}>

      {/* Encabezado de sección */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{
          fontFamily: FONT_SERIF,
          fontSize: '38px',
          fontWeight: 700,
          color: '#1E1E1E',
          marginBottom: '8px',
        }}>
          Únete a Artifex7
        </h2>
        <p style={{
          fontFamily: FONT_SANS,
          fontSize: '18px',
          color: '#7A7A78',
        }}>
          La red de los profesionales de la construcción
        </p>
      </div>

      {/* Grid 2 columnas */}
      <div className="cta-grid">

        {/* Bloque 1 — Profesionales */}
        <div style={{
          backgroundColor: '#1E1E1E',
          borderRadius: '16px',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#D4963A20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            flexShrink: 0,
          }}>
            <HardHat style={{ width: 48, height: 48, color: '#D4963A' }} />
          </div>
          <h3 style={{
            fontFamily: FONT_SERIF,
            fontSize: '24px',
            fontWeight: 700,
            color: '#F2F0ED',
            marginBottom: '12px',
          }}>
            ¿Eres profesional independiente o dueño de una empresa?
          </h3>
          <p style={{
            fontFamily: FONT_SANS,
            fontSize: '16px',
            color: '#F2F0ED99',
            lineHeight: 1.65,
            marginBottom: '28px',
          }}>
            Publica tus servicios y recibe solicitudes de propietarios verificados.
          </p>
          <Link href="/registro" style={{
            display: 'block',
            width: '100%',
            backgroundColor: '#C4581A',
            color: '#F2F0ED',
            fontFamily: FONT_SANS,
            fontSize: '16px',
            fontWeight: 700,
            padding: '14px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
            textAlign: 'center',
          }}>
            Registrarme como profesional
          </Link>
        </div>

        {/* Bloque 2 — Propietarios */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #C4581A30',
          borderRadius: '16px',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#C4581A15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            flexShrink: 0,
          }}>
            <Home style={{ width: 48, height: 48, color: '#C4581A' }} />
          </div>
          <h3 style={{
            fontFamily: FONT_SERIF,
            fontSize: '24px',
            fontWeight: 700,
            color: '#1E1E1E',
            marginBottom: '12px',
          }}>
            ¿Eres propietario y buscas profesionales de la construcción?
          </h3>
          <p style={{
            fontFamily: FONT_SANS,
            fontSize: '16px',
            color: '#7A7A78',
            lineHeight: 1.65,
            marginBottom: '28px',
          }}>
            Encuentra al maestro ideal para tu hogar, oficina o negocio. Registro gratuito.
          </p>
          <Link href="/registro" style={{
            display: 'block',
            width: '100%',
            backgroundColor: '#1E1E1E',
            color: '#D4963A',
            fontFamily: FONT_SANS,
            fontSize: '16px',
            fontWeight: 700,
            padding: '14px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
            textAlign: 'center',
          }}>
            Registrarme como propietario
          </Link>
        </div>

      </div>

      <style>{`
        .cta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 900px;
          margin: 0 auto;
        }
        @media (max-width: 767px) {
          .cta-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

    </section>
  )
}
