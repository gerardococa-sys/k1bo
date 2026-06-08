interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'inherit'
  variant?: 'dark' | 'light'
}

const SIZES: Record<string, string> = { sm: '18px', md: '22px', lg: '28px' }
const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'

export function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const sevenColor = variant === 'light' ? '#D4963A' : '#C4581A'
  const fontSize   = size === 'inherit' ? undefined : SIZES[size]
  return (
    <span
      style={{
        fontFamily: FONT_SERIF,
        fontWeight: 700,
        lineHeight: 1,
        ...(fontSize ? { fontSize } : {}),
      }}
    >
      <span style={{ color: 'inherit' }}>Artifex</span>
      <span style={{ color: sevenColor }}>7</span>
    </span>
  )
}
