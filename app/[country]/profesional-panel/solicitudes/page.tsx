export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft, Eye, Inbox } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ClientAvatar } from '@/components/ui/ClientAvatar'
import { Pagination } from '@/components/ui/Pagination'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#D4963A20', color: '#C4581A', label: 'Pendiente'   },
  responded: { bg: '#2C2C2C12', color: '#7A7A78', label: 'Cotizada'    },
  revision:  { bg: '#D4963A15', color: '#C4581A', label: 'En revisión' },
  accepted:  { bg: '#7A7A7820', color: '#3d4d40', label: 'Aceptada'    },
  rejected:  { bg: '#2C2C2C10', color: '#9B9B9B', label: 'Rechazada'   },
  completed: { bg: '#2C2C2C12', color: '#2C2C2C', label: 'Finalizada'  },
}

const FILTER_OPTIONS = [
  { value: 'all',       label: 'Todos'       },
  { value: 'pending',   label: 'Pendiente'   },
  { value: 'responded', label: 'Cotizada'    },
  { value: 'revision',  label: 'En revisión' },
  { value: 'accepted',  label: 'Aceptada'    },
  { value: 'rejected',  label: 'Rechazada'   },
  { value: 'completed', label: 'Finalizada'  },
]

function formatDate(ts: string | null | undefined) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const b = STATUS_BADGE[status] ?? STATUS_BADGE.pending
  return (
    <span style={{
      fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
      background: b.bg, color: b.color, padding: '3px 10px', borderRadius: '20px',
    }}>
      {b.label}
    </span>
  )
}

export default async function ProSolicitudesPage({
  params,
  searchParams,
}: {
  params:       { country: string }
  searchParams: { page?: string; size?: string; filter?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const filter   = FILTER_OPTIONS.some((o) => o.value === searchParams.filter)
    ? (searchParams.filter ?? 'all')
    : 'all'
  const pageSize = [10, 20, 50, 100].includes(Number(searchParams.size))
    ? Number(searchParams.size) : 10
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const from = (page - 1) * pageSize
  const to   = from + pageSize - 1

  let countQuery = supabase
    .from('quote_requests')
    .select('*', { count: 'exact', head: true })
    .eq('professional_id', user.id)
  if (filter !== 'all') countQuery = (countQuery as any).eq('status', filter)
  const { count: total } = await countQuery

  let dataQuery = supabase
    .from('quote_requests')
    .select('id, created_at, required_date, responded_at, status, client_id, category_id, subcategory_id')
    .eq('professional_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)
  if (filter !== 'all') dataQuery = (dataQuery as any).eq('status', filter)
  const { data: solicitudes } = await dataQuery

  const clientIds = Array.from(new Set((solicitudes ?? []).map((s: any) => s.client_id).filter(Boolean)))
  const catIds    = Array.from(new Set([
    ...(solicitudes ?? []).map((s: any) => s.category_id),
    ...(solicitudes ?? []).map((s: any) => s.subcategory_id),
  ].filter(Boolean)))

  const [clientsRes, catsRes] = await Promise.all([
    clientIds.length
      ? supabase.from('profiles').select('id, full_name, photo_url').in('id', clientIds)
      : Promise.resolve({ data: [] }),
    catIds.length
      ? supabase.from('categories').select('id, name').in('id', catIds)
      : Promise.resolve({ data: [] }),
  ])

  const clientsMap = Object.fromEntries(((clientsRes as any).data ?? []).map((c: any) => [c.id, c]))
  const catsMap    = Object.fromEntries(((catsRes as any).data ?? []).map((c: any) => [c.id, c]))

  const enriched = (solicitudes ?? []).map((s: any) => ({
    ...s,
    clientData:      clientsMap[s.client_id]      ?? null,
    categoryData:    catsMap[s.category_id]        ?? null,
    subcategoryData: catsMap[s.subcategory_id]     ?? null,
  }))

  const totalPages = Math.ceil((total ?? 0) / pageSize)
  const basePath   = `/${params.country}/profesional-panel/solicitudes`
  const filterPath = `${basePath}?filter=${filter}`

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Volver */}
      <Link
        href={`/${params.country}/profesional-panel/dashboard`}
        className="pro-sol-back"
        style={{
          fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A',
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
          gap: '6px', marginBottom: '24px',
        }}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver al Dashboard
      </Link>

      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#2C2C2C', margin: 0 }}>
          Mis Solicitudes
        </h1>
        <span style={{
          fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600,
          color: '#7A7A78', background: '#2C2C2C10',
          padding: '4px 12px', borderRadius: '20px',
        }}>
          {total ?? 0} {(total ?? 0) === 1 ? 'solicitud' : 'solicitudes'}
        </span>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTER_OPTIONS.map((opt) => {
          const active = filter === opt.value
          return (
            <Link
              key={opt.value}
              href={`${basePath}?filter=${opt.value}&page=1&size=${pageSize}`}
              style={{
                fontFamily: FONT_SANS, fontSize: '13px', fontWeight: active ? 600 : 400,
                padding: '6px 14px', borderRadius: '20px',
                border: '1px solid #D4963A40',
                background: active ? '#1E1E1E' : 'transparent',
                color:      active ? '#D4963A' : '#7A7A78',
                textDecoration: 'none', transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </Link>
          )
        })}
      </div>

      {/* Selector de tamaño */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Mostrar:</span>
        {[10, 20, 50, 100].map((size) => (
          <Link
            key={size}
            href={`${basePath}?filter=${filter}&page=1&size=${size}`}
            style={{
              fontFamily: FONT_SANS, fontSize: '13px',
              fontWeight: pageSize === size ? 700 : 400,
              color: pageSize === size ? '#C4581A' : '#7A7A78',
              padding: '4px 10px', borderRadius: '6px',
              background: pageSize === size ? '#C4581A12' : 'transparent',
              border: pageSize === size ? '1px solid #C4581A40' : '1px solid transparent',
              textDecoration: 'none',
            }}
          >
            {size}
          </Link>
        ))}
      </div>

      {/* Estado vacío */}
      {enriched.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 24px', gap: '16px' }}>
          <Inbox style={{ width: 48, height: 48, color: '#D4963A', opacity: 0.5 }} />
          <p style={{ fontFamily: FONT_SANS, fontSize: '18px', color: '#7A7A78', margin: 0, textAlign: 'center' }}>
            {filter === 'all' ? 'Aún no has recibido solicitudes' : 'No hay solicitudes con este filtro'}
          </p>
        </div>
      ) : (
        <>
          {/* ── TABLA DESKTOP ── */}
          <div className="pro-sol-table" style={{
            background: '#fff', borderRadius: '12px',
            border: '0.5px solid #2C2C2C12', overflow: 'hidden',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '10% 18% 16% 12% 12% 12% 12% 8%',
              background: '#F2F0ED', padding: '12px 16px', gap: 0,
            }}>
              {['Código', 'Cliente', 'Tipo de trabajo', 'Fecha solicitud', 'Fecha requerida', 'Fecha cotización', 'Estado', 'Acciones'].map((col) => (
                <div key={col} style={{
                  fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7A78',
                }}>
                  {col}
                </div>
              ))}
            </div>

            {enriched.map((s: any) => (
              <div
                key={s.id}
                className="pro-sol-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '10% 18% 16% 12% 12% 12% 12% 8%',
                  padding: '14px 16px', borderBottom: '0.5px solid #2C2C2C08',
                  alignItems: 'center', minHeight: '56px',
                }}
              >
                <div>
                  <span style={{
                    fontFamily: 'monospace', fontSize: '13px', color: '#7A7A78',
                    background: '#2C2C2C08', padding: '3px 8px', borderRadius: '6px',
                  }}>
                    {s.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ClientAvatar name={s.clientData?.full_name ?? '?'} photoUrl={s.clientData?.photo_url ?? null} size={32} />
                  <span style={{
                    fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500,
                    color: '#2C2C2C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {s.clientData?.full_name ?? '—'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>
                    {s.categoryData?.name ?? '—'}
                  </span>
                  {s.subcategoryData?.name && (
                    <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#7A7A78' }}>
                      {s.subcategoryData.name}
                    </span>
                  )}
                </div>

                <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>
                  {formatDate(s.created_at)}
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: s.required_date ? '#1E1E1E' : '#7A7A78' }}>
                  {formatDate(s.required_date)}
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: s.responded_at ? '#1E1E1E' : '#7A7A78' }}>
                  {formatDate(s.responded_at)}
                </div>

                <div><StatusBadge status={s.status} /></div>

                <div>
                  <Link
                    href={`/${params.country}/profesional-panel/solicitudes/${s.id}`}
                    className="pro-sol-ver-btn"
                    style={{
                      fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600,
                      color: '#C4581A', textDecoration: 'none',
                      border: '1px solid #C4581A40', borderRadius: '6px',
                      padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px',
                      background: 'transparent', transition: 'background 0.12s',
                    }}
                  >
                    <Eye style={{ width: 14, height: 14 }} />
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* ── CARDS MOBILE ── */}
          <div className="pro-sol-cards">
            {enriched.map((s: any) => (
              <div key={s.id} style={{
                background: '#fff', border: '0.5px solid #2C2C2C12',
                borderRadius: '10px', padding: '16px', marginBottom: '10px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    fontFamily: 'monospace', fontSize: '13px', color: '#7A7A78',
                    background: '#2C2C2C08', padding: '3px 8px', borderRadius: '6px',
                  }}>
                    {s.id.substring(0, 8).toUpperCase()}
                  </span>
                  <StatusBadge status={s.status} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <ClientAvatar name={s.clientData?.full_name ?? '?'} photoUrl={s.clientData?.photo_url ?? null} size={32} />
                  <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500, color: '#2C2C2C' }}>
                    {s.clientData?.full_name ?? '—'}
                  </span>
                </div>

                {s.categoryData?.name && (
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>
                      {s.categoryData.name}
                    </span>
                    {s.subcategoryData?.name && (
                      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#7A7A78', marginLeft: '6px' }}>
                        {s.subcategoryData.name}
                      </span>
                    )}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { label: 'Solicitud',  val: s.created_at   },
                    { label: 'Requerida',  val: s.required_date },
                    { label: 'Cotización', val: s.responded_at  },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div style={{ fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                        {label}
                      </div>
                      <div style={{ fontFamily: FONT_SANS, fontSize: '13px', color: val ? '#1E1E1E' : '#7A7A78' }}>
                        {formatDate(val)}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/${params.country}/profesional-panel/solicitudes/${s.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    width: '100%', padding: '10px',
                    fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#C4581A',
                    border: '1px solid #C4581A40', borderRadius: '8px',
                    textDecoration: 'none', background: 'transparent', boxSizing: 'border-box',
                  }}
                >
                  <Eye style={{ width: 15, height: 15 }} />
                  Ver detalle
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        basePath={filterPath}
      />

      <style>{`
        .pro-sol-back:hover     { text-decoration: underline !important; }
        .pro-sol-ver-btn:hover  { background: #C4581A10 !important; }
        .pro-sol-row:hover      { background: #F2F0ED80; }

        .pro-sol-table { display: block; }
        .pro-sol-cards { display: none; }

        @media (max-width: 767px) {
          .pro-sol-table { display: none; }
          .pro-sol-cards { display: block; }
        }
      `}</style>
    </div>
  )
}
