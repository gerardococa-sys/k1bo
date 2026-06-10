'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check } from 'lucide-react'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

interface Category {
  id:        string
  name:      string
  parent_id: string | null
}

interface Props {
  professionalId:  string
  initialSelected: string[]
  allCategories:   Category[]
}

export function CategoriasPicker({ professionalId, initialSelected, allCategories }: Props) {
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  const MAX_PRINCIPALES = 3

  const principales = allCategories.filter((c) => c.parent_id === null)
  const subcats      = allCategories.filter((c) => c.parent_id !== null)

  // Cuenta solo las categorías principales seleccionadas
  const selectedMainCount = selected.filter(
    (id) => allCategories.find((c) => c.id === id)?.parent_id === null,
  ).length

  function toggleCategoria(id: string) {
    setSelected((prev) => {
      // Deseleccionar
      if (prev.includes(id)) {
        setError('')
        return prev.filter((x) => x !== id)
      }

      // Es categoría principal? Verificar límite
      const isMain = allCategories.find((c) => c.id === id)?.parent_id === null
      if (isMain) {
        const mainCount = prev.filter(
          (sid) => allCategories.find((c) => c.id === sid)?.parent_id === null,
        ).length
        if (mainCount >= MAX_PRINCIPALES) {
          setError(`Máximo ${MAX_PRINCIPALES} categorías principales`)
          return prev
        }
      }

      // Subcategoría: sin límite — siempre se agrega
      setError('')
      return [...prev, id]
    })
    setSuccess(false)
  }

  async function handleSave() {
    if (selected.length === 0) {
      setError('Selecciona al menos una categoría')
      return
    }
    setSaving(true)
    setError('')
    const supabase = createClient()

    await supabase
      .from('professional_categories')
      .delete()
      .eq('professional_id', professionalId)

    const { error: insertError } = await supabase
      .from('professional_categories')
      .insert(selected.map((categoryId) => ({
        professional_id: professionalId,
        category_id:     categoryId,
      })))

    if (insertError) {
      setError('Error al guardar: ' + insertError.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  const btnBase: React.CSSProperties = {
    display:    'inline-flex',
    alignItems: 'center',
    gap:        '6px',
    borderRadius: '8px',
    transition: 'all 150ms',
    border:     'none',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Info / contador */}
      <div style={{
        background:   '#F2F0ED',
        borderRadius: '8px',
        padding:      '12px 16px',
        display:      'flex',
        alignItems:   'center',
        gap:          '10px',
      }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', lineHeight: 1.6, flex: 1 }}>
          Selecciona hasta {MAX_PRINCIPALES} categorías principales.
          Las subcategorías son ilimitadas.
        </span>
        <span style={{
          fontFamily: FONT_SANS,
          fontSize:   '13px',
          fontWeight: 700,
          color:      selectedMainCount >= MAX_PRINCIPALES ? '#C4581A' : '#7A7A78',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {selectedMainCount}/{MAX_PRINCIPALES} principales
        </span>
      </div>

      {/* Categorías principales */}
      {principales.length > 0 && (
        <div>
          <p style={{
            fontFamily:    FONT_SANS,
            fontSize:      '12px',
            fontWeight:    700,
            color:         '#7A7A78',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin:        '0 0 12px',
          }}>
            Categorías principales
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {principales.map((cat) => {
              const isSelected = selected.includes(cat.id)
              const isDisabled = !isSelected && selectedMainCount >= MAX_PRINCIPALES
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategoria(cat.id)}
                  disabled={isDisabled}
                  style={{
                    ...btnBase,
                    padding:    '8px 14px',
                    border:     `1.5px solid ${isSelected ? '#C4581A' : '#2C2C2C20'}`,
                    background: isSelected ? '#C4581A12' : '#fff',
                    color:      isSelected ? '#C4581A' : '#2C2C2C',
                    fontFamily: FONT_SANS,
                    fontSize:   '14px',
                    fontWeight: isSelected ? 600 : 400,
                    cursor:     isDisabled ? 'not-allowed' : 'pointer',
                    opacity:    isDisabled ? 0.4 : 1,
                  }}
                >
                  {isSelected && <Check style={{ width: 14, height: 14 }} />}
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Subcategorías — sin límite */}
      {subcats.length > 0 && (
        <div>
          <p style={{
            fontFamily:    FONT_SANS,
            fontSize:      '12px',
            fontWeight:    700,
            color:         '#7A7A78',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin:        '0 0 12px',
          }}>
            Subcategorías
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {subcats.map((cat) => {
              const isSelected = selected.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategoria(cat.id)}
                  style={{
                    ...btnBase,
                    padding:    '7px 12px',
                    border:     `1.5px solid ${isSelected ? '#C4581A' : '#2C2C2C15'}`,
                    background: isSelected ? '#C4581A12' : '#F2F0ED',
                    color:      isSelected ? '#C4581A' : '#7A7A78',
                    fontFamily: FONT_SANS,
                    fontSize:   '13px',
                    fontWeight: isSelected ? 600 : 400,
                    cursor:     'pointer',
                    opacity:    1,
                  }}
                >
                  {isSelected && <Check style={{ width: 13, height: 13 }} />}
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
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
        disabled={saving || selected.length === 0}
        style={{
          background:   saving || selected.length === 0 ? '#1E1E1E50' : '#1E1E1E',
          color:        '#D4963A',
          fontFamily:   FONT_SANS,
          fontSize:     '16px',
          fontWeight:   700,
          padding:      '13px',
          borderRadius: '8px',
          border:       'none',
          cursor:       saving || selected.length === 0 ? 'not-allowed' : 'pointer',
          width:        '100%',
        }}
      >
        {saving ? 'Guardando...' : success ? '✓ Categorías guardadas' : 'Guardar categorías'}
      </button>

      {success && (
        <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#3d4d40', textAlign: 'center', margin: 0 }}>
          ✓ Tus categorías han sido actualizadas correctamente.
        </p>
      )}
    </div>
  )
}
