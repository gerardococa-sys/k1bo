'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

interface Props {
  status: 'registered' | 'review' | 'active' | 'suspended'
  country?: string
}

const CONFIG = {
  registered: {
    bg:        '#1E1E1E0A',
    border:    '#1E1E1E25',
    icon:      '📋',
    title:     'Cuenta registrada',
    textColor: '#1E1E1E',
  },
  review: {
    bg:        '#D4963A15',
    border:    '#D4963A50',
    icon:      '⏳',
    title:     'Cuenta en revisión',
    textColor: '#B85C1A',
  },
  suspended: {
    bg:        '#C4581A10',
    border:    '#C4581A40',
    icon:      '🚫',
    title:     'Cuenta suspendida',
    textColor: '#C4581A',
  },
}

export function AccountStatusBanner({ status, country = 'sv' }: Props) {
  const router = useRouter()
  const [requesting, setRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === 'active') return null

  const c = CONFIG[status]

  const handleSolicitarActivacion = async () => {
    setRequesting(true)
    setError(null)
    try {
      const res = await fetch('/api/profesional/solicitar-activacion', {
        method: 'POST',
      })
      if (res.ok) {
        router.refresh()
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? 'Error al enviar la solicitud')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setRequesting(false)
    }
  }

  return (
    <div style={{
      background:   c.bg,
      border:       `1.5px solid ${c.border}`,
      borderRadius: '10px',
      padding:      '16px 20px',
      marginBottom: '24px',
      display:      'flex',
      alignItems:   'flex-start',
      gap:          '14px',
    }}>
      <span style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px' }}>
        {c.icon}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
          color: c.textColor, margin: '0 0 6px',
        }}>
          {c.title}
        </p>

        {status === 'registered' && (
          <>
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', lineHeight: 1.65, margin: '0 0 14px' }}>
              Por favor ve a la sección de{' '}
              <Link
                href={`/${country}/profesional-panel/perfil`}
                style={{ color: '#C4581A', fontWeight: 600, textDecoration: 'none' }}
              >
                "Mi Perfil"
              </Link>
              {' '}y completa las diferentes secciones. Cuando las hayas completado, da clic al siguiente botón para que validemos tu cuenta.
            </p>
            <button
              onClick={handleSolicitarActivacion}
              disabled={requesting}
              style={{
                display:    'inline-flex',
                alignItems: 'center',
                gap:        '8px',
                background: '#1E1E1E',
                color:      '#D4963A',
                fontFamily: FONT_SANS,
                fontSize:   '14px',
                fontWeight: 700,
                padding:    '11px 22px',
                borderRadius: '8px',
                border:     'none',
                cursor:     requesting ? 'not-allowed' : 'pointer',
                opacity:    requesting ? 0.65 : 1,
                transition: 'opacity 150ms',
              }}
            >
              {requesting ? 'Enviando...' : 'Perfil completado — solicitar activación'}
            </button>
            {error && (
              <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#C4581A', marginTop: '8px' }}>
                {error}
              </p>
            )}
          </>
        )}

        {status === 'review' && (
          <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', lineHeight: 1.65, margin: 0 }}>
            Su solicitud está siendo revisada por el equipo de ARTIFEX7. Le notificaremos cuando su cuenta sea activada.
          </p>
        )}

        {status === 'suspended' && (
          <>
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', lineHeight: 1.65, margin: 0 }}>
              Su cuenta está suspendida por incumplimiento a los términos y condiciones de ARTIFEX7. Para más información contáctenos en artifex7net@gmail.com
            </p>
            <a
              href="mailto:artifex7net@gmail.com"
              style={{
                display:        'inline-block',
                marginTop:      '8px',
                fontFamily:     FONT_SANS,
                fontSize:       '13px',
                fontWeight:     600,
                color:          '#C4581A',
                textDecoration: 'none',
              }}
            >
              Contactar soporte →
            </a>
          </>
        )}
      </div>
    </div>
  )
}
