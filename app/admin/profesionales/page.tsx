export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Eye, FileText } from 'lucide-react'
import { ClientAvatar } from '@/components/ui/ClientAvatar'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const PAGE_SIZE = 20

function formatDate(ts: string | null) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const TIPO_TABS = [
  { label: 'Todos',          value: ''            },
  { label: 'Independientes', value: 'independent' },
  { label: 'Empresas',       value: 'company'     },
]

const ESTADO_TABS = [
  { label: 'Todos los estados', value: ''          },
  { label: 'En revisión',       value: 'review'    },
  { label: 'Activos',           value: 'active'    },
  { label: 'Suspendidos',       value: 'suspended' },
]

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  review:    { bg: '#D4963A20', color: '#C4581A', label: 'En revisión' },
  active:    { bg: '#7A7A7820', color: '#3d4d40', label: 'Activo'      },
  suspended: { bg: '#C4581A15', color: '#C4581A', label: 'Suspendido'  },
}

function buildHref(tipo: string, estado: string, pagina?: number) {
  const p = new URLSearchParams()
  if (tipo)               p.set('tipo',   tipo)
  if (estado)             p.set('estado', estado)
  if (pagina && pagina > 1) p.set('pagina', String(pagina))
  const qs = p.toString()
  return `/admin/profesionales${qs ? `?${qs}` : ''}`
}

export default async function AdminProfesionalesPage({
  searchParams,
}: {
  searchParams: { tipo?: string; estado?: string; pagina?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tipo   = ['independent', 'company'].includes(searchParams.tipo   ?? '') ? searchParams.tipo!   : ''
  const estado = ['review', 'active', 'suspended'].includes(searchParams.estado ?? '') ? searchParams.estado! : ''
  const page   = Math.max(1, parseInt(searchParams.pagina ?? '1', 10))
  const from   = (page - 1) * PAGE_SIZE
  const to     = from + PAGE_SIZE - 1

  // Paso 1: IDs de profesionales filtrados por tipo
  let prosQuery = supabase.from('professionals').select('id, account_type').limit(10000)
  if (tipo) prosQuery = prosQuery.eq('account_type', tipo)
  const { data: profData } = await prosQuery

  const proIds  = (profData ?? []).map((p) => p.id)
  const typeMap = Object.fromEntries((profData ?? []).map((p) => [p.id, p.account_type]))

  let totalCount = 0
  let profileRows: any[] = []

  if (proIds.length > 0) {
    // Paso 2: count
    let countQ = supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .in('id', proIds)
      .eq('role', 'professional')
    if (estado) countQ = countQ.eq('account_status', estado)
    const { count } = await countQ
    totalCount = count ?? 0

    // Paso 3: datos paginados
    let dataQ = supabase
      .from('profiles')
      .select('id, full_name, account_status, created_at, photo_url')
      .in('id', proIds)
      .eq('role', 'professional')
      .order('created_at', { ascending: false })
      .range(from, to)
    if (estado) dataQ = dataQ.eq('account_status', estado)
    const { data } = await dataQ
    profileRows = data ?? []
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const pros = profileRows.map((p) => ({ ...p, account_type: typeMap[p.id] ?? 'independent' }))

  return (
    <div className="admin-page-content">

      <Link
        href="/admin/dashboard"
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver al Dashboard
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#2C2C2C', margin: 0 }}>
          Profesionales
        </h1>
        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#7A7A78', background: '#2C2C2C10', padding: '4px 12px', borderRadius: '20px' }}>
          {totalCount} registros
        </span>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {TIPO_TABS.map((tab) => {
            const active = tipo === tab.value
            return (
              <Link key={tab.value} href={buildHref(tab.value, estado)} style={{
                fontFamily: FONT_SANS, fontSize: '13px', fontWeight: active ? 600 : 400,
                padding: '6px 16px', borderRadius: '20px', border: '1px solid #D4963A40',
                background: active ? '#1E1E1E' : 'transparent',
                color: active ? '#D4963A' : '#7A7A78', textDecoration: 'none',
              }}>
                {tab.label}
              </Link>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {ESTADO_TABS.map((tab) => {
            const active = estado === tab.value
            const s = STATUS_STYLES[tab.value]
            return (
              <Link key={tab.value} href={buildHref(tipo, tab.value)} style={{
                fontFamily: FONT_SANS, fontSize: '13px', fontWeight: active ? 600 : 400,
                padding: '6px 16px', borderRadius: '20px',
                border: `1px solid ${s ? s.color + '50' : '#2C2C2C20'}`,
                background: active ? (s?.bg ?? '#2C2C2C15') : 'transparent',
                color: active ? (s?.color ?? '#2C2C2C') : '#7A7A78', textDecoration: 'none',
              }}>
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C12', overflow: 'hidden' }}>
        <div className="admin-table-scroll">
          <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F2F0ED', borderBottom: '1px solid #2C2C2C10' }}>
                {['Código', 'Nombre', 'Tipo', 'Fecha solicitud', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '12px 16px', textAlign: 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pros.map((p) => {
                const s = STATUS_STYLES[p.account_status ?? 'review'] ?? STATUS_STYLES.review
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #2C2C2C06' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', background: '#1E1E1E08', padding: '2px 8px', borderRadius: '4px', color: '#7A7A78' }}>
                        {p.id.substring(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ClientAvatar name={p.full_name ?? ''} photoUrl={p.photo_url} size={32} />
                        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C', fontWeight: 500 }}>{p.full_name ?? '—'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700,
                        background: p.account_type === 'company' ? '#1E1E1E15' : '#C4581A15',
                        color:      p.account_type === 'company' ? '#1E1E1E'   : '#C4581A',
                        padding: '3px 10px', borderRadius: '20px',
                      }}>
                        {p.account_type === 'company' ? 'Empresa' : 'Independiente'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>
                      {formatDate(p.created_at)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                        background: s.bg, color: s.color,
                        padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap',
                      }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link href={`/admin/profesionales/${p.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #C4581A40', borderRadius: '6px', padding: '6px 10px', color: '#C4581A', textDecoration: 'none' }}>
                          <Eye style={{ width: 14, height: 14 }} />
                          <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600 }}>Ver</span>
                        </Link>
                        <Link href={`/admin/profesionales/${p.id}/solicitudes`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #7A7A7840', borderRadius: '6px', padding: '6px 10px', color: '#7A7A78', textDecoration: 'none' }}>
                          <FileText style={{ width: 14, height: 14 }} />
                          <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600 }}>Solicitudes</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {pros.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', fontFamily: FONT_SANS, fontSize: '15px', color: '#7A7A78' }}>
                    No hay profesionales con los filtros seleccionados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} buildUrl={(n) => buildHref(tipo, estado, n)} />
    </div>
  )
}

function Pagination({ page, totalPages, buildUrl }: {
  page: number
  totalPages: number
  buildUrl: (p: number) => string
}) {
  if (totalPages <= 1) return null

  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '36px', height: '36px', padding: '0 10px',
    borderRadius: '8px', fontFamily: FONT_SANS, fontSize: '13px', textDecoration: 'none',
  }
  const btnStyle = (active: boolean, disabled = false): React.CSSProperties => ({
    ...base,
    border: `1px solid ${active ? '#1E1E1E' : disabled ? '#2C2C2C15' : '#2C2C2C20'}`,
    background: active ? '#1E1E1E' : 'transparent',
    color: active ? '#D4963A' : disabled ? '#2C2C2C30' : '#7A7A78',
    fontWeight: active ? 700 : 400,
    pointerEvents: disabled ? 'none' : 'auto',
  })

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '24px', flexWrap: 'wrap' }}>
      {page > 1
        ? <Link href={buildUrl(page - 1)} style={btnStyle(false)}><ChevronLeft style={{ width: 14, height: 14 }} /></Link>
        : <span style={btnStyle(false, true)}><ChevronLeft style={{ width: 14, height: 14 }} /></span>
      }

      {pages.map((n, i) =>
        n === '...'
          ? <span key={`e${i}`} style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', padding: '0 4px' }}>…</span>
          : <Link key={n} href={buildUrl(n as number)} style={btnStyle(n === page)}>{n}</Link>
      )}

      {page < totalPages
        ? <Link href={buildUrl(page + 1)} style={btnStyle(false)}><ChevronRight style={{ width: 14, height: 14 }} /></Link>
        : <span style={btnStyle(false, true)}><ChevronRight style={{ width: 14, height: 14 }} /></span>
      }

      <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', marginLeft: '8px' }}>
        Página {page} de {totalPages}
      </span>
    </div>
  )
}
