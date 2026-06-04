'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { UnreadDot } from '@/components/messages/UnreadDot'
import { formatDate } from '@/lib/utils'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#D4A96A20', color: '#B85C1A', label: 'Pendiente' },
  responded: { bg: '#1C141015', color: '#1C1410', label: 'Respondida' },
  accepted:  { bg: '#6B7B6E20', color: '#3d4d40', label: 'Aceptada' },
  rejected:  { bg: '#1C141010', color: '#6B7B6E', label: 'Rechazada' },
}

function Initials({ name }: { name?: string }) {
  const letters = (name ?? '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div style={{
      width: 48, height: 48, borderRadius: '50%', backgroundColor: '#B85C1A15',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontFamily: FONT_SERIF, fontSize: '16px', fontWeight: 700, color: '#B85C1A' }}>{letters}</span>
    </div>
  )
}

export default function ProSolicitudesPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams<{ country: string }>()

  const [userId, setUserId] = useState('')
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [latestMsgMap, setLatestMsgMap] = useState<Record<string, string>>({})

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      supabase
        .from('quote_requests')
        .select(`
          *,
          category:categories!quote_requests_category_id_fkey(name),
          subcategory:categories!quote_requests_subcategory_id_fkey(name),
          client:profiles!client_id(full_name, photo_url)
        `)
        .eq('professional_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => { setQuotes(data ?? []); setLoading(false) })
    })
  }, [])

  useEffect(() => {
    if (!userId || quotes.length === 0) return
    const ids = quotes.map((q) => q.id)
    supabase
      .from('quote_messages')
      .select('quote_request_id, created_at')
      .in('quote_request_id', ids)
      .neq('sender_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const map: Record<string, string> = {}
        data?.forEach((m: any) => {
          if (!map[m.quote_request_id]) map[m.quote_request_id] = m.created_at
        })
        setLatestMsgMap(map)
      })
  }, [userId, quotes])

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando...</div>

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link
        href={`/${params.country}/profesional-panel/dashboard`}
        style={{
          fontFamily: FONT_SANS, fontSize: '15px', color: '#B85C1A', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px',
        }}
        className="pro-sol-back"
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver al Dashboard
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#1C1410', margin: 0 }}>
          Mis Solicitudes
        </h1>
        <span style={{
          fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#6B7B6E',
          backgroundColor: '#1C141010', padding: '4px 12px', borderRadius: '20px',
        }}>
          {quotes.length} {quotes.length === 1 ? 'solicitud' : 'solicitudes'}
        </span>
      </div>

      {quotes.length === 0 ? (
        <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#6B7B6E', textAlign: 'center', padding: '48px 0' }}>
          Aún no tienes solicitudes.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {quotes.map((q) => {
            const client  = q.client as any
            const clientName  = client?.full_name ?? 'Propietario'
            const clientPhoto = client?.photo_url
            const category    = q.category as any
            const subcategory = q.subcategory as any
            const badge       = STATUS_BADGE[q.status] ?? STATUS_BADGE.pending

            return (
              <div key={q.id} style={{
                backgroundColor: '#fff',
                border: '0.5px solid #1C141015',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
              }}>
                {/* Avatar */}
                {clientPhoto ? (
                  <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={clientPhoto} alt={clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <Initials name={clientName} />
                )}

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FONT_SERIF, fontSize: '17px', fontWeight: 600, color: '#1C1410', margin: '0 0 4px' }}>
                    {clientName}
                  </p>
                  {category && (
                    <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#B85C1A', margin: '0 0 6px' }}>
                      {category.name}{subcategory ? ` › ${subcategory.name}` : ''}
                    </p>
                  )}
                  <p style={{
                    fontFamily: FONT_SANS, fontSize: '14px', color: 'rgba(28,20,16,0.65)',
                    margin: '0 0 8px',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {q.description}
                  </p>
                  {q.required_date && (
                    <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#6B7B6E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar style={{ width: 12, height: 12 }} />
                      Fecha requerida: {formatDate(q.required_date)}
                    </span>
                  )}
                </div>

                {/* Right: status + link */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                  <span style={{
                    fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                    backgroundColor: badge.bg, color: badge.color,
                    padding: '4px 10px', borderRadius: '20px',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    {badge.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UnreadDot solicitudId={q.id} latestAt={latestMsgMap[q.id] ?? null} />
                    <Link
                      href={`/${params.country}/profesional-panel/solicitudes/${q.id}`}
                      style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#B85C1A', textDecoration: 'none' }}
                      className="pro-sol-detail-link"
                    >
                      Ver detalle →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .pro-sol-back:hover        { text-decoration: underline; }
        .pro-sol-detail-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
