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
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#6B7B6E', margin: 0 }}>
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
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: '#B85C1A15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 11px',
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
                  lineHeight: 1.35,
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
        /* ── Grid responsive columns ──────────────────────────────── */
        .ax7-catgrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        /* sm (640px): 3 cols — item 10 alone in row 4, center it */
        @media (min-width: 640px) {
          .ax7-catgrid { grid-template-columns: repeat(3, 1fr); }
          .ax7-catgrid .ax7-catcard:nth-child(10) { grid-column-start: 2; }
        }

        /* md (768px): 4 cols — items 9-10 in row 3, center them */
        @media (min-width: 768px) {
          .ax7-catgrid { grid-template-columns: repeat(4, 1fr); }
          .ax7-catgrid .ax7-catcard:nth-child(10) { grid-column-start: auto; } /* reset sm */
          .ax7-catgrid .ax7-catcard:nth-child(9)  { grid-column-start: 2; }
        }

        /* lg (1024px): 6 cols — items 7-10 in row 2, center them */
        @media (min-width: 1024px) {
          .ax7-catgrid { grid-template-columns: repeat(6, 1fr); }
          .ax7-catgrid .ax7-catcard:nth-child(9)  { grid-column-start: auto; } /* reset md */
          .ax7-catgrid .ax7-catcard:nth-child(7)  { grid-column-start: 2; }
        }

        /* ── Card base ────────────────────────────────────────────── */
        .ax7-catcard {
          background-color: #fff;
          border: 0.5px solid #D4A96A40;
          border-radius: 12px;
          padding: 20px 10px 16px;
          display: block;
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
