'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Clock, Check, Download, X, MessageSquare } from 'lucide-react'
import { PhotoGallery } from '@/components/quotes/PhotoGallery'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string; description: string }> = {
  pending:   { bg: '#D4A96A20', color: '#B85C1A', label: 'Pendiente',  description: 'Tu solicitud está siendo revisada por el profesional.' },
  responded: { bg: '#1C141015', color: '#1C1410', label: 'Respondida', description: 'El profesional ha respondido con una cotización.' },
  accepted:  { bg: '#6B7B6E20', color: '#3d4d40', label: 'Aceptada',   description: 'Has aceptado la cotización del profesional.' },
  rejected:  { bg: '#1C141010', color: '#6B7B6E', label: 'Rechazada',  description: 'El profesional no pudo atender tu solicitud en este momento.' },
}

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

  const [solicitud,         setSolicitud]         = useState<any>(null)
  const [photos,            setPhotos]            = useState<{ photo_url: string }[]>([])
  const [pdfSignedUrl,      setPdfSignedUrl]      = useState<string | null>(null)
  const [loading,           setLoading]           = useState(true)
  const [actionLoading,     setActionLoading]     = useState(false)
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

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
      setPhotos(
        rawPhotos
          .map((p) => {
            const { data: { publicUrl } } = supabase.storage.from('quote-photos').getPublicUrl(p.photo_url)
            return { photo_url: publicUrl }
          })
          .filter((p) => p.photo_url)
      )

      if (data.quote_pdf_url) {
        const { data: signedData } = await supabase.storage
          .from('quote-pdfs')
          .createSignedUrl(data.quote_pdf_url, 3600)
        setPdfSignedUrl(signedData?.signedUrl ?? null)
      }

      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleAccept() {
    setActionLoading(true)
    const supabase = createClient()
    await supabase.from('quote_requests').update({ status: 'accepted' }).eq('id', params.id)
    setSolicitud((prev: any) => ({ ...prev, status: 'accepted' }))
    setActionLoading(false)
  }

  async function handleReject() {
    setActionLoading(true)
    const supabase = createClient()
    await supabase.from('quote_requests').update({ status: 'rejected' }).eq('id', params.id)
    setSolicitud((prev: any) => ({ ...prev, status: 'rejected' }))
    setConfirmRejectOpen(false)
    setActionLoading(false)
  }

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
  const proPhoto    = profProfile?.photo_url as string | undefined
  const category    = solicitud.category    as any
  const subcategory = solicitud.subcategory as any
  const badge       = STATUS_BADGE[solicitud.status] ?? STATUS_BADGE.pending
  const showCotizacion = solicitud.status === 'responded' || solicitud.status === 'accepted'

  const materialLines = (solicitud.quote_materials as string | null)
    ?.split('\n')
    .map((l: string) => l.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean) ?? []

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Back */}
      <Link
        href={`/${params.country}/cliente/solicitudes`}
        className="sol-back-link"
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#B85C1A', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}
      >
        ← Volver a mis solicitudes de cotización
      </Link>

      {/* Title */}
      <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#1C1410', margin: '0 0 28px' }}>
        Detalle de Solicitud
      </h1>

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

        {/* Cotización recibida */}
        {showCotizacion && (
          <div style={{ backgroundColor: '#fff', border: '1.5px solid #D4A96A50', borderRadius: '12px', padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                background: '#D4A96A20', color: '#B85C1A',
                padding: '4px 12px', borderRadius: '20px',
              }}>
                Cotización recibida
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Descripción */}
              <div>
                <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                  Descripción del trabajo a realizar
                </p>
                <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#1C1410', lineHeight: 1.7, margin: 0 }}>
                  {solicitud.quote_description ?? '—'}
                </p>
              </div>

              {/* Materiales */}
              {materialLines.length > 0 && (
                <div>
                  <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                    Materiales incluidos
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {materialLines.map((line: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <Check style={{ width: 16, height: 16, color: '#6B7B6E', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#1C1410', lineHeight: 1.5 }}>
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Costos */}
              {(solicitud.labor_cost != null || solicitud.materials_cost != null) && (
                <div style={{ background: '#F5F0E8', borderRadius: '8px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {solicitud.labor_cost != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E' }}>Mano de obra</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410' }}>${Number(solicitud.labor_cost).toFixed(2)}</span>
                    </div>
                  )}
                  {solicitud.materials_cost != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E' }}>Materiales estimados</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410' }}>${Number(solicitud.materials_cost).toFixed(2)}</span>
                    </div>
                  )}
                  {solicitud.labor_cost != null && solicitud.materials_cost != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #D4A96A40', paddingTop: '8px' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#1C1410' }}>Total estimado</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#1C1410' }}>${(Number(solicitud.labor_cost) + Number(solicitud.materials_cost)).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* PDF */}
              {pdfSignedUrl && (
                <div>
                  <a
                    href={pdfSignedUrl}
                    download
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: '#1C1410', color: '#D4A96A',
                      fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                      padding: '12px 20px', borderRadius: '8px', textDecoration: 'none',
                    }}
                  >
                    <Download style={{ width: 16, height: 16 }} />
                    Descargar cotización PDF
                  </a>
                </div>
              )}

              {/* Aceptar / Rechazar */}
              {solicitud.status === 'responded' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                  <button
                    onClick={handleAccept}
                    disabled={actionLoading}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#1C1410', color: '#D4A96A',
                      fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700,
                      padding: '13px', borderRadius: '8px', width: '100%',
                      border: 'none', cursor: actionLoading ? 'not-allowed' : 'pointer',
                      opacity: actionLoading ? 0.6 : 1,
                    }}
                  >
                    {actionLoading ? 'Procesando...' : 'Aceptar cotización'}
                  </button>
                  <button
                    onClick={() => setConfirmRejectOpen(true)}
                    disabled={actionLoading}
                    style={{
                      background: 'transparent', color: '#B85C1A',
                      border: '1.5px solid #B85C1A', borderRadius: '8px',
                      fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                      padding: '13px', width: '100%',
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      opacity: actionLoading ? 0.6 : 1,
                    }}
                  >
                    Rechazar cotización
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fotos */}
        {photos.length > 0 && (
          <Card>
            <SectionLabel>Fotos adjuntas</SectionLabel>
            <PhotoGallery photos={photos} />
          </Card>
        )}

        {/* Profesional + Mensajes */}
        <Card>
          {proPhoto ? (
            <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={proPhoto} alt={proName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <Initials name={proName} />
          )}

          <p style={{ fontFamily: FONT_SERIF, fontSize: '20px', fontWeight: 600, color: '#1C1410', textAlign: 'center', margin: '0 0 6px' }}>
            {proName}
          </p>
          {category && (
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#B85C1A', textAlign: 'center', margin: '0 0 8px' }}>
              {category.name}
            </p>
          )}
          {pro?.short_description && (
            <p style={{
              fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E',
              textAlign: 'center', margin: '8px 0 0',
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {pro.short_description}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <Link
              href={`/${params.country}/mensajes?solicitud=${params.id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', padding: '12px',
                fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                background: '#1C1410', color: '#D4A96A',
                borderRadius: '8px', textDecoration: 'none', boxSizing: 'border-box',
              }}
              className="sol-msg-btn"
            >
              <MessageSquare style={{ width: 17, height: 17 }} />
              Ver mensajes
            </Link>

            <Link
              href={`/${params.country}/profesional/${pro?.id}`}
              style={{
                display: 'block', width: '100%', textAlign: 'center',
                border: '1px solid #1C141020', color: '#1C1410',
                fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 600,
                padding: '12px', borderRadius: '8px',
                textDecoration: 'none', boxSizing: 'border-box',
              }}
              className="sol-pro-btn"
            >
              Ver perfil completo
            </Link>
          </div>
        </Card>

      </div>

      {/* Modal confirmar rechazo */}
      {confirmRejectOpen && (
        <div
          onClick={() => setConfirmRejectOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(28,20,16,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff', borderRadius: '16px',
              padding: '32px', maxWidth: '420px', width: '100%',
              boxShadow: '0 20px 60px rgba(28,20,16,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 700, color: '#1C1410', margin: 0 }}>
                ¿Rechazar cotización?
              </h3>
              <button
                onClick={() => setConfirmRejectOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7B6E', padding: '2px', display: 'flex' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#6B7B6E', lineHeight: 1.6, margin: '0 0 24px' }}>
              Si rechazas esta cotización, el profesional será notificado y la solicitud quedará marcada como rechazada.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                style={{
                  background: '#B85C1A', color: '#fff',
                  fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                  padding: '13px', borderRadius: '8px', width: '100%',
                  border: 'none', cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                {actionLoading ? 'Procesando...' : 'Sí, rechazar'}
              </button>
              <button
                onClick={() => setConfirmRejectOpen(false)}
                style={{
                  background: 'transparent', color: '#6B7B6E',
                  fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 600,
                  padding: '13px', borderRadius: '8px', width: '100%',
                  border: '1px solid #1C141020', cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sol-back-link:hover { text-decoration: underline; }
        .sol-msg-btn:hover   { opacity: 0.88; }
        .sol-pro-btn:hover   { background: #F5F0E8; }
      `}</style>
    </div>
  )
}
