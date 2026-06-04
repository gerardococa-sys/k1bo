export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Calendar, Clock } from 'lucide-react'
import { PhotoGallery } from '@/components/quotes/PhotoGallery'
import { MessageBoard } from '@/components/messages/MessageBoard'
import { MarkAsVisited } from '@/components/messages/MarkAsVisited'
import { StatusUpdater } from '@/components/messages/StatusUpdater'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string; description: string }> = {
  pending:   { bg: '#D4A96A20', color: '#B85C1A', label: 'Pendiente',  description: 'El propietario está esperando tu respuesta.' },
  responded: { bg: '#1C141015', color: '#1C1410', label: 'Respondida', description: 'Has respondido a esta solicitud.' },
  accepted:  { bg: '#6B7B6E20', color: '#3d4d40', label: 'Aceptada',   description: 'Has aceptado esta solicitud.' },
  rejected:  { bg: '#1C141010', color: '#6B7B6E', label: 'Rechazada',  description: 'No pudiste atender esta solicitud.' },
}

function formatDMY(dateStr: string) {
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

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 500, color: '#B85C1A' }}>
        {value}
      </span>
    </div>
  )
}

function Initials({ name }: { name?: string }) {
  const letters = (name ?? '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#B85C1A15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
      <span style={{ fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 700, color: '#B85C1A' }}>{letters}</span>
    </div>
  )
}

export default async function ProSolicitudDetailPage({ params }: { params: { country: string; id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: solicitud }, { data: proProfile }] = await Promise.all([
    supabase
      .from('quote_requests')
      .select(`
        *,
        client:profiles!client_id(full_name, photo_url, phone),
        category:categories!quote_requests_category_id_fkey(name, slug),
        subcategory:categories!quote_requests_subcategory_id_fkey(name, slug),
        quote_request_photos(id, photo_url)
      `)
      .eq('id', params.id)
      .eq('professional_id', user.id)
      .single(),
    supabase.from('profiles').select('full_name, photo_url').eq('id', user.id).single(),
  ])

  if (!solicitud) redirect(`/${params.country}/profesional-panel/solicitudes`)

  const client      = solicitud.client as any
  const clientName  = client?.full_name  ?? 'Propietario'
  const clientPhoto = client?.photo_url
  const category    = solicitud.category   as any
  const subcategory = solicitud.subcategory as any
  const badge       = STATUS_BADGE[solicitud.status] ?? STATUS_BADGE.pending

  const rawPhotos = (solicitud.quote_request_photos ?? []) as { id: string; photo_url: string }[]
  const photos = rawPhotos.map((p) => {
    const { data: { publicUrl } } = supabase.storage.from('quote-photos').getPublicUrl(p.photo_url)
    return { photo_url: publicUrl }
  }).filter((p) => p.photo_url)

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <MarkAsVisited solicitudId={params.id} />

      {/* Back link */}
      <Link
        href={`/${params.country}/profesional-panel/solicitudes`}
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#B85C1A', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}
        className="pro-sol-back"
      >
        ← Volver a solicitudes
      </Link>

      {/* Title */}
      <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#1C1410', margin: '0 0 32px' }}>
        Detalle de Solicitud
      </h1>

      {/* 50/50 grid — messages sticky on right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }} className="pro-sol-detail-grid">

        {/* LEFT — solicitud info + client card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Info card */}
          <Card>
            <SectionLabel>Solicitud</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {category    && <FieldRow label="Categoría"    value={category.name} />}
              {subcategory && <FieldRow label="Subcategoría" value={subcategory.name} />}

              {solicitud.required_date && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fecha requerida</span>
                  <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 500, color: '#B85C1A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar style={{ width: 15, height: 15, flexShrink: 0 }} />
                    {formatDMY(solicitud.required_date)}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recibida el</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 500, color: '#B85C1A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock style={{ width: 15, height: 15, flexShrink: 0 }} />
                  {formatDMY(solicitud.created_at)}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Descripción del trabajo</span>
                <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#1C1410', lineHeight: 1.7, margin: 0 }}>{solicitud.description}</p>
              </div>
            </div>
          </Card>

          {/* Status card + action buttons */}
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                backgroundColor: badge.bg, color: badge.color,
                padding: '8px 20px', borderRadius: '20px',
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {badge.label}
              </span>
              <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E', textAlign: 'center', margin: 0 }}>
                {badge.description}
              </p>
            </div>
            <StatusUpdater quoteId={params.id} currentStatus={solicitud.status} />
          </Card>

          {/* Photos */}
          {photos.length > 0 && (
            <Card>
              <SectionLabel>Fotos adjuntas</SectionLabel>
              <PhotoGallery photos={photos} />
            </Card>
          )}

          {/* Client card */}
          <Card>
            {clientPhoto ? (
              <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={clientPhoto} alt={clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <Initials name={clientName} />
            )}
            <p style={{ fontFamily: FONT_SERIF, fontSize: '20px', fontWeight: 600, color: '#1C1410', textAlign: 'center', margin: '0 0 6px' }}>{clientName}</p>
            <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#B85C1A', textAlign: 'center', margin: 0 }}>Propietario</p>
            {client?.phone && (
              <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E', textAlign: 'center', margin: '8px 0 0' }}>
                {client.phone}
              </p>
            )}
          </Card>
        </div>

        {/* RIGHT — sticky MessageBoard */}
        <div className="pro-sol-msg-sticky" style={{ backgroundColor: '#fff', border: '0.5px solid #1C141015', borderRadius: '12px', overflow: 'hidden' }}>
          <MessageBoard
            quoteRequestId={params.id}
            currentUserId={user.id}
            otherPartyName={clientName}
          />
        </div>

      </div>

      <style>{`
        .pro-sol-back:hover         { text-decoration: underline; }
        .pro-sol-msg-sticky         { height: 520px; }
        @media (min-width: 768px) {
          .pro-sol-detail-grid    { grid-template-columns: 1fr 1fr; }
          .pro-sol-msg-sticky     { position: sticky; top: 24px; height: calc(100vh - 120px); min-height: 520px; }
        }
      `}</style>
    </div>
  )
}
