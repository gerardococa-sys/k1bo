export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, FileText } from 'lucide-react'
import { ClientAvatar } from '@/components/ui/ClientAvatar'
import { StatusActions } from '@/components/admin/StatusActions'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <span style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C' }}>
        {value ?? '—'}
      </span>
    </div>
  )
}

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C12', padding: '24px' }}>
      {title && (
        <p style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

export default async function AdminClienteDetailPage({
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
    .select('id, full_name, phone, account_status, created_at, photo_url, role')
    .eq('id', params.id)
    .eq('role', 'client')
    .single()

  if (!profile) notFound()

  const { count: solicitudesCount } = await supabase
    .from('quote_requests')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', params.id)

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>

      <Link
        href="/admin/clientes"
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver a Propietarios
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <ClientAvatar name={profile.full_name ?? ''} photoUrl={profile.photo_url} size={72} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: FONT_SERIF, fontSize: '34px', fontWeight: 700, color: '#2C2C2C', margin: '0 0 6px' }}>
            {profile.full_name ?? '—'}
          </h1>
          <span style={{ fontFamily: 'monospace', fontSize: '12px', background: '#1E1E1E08', padding: '2px 8px', borderRadius: '4px', color: '#7A7A78' }}>
            {profile.id.substring(0, 8).toUpperCase()}
          </span>
        </div>

        <Link
          href={`/admin/clientes/${params.id}/solicitudes`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #7A7A7840', borderRadius: '8px', padding: '8px 14px', color: '#7A7A78', textDecoration: 'none' }}
        >
          <FileText style={{ width: 15, height: 15 }} />
          <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600 }}>
            {solicitudesCount ?? 0} solicitudes
          </span>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Left */}
        <Card title="Información de cuenta">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Nombre completo" value={profile.full_name} />
            <Field label="Teléfono" value={profile.phone} />
            <Field
              label="Fecha de registro"
              value={profile.created_at
                ? new Date(profile.created_at).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : '—'
              }
            />
            <Field label="Solicitudes enviadas" value={solicitudesCount ?? 0} />
          </div>
        </Card>

        {/* Right */}
        <Card title="Estado de cuenta">
          <StatusActions userId={profile.id} currentStatus={profile.account_status ?? 'review'} />
        </Card>

      </div>
    </div>
  )
}
