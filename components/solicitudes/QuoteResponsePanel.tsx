'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Send, FileUp, FileText, FileDown, X, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  responded: { bg: '#1C141015', color: '#1C1410',  label: 'Respondida' },
  accepted:  { bg: '#6B7B6E20', color: '#3d4d40',  label: 'Aceptada'   },
  rejected:  { bg: '#B85C1A08', color: '#B85C1A',  label: 'Rechazada'  },
  completed: { bg: '#1C141015', color: '#1C1410',  label: 'Finalizada' },
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
  const [error,         setError]         = useState<string | null>(null)
  const [submitting,    setSubmitting]    = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalMateriales = materials.reduce((sum, m) => sum + m.precioTotal, 0)

  useEffect(() => {
    setMaterialsCost(totalMateriales > 0 ? totalMateriales : '')
  }, [totalMateriales])

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
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    try {
      let pdfUrl: string | null = null
      if (pdfFile) {
        const path = `${userId}/${solicitudId}/cotizacion.pdf`
        const { error: uploadError } = await supabase.storage
          .from('quote-pdfs')
          .upload(path, pdfFile, { upsert: true, contentType: 'application/pdf' })
        if (uploadError) throw uploadError
        pdfUrl = path
      }

      const materialsForDB = materials.length > 0
        ? materials.map(({ id: _id, ...rest }) => rest)
        : null

      const { error: updateError } = await supabase
        .from('quote_requests')
        .update({
          status:               'responded',
          quote_description:    description.trim(),
          quote_materials:      null,
          quote_materials_list: materialsForDB,
          quote_pdf_url:        pdfUrl,
          labor_cost:           laborCost     !== '' ? Number(laborCost)     : null,
          materials_cost:       materialsCost !== '' ? Number(materialsCost) : null,
          responded_at:         new Date().toISOString(),
        })
        .eq('id', solicitudId)

      if (updateError) throw updateError
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
    border: '1px solid #D4A96A30', borderRadius: '6px',
    padding: '7px 8px', fontSize: '13px', fontFamily: FONT_SANS,
    background: '#FDFAF5', color: '#1C1410',
    width: '100%', boxSizing: 'border-box', outline: 'none',
  }

  /* ── READ-ONLY VIEW ─────────────────────────────────────────── */
  if (status !== 'pending') {
    const isRejected = status === 'rejected'
    const badge = STATUS_BADGE[status]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          backgroundColor: isRejected ? '#B85C1A08' : '#fff',
          border:          `1.5px solid ${isRejected ? '#B85C1A20' : '#6B7B6E30'}`,
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
                <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#6B7B6E' }}>
                  {formatDMY(respondedAt)}
                </span>
              )}
            </div>
          )}

          {isRejected ? (
            <div>
              <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                Motivo del rechazo
              </p>
              <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#1C1410', lineHeight: 1.7, margin: 0 }}>
                {rejectionReason ?? '—'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  Tu cotización
                </p>
                <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#1C1410', lineHeight: 1.7, margin: 0 }}>
                  {quoteDescription ?? '—'}
                </p>
              </div>

              {/* Materials table — new structured format */}
              {materialsList && materialsList.length > 0 && (
                <div>
                  <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                    Lista de materiales
                  </p>
                  <div style={{ border: '1px solid #D4A96A30', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '70px 1fr 110px 110px',
                      background: '#F5F0E8', padding: '8px 12px', gap: '8px',
                    }}>
                      {['Cant.', 'Descripción', 'Val. unit.', 'Total'].map((h) => (
                        <div key={h} style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {h}
                        </div>
                      ))}
                    </div>
                    {materialsList.map((m, i) => (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '70px 1fr 110px 110px',
                        padding: '10px 12px', gap: '8px',
                        borderTop: '1px solid #1C141008', alignItems: 'center',
                      }}>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410' }}>{m.cantidad}</span>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410' }}>{m.descripcion}</span>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E' }}>${Number(m.valorUnit).toFixed(2)}</span>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#1C1410' }}>${Number(m.precioTotal).toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={{
                      display: 'flex', justifyContent: 'flex-end', gap: '16px',
                      padding: '10px 12px', borderTop: '1px solid #D4A96A30', background: '#F5F0E840',
                    }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, color: '#6B7B6E', textTransform: 'uppercase' }}>
                        Subtotal materiales
                      </span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 700, color: '#1C1410', minWidth: '80px', textAlign: 'right' }}>
                        ${materialsList.reduce((s, m) => s + Number(m.precioTotal), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback: old text format */}
              {!materialsList && quoteMaterials && (
                <div>
                  <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                    Materiales
                  </p>
                  <div style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#1C1410', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {quoteMaterials}
                  </div>
                </div>
              )}

              {(initialLaborCost != null || initialMaterialsCost != null) && (
                <div style={{ background: '#F5F0E8', borderRadius: '8px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {initialLaborCost != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E' }}>Mano de obra</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410' }}>${initialLaborCost.toFixed(2)}</span>
                    </div>
                  )}
                  {initialMaterialsCost != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E' }}>Materiales estimados</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410' }}>${initialMaterialsCost.toFixed(2)}</span>
                    </div>
                  )}
                  {initialLaborCost != null && initialMaterialsCost != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #D4A96A40', paddingTop: '8px' }}>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#1C1410' }}>Total estimado</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#1C1410' }}>${(initialLaborCost + initialMaterialsCost).toFixed(2)}</span>
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
                      color: '#B85C1A', border: '1px solid #B85C1A40', borderRadius: '6px',
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

  /* ── FORM VIEW (status === 'pending') ───────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontFamily: FONT_SERIF, fontSize: '24px', fontWeight: 700, color: '#1C1410', margin: 0 }}>
        Enviar Cotización
      </h2>

      <div style={{
        backgroundColor: '#fff',
        border:          '0.5px solid #1C141015',
        borderRadius:    '12px',
        padding:         '24px',
        display:         'flex',
        flexDirection:   'column',
        gap:             '20px',
      }}>

        {/* Campo 1: Descripción */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#1C1410' }}>
            Descripción del trabajo a realizar{' '}
            <span style={{ color: '#B85C1A' }}>*</span>
          </label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe detalladamente el trabajo que realizarás, incluyendo proceso, tiempo estimado y cualquier condición importante..."
            style={{
              border: '1px solid #D4A96A40', borderRadius: '8px',
              padding: '12px 14px', fontSize: '15px', fontFamily: FONT_SANS,
              background: '#F5F0E8', resize: 'vertical', outline: 'none',
              color: '#1C1410', lineHeight: 1.6,
            }}
          />
        </div>

        {/* Campo 2: Lista de materiales */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#1C1410' }}>
            Lista de materiales{' '}
            <span style={{ fontWeight: 400, color: '#6B7B6E' }}>(opcional)</span>
          </label>

          {materials.length > 0 && (
            <div style={{ border: '1px solid #D4A96A30', borderRadius: '8px', overflow: 'hidden' }}>
              {/* Headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 120px 120px 36px',
                background: '#F5F0E8', padding: '8px 12px', gap: '6px',
              }}>
                {['Cant.', 'Descripción', 'Val. unit.', 'Total', ''].map((h, i) => (
                  <div key={i} style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, color: '#6B7B6E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
                  borderTop: '1px solid #1C141008', alignItems: 'center',
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
                  <div style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#1C1410', paddingLeft: '4px' }}>
                    ${m.precioTotal.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMaterial(m.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#B85C1A60', padding: '4px', display: 'flex',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#B85C1A')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#B85C1A60')}
                  >
                    <Trash2 style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              ))}

              {/* Subtotal row */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '16px',
                padding: '8px 48px 8px 12px',
                borderTop: '1px solid #D4A96A30', background: '#F5F0E840',
              }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, color: '#6B7B6E', textTransform: 'uppercase' }}>
                  Subtotal
                </span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 700, color: '#1C1410', minWidth: '70px', textAlign: 'right' }}>
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
              color: '#B85C1A', background: 'transparent',
              border: '1px dashed #B85C1A50', borderRadius: '6px',
              padding: '7px 14px', cursor: 'pointer',
            }}
          >
            <Plus style={{ width: 14, height: 14 }} />
            Agregar material
          </button>
        </div>

        {/* Campo 3: Mano de obra */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#1C1410' }}>
            Valor de mano de obra (USD){' '}
            <span style={{ color: '#B85C1A' }}>*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="0.00"
            style={{
              border: '1px solid #D4A96A40', borderRadius: '8px',
              padding: '10px 14px', fontSize: '15px', fontFamily: FONT_SANS,
              background: '#F5F0E8', outline: 'none',
              color: '#1C1410', width: '100%', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Campo 4: Materiales estimados (auto-filled from table) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#1C1410' }}>
            Valor estimado de materiales (USD){' '}
            <span style={{ fontWeight: 400, color: '#6B7B6E' }}>
              {materials.length > 0 ? '(calculado automáticamente)' : '(opcional)'}
            </span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={materialsCost}
            onChange={(e) => setMaterialsCost(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="0.00"
            style={{
              border: '1px solid #D4A96A40', borderRadius: '8px',
              padding: '10px 14px', fontSize: '15px', fontFamily: FONT_SANS,
              background: materials.length > 0 ? '#F5F0E850' : '#F5F0E8',
              outline: 'none', color: '#1C1410',
              width: '100%', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Resumen total — dark card */}
        {totalEstimado > 0 && (
          <div style={{
            background: '#1C1410', borderRadius: '10px',
            padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            {laborCost !== '' && Number(laborCost) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#D4A96A80' }}>Mano de obra</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#D4A96A' }}>${Number(laborCost).toFixed(2)}</span>
              </div>
            )}
            {materialsCost !== '' && Number(materialsCost) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#D4A96A80' }}>Materiales</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#D4A96A' }}>${Number(materialsCost).toFixed(2)}</span>
              </div>
            )}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: '1px solid #D4A96A30', paddingTop: '10px',
            }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700, color: '#D4A96A' }}>Total estimado</span>
              <span style={{ fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 700, color: '#D4A96A' }}>${totalEstimado.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Campo: PDF */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#1C1410' }}>
            Cotización en PDF{' '}
            <span style={{ fontWeight: 400, color: '#6B7B6E' }}>(opcional)</span>
          </label>

          {pdfFile ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              border: '1px solid #D4A96A40', borderRadius: '8px',
              padding: '12px 14px', background: '#F5F0E8',
            }}>
              <FileText style={{ width: 20, height: 20, color: '#B85C1A', flexShrink: 0 }} />
              <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {pdfFile.name}
              </span>
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#6B7B6E', display: 'flex' }}
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
                border: '2px dashed #D4A96A60', borderRadius: '10px',
                padding: '24px', textAlign: 'center', background: '#F5F0E808',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '8px',
              }}
            >
              <FileUp style={{ width: 32, height: 32, color: '#B85C1A' }} />
              <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E' }}>
                Arrastra tu PDF aquí o haz clic para subir
              </span>
              <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#6B7B6E', opacity: 0.6 }}>
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
          <div style={{ flex: 1, height: '1px', background: '#1C141012' }} />
          <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#6B7B6E' }}>— o —</span>
          <div style={{ flex: 1, height: '1px', background: '#1C141012' }} />
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
              color: rejectionOpen ? '#1C1410' : '#6B7B6E',
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
              <label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#1C1410' }}>
                Motivo del rechazo <span style={{ color: '#B85C1A' }}>*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionText}
                onChange={(e) => setRejectionText(e.target.value)}
                placeholder="Explica al propietario por qué no puedes atender esta solicitud..."
                style={{
                  border: '1px solid #B85C1A40', borderRadius: '8px',
                  padding: '12px 14px', fontSize: '15px', fontFamily: FONT_SANS,
                  background: '#B85C1A05', resize: 'vertical', outline: 'none',
                  color: '#1C1410', lineHeight: 1.6,
                }}
              />
              <button
                type="button"
                onClick={rechazarSolicitud}
                disabled={submitting}
                style={{
                  background: 'transparent', color: '#B85C1A',
                  border: '1.5px solid #B85C1A', borderRadius: '8px',
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
          <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#B85C1A', margin: 0 }}>
            {error}
          </p>
        )}

        {/* Botón principal */}
        <button
          type="button"
          onClick={enviarCotizacion}
          disabled={!description.trim() || laborCost === '' || submitting}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: '#1C1410', color: '#D4A96A',
            fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700,
            padding: '14px', borderRadius: '8px', width: '100%',
            border: 'none',
            cursor: !description.trim() || laborCost === '' || submitting ? 'not-allowed' : 'pointer',
            opacity: !description.trim() || laborCost === '' || submitting ? 0.5 : 1,
          }}
        >
          <Send style={{ width: 18, height: 18 }} />
          {submitting ? 'Enviando...' : 'Enviar cotización'}
        </button>
      </div>
    </div>
  )
}
