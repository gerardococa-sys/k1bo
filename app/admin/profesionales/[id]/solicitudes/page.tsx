export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#D4963A20', color: '#C4581A', label: 'Pendiente'   },
  responded: { bg: '#2C2C2C12', color: '#2C2C2C', label: 'Cotizada'    },
  revision:  { bg: '#D4963A15', color: '#C4581A', label: 'En revisión' },
  accepted:  { bg: '#7A7A7820', color: '#3d4d40', label: 'Aceptada'    },
  rejected:  { bg: '#2C2C2C10', color: '#7A7A78', label: 'Rechazada'   },
  completed: { bg: '#2C2C2C12', color: '#2C2C2C', label: 'Finalizada'  },
}

function formatDate(ts: string | null) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function AdminProSolicitudesPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: caller } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (caller?.role !== 'admin') redirect('/sv')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', params.id)
    .single()
  if (!profile) notFound()

  const { data: solicitudes } = await supabase
    .from('quote_requests')
    .select(`
      id, status, created_at, description,
      category:categories!quote_requests_category_id_fkey(name),
      client:profiles!quote_requests_client_id_fkey(full_name)
    `)
    .eq('professional_id', params.id)
    .order('created_at', { ascending: false })

  const rows = (solicitudes ?? []) as any[]

  return (
    <div style={{ padding: '32px' }}>

      <Link
        href={`/admin/profesionales/${params.id}`}
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver al perfil
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '34px', fontWeight: 700, color: '#2C2C2C', margin: 0 }}>
          Solicitudes
        </h1>
        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', fontStyle: 'italic' }}>
          de {profile.full_name}
        </span>
        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#7A7A78', background: '#2C2C2C10', padding: '4px 12px', borderRadius: '20px' }}>
          {rows.length} registros
        </span>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C12', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F2F0ED', borderBottom: '1px solid #2C2C2C10' }}>
              {['Código', 'Propietario', 'Categoría', 'Descripción', 'Fecha', 'Estado'].map((h) => (
                <th key={h} style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '12px 16px', textAlign: 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => {
              const badge = STATUS_BADGE[r.status] ?? STATUS_BADGE.pending
              const client = Array.isArray(r.client) ? r.client[0] : r.client
              const category = Array.isArray(r.category) ? r.category[0] : r.category
              return (
                <tr key={r.id} style={{ borderBottom: '1px solid #2C2C2C06' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', background: '#1E1E1E08', padding: '2px 8px', borderRadius: '4px', color: '#7A7A78' }}>
                      {r.id.substring(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>
                    {client?.full_name ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>
                    {category?.name ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '240px' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.description}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', whiteSpace: 'nowrap' }}>
                    {formatDate(r.created_at)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, background: badge.bg, color: badge.color, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', fontFamily: FONT_SANS, fontSize: '15px', color: '#7A7A78' }}>
                  Este profesional no tiene solicitudes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
