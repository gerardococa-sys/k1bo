export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Eye, FileText } from 'lucide-react'
import { ClientAvatar } from '@/components/ui/ClientAvatar'
import { StatusSelect } from '@/components/admin/StatusSelect'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

function formatDate(ts: string | null) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function AdminClientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: caller } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (caller?.role !== 'admin') redirect('/sv')

  const { data: rows } = await supabase
    .from('profiles')
    .select('id, full_name, phone, account_status, created_at, photo_url')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  const clients = (rows ?? []) as any[]

  return (
    <div style={{ padding: '32px' }}>

      <Link
        href="/admin/dashboard"
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver al Dashboard
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 700, color: '#2C2C2C', margin: 0 }}>
          Propietarios
        </h1>
        <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#7A7A78', background: '#2C2C2C10', padding: '4px 12px', borderRadius: '20px' }}>
          {clients.length} registros
        </span>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C12', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F2F0ED', borderBottom: '1px solid #2C2C2C10' }}>
              {['Código', 'Nombre', 'Teléfono', 'Fecha registro', 'Estado', 'Acciones'].map((h) => (
                <th key={h} style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '12px 16px', textAlign: 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((c: any) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #2C2C2C06' }}>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', background: '#1E1E1E08', padding: '2px 8px', borderRadius: '4px', color: '#7A7A78' }}>
                    {c.id.substring(0, 8).toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ClientAvatar name={c.full_name ?? ''} photoUrl={c.photo_url} size={32} />
                    <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C', fontWeight: 500 }}>
                      {c.full_name ?? '—'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>
                  {c.phone ?? '—'}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>
                  {formatDate(c.created_at)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusSelect userId={c.id} initialStatus={c.account_status ?? 'review'} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link
                      href={`/admin/clientes/${c.id}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #C4581A40', borderRadius: '6px', padding: '6px 10px', color: '#C4581A', textDecoration: 'none' }}
                    >
                      <Eye style={{ width: 14, height: 14 }} />
                      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600 }}>Ver</span>
                    </Link>
                    <Link
                      href={`/admin/clientes/${c.id}/solicitudes`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #7A7A7840', borderRadius: '6px', padding: '6px 10px', color: '#7A7A78', textDecoration: 'none' }}
                    >
                      <FileText style={{ width: 14, height: 14 }} />
                      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600 }}>Solicitudes</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', fontFamily: FONT_SANS, fontSize: '15px', color: '#7A7A78' }}>
                  No hay propietarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
