import Link from 'next/link'

const FONT_SANS = 'DM Sans, sans-serif'

interface PaginationProps {
  currentPage: number
  totalPages:  number
  pageSize:    number
  basePath:    string
}

export function Pagination({ currentPage, totalPages, pageSize, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  function buildHref(page: number) {
    const connector = basePath.includes('?') ? '&' : '?'
    return `${basePath}${connector}page=${page}&size=${pageSize}`
  }

  function getPages(): (number | '...')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | '...')[] = []
    pages.push(1)
    if (currentPage > 3) pages.push('...')

    const start = Math.max(2, currentPage - 1)
    const end   = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)

    return pages
  }

  const pages   = getPages()
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '40px', height: '40px', padding: '0 12px',
    borderRadius: '8px', border: '1px solid #2C2C2C12',
    fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500,
    textDecoration: 'none', color: '#2C2C2C', background: '#fff',
    cursor: 'pointer', transition: 'all 150ms',
  }

  const btnActive: React.CSSProperties = {
    ...btnBase,
    background: '#1E1E1E', color: '#D4963A',
    fontWeight: 700, border: '1px solid #1E1E1E',
  }

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    opacity: 0.35, cursor: 'not-allowed', pointerEvents: 'none',
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '6px', marginTop: '24px', flexWrap: 'wrap',
    }}>
      {hasPrev ? (
        <Link href={buildHref(currentPage - 1)} style={btnBase}>‹ Anterior</Link>
      ) : (
        <span style={btnDisabled}>‹ Anterior</span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} style={{ ...btnBase, border: 'none', cursor: 'default', color: '#7A7A78' }}>
            ...
          </span>
        ) : (
          <Link key={p} href={buildHref(p as number)} style={p === currentPage ? btnActive : btnBase}>
            {p}
          </Link>
        )
      )}

      {hasNext ? (
        <Link href={buildHref(currentPage + 1)} style={btnBase}>Siguiente ›</Link>
      ) : (
        <span style={btnDisabled}>Siguiente ›</span>
      )}
    </div>
  )
}
