'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Category, Department, Municipality } from '@/types'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

type OrderBy = 'featured' | 'rating' | 'recent'

type Filters = {
  nombre:       string
  categoria:    string
  subcategoria: string
  tipo:         string
  departamento: string
  municipio:    string
  distrito:     string
}

const DEFAULT_FILTERS: Filters = {
  nombre:       '',
  categoria:    '',
  subcategoria: '',
  tipo:         'all',
  departamento: '',
  municipio:    '',
  distrito:     '',
}

const TIPO_OPTIONS = [
  { value: 'all',         label: 'Todos' },
  { value: 'independent', label: 'Independiente' },
  { value: 'company',     label: 'Empresa' },
]

const selectStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid rgba(28,20,16,0.15)',
  background: '#FFFFFF',
  fontFamily: FONT_SANS,
  fontSize: '14px',
  color: '#1C1410',
  width: '100%',
  outline: 'none',
}

const filterLabelStyle: React.CSSProperties = {
  fontFamily: FONT_SANS,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#6B7B6E',
  display: 'block',
  marginBottom: '6px',
}

function mkClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── FiltersPanel (module-level to avoid re-mount on render) ─────────────────

interface FiltersPanelProps {
  filters:          Filters
  setFilter:        (key: keyof Filters, value: string) => void
  clearFilters:     () => void
  hasActiveFilters: boolean
  parentCategories: Category[]
  subcategories:    Category[]
  departments:      Department[]
  municipalities:   Municipality[]
}

function FiltersPanel({
  filters,
  setFilter,
  clearFilters,
  hasActiveFilters,
  parentCategories,
  subcategories,
  departments,
  municipalities,
}: FiltersPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#1C1410', margin: 0 }}>
          Filtros
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              fontFamily: FONT_SANS, fontSize: '13px', color: '#B85C1A',
              background: 'none', border: 'none', cursor: 'pointer',
              textDecoration: 'underline', padding: 0,
            }}
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Nombre */}
      <div>
        <label style={filterLabelStyle}>Nombre</label>
        <Input
          placeholder="Nombre del profesional..."
          value={filters.nombre}
          onChange={e => setFilter('nombre', e.target.value)}
          style={{ fontSize: '14px' }}
        />
      </div>

      {/* Categoría */}
      <div>
        <label style={filterLabelStyle}>Categoría</label>
        <select value={filters.categoria} onChange={e => setFilter('categoria', e.target.value)} style={selectStyle}>
          <option value="">Todas las categorías</option>
          {parentCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Subcategoría — solo visible cuando hay categoria seleccionada */}
      {subcategories.length > 0 && (
        <div>
          <label style={filterLabelStyle}>Subcategoría</label>
          <select value={filters.subcategoria} onChange={e => setFilter('subcategoria', e.target.value)} style={selectStyle}>
            <option value="">Todas</option>
            {subcategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* Tipo */}
      <div>
        <label style={filterLabelStyle}>Tipo</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {TIPO_OPTIONS.map(opt => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="tipo_filter"
                value={opt.value}
                checked={filters.tipo === opt.value}
                onChange={e => setFilter('tipo', e.target.value)}
                style={{ accentColor: '#B85C1A', width: 15, height: 15 }}
              />
              <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1C1410' }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departamento */}
      <div>
        <label style={filterLabelStyle}>Departamento</label>
        <select value={filters.departamento} onChange={e => setFilter('departamento', e.target.value)} style={selectStyle}>
          <option value="">Todos los departamentos</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Municipio — solo visible cuando hay departamento */}
      {municipalities.length > 0 && (
        <div>
          <label style={filterLabelStyle}>Municipio</label>
          <select value={filters.municipio} onChange={e => setFilter('municipio', e.target.value)} style={selectStyle}>
            <option value="">Todos los municipios</option>
            {municipalities.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      )}

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          style={{
            fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600,
            color: '#B85C1A', borderColor: 'rgba(184,92,26,0.35)',
          }}
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        height: 380,
        borderRadius: 14,
        background: 'linear-gradient(90deg, #F5F0E8 25%, #EAE5DC 50%, #F5F0E8 75%)',
        backgroundSize: '200% 100%',
        animation: 'ax7-shimmer 1.4s ease-in-out infinite',
      }}
    />
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProfesionalesPage({ params }: { params: { country: string } }) {
  const [profesionales,    setProfesionales]    = useState<any[]>([])
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [allCategories,    setAllCategories]    = useState<Category[]>([])
  const [departments,      setDepartments]      = useState<Department[]>([])
  const [municipalities,   setMunicipalities]   = useState<Municipality[]>([])
  const [filters,          setFiltersState]     = useState<Filters>(DEFAULT_FILTERS)
  const [orderBy,          setOrderBy]          = useState<OrderBy>('featured')
  const [loading,          setLoading]          = useState(true)
  const [mobileOpen,       setMobileOpen]       = useState(false)

  // Initial data load
  useEffect(() => {
    const load = async () => {
      const supabase = mkClient()

      const [{ data: country }, { data: cats }] = await Promise.all([
        supabase.from('countries').select('id').eq('url_prefix', params.country).single(),
        supabase.from('categories').select('id, name, slug, parent_id').eq('active', true).order('order_index'),
      ])

      const typedCats = (cats ?? []) as Category[]
      setAllCategories(typedCats)
      setParentCategories(typedCats.filter(c => c.parent_id === null))

      if (country?.id) {
        const { data: depts } = await supabase
          .from('departments').select('id, name').eq('country_id', country.id).order('name')
        setDepartments((depts ?? []) as Department[])
      }

      const { data: pros } = await supabase
        .from('professionals')
        .select(`
          id,
          short_description,
          bio,
          featured,
          covers_entire_country,
          account_type,
          created_at,
          profile:profiles(
            full_name,
            photo_url,
            verified,
            active,
            department:departments(id, name),
            municipality:municipalities(id, name)
          ),
          categories:professional_categories(
            category:categories(id, name, slug, parent_id)
          ),
          coverage:professional_coverage(
            department:departments(id, name)
          ),
          reviews:reviews(rating)
        `)
        .order('featured', { ascending: false })

      const adapted = (pros ?? [])
        .filter(p => (p.profile as any)?.active !== false && (p.profile as any)?.verified)
        .map(pro => ({
          ...pro,
          avg_rating: (pro.reviews as any[])?.length
            ? (pro.reviews as any[]).reduce((s: number, r: any) => s + r.rating, 0) / (pro.reviews as any[]).length
            : 0,
          total_reviews: (pro.reviews as any[])?.length ?? 0,
        }))

      setProfesionales(adapted)
      setLoading(false)
    }
    load()
  }, [params.country])

  // Load municipalities when department changes
  useEffect(() => {
    if (!filters.departamento) { setMunicipalities([]); return }
    mkClient()
      .from('municipalities').select('id, name').eq('department_id', filters.departamento).order('name')
      .then(({ data }) => setMunicipalities((data ?? []) as Municipality[]))
  }, [filters.departamento])

  // Subcategories of selected parent
  const subcategories = useMemo(
    () => filters.categoria ? allCategories.filter(c => c.parent_id === filters.categoria) : [],
    [filters.categoria, allCategories],
  )

  // Filtered + sorted results
  const filtrados = useMemo(() => {
    if (!profesionales) return []

    let result = profesionales.filter(pro => {
      // Acceso defensivo al perfil (puede ser objeto o array según FK setup en PostgREST)
      const profile = Array.isArray(pro.profile) ? pro.profile[0] : pro.profile
      if (!profile) return false

      // Filtro nombre
      if (filters.nombre && filters.nombre.trim() !== '') {
        const nombre = (profile.full_name ?? '').toLowerCase()
        if (!nombre.includes(filters.nombre.toLowerCase())) return false
      }

      // Filtro categoría / subcategoría
      if (filters.subcategoria && filters.subcategoria !== '') {
        const cats = (pro.categories as any[]) ?? []
        const tiene = cats.some(pc => {
          const cat = Array.isArray(pc.category) ? pc.category[0] : pc.category
          return cat?.id === filters.subcategoria
        })
        if (!tiene) return false
      } else if (filters.categoria && filters.categoria !== '') {
        const cats = (pro.categories as any[]) ?? []
        const tiene = cats.some(pc => {
          const cat = Array.isArray(pc.category) ? pc.category[0] : pc.category
          return cat?.id === filters.categoria || cat?.parent_id === filters.categoria
        })
        if (!tiene) return false
      }

      // Filtro tipo
      if (filters.tipo !== 'all' && pro.account_type !== filters.tipo) return false

      // Filtro departamento
      if (filters.departamento && filters.departamento !== '') {
        const dept = Array.isArray(profile.department) ? profile.department[0] : profile.department
        if (dept?.id !== filters.departamento) return false
      }

      // Filtro municipio
      if (filters.municipio && filters.municipio !== '') {
        const mun = Array.isArray(profile.municipality) ? profile.municipality[0] : profile.municipality
        if (mun?.id !== filters.municipio) return false
      }

      return true
    })

    if (orderBy === 'rating') {
      result = [...result].sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0))
    } else if (orderBy === 'recent') {
      result = [...result].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    }

    return result
  }, [profesionales, filters, orderBy])

  const setFilter = (key: keyof Filters, value: string) => {
    setFiltersState(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'categoria')    next.subcategoria = ''
      if (key === 'departamento') next.municipio    = ''
      return next
    })
  }

  const clearFilters = () => {
    setFiltersState(DEFAULT_FILTERS)
    setMobileOpen(false)
  }

  const hasActiveFilters = Object.entries(filters).some(([k, v]) =>
    k === 'tipo' ? v !== 'all' : v !== '',
  )

  const activeCount = Object.entries(filters).filter(([k, v]) =>
    k === 'tipo' ? v !== 'all' : v !== '',
  ).length

  const filterProps: FiltersPanelProps = {
    filters, setFilter, clearFilters, hasActiveFilters,
    parentCategories, subcategories, departments, municipalities,
  }

  const countLabel = loading
    ? 'Cargando profesionales...'
    : `${filtrados.length} profesional${filtrados.length !== 1 ? 'es' : ''} encontrado${filtrados.length !== 1 ? 's' : ''}`

  return (
    <div>
      {/* ── Header ── */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#1C1410',
          backgroundImage: 'url(/images/concrete-texture.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className="py-16 px-4"
      >
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(135deg, rgba(28,20,16,0.88) 0%, rgba(28,20,16,0.75) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }} className="container mx-auto text-center">
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 'clamp(36px, 5vw, 42px)',
              fontWeight: 700,
              color: '#F5F0E8',
              marginBottom: '8px',
            }}
          >
            Profesionales
          </h1>
          <p style={{ fontFamily: FONT_SANS, fontSize: '18px', color: '#6B7B6E' }}>
            Encuentra al maestro ideal para tu proyecto
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="container mx-auto px-4 py-8">

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-5">
          <button
            onClick={() => setMobileOpen(v => !v)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: '8px',
              border: '1px solid rgba(28,20,16,0.15)', backgroundColor: '#FFFFFF',
              fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600,
              color: '#1C1410', cursor: 'pointer',
            }}
          >
            <SlidersHorizontal style={{ width: 16, height: 16 }} />
            Filtros
            {activeCount > 0 && (
              <span
                style={{
                  backgroundColor: '#B85C1A', color: '#FFF', borderRadius: '50%',
                  width: 18, height: 18, fontSize: '11px', fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {activeCount}
              </span>
            )}
          </button>

          {mobileOpen && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(28,20,16,0.08)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '12px',
              }}
            >
              <FiltersPanel {...filterProps} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

          {/* Sidebar — desktop only */}
          <aside
            className="hidden lg:block"
            style={{
              width: '260px',
              flexShrink: 0,
              position: 'sticky',
              top: '88px',
              maxHeight: 'calc(100vh - 112px)',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(28,20,16,0.08)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <FiltersPanel {...filterProps} />
            </div>
          </aside>

          {/* Results column */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Results header bar */}
            <div
              style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '20px',
                flexWrap: 'wrap', gap: '12px',
              }}
            >
              <p style={{ fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 600, color: '#1C1410', margin: 0 }}>
                {countLabel}
              </p>
              <select
                value={orderBy}
                onChange={e => setOrderBy(e.target.value as OrderBy)}
                style={{ ...selectStyle, width: 'auto', padding: '8px 12px' }}
              >
                <option value="featured">Destacados primero</option>
                <option value="rating">Mejor calificados</option>
                <option value="recent">Más recientes</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 16px' }}>
                <p
                  style={{
                    fontFamily: FONT_SERIF, fontSize: '22px',
                    color: '#1C1410', marginBottom: '8px',
                  }}
                >
                  No encontramos profesionales con estos filtros
                </p>
                <p
                  style={{
                    fontFamily: FONT_SANS, fontSize: '16px',
                    color: '#6B7B6E', marginBottom: '24px',
                  }}
                >
                  Intenta con otros criterios de búsqueda
                </p>
                <Button
                  onClick={clearFilters}
                  style={{
                    backgroundColor: '#1C1410', color: '#D4A96A',
                    fontFamily: FONT_SANS, fontWeight: 700, borderRadius: '8px',
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {filtrados.map(pro => (
                  <ProfessionalCard
                    key={pro.id}
                    professional={pro as any}
                    countryPrefix={params.country}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ax7-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
