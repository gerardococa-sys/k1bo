'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useSearchParams } from 'next/navigation'
import MessageBoard from '@/components/messages/MessageBoard'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

export default function MensajesPage() {
  const params      = useParams<{ country: string }>()
  const searchParams = useSearchParams()
  const solicitudId  = searchParams.get('solicitud')

  const [userId,       setUserId]       = useState('')
  const [userRole,     setUserRole]     = useState('')
  const [loading,      setLoading]      = useState(true)
  const [solicitud,    setSolicitud]    = useState<any>(null)
  const [otherName,    setOtherName]    = useState('Participante')
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    async function init() {
      const supabase = createClient()

      // 1. Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUserId(user.id)

      // 2. Obtener role del usuario
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      setUserRole(profile?.role ?? '')

      // 3. Si hay solicitudId, cargar datos de la solicitud
      if (solicitudId) {
        const { data: sol } = await supabase
          .from('quote_requests')
          .select(`
            id,
            client_id,
            professional_id,
            category_id,
            subcategory_id
          `)
          .eq('id', solicitudId)
          .single()

        if (sol) {
          setSolicitud(sol)

          // 4. Obtener nombre del otro participante
          const otherPartyId = user.id === sol.client_id
            ? sol.professional_id
            : sol.client_id

          const { data: otherProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', otherPartyId)
            .single()

          if (otherProfile?.full_name) {
            setOtherName(otherProfile.full_name)
          }

          // 5. Obtener nombre de la categoría
          const catId = sol.subcategory_id ?? sol.category_id
          if (catId) {
            const { data: cat } = await supabase
              .from('categories')
              .select('name')
              .eq('id', catId)
              .single()
            if (cat?.name) setCategoryName(cat.name)
          }
        }
      }

      setLoading(false)
    }
    init()
  }, [solicitudId])

  // Link de regreso según el role del usuario
  const backHref = solicitud
    ? userRole === 'professional'
      ? `/${params.country}/profesional-panel/solicitudes/${solicitudId}`
      : `/${params.country}/cliente/solicitudes/${solicitudId}`
    : userRole === 'professional'
      ? `/${params.country}/profesional-panel/dashboard`
      : `/${params.country}/cliente/dashboard`

  const backLabel = solicitud
    ? '← Volver a la solicitud'
    : '← Volver al Dashboard'

  if (loading) return (
    <div style={{
      padding: '48px 24px',
      textAlign: 'center',
      fontFamily: FONT_SANS,
      color: '#6B7B6E'
    }}>
      Cargando mensajes...
    </div>
  )

  if (!solicitudId) return (
    <div style={{
      padding: '48px 24px',
      textAlign: 'center',
      fontFamily: FONT_SANS,
      color: '#6B7B6E'
    }}>
      <p style={{ fontSize: '18px', marginBottom: '16px' }}>
        No se especificó ninguna conversación
      </p>
      <Link
        href={`/${params.country}/cliente/dashboard`}
        style={{
          color: '#B85C1A',
          fontSize: '15px',
          textDecoration: 'none',
          fontFamily: FONT_SANS,
        }}
      >
        ← Volver al Dashboard
      </Link>
    </div>
  )

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '32px 24px',
      background: '#F5F0E8',
      minHeight: '100vh'
    }}>

      {/* Volver a la solicitud */}
      <Link
        href={backHref}
        style={{
          fontFamily: FONT_SANS,
          fontSize: '15px',
          color: '#B85C1A',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '24px',
        }}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        {backLabel}
      </Link>

      {/* Cabecera */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: FONT_SERIF,
          fontSize: '32px',
          fontWeight: 700,
          color: '#1C1410',
          margin: '0 0 6px',
        }}>
          Mensajes
        </h1>

        {/* Subtítulo con nombre del profesional y categoría */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontFamily: FONT_SANS,
            fontSize: '16px',
            fontWeight: 600,
            color: '#1C1410',
          }}>
            {otherName}
          </span>
          {categoryName && (
            <>
              <span style={{ color: '#D4A96A', fontSize: '14px' }}>·</span>
              <span style={{
                fontFamily: FONT_SANS,
                fontSize: '14px',
                color: '#B85C1A',
                fontWeight: 500,
              }}>
                {categoryName}
              </span>
            </>
          )}
          {solicitudId && (
            <>
              <span style={{ color: '#D4A96A', fontSize: '14px' }}>·</span>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#6B7B6E',
                background: '#1C141010',
                padding: '2px 8px',
                borderRadius: '6px',
              }}>
                {solicitudId.substring(0, 8).toUpperCase()}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Chat */}
      {userId && (
        <MessageBoard
          quoteRequestId={solicitudId}
          currentUserId={userId}
          otherPartyName={otherName}
        />
      )}

      {/* Link adicional a la solicitud al final */}
      {solicitud && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link
            href={backHref}
            style={{
              fontFamily: FONT_SANS,
              fontSize: '14px',
              color: '#6B7B6E',
              textDecoration: 'none',
            }}
          >
            Ver detalle completo de la solicitud →
          </Link>
        </div>
      )}

    </div>
  )
}
