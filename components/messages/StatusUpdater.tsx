'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

interface StatusUpdaterProps {
  quoteId: string
  currentStatus: string
}

export function StatusUpdater({ quoteId, currentStatus }: StatusUpdaterProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const update = async (status: string) => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('quote_requests').update({ status }).eq('id', quoteId)
    setLoading(false)
    if (error) { toast.error('Error al actualizar estado'); return }
    toast.success('Estado actualizado')
    router.refresh()
  }

  if (currentStatus !== 'pending') return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
      <button
        onClick={() => update('accepted')}
        disabled={loading}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
          backgroundColor: '#1C1410', color: '#D4A96A', cursor: loading ? 'default' : 'pointer',
          fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 700, opacity: loading ? 0.7 : 1,
        }}
      >
        Aceptar solicitud
      </button>
      <button
        onClick={() => update('responded')}
        disabled={loading}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          backgroundColor: '#F5F0E8', color: '#1C1410',
          border: '1px solid #1C141020', cursor: loading ? 'default' : 'pointer',
          fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, opacity: loading ? 0.7 : 1,
        }}
      >
        Marcar como respondida
      </button>
      <button
        onClick={() => update('rejected')}
        disabled={loading}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          backgroundColor: 'transparent', color: '#6B7B6E',
          border: '1px solid #6B7B6E30', cursor: loading ? 'default' : 'pointer',
          fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500, opacity: loading ? 0.7 : 1,
        }}
      >
        Rechazar solicitud
      </button>
    </div>
  )
}
