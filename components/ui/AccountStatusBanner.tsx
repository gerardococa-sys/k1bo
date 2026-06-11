'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

interface AccountStatusBannerProps {
  status:               'registered' | 'review' | 'active' | 'suspended'
  role?:                string
  professionalId?:      string
  activationRequested?: boolean
  country?:             string
}

export function AccountStatusBanner({
  status,
  role,
  professionalId,
  activationRequested: initialRequested = false,
  country = 'sv',
}: AccountStatusBannerProps) {
  const [requested, setRequested] = useState(initialRequested)
  const [loading,   setLoading]   = useState(false)
  const [sent,      setSent]      = useState(false)

  if (status === 'active') return null

  async function handleRequestActivation() {
    if (!professionalId) return
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from('professionals')
      .update({
        activation_requested:    true,
        activation_requested_at: new Date().toISOString(),
      })
      .eq('id', professionalId)
    setRequested(true)
    setSent(true)
    setLoading(false)
  }

  // ── Suspendido ──────────────────────────────────────────────────────────────
  if (status === 'suspended') {
    return (
      <div style={{
        background: '#C4581A10', border: '1.5px solid #C4581A40',
        borderRadius: '10px', padding: '16px 20px', marginBottom: '24px',
        display: 'flex', alignItems: 'flex-start', gap: '14px',
      }}>
        <span style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px' }}>🚫</span>
        <div>
          <p style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#C4581A', margin: '0 0 4px' }}>
            Cuenta suspendida
          </p>
          <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', lineHeight: 1.65, margin: 0 }}>
            Su cuenta está suspendida por incumplimiento a los términos y condiciones de ARTIFEX7.
          </p>
          <a
            href="mailto:artifex7net@gmail.com"
            style={{ display: 'inline-block', marginTop: '8px', fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#C4581A', textDecoration: 'none' }}
          >
            Contactar soporte →
          </a>
        </div>
      </div>
    )
  }

  // ── Profesional en revisión (o registrado) ──────────────────────────────────
  if (role === 'professional') {
    return (
      <div style={{
        background: '#D4963A10', border: '1.5px solid #D4963A50',
        borderRadius: '10px', padding: '20px 24px', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <span style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px' }}>⏳</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#C4581A', margin: '0 0 8px' }}>
              Cuenta en revisión
            </p>

            {requested ? (
              <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', lineHeight: 1.65, margin: 0 }}>
                {sent
                  ? '✅ Tu solicitud de activación fue enviada. El equipo de ARTIFEX7 revisará tu perfil y te notificará cuando esté activo.'
                  : '✅ Ya enviaste tu solicitud de activación. El equipo de ARTIFEX7 revisará tu perfil y te notificará cuando esté activo.'
                }
              </p>
            ) : (
              <>
                <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', lineHeight: 1.65, margin: '0 0 16px' }}>
                  Por favor ve a la sección de{' '}
                  <Link
                    href={`/${country}/profesional-panel/perfil`}
                    style={{ color: '#C4581A', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Mi Perfil
                  </Link>
                  {' '}y completa las diferentes secciones. Cuando las hayas completado da clic al siguiente botón para que validemos tu cuenta.
                </p>
                <button
                  onClick={handleRequestActivation}
                  disabled={loading}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: loading ? '#1E1E1E50' : '#1E1E1E',
                    color: '#D4963A', fontFamily: FONT_SANS,
                    fontSize: '14px', fontWeight: 700,
                    padding: '11px 20px', borderRadius: '8px',
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1, transition: 'opacity 150ms',
                  }}
                >
                  {loading ? 'Enviando...' : '✓ Perfil completado, solicitar activación'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Propietario / cliente en revisión ───────────────────────────────────────
  return (
    <div style={{
      background: '#D4963A10', border: '1.5px solid #D4963A50',
      borderRadius: '10px', padding: '16px 20px', marginBottom: '24px',
      display: 'flex', alignItems: 'flex-start', gap: '14px',
    }}>
      <span style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px' }}>⏳</span>
      <div>
        <p style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#C4581A', margin: '0 0 4px' }}>
          Cuenta en revisión
        </p>
        <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', lineHeight: 1.65, margin: 0 }}>
          Su solicitud está siendo revisada por el equipo de ARTIFEX7. Le notificaremos cuando su cuenta sea activada.
        </p>
      </div>
    </div>
  )
}
