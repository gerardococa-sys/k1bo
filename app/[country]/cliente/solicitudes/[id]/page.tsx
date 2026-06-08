'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Clock, Check, Download, X, MessageSquare, RefreshCw, CheckCircle, MessageCircle } from 'lucide-react'
import { PhotoGallery } from '@/components/quotes/PhotoGallery'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string; description: string }> = {
  pending:   { bg: '#D4963A20', color: '#C4581A', label: 'Pendiente',  description: 'Tu solicitud está siendo revisada por el profesional.' },
  responded: { bg: '#2C2C2C12', color: '#2C2C2C', label: 'Cotizada',     description: 'El profesional ha respondido con una cotización.' },
  revision:  { bg: '#D4963A15', color: '#C4581A', label: 'En revisión', description: 'Has solicitado cambios. El profesional está revisando tu solicitud.' },
  accepted:  { bg: '#7A7A7820', color: '#3d4d40', label: 'Aceptada',    description: 'Has aceptado la cotización del profesional.' },
  rejected:  { bg: '#2C2C2C10', color: '#7A7A78', label: 'Rechazada',  description: 'El profesional no pudo atender tu solicitud en este momento.' },
}

function formatDMY(dateStr: string | null | undefined) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: '#fff', border: '0.5px solid #2C2C2C12', borderRadius: '12px', padding: '24px', ...style }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>
      {children}
    </p>
  )
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 500, color: '#C4581A' }}>
        {value}
      </span>
    </div>
  )
}

function Initials({ name }: { name?: string }) {
  const letters = (name ?? '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#C4581A15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
      <span style={{ fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 700, color: '#C4581A' }}>{letters}</span>
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
  const [displayStatus,     setDisplayStatus]     = useState<string | null>(null)
  const [hireMode,          setHireMode]          = useState<'labor_only' | 'labor_and_materials' | null>(null)

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
    if (!hireMode) return
    setActionLoading(true)
    const supabase = createClient()
    await supabase
      .from('quote_requests')
      .update({ status: 'accepted', hire_mode: hireMode })
      .eq('id', params.id)
    setSolicitud((prev: any) => ({ ...prev, status: 'accepted', hire_mode: hireMode }))
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

  async function handleRequestRevision() {
    setActionLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('quote_requests')
      .update({ status: 'pending', responded_at: null })
      .eq('id', params.id)
    if (!error) {
      setDisplayStatus('revision')
      setSolicitud((prev: any) => ({ ...prev, status: 'pending' }))
    } else {
      console.error('Error al solicitar revisión:', error)
    }
    setActionLoading(false)
  }

  if (loading) {
    return (
      <div style={{ fontFamily: FONT_SANS, padding: '64px 24px', textAlign: 'center', color: '#7A7A78' }}>
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
  const currentStatus  = displayStatus ?? solicitud.status
  const badge          = STATUS_BADGE[currentStatus] ?? STATUS_BADGE.pending
  const showCotizacion = currentStatus === 'responded' || currentStatus === 'accepted' || currentStatus === 'revision'

  const materialsList = (solicitud.quote_materials_list as { cantidad: number; descripcion: string; valorUnit: number; precioTotal: number }[] | null) ?? null
  const materialLines = materialsList
    ? []
    : (solicitud.quote_materials as string | null)
        ?.split('\n')
        .map((l: string) => l.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean) ?? []

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Back */}
      <Link
        href={`/${params.country}/cliente/solicitudes`}
        className="sol-back-link"
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}
      >
        ← Volver a mis solicitudes de cotización
      </Link>

      {/* Title */}
      <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#2C2C2C', margin: '0 0 12px' }}>
        Detalle de Solicitud de Cotización
      </h1>

      {/* Código */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: '#2C2C2C08', padding: '6px 14px',
        borderRadius: '8px', marginBottom: '24px',
      }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Código
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: '#2C2C2C' }}>
          {params.id.substring(0, 8).toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Info card */}
        <Card>
          <SectionLabel>Solicitud</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {category    && <FieldRow label="Categoría"    value={category.name} />}
            {subcategory && <FieldRow label="Subcategoría" value={subcategory.name} />}

            {solicitud.required_date && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fecha requerida</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 500, color: '#C4581A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar style={{ width: 15, height: 15, flexShrink: 0 }} />
                  {formatDMY(solicitud.required_date)}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Enviada el</span>
              <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 500, color: '#C4581A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock style={{ width: 15, height: 15, flexShrink: 0 }} />
                {formatDMY(solicitud.created_at)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Descripción del trabajo</span>
              <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#2C2C2C', lineHeight: 1.7, margin: 0 }}>{solicitud.description}</p>
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
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', textAlign: 'center', margin: 0 }}>
              {badge.description}
            </p>
          </div>
        </Card>

        {/* Cotización recibida */}
        {showCotizacion && (
          <div style={{ backgroundColor: '#fff', border: '1.5px solid #D4963A50', borderRadius: '12px', padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                background: '#D4963A20', color: '#C4581A',
                padding: '4px 12px', borderRadius: '20px',
              }}>
                Cotización recibida
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Descripción */}
              <div>
                <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                  Descripción del trabajo a realizar
                </p>
                <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#2C2C2C', lineHeight: 1.7, margin: 0 }}>
                  {solicitud.quote_description ?? '—'}
                </p>
              </div>

              {/* Materiales — tabla estructurada (nuevo formato) */}
              {materialsList && materialsList.length > 0 && (
                <div>
                  <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                    Lista de materiales
                  </p>
                  <div style={{ border: '1px solid #D4963A30', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '70px 1fr 110px 110px',
                      background: '#F2F0ED', padding: '8px 12px', gap: '8px',
                    }}>
                      {['Cant.', 'Descripción', 'Val. unit.', 'Total'].map((h) => (
                        <div key={h} style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {h}
                        </div>
                      ))}
                    </div>
                    {materialsList.map((m, i) => (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '70px 1fr 110px 110px',
                        padding: '10px 12px', gap: '8px',
                        borderTop: '1px solid #2C2C2C08', alignItems: 'center',
                      }}>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>{m.cantidad}</span>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>{m.descripcion}</span>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>${Number(m.valorUnit).toFixed(2)}</span>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#2C2C2C' }}>${Number(m.precioTotal).toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={{
                      display: 'flex', justifyContent: 'flex-end', gap: '16px',
                      padding: '10px 12px', borderTop: '1px solid #D4963A30', background: '#F2F0ED40',
                    }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase' }}>
                        Subtotal materiales
                      </span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 700, color: '#2C2C2C', minWidth: '80px', textAlign: 'right' }}>
                        ${materialsList.reduce((s, m) => s + Number(m.precioTotal), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Materiales — formato antiguo (texto) */}
              {!materialsList && materialLines.length > 0 && (
                <div>
                  <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                    Materiales incluidos
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {materialLines.map((line: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <Check style={{ width: 16, height: 16, color: '#7A7A78', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C', lineHeight: 1.5 }}>
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Costos */}
              {showCotizacion && (
                <div style={{ background: '#F2F0ED', borderRadius: '8px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {solicitud.status === 'accepted' && solicitud.hire_mode && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: '#7A7A7815', padding: '4px 12px', borderRadius: '20px',
                      marginBottom: '4px', alignSelf: 'flex-start',
                    }}>
                      <CheckCircle style={{ width: 14, height: 14, color: '#7A7A78' }} />
                      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {solicitud.hire_mode === 'labor_only'
                          ? 'Contratado: Solo mano de obra'
                          : 'Contratado: Mano de obra + materiales'}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Mano de obra</span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>${Number(solicitud.labor_cost ?? 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Materiales</span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>${Number(solicitud.materials_cost ?? 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #D4963A40', paddingTop: '8px' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#2C2C2C' }}>Total estimado</span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '17px', fontWeight: 700, color: '#C4581A' }}>${(Number(solicitud.labor_cost ?? 0) + Number(solicitud.materials_cost ?? 0)).toFixed(2)}</span>
                  </div>
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
                      background: '#1E1E1E', color: '#D4963A',
                      fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                      padding: '12px 20px', borderRadius: '8px', textDecoration: 'none',
                    }}
                  >
                    <Download style={{ width: 16, height: 16 }} />
                    Descargar cotización PDF
                  </a>
                </div>
              )}

              {/* Aviso de espera cuando se solicitaron cambios */}
              {currentStatus === 'revision' && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  background: '#D4963A12', border: '1px solid #D4963A40',
                  borderRadius: '8px', padding: '14px 16px', marginTop: '8px',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>⏳</span>
                  <div>
                    <p style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#2C2C2C', margin: '0 0 4px' }}>
                      Cambios solicitados
                    </p>
                    <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', lineHeight: 1.6, margin: 0 }}>
                      Has solicitado cambios al profesional. Recibirás una notificación cuando envíe la cotización actualizada.
                    </p>
                    <Link
                      href={`/${params.country}/mensajes?solicitud=${params.id}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        marginTop: '10px', fontFamily: FONT_SANS, fontSize: '13px',
                        fontWeight: 600, color: '#C4581A', textDecoration: 'none',
                      }}
                    >
                      <MessageSquare style={{ width: 14, height: 14 }} />
                      Enviar mensaje al profesional →
                    </Link>
                  </div>
                </div>
              )}

              {/* Aceptar / Solicitar cambios / Rechazar — flujo 2 pasos */}
              {currentStatus === 'responded' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>

                  {hireMode === null ? (
                    /* ── PASO 1: selección de modalidad ── */
                    <>
                      <p style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#2C2C2C', margin: '0 0 4px' }}>
                        ¿Cómo desea contratar al profesional?
                      </p>

                      <button
                        onClick={() => setHireMode('labor_only')}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                          background: '#fff', border: '1.5px solid #D4963A50', borderRadius: '10px',
                          padding: '14px 16px', cursor: 'pointer', width: '100%', textAlign: 'left',
                          transition: 'border-color 150ms',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#C4581A')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#D4963A50')}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#2C2C2C' }}>
                            Solo mano de obra
                          </span>
                          <span style={{ fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700, color: '#C4581A' }}>
                            ${Number(solicitud.labor_cost ?? 0).toFixed(2)}
                          </span>
                        </div>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>
                          El profesional realiza el trabajo. Los materiales corren por su cuenta.
                        </span>
                      </button>

                      <button
                        onClick={() => setHireMode('labor_and_materials')}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                          background: '#fff', border: '1.5px solid #D4963A50', borderRadius: '10px',
                          padding: '14px 16px', cursor: 'pointer', width: '100%', textAlign: 'left',
                          transition: 'border-color 150ms',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#C4581A')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#D4963A50')}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#2C2C2C' }}>
                            Mano de obra + materiales
                          </span>
                          <span style={{ fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700, color: '#C4581A' }}>
                            ${(Number(solicitud.labor_cost ?? 0) + Number(solicitud.materials_cost ?? 0)).toFixed(2)}
                          </span>
                        </div>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>
                          El profesional incluye todos los materiales de la lista en la cotización.
                        </span>
                      </button>

                      {/* Solicitar cambios y Rechazar ya visibles en paso 1 */}
                      <button
                        onClick={handleRequestRevision}
                        disabled={actionLoading}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          background: 'transparent', color: '#7A7A78',
                          border: '1.5px solid #7A7A7840', borderRadius: '8px',
                          fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 600,
                          padding: '13px', width: '100%',
                          cursor: actionLoading ? 'not-allowed' : 'pointer',
                          opacity: actionLoading ? 0.6 : 1,
                          marginTop: '4px',
                        }}
                      >
                        <RefreshCw style={{ width: 16, height: 16 }} />
                        {actionLoading ? 'Procesando...' : 'Solicitar cambios'}
                      </button>

                      <button
                        onClick={() => setConfirmRejectOpen(true)}
                        disabled={actionLoading}
                        style={{
                          background: 'transparent', color: '#C4581A',
                          border: '1.5px solid #C4581A', borderRadius: '8px',
                          fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                          padding: '13px', width: '100%',
                          cursor: actionLoading ? 'not-allowed' : 'pointer',
                          opacity: actionLoading ? 0.6 : 1,
                        }}
                      >
                        Rechazar cotización
                      </button>
                    </>
                  ) : (
                    /* ── PASO 2: confirmación ── */
                    <>
                      <div style={{ background: '#F2F0ED', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Modalidad seleccionada
                          </span>
                          <button
                            onClick={() => setHireMode(null)}
                            style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#C4581A', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            Cambiar
                          </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>
                            {hireMode === 'labor_only' ? 'Solo mano de obra' : 'Mano de obra + materiales'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Mano de obra</span>
                          <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>${Number(solicitud.labor_cost ?? 0).toFixed(2)}</span>
                        </div>

                        {hireMode === 'labor_and_materials' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Materiales</span>
                            <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>${Number(solicitud.materials_cost ?? 0).toFixed(2)}</span>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #D4963A40', paddingTop: '8px' }}>
                          <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#2C2C2C' }}>Total a pagar</span>
                          <span style={{ fontFamily: FONT_SANS, fontSize: '18px', fontWeight: 700, color: '#C4581A' }}>
                            ${hireMode === 'labor_only'
                              ? Number(solicitud.labor_cost ?? 0).toFixed(2)
                              : (Number(solicitud.labor_cost ?? 0) + Number(solicitud.materials_cost ?? 0)).toFixed(2)
                            }
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleAccept}
                        disabled={actionLoading}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          background: '#1E1E1E', color: '#D4963A',
                          fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700,
                          padding: '14px', borderRadius: '8px', width: '100%',
                          border: 'none', cursor: actionLoading ? 'not-allowed' : 'pointer',
                          opacity: actionLoading ? 0.6 : 1,
                        }}
                      >
                        {actionLoading ? 'Procesando...' : 'Confirmar y aceptar cotización'}
                      </button>

                      <button
                        onClick={handleRequestRevision}
                        disabled={actionLoading}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          background: 'transparent', color: '#7A7A78',
                          border: '1.5px solid #7A7A7840', borderRadius: '8px',
                          fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 600,
                          padding: '13px', width: '100%',
                          cursor: actionLoading ? 'not-allowed' : 'pointer',
                          opacity: actionLoading ? 0.6 : 1,
                        }}
                      >
                        <RefreshCw style={{ width: 16, height: 16 }} />
                        {actionLoading ? 'Procesando...' : 'Solicitar cambios'}
                      </button>

                      <button
                        onClick={() => setConfirmRejectOpen(true)}
                        disabled={actionLoading}
                        style={{
                          background: 'transparent', color: '#C4581A',
                          border: '1.5px solid #C4581A', borderRadius: '8px',
                          fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                          padding: '13px', width: '100%',
                          cursor: actionLoading ? 'not-allowed' : 'pointer',
                          opacity: actionLoading ? 0.6 : 1,
                        }}
                      >
                        Rechazar cotización
                      </button>

                      <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        background: '#D4963A12', border: '1px solid #D4963A40',
                        borderRadius: '8px', padding: '12px 14px',
                      }}>
                        <MessageCircle style={{ width: 16, height: 16, color: '#C4581A', flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', lineHeight: 1.6, margin: 0 }}>
                          Puede enviar mensajes al maestro antes de aceptar o rechazar la cotización.{' '}
                          <Link href={`/${params.country}/mensajes?solicitud=${params.id}`} style={{ color: '#C4581A', fontWeight: 600, textDecoration: 'none' }}>
                            Ir a mensajes →
                          </Link>
                        </p>
                      </div>
                    </>
                  )}
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
              <img
                src={proPhoto}
                alt={proName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  const p = t.parentElement
                  if (p) {
                    p.style.background = '#C4581A15'
                    p.style.display = 'flex'
                    p.style.alignItems = 'center'
                    p.style.justifyContent = 'center'
                    p.innerHTML = `<span style="font-family:DM Sans,sans-serif;font-size:22px;font-weight:700;color:#C4581A">${proName.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()}</span>`
                  }
                }}
              />
            </div>
          ) : (
            <Initials name={proName} />
          )}

          <p style={{ fontFamily: FONT_SERIF, fontSize: '20px', fontWeight: 600, color: '#2C2C2C', textAlign: 'center', margin: '0 0 6px' }}>
            {proName}
          </p>
          {category && (
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#C4581A', textAlign: 'center', margin: '0 0 8px' }}>
              {category.name}
            </p>
          )}
          {pro?.short_description && (
            <p style={{
              fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78',
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
                background: '#1E1E1E', color: '#D4963A',
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
                border: '1px solid #2C2C2C20', color: '#2C2C2C',
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
            backgroundColor: 'rgba(30,30,30,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff', borderRadius: '16px',
              padding: '32px', maxWidth: '420px', width: '100%',
              boxShadow: '0 20px 60px rgba(30,30,30,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 700, color: '#2C2C2C', margin: 0 }}>
                ¿Rechazar cotización?
              </h3>
              <button
                onClick={() => setConfirmRejectOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A7A78', padding: '2px', display: 'flex' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#7A7A78', lineHeight: 1.6, margin: '0 0 24px' }}>
              Si rechazas esta cotización, el profesional será notificado y la solicitud quedará marcada como rechazada.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                style={{
                  background: '#C4581A', color: '#fff',
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
                  background: 'transparent', color: '#7A7A78',
                  fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 600,
                  padding: '13px', borderRadius: '8px', width: '100%',
                  border: '1px solid #2C2C2C20', cursor: 'pointer',
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
        .sol-pro-btn:hover   { background: #F2F0ED; }
      `}</style>
    </div>
  )
}
