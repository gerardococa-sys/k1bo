'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

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
      {btn('✅ Activar',           'active',    '#7A7A7820', '#3d4d40')}
      {btn('⏸ Marcar en revisión', 'review',    '#D4963A15', '#C4581A')}
      {btn('🚫 Suspender',         'suspended', '#C4581A15', '#C4581A')}
    </div>
  )
}
