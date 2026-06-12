'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_INFO: Record<string, { label: string; bg: string; color: string }> = {
  registered: { label: 'Registrado',  bg: '#7A7A7815', color: '#7A7A78'  },
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
  const [status, setStatus] = useState(currentStatus)
  const [busy,   setBusy]   = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  const update = async (next: string) => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: next }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Error ${res.status}`)
      }
      setStatus(next)
      router.refresh()
    } catch (err: any) {
      setError(err.message ?? 'Error al actualizar')
    } finally {
      setBusy(false)
    }
  }

  const info = STATUS_INFO[status] ?? STATUS_INFO.registered

  const btn = (label: string, target: string, bg: string, color: string) => (
    <button
      key={target}
      onClick={() => update(target)}
      disabled={busy || status === target}
      style={{
        fontFamily: FONT_SANS,
        fontSize: '14px',
        fontWeight: 600,
        background: status === target ? '#2C2C2C08' : bg,
        color: status === target ? '#7A7A78' : color,
        border: 'none',
        borderRadius: '8px',
        padding: '10px 18px',
        cursor: status === target || busy ? 'default' : 'pointer',
        opacity: status === target ? 0.5 : busy ? 0.7 : 1,
        transition: 'opacity 150ms',
        textAlign: 'left' as const,
      }}
    >
      {busy ? '...' : label}
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

      {btn('✅ Activar',                 'active',     '#7A7A7820', '#3d4d40')}
      {btn('⏸ Marcar en revisión',     'review',     '#D4963A15', '#C4581A')}
      {btn('📋 Marcar como Registrado', 'registered', '#7A7A7815', '#7A7A78')}
      {btn('🚫 Suspender',             'suspended',  '#C4581A15', '#C4581A')}

      {error && (
        <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#C4581A', margin: '4px 0 0', fontWeight: 600 }}>
          ⚠ {error}
        </p>
      )}
    </div>
  )
}
