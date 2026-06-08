export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FileX, Eye } from 'lucide-react'
import { UnreadDot } from '@/components/messages/UnreadDot'
import { ClientAvatar } from '@/components/ui/ClientAvatar'
import { Pagination } from '@/components/ui/Pagination'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#D4963A20', color: '#C4581A', label: 'Pendiente'  },
  responded: { bg: '#2C2C2C12', color: '#2C2C2C', label: 'Cotizada' },
  revision:  { bg: '#D4963A15', color: '#C4581A', label: 'En revisión' },
  accepted:  { bg: '#7A7A7820', color: '#3d4d40', label: 'Aceptada'   },
  rejected:  { bg: '#2C2C2C10', color: '#7A7A78', label: 'Rechazada'  },
  completed: { bg: '#2C2C2C12', color: '#2C2C2C', label: 'Finalizada' },
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
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        ← Volver al Dashboard
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#2C2C2C', margin: 0 }}>
          Mis solicitudes de cotización
        </h1>
        <span style={{
          fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#7A7A78',
          background: '#2C2C2C10', padding: '4px 12px', borderRadius: '20px',
        }}>
          {total ?? 0} {(total ?? 0) === 1 ? 'solicitud' : 'solicitudes'}
        </span>
      </div>

      {/* Empty state */}
      {total === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '64px 24px', textAlign: 'center' }}>
          <FileX style={{ width: 48, height: 48, color: '#C4581A' }} />
          <p style={{ fontFamily: FONT_SANS, fontSize: '18px', color: '#7A7A78', margin: 0 }}>
            Aún no has enviado solicitudes de cotización
          </p>
          <Link
            href={`/${params.country}/profesionales`}
            style={{
              fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
              backgroundColor: '#1E1E1E', color: '#D4963A',
              padding: '12px 24px', borderRadius: '8px', textDecoration: 'none',
            }}
          >
            Buscar profesionales
          </Link>
        </div>
      )}

      {(total ?? 0) > 0 && (
        <>
          {/* Selector de tamaño de página */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Mostrar:</span>
            {[10, 20, 50, 100].map((size) => (
              <Link
                key={size}
                href={`?page=1&size=${size}`}
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

          {/* ── TABLA DESKTOP ── */}
          <div className="cli-sol-table" style={{
            background: '#fff',
            borderRadius: '12px',
            border: '0.5px solid #2C2C2C12',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '10% 22% 20% 12% 12% 12% 12%',
              background: '#F2F0ED',
              padding: '12px 16px',
            }}>
              {['Código', 'Profesional', 'Tipo de trabajo', 'Fecha solicitud', 'Fecha cotización', 'Estado', 'Acciones'].map((col) => (
                <div key={col} style={{
                  fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7A78',
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
                    borderBottom: '0.5px solid #2C2C2C08',
                    alignItems: 'center',
                    minHeight: '56px',
                    transition: 'background 0.12s',
                  }}
                >
                  {/* Código */}
                  <div>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '13px', color: '#7A7A78',
                      background: '#2C2C2C08', padding: '3px 8px', borderRadius: '6px',
                    }}>
                      {s.id.substring(0, 8).toUpperCase()}
                    </span>
                  </div>

                  {/* Profesional */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClientAvatar name={proName} photoUrl={proPhoto} size={32} />
                    <span style={{
                      fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500,
                      color: '#2C2C2C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {proName}
                    </span>
                  </div>

                  {/* Tipo de trabajo */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>
                      {category?.name ?? '—'}
                    </span>
                    {subcategory?.name && (
                      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#7A7A78' }}>
                        {subcategory.name}
                      </span>
                    )}
                  </div>

                  {/* Fecha solicitud */}
                  <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>
                    {formatDMY(s.created_at)}
                  </div>

                  {/* Fecha cotización */}
                  <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: s.responded_at ? '#1E1E1E' : '#7A7A78' }}>
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
                        color: '#C4581A', textDecoration: 'none',
                        border: '1px solid #C4581A40', borderRadius: '6px',
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
                  border: '0.5px solid #2C2C2C12',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '10px',
                }}>
                  {/* Código + estado */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '13px', color: '#7A7A78',
                      background: '#2C2C2C08', padding: '3px 8px', borderRadius: '6px',
                    }}>
                      {s.id.substring(0, 8).toUpperCase()}
                    </span>
                    <StatusBadge status={s.status} />
                  </div>

                  {/* Profesional */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <ClientAvatar name={proName} photoUrl={proPhoto} size={32} />
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500, color: '#2C2C2C' }}>
                      {proName}
                    </span>
                  </div>

                  {/* Categoría */}
                  {category?.name && (
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>
                        {category.name}
                      </span>
                      {subcategory?.name && (
                        <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#7A7A78', marginLeft: '6px' }}>
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
                        <div style={{ fontFamily: FONT_SANS, fontSize: '10px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                          {label}
                        </div>
                        <div style={{ fontFamily: FONT_SANS, fontSize: '13px', color: val ? '#1E1E1E' : '#7A7A78' }}>
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
                      fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#C4581A',
                      border: '1px solid #C4581A40', borderRadius: '8px',
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

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        basePath={`/${params.country}/cliente/solicitudes`}
      />

      <style>{`
        .cli-sol-back:hover     { text-decoration: underline !important; }
        .cli-sol-ver-btn:hover  { background: #C4581A10 !important; }
        .cli-sol-row:hover      { background: #F2F0ED80; }

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
