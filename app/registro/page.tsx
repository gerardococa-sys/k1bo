import Link from 'next/link'
import { Home, HardHat, Building2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear cuenta — Artifex7',
  description: 'Elige el tipo de cuenta que mejor describe tu perfil en Artifex7.',
}

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

export default function RegistroPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F0E8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 16px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: '42px',
            fontWeight: 700,
            color: '#1C1410',
            margin: '0 0 12px',
          }}
        >
          ¿Cómo quieres usar Artifex7?
        </h1>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: '18px',
            color: '#6B7B6E',
            margin: 0,
          }}
        >
          Elige el tipo de cuenta que mejor describe tu perfil
        </p>
      </div>

      {/* Cards grid */}
      <div className="ax7-reg-grid" style={{ width: '100%', maxWidth: '900px' }}>

        {/* Card 1 — Propietario */}
        <div className="ax7-reg-card" style={{ border: '0.5px solid #1C141015' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#B85C1A12', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <Home style={{ width: 36, height: 36, color: '#B85C1A' }} />
          </div>
          <p style={{ fontFamily: FONT_SERIF, fontSize: '24px', fontWeight: 600, color: '#1C1410', margin: 0 }}>
            Propietario
          </p>
          <span style={{ display: 'inline-block', backgroundColor: '#6B7B6E15', color: '#6B7B6E', fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, borderRadius: '20px', padding: '4px 12px' }}>
            Gratis
          </span>
          <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#6B7B6E', lineHeight: 1.65, margin: 0, flex: 1 }}>
            Busca y contrata profesionales para tu hogar, oficina o negocio. Registro gratuito.
          </p>
          <Link
            href="/registro/cliente"
            className="ax7-reg-btn"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              backgroundColor: '#1C1410',
              color: '#D4A96A',
              fontFamily: FONT_SANS,
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '8px',
              padding: '14px',
              textDecoration: 'none',
              marginTop: 'auto',
              boxSizing: 'border-box',
            }}
          >
            Registrarme como Propietario
          </Link>
        </div>

        {/* Card 2 — Profesional Independiente */}
        <div className="ax7-reg-card" style={{ border: '0.5px solid #1C141015' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#B85C1A12', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <HardHat style={{ width: 36, height: 36, color: '#B85C1A' }} />
          </div>
          <p style={{ fontFamily: FONT_SERIF, fontSize: '24px', fontWeight: 600, color: '#1C1410', margin: 0 }}>
            Profesional Independiente
          </p>
          <span style={{ display: 'inline-block', backgroundColor: '#6B7B6E15', color: '#6B7B6E', fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, borderRadius: '20px', padding: '4px 12px' }}>
            Gratis
          </span>
          <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#6B7B6E', lineHeight: 1.65, margin: 0, flex: 1 }}>
            Publica tus servicios y recibe solicitudes de clientes verificados. Registro gratuito.
          </p>
          <Link
            href="/registro/profesional"
            className="ax7-reg-btn"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              backgroundColor: '#1C1410',
              color: '#D4A96A',
              fontFamily: FONT_SANS,
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '8px',
              padding: '14px',
              textDecoration: 'none',
              marginTop: 'auto',
              boxSizing: 'border-box',
            }}
          >
            Registrarme como Profesional
          </Link>
        </div>

        {/* Card 3 — Empresa */}
        <div
          className="ax7-reg-card"
          style={{ border: '1.5px solid #B85C1A40', position: 'relative', overflow: 'hidden' }}
        >
          {/* "Más popular" top-right badge */}
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: '#B85C1A',
              color: '#F5F0E8',
              fontFamily: FONT_SANS,
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '0 16px 0 10px',
            }}
          >
            Más popular
          </span>
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#B85C1A12', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <Building2 style={{ width: 36, height: 36, color: '#B85C1A' }} />
          </div>
          <p style={{ fontFamily: FONT_SERIF, fontSize: '24px', fontWeight: 600, color: '#1C1410', margin: 0 }}>
            Empresa
          </p>
          <span style={{ display: 'inline-block', backgroundColor: '#B85C1A15', color: '#B85C1A', fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 700, borderRadius: '20px', padding: '4px 12px' }}>
            $99 / año
          </span>
          <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#6B7B6E', lineHeight: 1.65, margin: 0, flex: 1 }}>
            Perfil destacado permanente, múltiples categorías, badge verificado y estadísticas.
          </p>
          <Link
            href="/registro/empresa"
            className="ax7-reg-btn-empresa"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              backgroundColor: '#B85C1A',
              color: '#F5F0E8',
              fontFamily: FONT_SANS,
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '8px',
              padding: '14px',
              textDecoration: 'none',
              marginTop: 'auto',
              boxSizing: 'border-box',
            }}
          >
            Registrar mi Empresa
          </Link>
        </div>
      </div>

      {/* Login link */}
      <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#6B7B6E', marginTop: '32px' }}>
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" style={{ color: '#B85C1A', fontWeight: 600, textDecoration: 'none' }} className="ax7-login-link">
          Inicia sesión
        </Link>
      </p>

      <style>{`
        .ax7-reg-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .ax7-reg-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .ax7-reg-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          transition: border-color 200ms, box-shadow 200ms, transform 200ms;
        }
        .ax7-reg-card:hover {
          border-color: #B85C1A40 !important;
          box-shadow: 0 4px 24px #1C141010;
          transform: translateY(-3px);
        }
        .ax7-reg-btn:hover   { background-color: #2a1f18 !important; }
        .ax7-reg-btn-empresa:hover { opacity: 0.88; }
        .ax7-login-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
