export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Calendar, Clock } from 'lucide-react'

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

function formatDate(ts: string | null | undefined) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function AdminSolicitudDetailPage({
  params,
}: {
  params: { id: string; solicitudId: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: caller } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (caller?.role !== 'admin') redirect('/sv')

  const { data: solicitud } = await supabase
    .from('quote_requests')
    .select(`
      *,
      professional:professionals(
        id,
        profiles(full_name, photo_url)
      ),
      client:profiles!quote_requests_client_id_fkey(
        full_name, photo_url, phone
      ),
      category:categories!quote_requests_category_id_fkey(name),
      subcategory:categories!quote_requests_subcategory_id_fkey(name),
      quote_request_photos(photo_url)
    `)
    .eq('id', params.solicitudId)
    .single()

  if (!solicitud) notFound()

  const badge = STATUS_BADGE[solicitud.status] ?? STATUS_BADGE.pending

  const pro = solicitud.professional as any
  const profProfile = Array.isArray(pro?.profiles) ? pro.profiles[0] : pro?.profiles
  const client = Array.isArray(solicitud.client) ? solicitud.client[0] : solicitud.client
  const category = Array.isArray(solicitud.category) ? solicitud.category[0] : solicitud.category
  const subcategory = Array.isArray(solicitud.subcategory) ? solicitud.subcategory[0] : solicitud.subcategory

  const materialsList = solicitud.quote_materials_list as any[] | null

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px)' }}>

      {/* Back */}
      <Link
        href={`/admin/profesionales/${params.id}/solicitudes`}
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver a solicitudes
      </Link>

      {/* Título + código */}
      <h1 style={{ fontFamily: FONT_SERIF, fontSize: '34px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 8px' }}>
        Detalle de Solicitud de Cotización
      </h1>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1E1E1E08', padding: '6px 14px', borderRadius: '8px', marginBottom: '28px' }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Código
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: '#1E1E1E' }}>
          {params.solicitudId.substring(0, 8).toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Estado */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C12', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Estado de la solicitud
          </span>
          <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: badge.bg, color: badge.color, padding: '6px 16px', borderRadius: '20px' }}>
            {badge.label}
          </span>
        </div>

        {/* Partes involucradas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>

          {/* Propietario */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C12', padding: '20px 24px' }}>
            <p style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
              Propietario
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#C4581A15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FONT_SERIF, fontSize: '14px', fontWeight: 700, color: '#C4581A' }}>
                  {(client?.full_name ?? '?').split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()}
                </span>
              </div>
              <div>
                <p style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 600, color: '#1E1E1E', margin: 0 }}>
                  {client?.full_name ?? '—'}
                </p>
                {client?.phone && (
                  <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', margin: '2px 0 0' }}>
                    {client.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profesional */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C12', padding: '20px 24px' }}>
            <p style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
              Profesional
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#C4581A15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FONT_SERIF, fontSize: '14px', fontWeight: 700, color: '#C4581A' }}>
                  {(profProfile?.full_name ?? '?').split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()}
                </span>
              </div>
              <div>
                <p style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 600, color: '#1E1E1E', margin: 0 }}>
                  {profProfile?.full_name ?? '—'}
                </p>
                <Link
                  href={`/admin/profesionales/${params.id}`}
                  style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#C4581A', textDecoration: 'none', fontWeight: 600 }}
                >
                  Ver perfil →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Info de la solicitud */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C12', padding: '24px' }}>
          <p style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
            Detalles de la solicitud
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {category?.name && (
              <div>
                <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                  Categoría
                </span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 500, color: '#C4581A' }}>
                  {category.name}{subcategory?.name && ` → ${subcategory.name}`}
                </span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <Clock style={{ width: 13, height: 13 }} />
                  Enviada
                </span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#1E1E1E' }}>
                  {formatDate(solicitud.created_at)}
                </span>
              </div>
              <div>
                <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <Calendar style={{ width: 13, height: 13 }} />
                  Fecha requerida
                </span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#1E1E1E' }}>
                  {formatDate(solicitud.required_date)}
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                Descripción del trabajo
              </span>
              <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#1E1E1E', lineHeight: 1.7, margin: 0 }}>
                {solicitud.description}
              </p>
            </div>
          </div>
        </div>

        {/* Cotización si existe */}
        {solicitud.quote_description && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #C4581A30', padding: '24px' }}>
            <p style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
              Cotización enviada por el profesional
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#1E1E1E', lineHeight: 1.7, margin: 0 }}>
                {solicitud.quote_description}
              </p>

              {/* Materiales */}
              {materialsList && materialsList.length > 0 && (
                <div style={{ border: '1px solid #C4581A20', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 110px 110px', background: '#F2F0ED', padding: '8px 12px', gap: '8px' }}>
                    {['Cant.', 'Descripción', 'Val. unit.', 'Total'].map((h) => (
                      <div key={h} style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {h}
                      </div>
                    ))}
                  </div>
                  {materialsList.map((m: any, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 110px 110px', padding: '10px 12px', gap: '8px', borderTop: '1px solid #1E1E1E08', alignItems: 'center' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1E1E1E' }}>{m.cantidad}</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1E1E1E' }}>{m.descripcion}</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>${Number(m.valorUnit).toFixed(2)}</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#1E1E1E' }}>${Number(m.precioTotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totales */}
              <div style={{ background: '#F2F0ED', borderRadius: '8px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {solicitud.labor_cost != null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Mano de obra</span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1E1E1E' }}>${Number(solicitud.labor_cost).toFixed(2)}</span>
                  </div>
                )}
                {solicitud.materials_cost != null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Materiales</span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1E1E1E' }}>${Number(solicitud.materials_cost).toFixed(2)}</span>
                  </div>
                )}
                {solicitud.labor_cost != null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #C4581A30', paddingTop: '8px' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#1E1E1E' }}>Total</span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#C4581A' }}>
                      ${(Number(solicitud.labor_cost ?? 0) + Number(solicitud.materials_cost ?? 0)).toFixed(2)}
                    </span>
                  </div>
                )}

                {solicitud.hire_mode && (
                  <div style={{ borderTop: '1px solid #C4581A20', paddingTop: '8px', marginTop: '4px' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Modalidad:{' '}
                    </span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#1E1E1E', fontWeight: 500 }}>
                      {solicitud.hire_mode === 'labor_only' ? 'Solo mano de obra' : 'Mano de obra + materiales'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
