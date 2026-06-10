export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#D4963A20', color: '#C4581A', label: 'Pendiente'   },
  responded: { bg: '#2C2C2C12', color: '#7A7A78', label: 'Cotizada'    },
  revision:  { bg: '#D4963A15', color: '#C4581A', label: 'En revisión' },
  accepted:  { bg: '#7A7A7820', color: '#3d4d40', label: 'Aceptada'    },
  rejected:  { bg: '#2C2C2C10', color: '#9A9A98', label: 'Rechazada'   },
  completed: { bg: '#2C2C2C12', color: '#2C2C2C', label: 'Finalizada'  },
}

function formatDMY(ts: string | null | undefined) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function AdminPropietarioSolicitudesPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (adminProfile?.role !== 'admin') redirect('/sv')

  const { data: propietario } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', params.id)
    .single()

  const { data: rawSolicitudes } = await supabase
    .from('quote_requests')
    .select('id, created_at, responded_at, status, professional_id, category_id, subcategory_id')
    .eq('client_id', params.id)
    .order('created_at', { ascending: false })

  const solicitudes = rawSolicitudes ?? []

  const proIds = [...new Set(solicitudes.map((s) => s.professional_id).filter(Boolean))]
  const catIds = [...new Set([
    ...solicitudes.map((s) => s.category_id),
    ...solicitudes.map((s) => s.subcategory_id),
  ].filter(Boolean))]

  const [{ data: prosData }, { data: catsData }] = await Promise.all([
    proIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', proIds)
      : Promise.resolve({ data: [] }),
    catIds.length
      ? supabase.from('categories').select('id, name').in('id', catIds)
      : Promise.resolve({ data: [] }),
  ])

  const prosMap = Object.fromEntries((prosData ?? []).map((p) => [p.id, p]))
  const catsMap = Object.fromEntries((catsData ?? []).map((c) => [c.id, c]))

  const enriched = solicitudes.map((s) => ({
    ...s,
    professionalData: prosMap[s.professional_id ?? ''] ?? null,
    categoryData:     catsMap[s.category_id    ?? ''] ?? null,
    subcategoryData:  catsMap[s.subcategory_id ?? ''] ?? null,
  }))

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

      <Link
        href={`/admin/propietarios/${params.id}`}
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        ← Volver al perfil
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '32px', fontWeight: 700, color: '#1E1E1E', margin: 0 }}>
          Solicitudes de {propietario?.full_name ?? '—'}
        </h1>
        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#7A7A78', background: '#1E1E1E10', padding: '4px 12px', borderRadius: '20px' }}>
          {enriched.length} {enriched.length === 1 ? 'solicitud' : 'solicitudes'}
        </span>
      </div>

      {enriched.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#7A7A78', fontFamily: FONT_SANS, fontSize: '18px' }}>
          Este propietario no tiene solicitudes
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C15', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '10% 22% 18% 13% 13% 13% 11%', background: '#F2F0ED', padding: '12px 16px' }}>
            {['Código', 'Profesional', 'Tipo de trabajo', 'Fecha solicitud', 'Fecha cotización', 'Estado', 'Acciones'].map((col) => (
              <div key={col} style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7A78' }}>
                {col}
              </div>
            ))}
          </div>

          {/* Filas */}
          {enriched.map((s) => {
            const badge = STATUS_BADGE[s.status] ?? STATUS_BADGE.pending
            return (
              <div
                key={s.id}
                style={{ display: 'grid', gridTemplateColumns: '10% 22% 18% 13% 13% 13% 11%', padding: '14px 16px', borderBottom: '0.5px solid #2C2C2C08', alignItems: 'center', minHeight: '56px' }}
              >
                {/* Código */}
                <div>
                  <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#7A7A78', background: '#1E1E1E08', padding: '3px 8px', borderRadius: '6px' }}>
                    {s.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>

                {/* Profesional */}
                <div>
                  <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500, color: '#1E1E1E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                    {s.professionalData?.full_name ?? '—'}
                  </span>
                </div>

                {/* Tipo de trabajo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1E1E1E' }}>
                    {s.categoryData?.name ?? '—'}
                  </span>
                  {s.subcategoryData?.name && (
                    <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#7A7A78' }}>
                      {s.subcategoryData.name}
                    </span>
                  )}
                </div>

                {/* Fecha solicitud */}
                <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1E1E1E' }}>
                  {formatDMY(s.created_at)}
                </div>

                {/* Fecha cotización */}
                <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: s.responded_at ? '#1E1E1E' : '#7A7A78' }}>
                  {formatDMY(s.responded_at)}
                </div>

                {/* Estado */}
                <div>
                  <span style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: badge.bg, color: badge.color, padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                    {badge.label}
                  </span>
                </div>

                {/* Acciones */}
                <div>
                  <Link
                    href={`/admin/propietarios/${params.id}/solicitudes/${s.id}`}
                    style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#C4581A', border: '1px solid #C4581A40', borderRadius: '6px', padding: '5px 10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Ver
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
