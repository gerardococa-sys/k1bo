'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Send, FileUp, FileText, FileDown, X, ChevronDown, Plus, Trash2, RefreshCw, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  responded: { bg: '#2C2C2C12', color: '#2C2C2C',  label: 'Cotizada'    },
  revision:  { bg: '#D4963A15', color: '#C4581A',  label: 'En revisión' },
  accepted:  { bg: '#7A7A7820', color: '#3d4d40',  label: 'Aceptada'    },
  rejected:  { bg: '#C4581A08', color: '#C4581A',  label: 'Rechazada'  },
  completed: { bg: '#2C2C2C12', color: '#2C2C2C',  label: 'Finalizada' },
}

function formatDMY(dateStr: string | null | undefined) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface MaterialItem {
  id:          string
  cantidad:    number
  descripcion: string
  valorUnit:   number
  precioTotal: number
}

type StoredMaterial = Omit<MaterialItem, 'id'>

interface Props {
  solicitudId:      string
  userId:           string
  country:          string
  status:           string
  quoteDescription: string | null
  quoteMaterials:   string | null
  materialsList:    StoredMaterial[] | null
  quotePdfUrl:      string | null
  rejectionReason:  string | null
  respondedAt:      string | null
  laborCost:        number | null
  materialsCost:    number | null
}

export function QuoteResponsePanel({
  solicitudId, userId, country, status,
  quoteDescription, quoteMaterials, materialsList,
  quotePdfUrl, rejectionReason, respondedAt,
  laborCost: initialLaborCost, materialsCost: initialMaterialsCost,
}: Props) {
  const router = useRouter()

  const [description,   setDescription]   = useState('')
  const [materials,     setMaterials]     = useState<MaterialItem[]>([])
  const [laborCost,     setLaborCost]     = useState<number | ''>('')
  const [materialsCost, setMaterialsCost] = useState<number | ''>('')
  const [pdfFile,       setPdfFile]       = useState<File | null>(null)
  const [rejectionOpen, setRejectionOpen] = useState(false)
  const [rejectionText, setRejectionText] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [error,          setError]         = useState<string | null>(null)
  const [submitting,     setSubmitting]    = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalMateriales = materials.reduce((sum, m) => sum + m.precioTotal, 0)

  useEffect(() => {
    setMaterialsCost(totalMateriales > 0 ? totalMateriales : '')
  }, [totalMateriales])

  useEffect(() => {
    if (status === 'revision') setAceptaTerminos(false)
  }, [status])

  useEffect(() => {
    if (status === 'pending' && quoteDescription) setDescription(quoteDescription)
    if (status === 'pending' && materialsList && materialsList.length > 0) {
      setMaterials(materialsList.map((m, i) => ({
        ...m,
        id: `mat-${i}-${Date.now()}`,
      })))
    }
    if (status === 'pending' && initialLaborCost != null) setLaborCost(initialLaborCost)
    if (status === 'pending' && initialMaterialsCost != null) setMaterialsCost(initialMaterialsCost)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalEstimado = (Number(laborCost) || 0) + (Number(materialsCost) || 0)

  function addMaterial() {
    setMaterials((prev) => [...prev, {
      id:          `mat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      cantidad:    1,
      descripcion: '',
      valorUnit:   0,
      precioTotal: 0,
    }])
  }

  function updateMaterial(id: string, field: 'cantidad' | 'descripcion' | 'valorUnit', rawValue: string) {
    setMaterials((prev) => prev.map((m) => {
      if (m.id !== id) return m
      const updated = { ...m, [field]: field === 'descripcion' ? rawValue : (Number(rawValue) || 0) }
      updated.precioTotal = updated.cantidad * updated.valorUnit
      return updated
    }))
  }

  function removeMaterial(id: string) {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
      setPdfFile(file)
    }
  }, [])

  async function enviarCotizacion() {
    if (!description.trim()) return

    if (!aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones para enviar la cotización.')
      document.getElementById('terminos-check')?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    try {
      let pdfUrl: string | null = null
      if (pdfFile) {
        const path = `${userId}/${solicitudId}/cotizacion.pdf`

        console.log('[PDF upload] userId:', userId)
        console.log('[PDF upload] solicitudId:', solicitudId)
        console.log('[PDF upload] path:', path)
        console.log('[PDF upload] file:', pdfFile.name, pdfFile.size, pdfFile.type)

        const uploadResult = await supabase.storage
          .from('quote-pdfs')
          .upload(path, pdfFile, { upsert: true, contentType: 'application/pdf' })

        const uploadError = Array.isArray(uploadResult) ? uploadResult[1] : uploadResult.error
        const uploadData  = Array.isArray(uploadResult) ? uploadResult[0] : uploadResult.data

        console.log('[PDF] uploadData:', uploadData)
        console.log('[PDF] uploadError:', uploadError)

        if (uploadError) {
          setError('Error al subir PDF: ' + uploadError.message)
          setSubmitting(false)
          return
        }

        pdfUrl = path
        console.log('[PDF] pdfUrl guardado:', pdfUrl)
      }

      const materialsForDB = materials.length > 0
        ? materials.map(({ id: _id, ...rest }) => rest)
        : null

      console.log('[update] pdfUrl que se va a guardar:', pdfUrl)

      const { error: updateError } = await supabase
        .from('quote_requests')
        .update({
          status:               'responded',
          quote_description:    description.trim(),
          quote_materials:      null,
          quote_materials_list: materialsForDB,
          quote_pdf_url:        pdfUrl ?? (status === 'revision' ? quotePdfUrl : null),
          labor_cost:           laborCost     !== '' ? Number(laborCost)     : null,
          materials_cost:       materialsCost !== '' ? Number(materialsCost) : null,
          responded_at:         new Date().toISOString(),
        })
        .eq('id', solicitudId)

      console.log('[update] error:', updateError)

      if (updateError) {
        setError('Error al guardar: ' + updateError.message)
        setSubmitting(false)
        return
      }
      router.push(`/${country}/profesional-panel/solicitudes`)
    } catch (e: any) {
      setError(e.message ?? 'Ocurrió un error al enviar la cotización')
      setSubmitting(false)
    }
  }

  async function rechazarSolicitud() {
    if (!rejectionText.trim()) {
      setError('Debes escribir el motivo del rechazo')
      return
    }
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    try {
      const { error: updateError } = await supabase
        .from('quote_requests')
        .update({
          status:           'rejected',
          rejection_reason: rejectionText.trim(),
          responded_at:     new Date().toISOString(),
        })
        .eq('id', solicitudId)
      if (updateError) throw updateError
      router.push(`/${country}/profesional-panel/solicitudes`)
    } catch (e: any) {
      setError(e.message ?? 'Ocurrió un error al rechazar la solicitud')
      setSubmitting(false)
    }
  }

  const cellInput: React.CSSProperties = {
    border: '1px solid #D4963A30', borderRadius: '6px',
    padding: '7px 8px', fontSize: '13px', fontFamily: FONT_SANS,
    background: '#FDFAF5', color: '#2C2C2C',
    width: '100%', boxSizing: 'border-box', outline: 'none',
  }

  /* ── READ-ONLY VIEW ─────────────────────────────────────────── */
  if (status !== 'pending') {
    const isRejected = status === 'rejected'
    const badge = STATUS_BADGE[status]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          backgroundColor: isRejected ? '#C4581A08' : '#fff',
          border:          `1.5px solid ${isRejected ? '#C4581A20' : '#7A7A7830'}`,
          borderRadius:    '12px',
          padding:         '24px',
        }}>
          {badge && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{
                fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                background: badge.bg, color: badge.color,
                padding: '4px 12px', borderRadius: '20px',
              }}>
                {badge.label}
              </span>
              {respondedAt && (
                <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>
                  {formatDMY(respondedAt)}
                </span>
              )}
            </div>
          )}

          {isRejected ? (
            <div>
              <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                Motivo del rechazo
              </p>
              <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C', lineHeight: 1.7, margin: 0 }}>
                {rejectionReason ?? '—'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  Tu cotización
                </p>
                <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C', lineHeight: 1.7, margin: 0 }}>
                  {quoteDescription ?? '—'}
                </p>
              </div>

              {/* Materials table — new structured format */}
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

              {/* Fallback: old text format */}
              {!materialsList && quoteMaterials && (
                <div>
                  <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                    Materiales
                  </p>
                  <div style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {quoteMaterials}
                  </div>
                </div>
              )}

              {(initialLaborCost != null || initialMaterialsCost != null) && (
                <div style={{ background: '#F2F0ED', borderRadius: '8px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {initialLaborCost != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Mano de obra</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>${initialLaborCost.toFixed(2)}</span>
                    </div>
                  )}
                  {initialMaterialsCost != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Materiales estimados</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>${initialMaterialsCost.toFixed(2)}</span>
                    </div>
                  )}
                  {initialLaborCost != null && initialMaterialsCost != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #D4963A40', paddingTop: '8px' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#2C2C2C' }}>Total estimado</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#2C2C2C' }}>${(initialLaborCost + initialMaterialsCost).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {quotePdfUrl && (
                <div>
                  <button
                    type="button"
                    onClick={async () => {
                      const supabase = createClient()
                      const { data } = await supabase.storage
                        .from('quote-pdfs')
                        .createSignedUrl(quotePdfUrl, 3600)
                      if (data?.signedUrl) window.open(data.signedUrl, '_blank')
                    }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      color: '#C4581A', border: '1px solid #C4581A40', borderRadius: '6px',
                      padding: '8px 14px', fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600,
                      background: 'transparent', cursor: 'pointer',
                    }}
                  >
                    <FileDown style={{ width: 16, height: 16 }} />
                    Ver cotización PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── FORM VIEW (status === 'pending' | 'revision') ─────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontFamily: FONT_SERIF, fontSize: '24px', fontWeight: 700, color: '#2C2C2C', margin: 0 }}>
        {quoteDescription ? 'Editar Cotización' : 'Enviar Cotización'}
      </h2>

      {quoteDescription && (
        <div style={{
          background: '#D4963A15', border: '1px solid #D4963A50',
          borderRadius: '10px', padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}>
          <RefreshCw style={{ width: 16, height: 16, color: '#C4581A', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#C4581A', margin: '0 0 3px' }}>
              El propietario ha solicitado cambios
            </p>
            <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', margin: 0, lineHeight: 1.5 }}>
              Edita la cotización con los ajustes necesarios y vuelve a enviarla.
            </p>
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: '#fff',
        border:          '0.5px solid #2C2C2C12',
        borderRadius:    '12px',
        padding:         '24px',
        display:         'flex',
        flexDirection:   'column',
        gap:             '20px',
      }}>

        {/* Campo 1: Descripción */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#2C2C2C' }}>
            Descripción del trabajo a realizar{' '}
            <span style={{ color: '#C4581A' }}>*</span>
          </label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe detalladamente el trabajo que realizarás, incluyendo proceso, tiempo estimado y cualquier condición importante..."
            style={{
              border: '1px solid #D4963A40', borderRadius: '8px',
              padding: '12px 14px', fontSize: '15px', fontFamily: FONT_SANS,
              background: '#F2F0ED', resize: 'vertical', outline: 'none',
              color: '#2C2C2C', lineHeight: 1.6,
            }}
          />
        </div>

        {/* Campo 2: Lista de materiales */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#2C2C2C' }}>
            Lista de materiales{' '}
            <span style={{ fontWeight: 400, color: '#7A7A78' }}>(opcional)</span>
          </label>

          {materials.length > 0 && (
            <div style={{ border: '1px solid #D4963A30', borderRadius: '8px', overflow: 'hidden' }}>
              {/* Headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 120px 120px 36px',
                background: '#F2F0ED', padding: '8px 12px', gap: '6px',
              }}>
                {['Cant.', 'Descripción', 'Val. unit.', 'Total', ''].map((h, i) => (
                  <div key={i} style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {materials.map((m) => (
                <div key={m.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 120px 120px 36px',
                  padding: '8px 12px', gap: '6px',
                  borderTop: '1px solid #2C2C2C08', alignItems: 'center',
                }}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={m.cantidad}
                    onChange={(e) => updateMaterial(m.id, 'cantidad', e.target.value)}
                    style={cellInput}
                  />
                  <input
                    type="text"
                    value={m.descripcion}
                    onChange={(e) => updateMaterial(m.id, 'descripcion', e.target.value)}
                    placeholder="Descripción"
                    style={cellInput}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={m.valorUnit}
                    onChange={(e) => updateMaterial(m.id, 'valorUnit', e.target.value)}
                    style={cellInput}
                  />
                  <div style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#2C2C2C', paddingLeft: '4px' }}>
                    ${m.precioTotal.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMaterial(m.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#C4581A60', padding: '4px', display: 'flex',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C4581A')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#C4581A60')}
                  >
                    <Trash2 style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              ))}

              {/* Subtotal row */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '16px',
                padding: '8px 48px 8px 12px',
                borderTop: '1px solid #D4963A30', background: '#F2F0ED40',
              }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase' }}>
                  Subtotal
                </span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 700, color: '#2C2C2C', minWidth: '70px', textAlign: 'right' }}>
                  ${totalMateriales.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={addMaterial}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              alignSelf: 'flex-start',
              fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600,
              color: '#C4581A', background: 'transparent',
              border: '1px dashed #C4581A50', borderRadius: '6px',
              padding: '7px 14px', cursor: 'pointer',
            }}
          >
            <Plus style={{ width: 14, height: 14 }} />
            Agregar material
          </button>
        </div>

        {/* Campo 3: Mano de obra */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#2C2C2C' }}>
            Valor de mano de obra (USD){' '}
            <span style={{ color: '#C4581A' }}>*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="0.00"
            style={{
              border: '1px solid #D4963A40', borderRadius: '8px',
              padding: '10px 14px', fontSize: '15px', fontFamily: FONT_SANS,
              background: '#F2F0ED', outline: 'none',
              color: '#2C2C2C', width: '100%', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Resumen total */}
        {totalEstimado > 0 && (
          <div style={{
            background: '#F2F0ED', borderRadius: '10px',
            padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            {laborCost !== '' && Number(laborCost) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Mano de obra</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>${Number(laborCost).toFixed(2)}</span>
              </div>
            )}
            {materialsCost !== '' && Number(materialsCost) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Materiales</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>${Number(materialsCost).toFixed(2)}</span>
              </div>
            )}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: '1px solid #D4963A40', paddingTop: '10px',
            }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700, color: '#2C2C2C' }}>Total estimado</span>
              <span style={{ fontFamily: FONT_SERIF, fontSize: '20px', fontWeight: 700, color: '#C4581A' }}>${totalEstimado.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Campo: PDF */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#2C2C2C' }}>
            Cotización en PDF{' '}
            <span style={{ fontWeight: 400, color: '#7A7A78' }}>(opcional)</span>
          </label>

          {pdfFile ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              border: '1px solid #D4963A40', borderRadius: '8px',
              padding: '12px 14px', background: '#F2F0ED',
            }}>
              <FileText style={{ width: 20, height: 20, color: '#C4581A', flexShrink: 0 }} />
              <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {pdfFile.name}
              </span>
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#7A7A78', display: 'flex' }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #D4963A60', borderRadius: '10px',
                padding: '24px', textAlign: 'center', background: '#F2F0ED08',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '8px',
              }}
            >
              <FileUp style={{ width: 32, height: 32, color: '#C4581A' }} />
              <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>
                Arrastra tu PDF aquí o haz clic para subir
              </span>
              <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#7A7A78', opacity: 0.6 }}>
                Solo PDF · Máx. 5MB
              </span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file && file.size <= 5 * 1024 * 1024) setPdfFile(file)
              e.target.value = ''
            }}
          />
        </div>

        {/* Separador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#2C2C2C12' }} />
          <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>— o —</span>
          <div style={{ flex: 1, height: '1px', background: '#2C2C2C12' }} />
        </div>

        {/* Rechazo accordion */}
        <div>
          <button
            type="button"
            onClick={() => { setRejectionOpen((v) => !v); setError(null) }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600,
              color: rejectionOpen ? '#1E1E1E' : '#7A7A78',
              padding: '4px 0', transition: 'color 0.15s',
            }}
          >
            Rechazar esta solicitud
            <ChevronDown style={{
              width: 18, height: 18,
              transform: rejectionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }} />
          </button>

          {rejectionOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
              <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#2C2C2C' }}>
                Motivo del rechazo <span style={{ color: '#C4581A' }}>*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionText}
                onChange={(e) => setRejectionText(e.target.value)}
                placeholder="Explica al propietario por qué no puedes atender esta solicitud..."
                style={{
                  border: '1px solid #C4581A40', borderRadius: '8px',
                  padding: '12px 14px', fontSize: '15px', fontFamily: FONT_SANS,
                  background: '#C4581A05', resize: 'vertical', outline: 'none',
                  color: '#2C2C2C', lineHeight: 1.6,
                }}
              />
              <button
                type="button"
                onClick={rechazarSolicitud}
                disabled={submitting}
                style={{
                  background: 'transparent', color: '#C4581A',
                  border: '1.5px solid #C4581A', borderRadius: '8px',
                  fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                  padding: '12px 24px', width: '100%', marginTop: '8px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? 'Enviando...' : 'Rechazar solicitud'}
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#C4581A', margin: 0 }}>
            {error}
          </p>
        )}

        {/* Checkbox términos y condiciones */}
        <div
          id="terminos-check"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            background: '#F2F0ED',
            borderRadius: '8px',
            border: `1.5px solid ${aceptaTerminos ? '#C4581A40' : '#2C2C2C15'}`,
            cursor: 'pointer',
          }}
          onClick={() => setAceptaTerminos((v) => !v)}
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            border: `2px solid ${aceptaTerminos ? '#C4581A' : '#7A7A78'}`,
            background: aceptaTerminos ? '#C4581A' : 'transparent',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 150ms',
            marginTop: '1px',
          }}>
            {aceptaTerminos && (
              <Check style={{ width: 12, height: 12, color: '#F2F0ED', strokeWidth: 3 }} />
            )}
          </div>
          <p style={{
            fontFamily: FONT_SANS,
            fontSize: '14px',
            color: '#2C2C2C',
            lineHeight: 1.6,
            margin: 0,
            userSelect: 'none',
          }}>
            He leído y acepto los{' '}
            <a
              href="/terminos"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: '#C4581A', fontWeight: 600, textDecoration: 'none' }}
            >
              Términos y Condiciones
            </a>
            {' '}de Artifex7, incluyendo la política de comisiones y pagos aplicable a los profesionales.
          </p>
        </div>

        {!aceptaTerminos && error?.includes('términos') && (
          <p style={{
            fontFamily: FONT_SANS,
            fontSize: '13px',
            color: '#C4581A',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
            Debes aceptar los términos y condiciones para enviar la cotización.
          </p>
        )}

        {/* Botón principal */}
        <button
          type="button"
          onClick={enviarCotizacion}
          disabled={!description.trim() || laborCost === '' || !aceptaTerminos || submitting}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: '#1E1E1E', color: '#D4963A',
            fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700,
            padding: '14px', borderRadius: '8px', width: '100%',
            border: 'none',
            cursor: !description.trim() || laborCost === '' || !aceptaTerminos || submitting ? 'not-allowed' : 'pointer',
            opacity: !description.trim() || laborCost === '' || !aceptaTerminos || submitting ? 0.5 : 1,
          }}
        >
          <Send style={{ width: 18, height: 18 }} />
          {submitting ? 'Enviando...' : 'Enviar cotización'}
        </button>
      </div>
    </div>
  )
}
