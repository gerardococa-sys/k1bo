export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ClientAvatar } from '@/components/ui/ClientAvatar'
import { Pagination } from '@/components/ui/Pagination'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const PAGE_SIZE = 20

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  registered: { bg: '#7A7A7815', color: '#7A7A78', label: 'Registrado'  },
  review:     { bg: '#D4963A20', color: '#C4581A', label: 'En revisión' },
  active:     { bg: '#7A7A7820', color: '#3d4d40', label: 'Activo'      },
  suspended:  { bg: '#C4581A15', color: '#C4581A', label: 'Suspendido'  },
}

const ESTADO_TABS = [
  { label: 'Todos los estados', value: ''           },
  { label: 'En revisión',       value: 'review'     },
  { label: 'Activos',           value: 'active'     },
  { label: 'Suspendidos',       value: 'suspended'  },
]

function formatDMY(ts: string | null) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function buildBasePath(estado: string) {
  const p = new URLSearchParams()
  if (estado) p.set('estado', estado)
  const qs = p.toString()
  return `/admin/propietarios${qs ? `?${qs}` : ''}`
}

export default async function AdminPropietariosPage({
  searchParams,
}: {
  searchParams: { estado?: string; page?: string; size?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (adminProfile?.role !== 'admin') redirect('/sv')

  const estado   = ['review', 'active', 'suspended'].includes(searchParams.estado ?? '') ? searchParams.estado! : ''
  const pageSize = [10, 20, 50].includes(Number(searchParams.size)) ? Number(searchParams.size) : PAGE_SIZE
  const page     = Math.max(1, parseInt(searchParams.page ?? '1', 10))
  const from     = (page - 1) * pageSize
  const to       = from + pageSize - 1

  let countQ = supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'client')
  if (estado) countQ = countQ.eq('account_status', estado)
  const { count: totalCount } = await countQ

  let dataQ = supabase
    .from('profiles')
    .select('id, full_name, photo_url, account_status, created_at')
    .eq('role', 'client')
    .order('created_at', { ascending: false })
    .range(from, to)
  if (estado) dataQ = dataQ.eq('account_status', estado)
  const { data: propietarios } = await dataQ

  const total      = totalCount ?? 0
  const totalPages = Math.ceil(total / pageSize)
  const basePath   = buildBasePath(estado)

  return (
    <div className="admin-page-content" style={{ maxWidth: '1100px', margin: '0 auto' }}>

      <Link
        href="/admin/dashboard"
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver al Dashboard
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#1E1E1E', margin: 0 }}>
          Propietarios
        </h1>
        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#7A7A78', background: '#1E1E1E10', padding: '4px 12px', borderRadius: '20px' }}>
          {total} registrados
        </span>
      </div>

      {/* Filtros de estado */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {ESTADO_TABS.map((tab) => {
          const active = estado === tab.value
          const s = STATUS_BADGE[tab.value]
          return (
            <Link
              key={tab.value}
              href={buildBasePath(tab.value)}
              style={{
                fontFamily: FONT_SANS, fontSize: '13px', fontWeight: active ? 600 : 400,
                padding: '6px 16px', borderRadius: '20px',
                border: `1px solid ${s ? s.color + '50' : '#2C2C2C20'}`,
                background: active ? (s?.bg ?? '#2C2C2C15') : 'transparent',
                color: active ? (s?.color ?? '#2C2C2C') : '#7A7A78',
                textDecoration: 'none',
              }}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {total === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#7A7A78', fontFamily: FONT_SANS, fontSize: '18px' }}>
          No hay propietarios con los filtros seleccionados
        </div>
      ) : (
        <>
          <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C15', overflow: 'hidden' }}>
            <div className="admin-table-scroll">
              <div style={{ minWidth: '600px' }}>

                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '10% 28% 18% 18% 26%', background: '#F2F0ED', padding: '12px 16px' }}>
                  {['Código', 'Nombre', 'Fecha registro', 'Estado', 'Acciones'].map((col) => (
                    <div key={col} style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7A78' }}>
                      {col}
                    </div>
                  ))}
                </div>

                {/* Filas */}
                {(propietarios ?? []).map((p) => {
                  const badge = STATUS_BADGE[p.account_status ?? 'review'] ?? STATUS_BADGE.review
                  return (
                    <div
                      key={p.id}
                      style={{ display: 'grid', gridTemplateColumns: '10% 28% 18% 18% 26%', padding: '14px 16px', borderBottom: '0.5px solid #2C2C2C08', alignItems: 'center', minHeight: '56px' }}
                    >
                      <div>
                        <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#7A7A78', background: '#1E1E1E08', padding: '3px 8px', borderRadius: '6px' }}>
                          {p.id.substring(0, 8).toUpperCase()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ClientAvatar name={p.full_name ?? '?'} photoUrl={p.photo_url} size={32} />
                        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500, color: '#1E1E1E' }}>
                          {p.full_name ?? '—'}
                        </span>
                      </div>

                      <div style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#1E1E1E' }}>
                        {formatDMY(p.created_at)}
                      </div>

                      <div>
                        <span style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: badge.bg, color: badge.color, padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                          {badge.label}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Link
                          href={`/admin/propietarios/${p.id}`}
                          style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#C4581A', border: '1px solid #C4581A40', borderRadius: '6px', padding: '5px 10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/admin/propietarios/${p.id}/solicitudes`}
                          style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, color: '#7A7A78', border: '1px solid #7A7A7840', borderRadius: '6px', padding: '5px 10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          Solicitudes
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            basePath={basePath}
          />
        </>
      )}
    </div>
  )
}
