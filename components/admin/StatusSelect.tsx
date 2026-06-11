'use client'

import { useState } from 'react'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  registered: { bg: '#7A7A7815', color: '#7A7A78', border: '#7A7A7830' },
  review:     { bg: '#D4963A15', color: '#C4581A', border: '#C4581A40' },
  active:     { bg: '#7A7A7820', color: '#3d4d40', border: '#3d4d4040' },
  suspended:  { bg: '#C4581A10', color: '#C4581A', border: '#C4581A40' },
}

export function StatusSelect({
  userId,
  initialStatus,
}: {
  userId: string
  initialStatus: string
}) {
  const [status, setStatus]   = useState(initialStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const s = STATUS_STYLES[status] ?? STATUS_STYLES.registered

  const onChange = async (next: string) => {
    setLoading(true)
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
    } catch (err: any) {
      setError(err.message ?? 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        style={{
          fontFamily: FONT_SANS,
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          background: s.bg,
          color: s.color,
          border: `1px solid ${s.border}`,
          borderRadius: '20px',
          padding: '4px 10px',
          cursor: loading ? 'wait' : 'pointer',
          outline: 'none',
          appearance: 'none',
          WebkitAppearance: 'none',
          opacity: loading ? 0.6 : 1,
        }}
      >
        <option value="registered">Registrado</option>
        <option value="review">En revisión</option>
        <option value="active">Activo</option>
        <option value="suspended">Suspendido</option>
      </select>
      {error && (
        <span style={{ fontFamily: FONT_SANS, fontSize: '11px', color: '#C4581A' }}>
          {error}
        </span>
      )}
    </div>
  )
}
