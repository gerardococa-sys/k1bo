'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useSearchParams } from 'next/navigation'
import MessageBoard from '@/components/messages/MessageBoard'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

export default function MensajesPage() {
  const params = useParams<{ country: string }>()
  const searchParams = useSearchParams()
  const solicitudId = searchParams.get('solicitud')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div style={{ padding: '48px 24px', textAlign: 'center', fontFamily: FONT_SANS, color: '#6B7B6E' }}>
      Cargando mensajes...
    </div>
  )

  if (!solicitudId) return (
    <div style={{ padding: '48px 24px', textAlign: 'center', fontFamily: FONT_SANS, color: '#6B7B6E' }}>
      <p style={{ fontSize: '18px' }}>
        Selecciona una conversación para comenzar
      </p>
    </div>
  )

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{
        fontFamily: FONT_SERIF,
        fontSize: '32px',
        fontWeight: 700,
        color: '#1C1410',
        marginBottom: '24px',
      }}>
        Mensajes
      </h1>
      {userId && (
        <MessageBoard
          quoteRequestId={solicitudId}
          currentUserId={userId}
          otherPartyName="Participante"
        />
      )}
    </div>
  )
}
