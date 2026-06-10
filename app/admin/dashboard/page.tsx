export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { HardHat, Building2, Home } from 'lucide-react'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/sv')

  const [indRes, empRes, propRes] = await Promise.all([
    supabase
      .from('professionals')
      .select('id', { count: 'exact', head: true })
      .eq('account_type', 'independent'),
    supabase
      .from('professionals')
      .select('id', { count: 'exact', head: true })
      .eq('account_type', 'company'),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'client'),
  ])

  const cards = [
    {
      icon:  HardHat,
      count: indRes.count ?? 0,
      label: 'Profesionales Independientes',
      href:  '/admin/profesionales?tipo=independent',
    },
    {
      icon:  Building2,
      count: empRes.count ?? 0,
      label: 'Empresas registradas',
      href:  '/admin/profesionales?tipo=company',
    },
    {
      icon:  Home,
      count: propRes.count ?? 0,
      label: 'Propietarios registrados',
      href:  '/admin/clientes',
    },
  ]

  return (
    <>
      {/* Dark header */}
      <div style={{ background: '#1E1E1E', padding: '48px 32px 40px' }}>
        <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 700, color: '#D4963A', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Administración
        </p>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: '42px', fontWeight: 700, color: '#F2F0ED', margin: '0 0 6px' }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: FONT_SANS, fontSize: '18px', color: 'rgba(242,240,237,0.50)', margin: 0 }}>
          Bienvenido, {profile?.full_name}
        </p>

        {/* Counter cards inside header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '32px' }}>
          {cards.map(({ icon: Icon, count, label, href }) => (
            <div
              key={href}
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: '0.5px solid #2C2C2C12',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: '#C4581A12',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon style={{ width: 28, height: 28, color: '#C4581A' }} />
              </div>
              <p style={{ fontFamily: FONT_SERIF, fontSize: '48px', fontWeight: 700, color: '#1E1E1E', margin: 0, lineHeight: 1 }}>
                {count}
              </p>
              <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', margin: 0 }}>
                {label}
              </p>
              <Link
                href={href}
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#C4581A',
                  textDecoration: 'none',
                  marginTop: 'auto',
                }}
              >
                Ver listado →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Quotes by status */}
      <div style={{ padding: '32px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C12', padding: '24px' }}>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 600, color: '#1E1E1E', marginBottom: '20px' }}>
            Solicitudes por estado
          </h2>
          <QuotesByStatus />
        </div>
      </div>
    </>
  )
}

async function QuotesByStatus() {
  const supabase = await createClient()
  const statuses = ['pending', 'responded', 'accepted', 'rejected', 'completed']
  const labels: Record<string, string> = {
    pending:   'Pendientes',
    responded: 'Cotizadas',
    accepted:  'Aceptadas',
    rejected:  'Rechazadas',
    completed: 'Finalizadas',
  }
  const barColors: Record<string, string> = {
    pending:   '#D4963A',
    responded: '#7A7A78',
    accepted:  '#3d4d40',
    rejected:  '#C4581A',
    completed: '#2C2C2C',
  }

  const counts = await Promise.all(
    statuses.map((s) =>
      supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', s),
    ),
  )

  const total = counts.reduce((sum, { count }) => sum + (count ?? 0), 0)
  const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {statuses.map((s, i) => {
        const count = counts[i].count ?? 0
        const pct = total > 0 ? Math.round((count / total) * 100) : 0
        return (
          <div key={s}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>{labels[s]}</span>
              <span style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#2C2C2C' }}>{count}</span>
            </div>
            <div style={{ height: '6px', background: '#2C2C2C08', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: barColors[s], borderRadius: '99px', width: `${pct}%`, transition: 'width 0.4s' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
