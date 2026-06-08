'use client'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

interface Props {
  status: 'review' | 'active' | 'suspended'
  userName?: string
}

const CONFIG = {
  review: {
    bg:        '#D4963A15',
    border:    '#D4963A50',
    icon:      '⏳',
    title:     'Cuenta en revisión',
    message:   'Su solicitud está siendo revisada por el equipo de ARTIFEX7. Le notificaremos cuando su cuenta sea activada.',
    textColor: '#B85C1A',
  },
  suspended: {
    bg:        '#C4581A10',
    border:    '#C4581A40',
    icon:      '🚫',
    title:     'Cuenta suspendida',
    message:   'Su cuenta está suspendida por incumplimiento a los términos y condiciones de ARTIFEX7. Para más información contáctenos en artifex7net@gmail.com',
    textColor: '#C4581A',
  },
}

export function AccountStatusBanner({ status }: Props) {
  if (status === 'active') return null

  const c = CONFIG[status]

  return (
    <div style={{
      background:    c.bg,
      border:        `1.5px solid ${c.border}`,
      borderRadius:  '10px',
      padding:       '16px 20px',
      marginBottom:  '24px',
      display:       'flex',
      alignItems:    'flex-start',
      gap:           '14px',
    }}>
      <span style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px' }}>
        {c.icon}
      </span>
      <div>
        <p style={{
          fontFamily: FONT_SANS,
          fontSize:   '15px',
          fontWeight: 700,
          color:      c.textColor,
          margin:     '0 0 4px',
        }}>
          {c.title}
        </p>
        <p style={{
          fontFamily: FONT_SANS,
          fontSize:   '14px',
          color:      '#7A7A78',
          lineHeight: 1.65,
          margin:     0,
        }}>
          {c.message}
        </p>
        {status === 'suspended' && (
          <a
            href="mailto:artifex7net@gmail.com"
            style={{
              display:        'inline-block',
              marginTop:      '8px',
              fontFamily:     FONT_SANS,
              fontSize:       '13px',
              fontWeight:     600,
              color:          '#C4581A',
              textDecoration: 'none',
            }}
          >
            Contactar soporte →
          </a>
        )}
      </div>
    </div>
  )
}
