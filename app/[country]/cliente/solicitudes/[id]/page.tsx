'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Clock } from 'lucide-react'
import { PhotoGallery } from '@/components/quotes/PhotoGallery'
import MessageBoard from '@/components/messages/MessageBoard'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string; description: string }> = {
  pending:   { bg: '#D4A96A20', color: '#B85C1A', label: 'Pendiente',  description: 'Tu solicitud está siendo revisada por el profesional.' },
  responded: { bg: '#1C141015', color: '#1C1410', label: 'Respondida', description: 'El profesional ha respondido a tu solicitud.' },
  accepted:  { bg: '#6B7B6E20', color: '#3d4d40', label: 'Aceptada',   description: 'El profesional ha aceptado tu solicitud.' },
  rejected:  { bg: '#1C141010', color: '#6B7B6E', label: 'Rechazada',  description: 'El profesional no pudo atender tu solicitud en este momento.' },
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

export default function SolicitudDetailPage() {
  const router = useRouter()
  const params = useParams<{ country: string; id: string }>()

  const [userId, setUserId]       = useState('')
  const [solicitud, setSolicitud] = useState<any>(null)
  const [photos, setPhotos]       = useState<{ photo_url: string }[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      setUserId(user.id)
      localStorage.setItem('visit_' + params.id, new Date().toISOString())

      const { data } = await supabase
        .from('quote_requests')
        .select(`
          *,
          professional:professionals(
            id, bio, short_description,
            profiles(full_name, photo_url, phone)
          ),
          category:categories!quote_requests_category_id_fkey(name, slug),
          subcategory:categories!quote_requests_subcategory_id_fkey(name, slug),
          quote_request_photos(id, photo_url)
        `)
        .eq('id', params.id)
        .eq('client_id', user.id)
        .single()

      if (!data) { router.push(`/${params.country}/cliente/solicitudes`); return }

      setSolicitud(data)

      const rawPhotos = (data.quote_request_photos ?? []) as { id: string; photo_url: string }[]
      const photoList = rawPhotos
        .map((p) => {
          const { data: { publicUrl } } = supabase.storage.from('quote-photos').getPublicUrl(p.photo_url)
          return { photo_url: publicUrl }
        })
        .filter((p) => p.photo_url)
      setPhotos(photoList)

      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <div style={{ fontFamily: FONT_SANS, padding: '64px 24px', textAlign: 'center', color: '#6B7B6E' }}>
        Cargando...
      </div>
    )
  }

  const pro         = solicitud.professional as any
  const profProfile = Array.isArray(pro?.profiles) ? pro.profiles[0] : pro?.profiles
  const proName     = profProfile?.full_name ?? 'Profesional'
  const proPhoto    = profProfile?.photo_url
  const category    = solicitud.category    as any
  const subcategory = solicitud.subcategory as any
  const badge       = STATUS_BADGE[solicitud.status] ?? STATUS_BADGE.pending

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">

      {/* Back link */}
      <Link
        href={`/${params.country}/cliente/solicitudes`}
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#B85C1A', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}
        className="sol-back-link"
      >
        ← Volver a mis solicitudes
      </Link>

      {/* Title */}
      <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#1C1410', margin: '0 0 32px' }}>
        Detalle de Solicitud
      </h1>

      {/* 50/50 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }} className="sol-detail-grid">

        {/* LEFT — solicitud info + professional card */}
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
                <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Enviada el</span>
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

          {/* Status card */}
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
          </Card>

          {/* Photos */}
          {photos.length > 0 && (
            <Card>
              <SectionLabel>Fotos adjuntas</SectionLabel>
              <PhotoGallery photos={photos} />
            </Card>
          )}

          {/* Professional card */}
          <Card>
            {proPhoto ? (
              <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proPhoto} alt={proName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <Initials name={proName} />
            )}
            <p style={{ fontFamily: FONT_SERIF, fontSize: '20px', fontWeight: 600, color: '#1C1410', textAlign: 'center', margin: '0 0 6px' }}>{proName}</p>
            {category && <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#B85C1A', textAlign: 'center', margin: '0 0 8px' }}>{category.name}</p>}
            {pro?.short_description && (
              <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E', textAlign: 'center', margin: '8px 0 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {pro.short_description}
              </p>
            )}
            <Link
              href={`/${params.country}/profesional/${pro?.id}`}
              style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#1C1410', color: '#D4A96A', fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, padding: '12px', borderRadius: '8px', textDecoration: 'none', marginTop: '16px', boxSizing: 'border-box' }}
              className="sol-pro-btn"
            >
              Ver perfil completo
            </Link>
          </Card>
        </div>

        {/* RIGHT — sticky MessageBoard */}
        <div style={{ position: 'sticky', top: '24px' }}>
          {userId && (
            <MessageBoard
              quoteRequestId={params.id}
              currentUserId={userId}
              otherPartyName={proName}
            />
          )}
        </div>

      </div>

      <style>{`
        .sol-back-link:hover { text-decoration: underline; }
        .sol-pro-btn:hover   { opacity: 0.88; }
        @media (min-width: 768px) {
          .sol-detail-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  )
}
