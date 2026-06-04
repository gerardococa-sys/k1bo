import Link from 'next/link'
import {
  LayoutTemplate, Layers, AppWindow, Hammer, Paintbrush,
  Leaf, Droplets, Zap, Building2, Grid3x3, Wrench,
} from 'lucide-react'
import type { Category } from '@/types'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const NAME_ICON_MAP: Record<string, React.ElementType> = {
  'cielo falso y divisiones':  LayoutTemplate,
  'cielos falsos y divisiones': LayoutTemplate,
  'cielos falsos':             LayoutTemplate,
  'paneles wpc y pvc':         Layers,
  'paneles wpc':               Layers,
  'ventanas pvc':              AppWindow,
  'albanileria':               Hammer,
  'albañilería':               Hammer,
  'pintura':                   Paintbrush,
  'jardineria':                Leaf,
  'jardinería':                Leaf,
  'fontaneria':                Droplets,
  'fontanería':                Droplets,
  'plomeria':                  Droplets,
  'electricidad':              Zap,
  'electrico':                 Zap,
  'eléctrico':                 Zap,
  'estructura metalica':       Building2,
  'estructura metálica':       Building2,
  'pisos':                     Grid3x3,
}

function getIcon(name: string): React.ElementType {
  const key = name.toLowerCase().trim()
  if (NAME_ICON_MAP[key]) return NAME_ICON_MAP[key]
  const firstWord = key.split(/\s+/)[0]
  const partial = Object.keys(NAME_ICON_MAP).find((k) => k.startsWith(firstWord))
  return partial ? NAME_ICON_MAP[partial] : Wrench
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
        <div style={{ marginBottom: '36px' }}>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 700,
              fontSize: '46px',
              color: '#1C1410',
              margin: '0 0 10px',
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontFamily: FONT_SANS, fontSize: '20px', fontWeight: 400, color: '#6B7B6E', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="ax7-catgrid">
        {categories.map((cat) => {
          const Icon = getIcon(cat.name)
          return (
            <Link
              key={cat.id}
              href={`/${countryPrefix}/categoria/${cat.slug}`}
              className="ax7-catcard"
              style={{ textDecoration: 'none' }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: '#B85C1A12',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon style={{ width: 26, height: 26, color: '#B85C1A' }} />
              </div>

              {/* Name */}
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#1C1410',
                  margin: 0,
                  lineHeight: 1.4,
                  textAlign: 'center',
                }}
              >
                {cat.name}
              </p>
            </Link>
          )
        })}
      </div>

      <style>{`
        /* ── Grid: 2-col mobile → 3-col tablet → 4-col desktop ───── */
        .ax7-catgrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        @media (min-width: 768px) {
          .ax7-catgrid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (min-width: 1024px) {
          .ax7-catgrid { grid-template-columns: repeat(4, 1fr); }
        }

        /* ── Card base ────────────────────────────────────────────── */
        .ax7-catcard {
          background-color: #ffffff;
          border: 0.5px solid #1C141012;
          border-radius: 14px;
          padding: 28px 16px 24px;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          transition: border-color 180ms, background-color 180ms, transform 180ms;
        }

        /* ── Hover ────────────────────────────────────────────────── */
        .ax7-catcard:hover {
          border-color: #B85C1A60;
          background-color: #B85C1A04;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
