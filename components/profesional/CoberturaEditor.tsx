'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, MapPin, Check } from 'lucide-react'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

interface CoverageItem {
  id?:               string
  department_id:     string
  department_name:   string
  municipality_id?:  string | null
  municipality_name?: string | null
  district_id?:      string | null
  district_name?:    string | null
}

interface Props {
  professionalId:       string
  initialCoverage:      CoverageItem[]
  initialEntireCountry: boolean
  departments:          { id: string; name: string }[]
}

const selectStyle: React.CSSProperties = {
  width:        '100%',
  padding:      '10px 12px',
  borderRadius: '8px',
  border:       '1px solid rgba(196,88,26,0.25)',
  background:   '#F2F0ED',
  fontFamily:   FONT_SANS,
  fontSize:     '15px',
  color:        '#1E1E1E',
  outline:      'none',
}

export function CoberturaEditor({
  professionalId,
  initialCoverage,
  initialEntireCountry,
  departments,
}: Props) {
  const [entireCountry, setEntireCountry] = useState(initialEntireCountry)
  const [coverage,      setCoverage]      = useState<CoverageItem[]>(initialCoverage)
  const [saving,        setSaving]        = useState(false)
  const [success,       setSuccess]       = useState(false)
  const [error,         setError]         = useState('')

  const [newDept, setNewDept] = useState('')
  const [newMuni, setNewMuni] = useState('')
  const [newDist, setNewDist] = useState('')
  const [munis,   setMunis]   = useState<{ id: string; name: string }[]>([])
  const [dists,   setDists]   = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (!newDept) {
      setMunis([]); setNewMuni(''); setDists([]); setNewDist('')
      return
    }
    const supabase = createClient()
    supabase
      .from('municipalities')
      .select('id, name')
      .eq('department_id', newDept)
      .order('name')
      .then(({ data }) => {
        setMunis(data ?? [])
        setNewMuni('')
        setDists([])
        setNewDist('')
      })
  }, [newDept])

  useEffect(() => {
    if (!newMuni) { setDists([]); setNewDist(''); return }
    const supabase = createClient()
    supabase
      .from('districts')
      .select('id, name')
      .eq('municipality_id', newMuni)
      .order('name')
      .then(({ data }) => {
        setDists(data ?? [])
        setNewDist('')
      })
  }, [newMuni])

  function handleAddCoverage() {
    if (!newDept) { setError('Selecciona un departamento'); return }

    const dept = departments.find((d) => d.id === newDept)
    const muni = munis.find((m) => m.id === newMuni)
    const dist = dists.find((d) => d.id === newDist)

    const exists = coverage.some(
      (c) =>
        c.department_id === newDept &&
        (c.municipality_id ?? null) === (newMuni || null) &&
        (c.district_id ?? null) === (newDist || null),
    )
    if (exists) { setError('Esta zona ya está en tu lista'); return }

    setCoverage((prev) => [
      ...prev,
      {
        department_id:     newDept,
        department_name:   dept?.name ?? '',
        municipality_id:   newMuni || null,
        municipality_name: muni?.name ?? null,
        district_id:       newDist || null,
        district_name:     dist?.name ?? null,
      },
    ])
    setNewDept(''); setNewMuni(''); setNewDist('')
    setMunis([]); setDists([])
    setError('')
  }

  function handleRemove(index: number) {
    setCoverage((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const supabase = createClient()

    await supabase
      .from('professionals')
      .update({ covers_entire_country: entireCountry })
      .eq('id', professionalId)

    await supabase
      .from('professional_coverage')
      .delete()
      .eq('professional_id', professionalId)

    if (!entireCountry && coverage.length > 0) {
      const { error: insertError } = await supabase
        .from('professional_coverage')
        .insert(
          coverage.map((c) => ({
            professional_id: professionalId,
            department_id:   c.department_id,
            municipality_id: c.municipality_id ?? null,
            district_id:     c.district_id ?? null,
          })),
        )
      if (insertError) {
        setError('Error al guardar: ' + insertError.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Toggle todo el país */}
      <div
        onClick={() => { setEntireCountry((v) => !v); setSuccess(false) }}
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '12px',
          padding:    '14px 16px',
          background: entireCountry ? '#C4581A12' : '#F2F0ED',
          border:     `1.5px solid ${entireCountry ? '#C4581A40' : '#2C2C2C15'}`,
          borderRadius: '8px',
          cursor:     'pointer',
        }}
      >
        <div style={{
          width:           20,
          height:          20,
          borderRadius:    '4px',
          border:          `2px solid ${entireCountry ? '#C4581A' : '#7A7A78'}`,
          background:      entireCountry ? '#C4581A' : 'transparent',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:      0,
          transition:      'all 150ms',
        }}>
          {entireCountry && (
            <Check style={{ width: 12, height: 12, color: '#F2F0ED', strokeWidth: 3 }} />
          )}
        </div>
        <div>
          <p style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#1E1E1E', margin: 0 }}>
            Cubro todo El Salvador
          </p>
          <p style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#7A7A78', margin: '2px 0 0' }}>
            Apareceré en búsquedas de cualquier zona del país
          </p>
        </div>
      </div>

      {/* Zonas específicas */}
      {!entireCountry && (
        <>
          {/* Lista actual */}
          {coverage.length > 0 && (
            <div>
              <p style={{
                fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700,
                color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em',
                margin: '0 0 10px',
              }}>
                Zonas configuradas
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {coverage.map((c, i) => (
                  <div key={i} style={{
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'space-between',
                    padding:         '10px 14px',
                    background:      '#fff',
                    border:          '1px solid #2C2C2C10',
                    borderRadius:    '8px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin style={{ width: 14, height: 14, color: '#C4581A', flexShrink: 0 }} />
                      <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1E1E1E' }}>
                        {c.department_name}
                        {c.municipality_name && ` → ${c.municipality_name}`}
                        {c.district_name && ` → ${c.district_name}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A7A78', padding: '4px', display: 'flex', flexShrink: 0 }}
                    >
                      <X style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agregar nueva zona */}
          <div style={{
            background:    '#F2F0ED',
            borderRadius:  '10px',
            padding:       '16px',
            display:       'flex',
            flexDirection: 'column',
            gap:           '12px',
          }}>
            <p style={{
              fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700,
              color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
            }}>
              Agregar zona de cobertura
            </p>

            <select value={newDept} onChange={(e) => setNewDept(e.target.value)} style={selectStyle}>
              <option value="">Selecciona departamento *</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {munis.length > 0 && (
              <select value={newMuni} onChange={(e) => setNewMuni(e.target.value)} style={selectStyle}>
                <option value="">Todo el departamento</option>
                {munis.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            )}

            {dists.length > 0 && (
              <select value={newDist} onChange={(e) => setNewDist(e.target.value)} style={selectStyle}>
                <option value="">Todo el municipio</option>
                {dists.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={handleAddCoverage}
              disabled={!newDept}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          '6px',
                background:   !newDept ? '#1E1E1E30' : '#1E1E1E',
                color:        '#D4963A',
                fontFamily:   FONT_SANS,
                fontSize:     '14px',
                fontWeight:   600,
                padding:      '10px 16px',
                borderRadius: '8px',
                border:       'none',
                cursor:       !newDept ? 'not-allowed' : 'pointer',
                alignSelf:    'flex-start',
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
              Agregar zona
            </button>
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#C4581A', margin: 0 }}>
          {error}
        </p>
      )}

      {/* Guardar */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        style={{
          background:   saving ? '#1E1E1E50' : '#1E1E1E',
          color:        '#D4963A',
          fontFamily:   FONT_SANS,
          fontSize:     '16px',
          fontWeight:   700,
          padding:      '13px',
          borderRadius: '8px',
          border:       'none',
          cursor:       saving ? 'not-allowed' : 'pointer',
          width:        '100%',
        }}
      >
        {saving ? 'Guardando...' : success ? '✓ Cobertura guardada' : 'Guardar cobertura'}
      </button>
    </div>
  )
}
