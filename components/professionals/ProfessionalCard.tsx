import Link from 'next/link'
import Image from 'next/image'
import {
  Star, MapPin, ShieldCheck,
  Wrench, Zap, Droplets, Paintbrush, Hammer,
  Leaf, Sparkles, Wind, Flame, HardHat, Sofa, Ruler,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { Professional } from '@/types'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  electricidad:          Zap,
  electrico:             Zap,
  fontaneria:            Droplets,
  plomeria:              Droplets,
  pintura:               Paintbrush,
  carpinteria:           Hammer,
  albanileria:           HardHat,
  construccion:          HardHat,
  jardineria:            Leaf,
  limpieza:              Sparkles,
  'aire-acondicionado':  Wind,
  soldadura:             Flame,
  muebles:               Sofa,
  diseno:                Ruler,
}

function getCategoryIcon(name?: string | null): React.ElementType {
  if (!name) return Wrench
  const key = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
  return CATEGORY_ICONS[key] ?? Wrench
}

interface ProfessionalCardProps {
  professional: Professional
  countryPrefix: string
}

export function ProfessionalCard({ professional, countryPrefix }: ProfessionalCardProps) {
  const profile         = professional.profile
  const avgRating       = professional.avg_rating ?? 0
  const totalReviews    = professional.total_reviews ?? 0
  const primaryCategory = professional.categories?.[0]?.category
  const CategoryIcon    = getCategoryIcon(primaryCategory?.name)
  const isFeatured      = professional.featured

  const descriptionText = professional.short_description || professional.bio || null

  const coverageText = professional.covers_entire_country
    ? `Todo ${profile?.country?.name ?? 'el país'}`
    : professional.coverage
        ?.map((c) => c.department?.name)
        .filter(Boolean)
        .slice(0, 2)
        .join(', ') ?? ''

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: isFeatured ? '0.5px solid #D4A96A80' : '0.5px solid #D4A96A50',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: isFeatured ? '0 0 0 1.5px #D4A96A30' : 'none',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Featured badge ──────────────────────────────────────── */}
      {isFeatured && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: '#1C1410',
            color: '#D4A96A',
            fontSize: '10px',
            fontWeight: 600,
            fontFamily: FONT_SANS,
            padding: '3px 10px',
            borderRadius: '0 12px 0 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            zIndex: 1,
          }}
        >
          <Star style={{ width: 10, height: 10, fill: '#D4A96A', color: '#D4A96A' }} />
          Destacado
        </div>
      )}

      {/* ── 1. Header ────────────────────────────────────────────── */}
      <div style={{ padding: '16px 16px 0', display: 'flex', gap: 12 }}>

        {/* Avatar */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            flexShrink: 0,
            overflow: 'hidden',
            backgroundColor: '#B85C1A20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {profile?.photo_url ? (
            <Image
              src={profile.photo_url}
              alt={profile.full_name ?? ''}
              width={52}
              height={52}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : (
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 600,
                fontSize: '18px',
                color: '#B85C1A',
                lineHeight: 1,
              }}
            >
              {getInitials(profile?.full_name ?? 'P')}
            </span>
          )}
        </div>

        {/* Name / category / stars */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>

          {/* Name */}
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 600,
              fontSize: '16px',
              color: '#1C1410',
              margin: '0 0 2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              paddingRight: isFeatured ? 80 : 0,
            }}
          >
            {profile?.full_name}
          </p>

          {/* Category */}
          {primaryCategory && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <CategoryIcon style={{ width: 11, height: 11, color: '#B85C1A', flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#B85C1A',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {primaryCategory.name}
              </span>
            </div>
          )}

          {/* Stars + count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                style={{
                  width: 11,
                  height: 11,
                  fill:  i < Math.round(avgRating) ? '#D4A96A' : '#D4A96A30',
                  color: i < Math.round(avgRating) ? '#D4A96A' : '#D4A96A30',
                }}
              />
            ))}
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: '11px',
                color: '#1C141060',
                marginLeft: 4,
              }}
            >
              ({totalReviews})
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Description ───────────────────────────────────────── */}
      <div
        style={{
          padding: '10px 16px 12px',
          borderBottom: '0.5px solid #D4A96A25',
          flex: 1,
        }}
      >
        {descriptionText ? (
          <p
            className="ax7-lineclamp"
            style={{
              fontFamily: FONT_SANS,
              fontSize: '13px',
              fontWeight: 400,
              color: 'rgba(28,20,16,0.67)',
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {descriptionText}
          </p>
        ) : (
          /* Placeholder keeps height uniform when no description exists */
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: '13px',
              color: 'rgba(28,20,16,0.30)',
              lineHeight: 1.55,
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            Perfil en construcción
          </p>
        )}
      </div>

      {/* ── 3. Badges ────────────────────────────────────────────── */}
      <div style={{ padding: '10px 16px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {profile?.verified && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              backgroundColor: '#6B7B6E15',
              color: '#6B7B6E',
              fontSize: '10px',
              fontFamily: FONT_SANS,
              fontWeight: 600,
              borderRadius: '20px',
              padding: '2px 8px',
            }}
          >
            <ShieldCheck style={{ width: 10, height: 10 }} />
            Verificado
          </span>
        )}
        {coverageText && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              backgroundColor: '#D4A96A15',
              color: '#B85C1A',
              fontSize: '10px',
              fontFamily: FONT_SANS,
              fontWeight: 600,
              borderRadius: '20px',
              padding: '2px 8px',
            }}
          >
            <MapPin style={{ width: 10, height: 10 }} />
            {coverageText}
          </span>
        )}
      </div>

      {/* ── 4. CTA button ────────────────────────────────────────── */}
      <div style={{ padding: '0 14px 14px' }}>
        <Link
          href={`/${countryPrefix}/profesional/${professional.id}`}
          style={{
            display: 'block',
            textAlign: 'center',
            backgroundColor: '#B85C1A',
            color: '#F5F0E8',
            fontFamily: FONT_SANS,
            fontWeight: 600,
            fontSize: '13px',
            borderRadius: '6px',
            padding: '9px',
            textDecoration: 'none',
          }}
        >
          Ver Perfil Completo
        </Link>
      </div>

      <style>{`
        .ax7-lineclamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
