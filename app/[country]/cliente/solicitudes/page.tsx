export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FileX, Eye } from 'lucide-react'
import { UnreadDot } from '@/components/messages/UnreadDot'
import { ClientAvatar } from '@/components/ui/ClientAvatar'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#D4A96A20', color: '#B85C1A', label: 'Pendiente'  },
  responded: { bg: '#1C141015', color: '#1C1410', label: 'Cotizada' },
  revision:  { bg: '#D4A96A15', color: '#B85C1A', label: 'En revisión' },
  accepted:  { bg: '#6B7B6E20', color: '#3d4d40', label: 'Aceptada'   },
  rejected:  { bg: '#1C141010', color: '#6B7B6E', label: 'Rechazada'  },
  completed: { bg: '#1C141015', color: '#1C1410', label: 'Finalizada' },
}

function formatDMY(dateStr: string | null | undefined) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
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

export default async function ClientSolicitudesPage({
  params,
  searchParams,
}: {
  params:       { country: string }
  searchParams: { page?: string; size?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'client') redirect(`/${params.country}`)

  const pageSize = [10, 20, 50, 100].includes(Number(searchParams.size))
    ? Number(searchParams.size) : 10
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const from = (page - 1) * pageSize
  const to   = from + pageSize - 1

  const { count: total } = await supabase
    .from('quote_requests')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', user.id)

  const { data: solicitudes } = await supabase
    .from('quote_requests')
    .select(`
      id, created_at, responded_at, status,
      professional:professionals(
        id,
        profiles(full_name, photo_url)
      ),
      category:categories!quote_requests_category_id_fkey(name),
      subcategory:categories!quote_requests_subcategory_id_fkey(name)
    `)
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((total ?? 0) / pageSize)
  const hasPrev = page > 1
  const hasNext = page < totalPages

  const solicitudIds = (solicitudes ?? []).map((s: any) => s.id)
  let latestMsgMap: Record<string, string> = {}
  if (solicitudIds.length > 0) {
    const { data: msgs } = await supabase
      .from('quote_messages')
      .select('quote_request_id, created_at')
      .in('quote_request_id', solicitudIds)
      .neq('sender_id', user.id)
      .order('created_at', { ascending: false })
    msgs?.forEach((m: any) => {
      if (!latestMsgMap[m.quote_request_id]) latestMsgMap[m.quote_request_id] = m.created_at
    })
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Back */}
      <Link
        href={`/${params.country}/cliente/dashboard`}
        className="cli-sol-back"
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#B85C1A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        ← Volver al Dashboard
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#1C1410', margin: 0 }}>
          Mis solicitudes de cotización
        </h1>
        <span style={{
          fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#6B7B6E',
          background: '#1C141010', padding: '4px 12px', borderRadius: '20px',
        }}>
          {total ?? 0} {(total ?? 0) === 1 ? 'solicitud' : 'solicitudes'}
        </span>
      </div>

      {/* Empty state */}
      {total === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '64px 24px', textAlign: 'center' }}>
          <FileX style={{ width: 48, height: 48, color: '#B85C1A' }} />
          <p style={{ fontFamily: FONT_SANS, fontSize: '18px', color: '#6B7B6E', margin: 0 }}>
            Aún no has enviado solicitudes de cotización
          </p>
          <Link
            href={`/${params.country}/profesionales`}
            style={{
              fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
              backgroundColor: '#1C1410', color: '#D4A96A',
              padding: '12px 24px', borderRadius: '8px', textDecoration: 'none',
            }}
          >
            Buscar profesionales
          </Link>
        </div>
      )}

      {(total ?? 0) > 0 && (
        <>
          {/* ── TABLA DESKTOP ── */}
          <div className="cli-sol-table" style={{
            background: '#fff',
            borderRadius: '12px',
            border: '0.5px solid #1C141015',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '10% 22% 20% 12% 12% 12% 12%',
              background: '#F5F0E8',
              padding: '12px 16px',
            }}>
              {['Código', 'Profesional', 'Tipo de trabajo', 'Fecha solicitud', 'Fecha cotización', 'Estado', 'Acciones'].map((col) => (
                <div key={col} style={{
                  fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7B6E',
                }}>
                  {col}
                </div>
              ))}
            </div>

            {/* Rows */}
            {(solicitudes ?? []).map((s: any) => {
              const pro         = s.professional
              const profProfile = Array.isArray(pro?.profiles) ? pro.profiles[0] : pro?.profiles
              const proName     = profProfile?.full_name ?? 'Profesional'
              const proPhoto    = profProfile?.photo_url ?? null
              const category    = s.category
              const subcategory = s.subcategory

              return (
                <div
                  key={s.id}
                  className="cli-sol-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '10% 22% 20% 12% 12% 12% 12%',
                    padding: '14px 16px',
                    borderBottom: '0.5px solid #1C141008',
                    alignItems: 'center',
                    minHeight: '56px',
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

                  {/* Profesional */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClientAvatar name={proName} photoUrl={proPhoto} size={32} />
                    <span style={{
                      fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500,
                      color: '#1C1410', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {proName}
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
                    {formatDMY(s.created_at)}
                  </div>

                  {/* Fecha cotización */}
                  <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: s.responded_at ? '#1C1410' : '#6B7B6E' }}>
                    {formatDMY(s.responded_at)}
                  </div>

                  {/* Estado */}
                  <div>
                    <StatusBadge status={s.status} />
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UnreadDot solicitudId={s.id} latestAt={latestMsgMap[s.id] ?? null} />
                    <Link
                      href={`/${params.country}/cliente/solicitudes/${s.id}`}
                      className="cli-sol-ver-btn"
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
          <div className="cli-sol-cards">
            {(solicitudes ?? []).map((s: any) => {
              const pro         = s.professional
              const profProfile = Array.isArray(pro?.profiles) ? pro.profiles[0] : pro?.profiles
              const proName     = profProfile?.full_name ?? 'Profesional'
              const proPhoto    = profProfile?.photo_url ?? null
              const category    = s.category
              const subcategory = s.subcategory

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

                  {/* Profesional */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <ClientAvatar name={proName} photoUrl={proPhoto} size={32} />
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500, color: '#1C1410' }}>
                      {proName}
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                    {[
                      { label: 'Solicitud',  val: s.created_at  },
                      { label: 'Cotización', val: s.responded_at },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <div style={{ fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                          {label}
                        </div>
                        <div style={{ fontFamily: FONT_SANS, fontSize: '13px', color: val ? '#1C1410' : '#6B7B6E' }}>
                          {formatDMY(val)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botón */}
                  <Link
                    href={`/${params.country}/cliente/solicitudes/${s.id}`}
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

      {/* Paginación */}
      {(total ?? 0) > 0 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: '20px', flexWrap: 'wrap', gap: '12px',
        }}>
          {/* Selector de registros por página */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E' }}>Mostrar:</span>
            {[10, 20, 50, 100].map((size) => (
              <Link
                key={size}
                href={`?page=1&size=${size}`}
                style={{
                  fontFamily: FONT_SANS, fontSize: '13px',
                  fontWeight: pageSize === size ? 700 : 400,
                  color: pageSize === size ? '#B85C1A' : '#6B7B6E',
                  padding: '4px 10px', borderRadius: '6px',
                  background: pageSize === size ? '#B85C1A12' : 'transparent',
                  border: pageSize === size ? '1px solid #B85C1A40' : '1px solid transparent',
                  textDecoration: 'none',
                }}
              >
                {size}
              </Link>
            ))}
          </div>

          {/* Info y navegación */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E' }}>
              {from + 1}–{Math.min(to + 1, total ?? 0)} de {total ?? 0}
            </span>
            {hasPrev && (
              <Link
                href={`?page=${page - 1}&size=${pageSize}`}
                style={{
                  fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600,
                  color: '#B85C1A', border: '1px solid #B85C1A40',
                  borderRadius: '6px', padding: '6px 12px', textDecoration: 'none',
                }}
              >
                ← Anterior
              </Link>
            )}
            {hasNext && (
              <Link
                href={`?page=${page + 1}&size=${pageSize}`}
                style={{
                  fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600,
                  color: '#B85C1A', border: '1px solid #B85C1A40',
                  borderRadius: '6px', padding: '6px 12px', textDecoration: 'none',
                }}
              >
                Siguiente →
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        .cli-sol-back:hover     { text-decoration: underline !important; }
        .cli-sol-ver-btn:hover  { background: #B85C1A10 !important; }
        .cli-sol-row:hover      { background: #F5F0E880; }

        .cli-sol-table { display: block; }
        .cli-sol-cards { display: none; }

        @media (max-width: 767px) {
          .cli-sol-table { display: none; }
          .cli-sol-cards { display: block; }
        }
      `}</style>
    </div>
  )
}
