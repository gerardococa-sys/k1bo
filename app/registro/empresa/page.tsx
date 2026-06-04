import Link from 'next/link'
import { Building2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro de Empresas — Artifex7',
  description: 'Próximamente: registro para empresas en Artifex7.',
}

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

export default function RegistroEmpresaPage() {
  return (
    <div
      style={{
        minHeight: '60vh',
        backgroundColor: '#F5F0E8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 16px',
        textAlign: 'center',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          backgroundColor: '#B85C1A12',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <Building2 style={{ width: 56, height: 56, color: '#B85C1A' }} />
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: FONT_SERIF,
          fontSize: '42px',
          fontWeight: 700,
          color: '#1C1410',
          margin: '0 0 12px',
        }}
      >
        Registro de Empresas
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: FONT_SANS,
          fontSize: '20px',
          fontWeight: 600,
          color: '#B85C1A',
          margin: '0 0 16px',
        }}
      >
        Próximamente
      </p>

      {/* Description */}
      <p
        style={{
          fontFamily: FONT_SANS,
          fontSize: '17px',
          color: '#6B7B6E',
          maxWidth: '480px',
          lineHeight: 1.7,
          margin: '0 0 32px',
        }}
      >
        Estamos preparando el proceso de registro para empresas.
        Incluirá perfil destacado permanente, hasta 5 categorías,
        badge Empresa Verificada y más.
      </p>

      {/* Primary button */}
      <Link
        href="/sv"
        className="ax7-empresa-btn"
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
          marginBottom: '20px',
        }}
      >
        Volver al inicio
      </Link>

      {/* Secondary link */}
      <Link
        href="/registro/profesional"
        className="ax7-empresa-link"
        style={{
          fontFamily: FONT_SANS,
          fontSize: '15px',
          color: '#B85C1A',
          textDecoration: 'none',
        }}
      >
        ¿Eres profesional independiente? Regístrate aquí
      </Link>

      <style>{`
        .ax7-empresa-btn:hover  { background-color: #2a1f18 !important; }
        .ax7-empresa-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
