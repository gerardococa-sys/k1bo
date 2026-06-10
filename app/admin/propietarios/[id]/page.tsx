export const dynamic = 'force-dynamic'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ClientAvatar } from '@/components/ui/ClientAvatar'
import { StatusActions } from '@/components/admin/StatusActions'
import { FileText, MapPin, Phone, Calendar, Mail, Home } from 'lucide-react'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  review:    { bg: '#D4963A20', color: '#C4581A', label: 'En revisión' },
  active:    { bg: '#7A7A7820', color: '#3d4d40', label: 'Activo'      },
  suspended: { bg: '#C4581A15', color: '#C4581A', label: 'Suspendido'  },
}

function formatDMY(ts: string | null | undefined) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #2C2C2C12', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <div style={{ color: '#C4581A' }}>{icon}</div>
        <p style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <span style={{ fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 600, color: '#7A7A78', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C' }}>
        {value ?? '—'}
      </span>
    </div>
  )
}

export default async function AdminPropietarioPerfilPage({
  params,
}: {
  params: { id: string }
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

  const { data: propietario } = await supabase
    .from('profiles')
    .select(`
      *,
      department:departments(name),
      municipality:municipalities(name),
      district:districts(name)
    `)
    .eq('id', params.id)
    .eq('role', 'client')
    .single()

  if (!propietario) notFound()

  // Email via service role
  let email: string | null = null
  try {
    const adminSupabase = createAdminClient()
    const { data: authUserData } = await adminSupabase.auth.admin.getUserById(params.id)
    email = authUserData?.user?.email ?? null
  } catch {
    // Non-critical — continue without email
  }

  const { count: solicitudesCount } = await supabase
    .from('quote_requests')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', params.id)

  const badge = STATUS_BADGE[propietario.account_status ?? 'review'] ?? STATUS_BADGE.review

  const dept  = Array.isArray(propietario.department)    ? propietario.department[0]    : propietario.department
  const muni  = Array.isArray(propietario.municipality)  ? propietario.municipality[0]  : propietario.municipality
  const dist  = Array.isArray(propietario.district)      ? propietario.district[0]      : propietario.district

  const phoneDisplay = [propietario.phone_country_code, propietario.phone]
    .filter(Boolean).join(' ') || null

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px)' }}>

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <Link
          href="/admin/propietarios"
          style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          ← Volver a propietarios
        </Link>
        <Link
          href={`/admin/propietarios/${params.id}/solicitudes`}
          style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#7A7A78', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #7A7A7840', borderRadius: '8px', padding: '8px 14px' }}
        >
          <FileText style={{ width: 15, height: 15 }} />
          Ver solicitudes ({solicitudesCount ?? 0}) →
        </Link>
      </div>

      {/* Header perfil */}
      <div style={{ background: '#1E1E1E', borderRadius: '16px', padding: '32px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
        <ClientAvatar name={propietario.full_name ?? '?'} photoUrl={propietario.photo_url} size={80} />
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, color: '#D4963A', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>
            Propietario
          </p>
          <h1 style={{ fontFamily: FONT_SERIF, fontSize: '36px', fontWeight: 700, color: '#F2F0ED', margin: '0 0 12px' }}>
            {propietario.full_name ?? '—'}
          </h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: badge.bg, color: badge.color, padding: '4px 12px', borderRadius: '20px' }}>
              {badge.label}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', background: '#ffffff15', color: '#7A7A78', padding: '3px 10px', borderRadius: '6px' }}>
              {params.id.substring(0, 8).toUpperCase()}
            </span>
            <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: 'rgba(242,240,237,0.5)' }}>
              Registrado el {formatDMY(propietario.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>

        {/* Columna izquierda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <Card title="Información de contacto" icon={<Phone style={{ width: 15, height: 15 }} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Nombre completo" value={propietario.full_name} />
              <Field label="Email" value={email} />
              <Field label="Teléfono" value={phoneDisplay} />
              <Field
                label="Fecha de nacimiento"
                value={propietario.date_of_birth
                  ? new Date(propietario.date_of_birth + 'T00:00:00').toLocaleDateString('es-SV', { day: '2-digit', month: 'long', year: 'numeric' })
                  : null
                }
              />
            </div>
          </Card>

          <Card title="Dirección" icon={<Home style={{ width: 15, height: 15 }} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Dirección" value={propietario.address} />
              <Field label="Departamento" value={dept?.name} />
              <Field label="Municipio" value={muni?.name} />
              <Field label="Distrito" value={dist?.name} />
            </div>
          </Card>

        </div>

        {/* Columna derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <Card title="Estado de cuenta" icon={<MapPin style={{ width: 15, height: 15 }} />}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: badge.bg, color: badge.color, padding: '4px 12px', borderRadius: '20px' }}>
                {badge.label}
              </span>
            </div>
            <StatusActions userId={params.id} currentStatus={propietario.account_status ?? 'review'} />
          </Card>

          <Card title="Actividad" icon={<Calendar style={{ width: 15, height: 15 }} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Field label="Fecha de registro" value={formatDMY(propietario.created_at)} />
              <Field label="Solicitudes enviadas" value={solicitudesCount ?? 0} />
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
