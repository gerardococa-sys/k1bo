export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FileX, Calendar } from 'lucide-react'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#D4A96A20', color: '#B85C1A', label: 'Pendiente' },
  responded: { bg: '#1C141015', color: '#1C1410', label: 'Respondida' },
  accepted:  { bg: '#6B7B6E20', color: '#3d4d40', label: 'Aceptada' },
  rejected:  { bg: '#1C141010', color: '#6B7B6E', label: 'Rechazada' },
}

function formatDMY(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function Initials({ name }: { name?: string }) {
  const letters = (name ?? '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%',
      backgroundColor: '#B85C1A15',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: FONT_SERIF, fontSize: '20px', fontWeight: 700, color: '#B85C1A' }}>{letters}</span>
    </div>
  )
}

export default async function ClientSolicitudesPage({ params }: { params: { country: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'client') redirect(`/${params.country}`)

  const { data: solicitudes } = await supabase
    .from('quote_requests')
    .select(`
      *,
      professional:professionals(
        id,
        profiles(full_name, photo_url)
      ),
      category:categories!quote_requests_category_id_fkey(
        name, slug
      ),
      subcategory:categories!quote_requests_subcategory_id_fkey(
        name, slug
      ),
      quote_request_photos(photo_url)
    `)
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const total = solicitudes?.length ?? 0

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">

      {/* Back link */}
      <Link
        href={`/${params.country}/cliente/dashboard`}
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#B85C1A', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}
        className="solicitudes-back-link"
      >
        ← Volver al Dashboard
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#1C1410', margin: 0 }}>
          Mis Solicitudes
        </h1>
        <span style={{
          fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#6B7B6E',
          backgroundColor: '#1C141010', padding: '4px 12px', borderRadius: '20px',
        }}>
          {total} {total === 1 ? 'solicitud' : 'solicitudes'}
        </span>
      </div>

      {/* Empty state */}
      {total === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '64px 24px', textAlign: 'center' }}>
          <FileX style={{ width: 48, height: 48, color: '#B85C1A' }} />
          <p style={{ fontFamily: FONT_SANS, fontSize: '18px', color: '#6B7B6E', margin: 0 }}>
            Aún no has enviado solicitudes
          </p>
          <Link
            href={`/${params.country}`}
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

      {/* Solicitudes list */}
      {total > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {solicitudes!.map((q: any) => {
            const pro         = q.professional
            const profProfile = Array.isArray(pro?.profiles) ? pro.profiles[0] : pro?.profiles
            const proName     = profProfile?.full_name ?? 'Profesional'
            const proPhoto    = profProfile?.photo_url
            const category    = q.category
            const subcategory = q.subcategory
            const photos      = q.quote_request_photos ?? []
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
                {proPhoto ? (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={proPhoto} alt={proName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <Initials name={proName} />
                )}

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 600, color: '#1C1410', margin: '0 0 4px' }}>
                    {proName}
                  </p>

                  {category && (
                    <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#B85C1A', margin: '0 0 6px' }}>
                      {category.name}{subcategory ? ` › ${subcategory.name}` : ''}
                    </p>
                  )}

                  <p style={{
                    fontFamily: FONT_SANS, fontSize: '15px', color: 'rgba(28,20,16,0.70)',
                    margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {q.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: photos.length > 0 ? '10px' : 0 }}>
                    {q.required_date && (
                      <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#6B7B6E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ width: 13, height: 13 }} />
                        Fecha requerida: {formatDMY(q.required_date)}
                      </span>
                    )}
                    <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#6B7B6E' }}>
                      Enviada el {formatDMY(q.created_at)}
                    </span>
                  </div>

                  {/* Photo thumbnails */}
                  {photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {photos.slice(0, 4).map((p: any, i: number) => (
                        <div key={i} style={{ width: 40, height: 40, borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                      {photos.length > 4 && (
                        <span style={{
                          width: 40, height: 40, borderRadius: '6px', flexShrink: 0,
                          backgroundColor: '#1C141015', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#6B7B6E',
                        }}>
                          +{photos.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: status + link */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                  <span style={{
                    fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700,
                    backgroundColor: badge.bg, color: badge.color,
                    padding: '4px 12px', borderRadius: '20px',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    {badge.label}
                  </span>
                  <Link
                    href={`/${params.country}/cliente/solicitudes/${q.id}`}
                    style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#B85C1A', textDecoration: 'none' }}
                    className="solicitudes-detail-link"
                  >
                    Ver detalle →
                  </Link>
                </div>

              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .solicitudes-back-link:hover   { text-decoration: underline; }
        .solicitudes-detail-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
