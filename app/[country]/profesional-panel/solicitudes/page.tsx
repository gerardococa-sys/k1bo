'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Eye, Inbox } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#D4A96A20', color: '#B85C1A', label: 'Pendiente'  },
  responded: { bg: '#1C141015', color: '#6B7B6E', label: 'Respondida' },
  accepted:  { bg: '#6B7B6E20', color: '#3d4d40', label: 'Aceptada'   },
  rejected:  { bg: '#1C141010', color: '#9B9B9B', label: 'Rechazada'  },
  completed: { bg: '#1C141015', color: '#1C1410', label: 'Finalizada' },
}

const FILTER_OPTIONS = [
  { value: 'all',       label: 'Todos'      },
  { value: 'pending',   label: 'Pendiente'  },
  { value: 'responded', label: 'Respondida' },
  { value: 'accepted',  label: 'Aceptada'   },
  { value: 'rejected',  label: 'Rechazada'  },
  { value: 'completed', label: 'Finalizada' },
]

function formatDate(ts: string | null | undefined) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-SV', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function Avatar({ name, photoUrl, size = 32 }: { name?: string; photoUrl?: string; size?: number }) {
  const letters = (name ?? '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  if (photoUrl) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: '#B85C1A15', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#B85C1A' }}>
        {letters}
      </span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const b = STATUS_BADGE[status] ?? STATUS_BADGE.pending
  return (
    <span style={{
      fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
      background: b.bg, color: b.color,
      padding: '3px 10px', borderRadius: '20px',
    }}>
      {b.label}
    </span>
  )
}

export default function ProSolicitudesPage() {
  const supabase = createClient()
  const router   = useRouter()
  const params   = useParams<{ country: string }>()

  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [hoveredRow, setHoveredRow]   = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      supabase
        .from('quote_requests')
        .select(`
          id,
          created_at,
          required_date,
          responded_at,
          status,
          description,
          client:profiles!quote_requests_client_id_fkey(
            full_name,
            photo_url
          ),
          category:categories!quote_requests_category_id_fkey(
            name
          ),
          subcategory:categories!quote_requests_subcategory_id_fkey(
            name
          )
        `)
        .eq('professional_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setSolicitudes(data ?? [])
          setLoading(false)
        })
    })
  }, [])

  const filtered = activeFilter === 'all'
    ? solicitudes
    : solicitudes.filter((s) => s.status === activeFilter)

  if (loading) {
    return (
      <div style={{ fontFamily: FONT_SANS, color: '#6B7B6E', padding: '48px 24px', textAlign: 'center' }}>
        Cargando...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Volver */}
      <Link
        href={`/${params.country}/profesional-panel/dashboard`}
        className="pro-sol-back"
        style={{
          fontFamily: FONT_SANS, fontSize: '15px', color: '#B85C1A',
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
          gap: '6px', marginBottom: '24px',
        }}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver al Dashboard
      </Link>

      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <h1 style={{
          fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700,
          color: '#1C1410', margin: 0,
        }}>
          Mis Solicitudes
        </h1>
        <span style={{
          fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600,
          color: '#6B7B6E', background: '#1C141010',
          padding: '4px 12px', borderRadius: '20px',
        }}>
          {solicitudes.length} {solicitudes.length === 1 ? 'solicitud' : 'solicitudes'}
        </span>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTER_OPTIONS.map((opt) => {
          const active = activeFilter === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              style={{
                fontFamily: FONT_SANS, fontSize: '13px', fontWeight: active ? 600 : 400,
                padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                border: '1px solid #D4A96A40',
                background: active ? '#1C1410' : 'transparent',
                color:      active ? '#D4A96A'  : '#6B7B6E',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Estado vacío */}
      {filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '64px 24px', gap: '16px',
        }}>
          <Inbox style={{ width: 48, height: 48, color: '#D4A96A', opacity: 0.5 }} />
          <p style={{ fontFamily: FONT_SANS, fontSize: '18px', color: '#6B7B6E', margin: 0, textAlign: 'center' }}>
            Aún no has recibido solicitudes
          </p>
        </div>
      ) : (
        <>
          {/* ── TABLA DESKTOP ── */}
          <div className="pro-sol-table" style={{
            background: '#fff',
            borderRadius: '12px',
            border: '0.5px solid #1C141015',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '10% 18% 16% 12% 12% 12% 12% 8%',
              background: '#F5F0E8',
              padding: '12px 16px',
              gap: '0',
            }}>
              {['Código', 'Cliente', 'Tipo de trabajo', 'Fecha solicitud', 'Fecha requerida', 'Fecha cotización', 'Estado', 'Acciones'].map((col) => (
                <div key={col} style={{
                  fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7B6E',
                }}>
                  {col}
                </div>
              ))}
            </div>

            {/* Filas */}
            {filtered.map((s) => {
              const client      = s.client as any
              const category    = s.category as any
              const subcategory = s.subcategory as any
              const clientName  = client?.full_name ?? 'Propietario'
              const isHovered   = hoveredRow === s.id

              return (
                <div
                  key={s.id}
                  onMouseEnter={() => setHoveredRow(s.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '10% 18% 16% 12% 12% 12% 12% 8%',
                    padding: '14px 16px',
                    borderBottom: '0.5px solid #1C141008',
                    alignItems: 'center',
                    minHeight: '56px',
                    background: isHovered ? '#F5F0E880' : 'transparent',
                    transition: 'background 0.12s',
                  }}
                >
                  {/* Código */}
                  <div>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '13px', color: '#6B7B6E',
                      background: '#1C141008', padding: '3px 8px', borderRadius: '6px',
                    }}>
                      {s.id.substring(0, 8).toUpperCase()}
                    </span>
                  </div>

                  {/* Cliente */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar name={clientName} photoUrl={client?.photo_url} size={32} />
                    <span style={{
                      fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500,
                      color: '#1C1410', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {clientName}
                    </span>
                  </div>

                  {/* Tipo de trabajo */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410' }}>
                      {category?.name ?? '—'}
                    </span>
                    {subcategory?.name && (
                      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#6B7B6E' }}>
                        {subcategory.name}
                      </span>
                    )}
                  </div>

                  {/* Fecha solicitud */}
                  <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410' }}>
                    {formatDate(s.created_at)}
                  </div>

                  {/* Fecha requerida */}
                  <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: s.required_date ? '#1C1410' : '#6B7B6E' }}>
                    {formatDate(s.required_date)}
                  </div>

                  {/* Fecha cotización */}
                  <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: s.responded_at ? '#1C1410' : '#6B7B6E' }}>
                    {formatDate(s.responded_at)}
                  </div>

                  {/* Estado */}
                  <div>
                    <StatusBadge status={s.status} />
                  </div>

                  {/* Acciones */}
                  <div>
                    <Link
                      href={`/${params.country}/profesional-panel/solicitudes/${s.id}`}
                      className="pro-sol-ver-btn"
                      style={{
                        fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600,
                        color: '#B85C1A', textDecoration: 'none',
                        border: '1px solid #B85C1A40', borderRadius: '6px',
                        padding: '6px 12px',
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        background: 'transparent', transition: 'background 0.12s',
                      }}
                    >
                      <Eye style={{ width: 14, height: 14 }} />
                      Ver
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── CARDS MOBILE ── */}
          <div className="pro-sol-cards">
            {filtered.map((s) => {
              const client      = s.client as any
              const category    = s.category as any
              const subcategory = s.subcategory as any
              const clientName  = client?.full_name ?? 'Propietario'

              return (
                <div key={s.id} style={{
                  background: '#fff',
                  border: '0.5px solid #1C141015',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '10px',
                }}>
                  {/* Código + estado */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '13px', color: '#6B7B6E',
                      background: '#1C141008', padding: '3px 8px', borderRadius: '6px',
                    }}>
                      {s.id.substring(0, 8).toUpperCase()}
                    </span>
                    <StatusBadge status={s.status} />
                  </div>

                  {/* Cliente */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Avatar name={clientName} photoUrl={client?.photo_url} size={32} />
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500, color: '#1C1410' }}>
                      {clientName}
                    </span>
                  </div>

                  {/* Categoría */}
                  {category?.name && (
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410' }}>
                        {category.name}
                      </span>
                      {subcategory?.name && (
                        <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#6B7B6E', marginLeft: '6px' }}>
                          {subcategory.name}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Fechas */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '8px', marginBottom: '14px',
                  }}>
                    {[
                      { label: 'Solicitud',   val: s.created_at   },
                      { label: 'Requerida',   val: s.required_date },
                      { label: 'Cotización',  val: s.responded_at  },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <div style={{ fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                          {label}
                        </div>
                        <div style={{ fontFamily: FONT_SANS, fontSize: '13px', color: val ? '#1C1410' : '#6B7B6E' }}>
                          {formatDate(val)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botón */}
                  <Link
                    href={`/${params.country}/profesional-panel/solicitudes/${s.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      width: '100%', padding: '10px',
                      fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#B85C1A',
                      border: '1px solid #B85C1A40', borderRadius: '8px',
                      textDecoration: 'none', background: 'transparent', boxSizing: 'border-box',
                    }}
                  >
                    <Eye style={{ width: 15, height: 15 }} />
                    Ver detalle
                  </Link>
                </div>
              )
            })}
          </div>
        </>
      )}

      <style>{`
        .pro-sol-back:hover { text-decoration: underline !important; }
        .pro-sol-ver-btn:hover { background: #B85C1A10 !important; }

        /* Desktop: tabla visible, cards ocultos */
        .pro-sol-table  { display: block; }
        .pro-sol-cards  { display: none; }

        /* Mobile: tabla oculta, cards visibles */
        @media (max-width: 767px) {
          .pro-sol-table { display: none; }
          .pro-sol-cards { display: block; }
        }
      `}</style>
    </div>
  )
}
