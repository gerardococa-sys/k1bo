export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Calendar, Clock, MessageSquare } from 'lucide-react'
import { PhotoGallery } from '@/components/quotes/PhotoGallery'
import { MarkAsVisited } from '@/components/messages/MarkAsVisited'
import { QuoteResponsePanel } from '@/components/solicitudes/QuoteResponsePanel'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

function formatDMY(dateStr: string | null | undefined) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: '#fff', border: '0.5px solid #1C141015', borderRadius: '12px', padding: '24px', ...style }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>
      {children}
    </p>
  )
}

function FieldRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 500, color: '#B85C1A', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon}
        {value}
      </span>
    </div>
  )
}

export default async function ProSolicitudDetailPage({ params }: { params: { country: string; id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: solicitud } = await supabase
    .from('quote_requests')
    .select(`
      *,
      client:profiles!quote_requests_client_id_fkey(
        full_name, photo_url, phone
      ),
      category:categories!quote_requests_category_id_fkey(
        name, slug
      ),
      subcategory:categories!quote_requests_subcategory_id_fkey(
        name, slug
      ),
      quote_request_photos(id, photo_url)
    `)
    .eq('id', params.id)
    .eq('professional_id', user.id)
    .single()

  if (!solicitud) redirect(`/${params.country}/profesional-panel/solicitudes`)

  const client     = (solicitud as any).client
  const clientName = client?.full_name ?? 'Propietario'

  // Generate public URL for avatar (photo_url may be a relative path)
  const clientPhotoRaw = client?.photo_url as string | null
  const clientPhoto = clientPhotoRaw
    ? clientPhotoRaw.startsWith('http')
      ? clientPhotoRaw
      : supabase.storage.from('avatars').getPublicUrl(clientPhotoRaw).data.publicUrl
    : undefined
  const category    = (solicitud as any).category
  const subcategory = (solicitud as any).subcategory

  const rawPhotos = ((solicitud as any).quote_request_photos ?? []) as { id: string; photo_url: string }[]
  const photos = rawPhotos
    .map((p) => {
      const { data: { publicUrl } } = supabase.storage.from('quote-photos').getPublicUrl(p.photo_url)
      return { photo_url: publicUrl }
    })
    .filter((p) => p.photo_url)

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <MarkAsVisited solicitudId={params.id} />

      {/* Back */}
      <Link
        href={`/${params.country}/profesional-panel/solicitudes`}
        className="pro-sol-back"
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#B85C1A', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}
      >
        ← Volver a solicitudes
      </Link>

      {/* Title */}
      <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#1C1410', margin: '0 0 32px' }}>
        Detalle de Solicitud
      </h1>

      {/* 2-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }} className="pro-sol-detail-grid">

        {/* ── COLUMNA IZQUIERDA ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Card: Cotización recibida */}
          <Card>
            <SectionLabel>Cotización recibida</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {category && <FieldRow label="Categoría" value={category.name} />}
              {subcategory && <FieldRow label="Subcategoría" value={subcategory.name} />}

              <FieldRow
                label="Fecha de solicitud"
                value={formatDMY(solicitud.created_at)}
                icon={<Clock style={{ width: 15, height: 15, flexShrink: 0 }} />}
              />

              {solicitud.required_date && (
                <FieldRow
                  label="Fecha requerida"
                  value={formatDMY(solicitud.required_date)}
                  icon={<Calendar style={{ width: 15, height: 15, flexShrink: 0 }} />}
                />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Descripción del trabajo
                </span>
                <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#1C1410', lineHeight: 1.7, margin: 0 }}>
                  {(solicitud as any).description ?? '—'}
                </p>
              </div>
            </div>
          </Card>

          {/* Fotos adjuntas */}
          {photos.length > 0 && (
            <Card>
              <SectionLabel>Fotos adjuntas</SectionLabel>
              <PhotoGallery photos={photos} />
            </Card>
          )}

          {/* Card: Propietario */}
          <Card>
            <SectionLabel>Propietario</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              {clientPhoto ? (
                <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={clientPhoto} alt={clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#B85C1A15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: FONT_SERIF, fontSize: '16px', fontWeight: 700, color: '#B85C1A' }}>
                    {clientName.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p style={{ fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 600, color: '#1C1410', margin: 0 }}>
                  {clientName}
                </p>
                {client?.phone && (
                  <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E', margin: '3px 0 0' }}>
                    {client.phone}
                  </p>
                )}
              </div>
            </div>

            <Link
              href={`/${params.country}/mensajes?solicitud=${params.id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', padding: '12px',
                fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 600,
                background: '#1C1410', color: '#D4A96A',
                borderRadius: '8px', textDecoration: 'none', boxSizing: 'border-box',
              }}
              className="pro-sol-msg-btn"
            >
              <MessageSquare style={{ width: 17, height: 17 }} />
              Ir a mensajes
            </Link>
          </Card>
        </div>

        {/* ── COLUMNA DERECHA — formulario / respuesta ── */}
        <div>
          <QuoteResponsePanel
            solicitudId={params.id}
            userId={user.id}
            country={params.country}
            status={(solicitud as any).status ?? 'pending'}
            quoteDescription={(solicitud as any).quote_description ?? null}
            quoteMaterials={(solicitud as any).quote_materials ?? null}
            quotePdfUrl={(solicitud as any).quote_pdf_url ?? null}
            rejectionReason={(solicitud as any).rejection_reason ?? null}
            respondedAt={(solicitud as any).responded_at ?? null}
            laborCost={(solicitud as any).labor_cost ?? null}
            materialsCost={(solicitud as any).materials_cost ?? null}
          />
        </div>
      </div>

      <style>{`
        .pro-sol-back:hover    { text-decoration: underline; }
        .pro-sol-msg-btn:hover { opacity: 0.88; }
        @media (min-width: 768px) {
          .pro-sol-detail-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  )
}
