'use client'

import { useState } from 'react'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  review:    { bg: '#D4963A15', color: '#C4581A' },
  active:    { bg: '#7A7A7820', color: '#3d4d40' },
  suspended: { bg: '#C4581A10', color: '#C4581A' },
}

export function StatusSelect({
  userId,
  initialStatus,
}: {
  userId: string
  initialStatus: string
}) {
  const [status, setStatus] = useState(initialStatus)
  const [busy, setBusy] = useState(false)
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.review

  const onChange = async (next: string) => {
    setBusy(true)
    const res = await fetch('/api/admin/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status: next }),
    })
    if (res.ok) setStatus(next)
    setBusy(false)
  }

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      disabled={busy}
      style={{
        fontFamily: FONT_SANS,
        fontSize: '12px',
        fontWeight: 700,
        background: s.bg,
        color: s.color,
        border: 'none',
        borderRadius: '20px',
        padding: '4px 10px',
        cursor: busy ? 'wait' : 'pointer',
        outline: 'none',
      }}
    >
      <option value="review">En revisión</option>
      <option value="active">Activo</option>
      <option value="suspended">Suspendido</option>
    </select>
  )
}
