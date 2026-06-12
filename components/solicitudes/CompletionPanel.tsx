'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, ClipboardCheck, AlertCircle, Clock } from 'lucide-react'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

export function CompletionPanel({
  solicitudId,
  initialStatus,
  initialCompletionNotes,
  initialCompletedAt,
}: {
  solicitudId: string
  initialStatus: string
  initialCompletionNotes: string | null
  initialCompletedAt: string | null
}) {
  const [status,         setStatus]         = useState(initialStatus)
  const [submittedNotes, setSubmittedNotes] = useState(initialCompletionNotes)
  const [completedAt,    setCompletedAt]    = useState<string | null>(initialCompletedAt)
  const [completionOpen, setCompletionOpen] = useState(false)
  const [completionNotes, setCompletionNotes] = useState('')
  const [completing,     setCompleting]     = useState(false)

  async function handleComplete() {
    if (!completionNotes.trim()) return
    setCompleting(true)
    const supabase = createClient()
    const now = new Date().toISOString()
    const { error } = await supabase
      .from('quote_requests')
      .update({
        status: 'completed',
        completion_notes: completionNotes.trim(),
        completed_at: now,
      })
      .eq('id', solicitudId)

    if (!error) {
      setStatus('completed')
      setSubmittedNotes(completionNotes.trim())
      setCompletedAt(now)
      setCompletionOpen(false)
    } else {
      console.error('[handleComplete] error:', error)
      alert('Error al finalizar: ' + error.message)
    }
    setCompleting(false)
  }

  if (status === 'completed' && submittedNotes) {
    return (
      <div style={{
        background: '#fff',
        border: '1.5px solid #7A7A7830',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <CheckCircle style={{ width: 20, height: 20, color: '#3d4d40', flexShrink: 0 }} />
          <p style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 700, color: '#1E1E1E', margin: 0 }}>
            Trabajo finalizado
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <span style={{
              fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78',
              textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px',
            }}>
              Descripción del trabajo realizado
            </span>
            <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#1E1E1E', lineHeight: 1.7, margin: 0 }}>
              {submittedNotes}
            </p>
          </div>

          {completedAt && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock style={{ width: 14, height: 14, color: '#7A7A78' }} />
              <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>
                Finalizado el{' '}
                {new Date(completedAt).toLocaleDateString('es-SV', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (status !== 'accepted') return null

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid #D4963A40',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <CheckCircle style={{ width: 24, height: 24, color: '#D4963A', flexShrink: 0 }} />
        <div>
          <p style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 700, color: '#1E1E1E', margin: 0 }}>
            ¿Trabajo completado?
          </p>
          <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', margin: '4px 0 0' }}>
            Registra la finalización del trabajo para cerrar esta solicitud.
          </p>
        </div>
      </div>

      {!completionOpen ? (
        <button
          onClick={() => setCompletionOpen(true)}
          style={{
            background: '#1E1E1E', color: '#D4963A',
            fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
            padding: '12px 24px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <ClipboardCheck style={{ width: 16, height: 16 }} />
          Registrar trabajo finalizado
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{
              fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 700, color: '#7A7A78',
              textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px',
            }}>
              Descripción del trabajo realizado *
            </label>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Describe el trabajo realizado, materiales utilizados, observaciones finales..."
              rows={4}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '8px',
                border: '1px solid #C4581A30', background: '#F2F0ED',
                fontFamily: FONT_SANS, fontSize: '15px', color: '#1E1E1E',
                resize: 'vertical', lineHeight: 1.6, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{
            background: '#D4963A10', border: '1px solid #D4963A30', borderRadius: '8px',
            padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px',
          }}>
            <AlertCircle style={{ width: 16, height: 16, color: '#D4963A', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', lineHeight: 1.6, margin: 0 }}>
              Al marcar como finalizado, la solicitud quedará cerrada y el propietario podrá dejar una reseña del trabajo realizado.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleComplete}
              disabled={!completionNotes.trim() || completing}
              style={{
                flex: 1, background: '#1E1E1E', color: '#D4963A',
                fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                padding: '13px', borderRadius: '8px', border: 'none',
                cursor: !completionNotes.trim() || completing ? 'not-allowed' : 'pointer',
                opacity: !completionNotes.trim() || completing ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <CheckCircle style={{ width: 16, height: 16 }} />
              {completing ? 'Guardando...' : 'Confirmar finalización'}
            </button>
            <button
              onClick={() => { setCompletionOpen(false); setCompletionNotes('') }}
              disabled={completing}
              style={{
                background: 'transparent', color: '#7A7A78',
                fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 600,
                padding: '13px 20px', borderRadius: '8px',
                border: '1px solid #2C2C2C20', cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
