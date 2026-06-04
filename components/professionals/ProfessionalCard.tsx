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
        backgroundColor: 'transparent',
        border: '0.5px solid #1C141015',
        outline: isFeatured ? '1.5px solid #D4A96A70' : 'none',
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* ── 1. Photo / Avatar section ────────────────────────────── */}
      <div
        style={{
          height: 120,
          backgroundColor: '#F5F0E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* Avatar 72px */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #F5F0E8',
            backgroundColor: '#B85C1A15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(28,20,16,0.12)',
          }}
        >
          {profile?.photo_url ? (
            <Image
              src={profile.photo_url}
              alt={profile.full_name ?? ''}
              width={72}
              height={72}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : (
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 600,
                fontSize: '24px',
                color: '#B85C1A',
                lineHeight: 1,
              }}
            >
              {getInitials(profile?.full_name ?? 'P')}
            </span>
          )}
        </div>

        {/* Featured badge — top-right of photo section */}
        {isFeatured && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#D4A96A',
              color: '#1C1410',
              fontSize: '10px',
              fontWeight: 700,
              fontFamily: FONT_SANS,
              padding: '3px 10px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Star style={{ width: 10, height: 10, fill: '#1C1410', color: '#1C1410' }} />
            Destacado
          </div>
        )}
      </div>

      {/* ── 2. Body ──────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px 18px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Name */}
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 600,
            fontSize: '20px',
            color: '#1C1410',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.25,
          }}
        >
          {profile?.full_name}
        </p>

        {/* Category */}
        {primaryCategory && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <CategoryIcon style={{ width: 13, height: 13, color: '#B85C1A', flexShrink: 0 }} />
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: '15px',
                fontWeight: 500,
                color: '#B85C1A',
              }}
            >
              {primaryCategory.name}
            </span>
          </div>
        )}

        {/* Stars + count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              style={{
                width: 15,
                height: 15,
                fill:  i < Math.round(avgRating) ? '#D4A96A' : '#D4A96A25',
                color: i < Math.round(avgRating) ? '#D4A96A' : '#D4A96A25',
              }}
            />
          ))}
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: '12px',
              color: '#1C141060',
              marginLeft: 4,
            }}
          >
            ({totalReviews})
          </span>
        </div>

        {/* Separator */}
        <div style={{ borderTop: '0.5px solid #1C141010', margin: '4px 0' }} />

        {/* Description — flex:1 keeps uniform height across cards */}
        <div style={{ flex: 1 }}>
          {descriptionText ? (
            <p
              className="ax7-desc-clamp"
              style={{
                fontFamily: FONT_SANS,
                fontSize: '15px',
                fontWeight: 400,
                color: 'rgba(28,20,16,0.65)',
                lineHeight: 1.65,
                margin: 0,
                textAlign: 'center',
              }}
            >
              {descriptionText}
            </p>
          ) : (
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: '15px',
                color: 'rgba(28,20,16,0.28)',
                lineHeight: 1.65,
                margin: 0,
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              Perfil en construcción
            </p>
          )}
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 5 }}>
          {profile?.verified && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                backgroundColor: '#6B7B6E15',
                color: '#6B7B6E',
                fontSize: '12px',
                fontFamily: FONT_SANS,
                fontWeight: 600,
                borderRadius: '20px',
                padding: '3px 9px',
              }}
            >
              <ShieldCheck style={{ width: 11, height: 11 }} />
              Verificado
            </span>
          )}
          {coverageText && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                backgroundColor: '#1C141010',
                color: '#6B7B6E',
                fontSize: '12px',
                fontFamily: FONT_SANS,
                fontWeight: 600,
                borderRadius: '20px',
                padding: '3px 9px',
              }}
            >
              <MapPin style={{ width: 11, height: 11 }} />
              {coverageText}
            </span>
          )}
        </div>
      </div>

      {/* ── 3. CTA footer ────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '0 16px 18px', flexShrink: 0 }}>
        <Link
          href={`/${countryPrefix}/profesional/${professional.id}`}
          className="ax7-procard-btn"
          style={{
            display: 'block',
            textAlign: 'center',
            backgroundColor: '#1C1410',
            color: '#D4A96A',
            fontFamily: FONT_SANS,
            fontWeight: 700,
            fontSize: '16px',
            letterSpacing: '0.02em',
            borderRadius: '8px',
            padding: '15px 24px',
            textDecoration: 'none',
            transition: 'background-color 150ms',
          }}
        >
          Ver Perfil Completo
        </Link>
      </div>

      <style>{`
        .ax7-desc-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ax7-procard-btn:hover {
          background-color: #2a1f18 !important;
        }
      `}</style>
    </div>
  )
}
