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

  const MAX_CATEGORIAS = 3

  const principales = allCategories.filter((c) => !c.parent_id)
  const subcats      = allCategories.filter((c) => !!c.parent_id)

  function toggleCategoria(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_CATEGORIAS) {
        setError(`Máximo ${MAX_CATEGORIAS} categorías permitidas`)
        return prev
      }
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

  function CategoryButton({
    cat,
    size = 'md',
  }: {
    cat: Category
    size?: 'md' | 'sm'
  }) {
    const isSelected = selected.includes(cat.id)
    const isDisabled = !isSelected && selected.length >= MAX_CATEGORIAS
    const sm         = size === 'sm'

    return (
      <button
        key={cat.id}
        type="button"
        onClick={() => !isDisabled && toggleCategoria(cat.id)}
        style={{
          display:     'inline-flex',
          alignItems:  'center',
          gap:         '6px',
          padding:     sm ? '7px 12px' : '8px 14px',
          borderRadius: '8px',
          border:      `1.5px solid ${isSelected ? '#C4581A' : sm ? '#2C2C2C15' : '#2C2C2C20'}`,
          background:  isSelected ? '#C4581A12' : sm ? '#F2F0ED' : '#fff',
          color:       isSelected ? '#C4581A' : sm ? '#7A7A78' : '#2C2C2C',
          fontFamily:  FONT_SANS,
          fontSize:    sm ? '13px' : '14px',
          fontWeight:  isSelected ? 600 : 400,
          cursor:      isDisabled ? 'not-allowed' : 'pointer',
          opacity:     isDisabled ? 0.4 : 1,
          transition:  'all 150ms',
        }}
      >
        {isSelected && <Check style={{ width: sm ? 13 : 14, height: sm ? 13 : 14 }} />}
        {cat.name}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Contador / info */}
      <div style={{
        background:   '#F2F0ED',
        borderRadius: '8px',
        padding:      '12px 16px',
        display:      'flex',
        alignItems:   'center',
        gap:          '10px',
      }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', lineHeight: 1.6, flex: 1 }}>
          Selecciona hasta {MAX_CATEGORIAS} categorías en las que ofreces tus servicios.
          Puedes incluir categorías principales y subcategorías.
        </span>
        <span style={{
          fontFamily:  FONT_SANS,
          fontSize:    '13px',
          fontWeight:  700,
          color:       selected.length >= MAX_CATEGORIAS ? '#C4581A' : '#7A7A78',
          whiteSpace:  'nowrap',
          flexShrink:  0,
        }}>
          {selected.length}/{MAX_CATEGORIAS}
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
            {principales.map((cat) => <CategoryButton key={cat.id} cat={cat} size="md" />)}
          </div>
        </div>
      )}

      {/* Subcategorías */}
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
            {subcats.map((cat) => <CategoryButton key={cat.id} cat={cat} size="sm" />)}
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
