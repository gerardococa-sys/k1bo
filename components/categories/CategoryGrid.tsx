import Link from 'next/link'
import {
  LayoutTemplate, Layers, AppWindow, Hammer, Paintbrush,
  Leaf, Droplets, Zap, Building2, Grid3x3, Wrench,
} from 'lucide-react'
import type { Category } from '@/types'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const NAME_ICON_MAP: Record<string, React.ElementType> = {
  // exact names
  'cielo falso y divisiones': LayoutTemplate,
  'cielos falsos y divisiones': LayoutTemplate,
  'cielos falsos': LayoutTemplate,
  'paneles wpc y pvc': Layers,
  'paneles wpc': Layers,
  'ventanas pvc': AppWindow,
  'albanileria': Hammer,
  'albañilería': Hammer,
  'pintura': Paintbrush,
  'jardineria': Leaf,
  'jardinería': Leaf,
  'fontaneria': Droplets,
  'fontanería': Droplets,
  'plomeria': Droplets,
  'electricidad': Zap,
  'electrico': Zap,
  'eléctrico': Zap,
  'estructura metalica': Building2,
  'estructura metálica': Building2,
  'pisos': Grid3x3,
}

function getIcon(name: string, iconSlug?: string | null): React.ElementType {
  const key = name.toLowerCase().trim()
  if (NAME_ICON_MAP[key]) return NAME_ICON_MAP[key]

  // fallback: partial match on first word
  const firstWord = key.split(/\s+/)[0]
  const partial = Object.keys(NAME_ICON_MAP).find((k) => k.startsWith(firstWord))
  if (partial) return NAME_ICON_MAP[partial]

  return Wrench
}

interface CategoryGridProps {
  categories:    Category[]
  countryPrefix: string
  title?:        string
  subtitle?:     string
}

export function CategoryGrid({ categories, countryPrefix, title, subtitle }: CategoryGridProps) {
  return (
    <div>
      {/* Optional section header */}
      {title && (
        <div style={{ marginBottom: '28px' }}>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 600,
              fontSize: '24px',
              color: '#1C1410',
              margin: '0 0 6px',
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: '14px',
                color: '#6B7B6E',
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '10px',
        }}
      >
        {categories.map((cat) => {
          const Icon = getIcon(cat.name, cat.icon)
          return (
            <Link
              key={cat.id}
              href={`/${countryPrefix}/categoria/${cat.slug}`}
              className="category-card"
              style={{
                backgroundColor: '#FFFFFF',
                border: '0.5px solid #D4A96A40',
                borderRadius: '12px',
                padding: '20px 12px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
                transition: 'border-color 200ms, background-color 200ms, transform 200ms',
              }}
            >
              {/* Icon wrapper */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: '#B85C1A15',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                }}
              >
                <Icon style={{ width: 22, height: 22, color: '#B85C1A' }} />
              </div>

              {/* Name */}
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#1C1410',
                  margin: 0,
                  lineHeight: '1.3',
                }}
              >
                {cat.name}
              </p>
            </Link>
          )
        })}
      </div>

      <style>{`
        .category-card:hover {
          border-color: #B85C1A60 !important;
          background-color: #B85C1A05 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
