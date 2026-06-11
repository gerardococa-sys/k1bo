'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_INFO: Record<string, { label: string; bg: string; color: string }> = {
  registered: { label: 'Registrado',  bg: '#1E1E1E12', color: '#1E1E1E'  },
  review:     { label: 'En revisión', bg: '#D4963A15', color: '#C4581A'  },
  active:     { label: 'Activo',      bg: '#7A7A7820', color: '#3d4d40'  },
  suspended:  { label: 'Suspendido',  bg: '#C4581A15', color: '#C4581A'  },
}

export function StatusActions({
  userId,
  currentStatus,
}: {
  userId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const update = async (status: string) => {
    setBusy(true)
    await fetch('/api/admin/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status }),
    })
    setBusy(false)
    router.refresh()
  }

  const info = STATUS_INFO[currentStatus] ?? STATUS_INFO.registered

  const btn = (
    label: string,
    status: string,
    bg: string,
    color: string,
  ) => (
    <button
      onClick={() => update(status)}
      disabled={busy || currentStatus === status}
      style={{
        fontFamily: FONT_SANS,
        fontSize: '14px',
        fontWeight: 600,
        background: currentStatus === status ? '#2C2C2C08' : bg,
        color: currentStatus === status ? '#7A7A78' : color,
        border: 'none',
        borderRadius: '8px',
        padding: '10px 18px',
        cursor: currentStatus === status || busy ? 'default' : 'pointer',
        opacity: currentStatus === status ? 0.5 : 1,
        transition: 'opacity 150ms',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#7A7A78' }}>Estado actual:</span>
        <span style={{
          fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.05em',
          background: info.bg, color: info.color,
          padding: '3px 10px', borderRadius: '20px',
        }}>
          {info.label}
        </span>
      </div>
      {btn('✅ Activar',                'active',     '#7A7A7820', '#3d4d40')}
      {btn('⏸ Marcar en revisión',    'review',     '#D4963A15', '#C4581A')}
      {btn('📋 Marcar como Registrado','registered', '#1E1E1E12', '#1E1E1E')}
      {btn('🚫 Suspender',            'suspended',  '#C4581A15', '#C4581A')}
    </div>
  )
}
