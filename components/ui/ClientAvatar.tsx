'use client'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'

interface ClientAvatarProps {
  name:     string
  photoUrl?: string | null
  size?:    number
}

export function ClientAvatar({ name, photoUrl, size = 48 }: ClientAvatarProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  if (!photoUrl) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: '#C4581A15', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{
          fontFamily: FONT_SERIF,
          fontSize: Math.round(size * 0.35) + 'px',
          fontWeight: 700, color: '#C4581A',
        }}>
          {initials}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      overflow: 'hidden', flexShrink: 0,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt={name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => {
          const t = e.target as HTMLImageElement
          t.style.display = 'none'
          const p = t.parentElement
          if (p) {
            p.style.background = '#C4581A15'
            p.style.display = 'flex'
            p.style.alignItems = 'center'
            p.style.justifyContent = 'center'
            p.innerHTML = `<span style="font-family:DM Sans,sans-serif;font-size:${Math.round(size * 0.3)}px;font-weight:700;color:#C4581A">${initials}</span>`
          }
        }}
      />
    </div>
  )
}
