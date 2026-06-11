export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, FileText, Phone, MapPin, Briefcase } from 'lucide-react'
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

export default async function AdminProfesionalDetailPage({
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
    .eq('role', 'professional')
    .single()

  if (!profile) notFound()

  const { data: pro } = await supabase
    .from('professionals')
    .select('account_type, bio, short_description, whatsapp, covers_entire_country, company_name, nrc, years_in_market')
    .eq('id', params.id)
    .maybeSingle()

  const { count: solicitudesCount } = await supabase
    .from('quote_requests')
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', params.id)

  const isCompany = pro?.account_type === 'company'

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '900px' }}>

      <Link
        href="/admin/profesionales"
        style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver a Profesionales
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <ClientAvatar name={profile.full_name ?? ''} photoUrl={profile.photo_url} size={72} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: FONT_SERIF, fontSize: '34px', fontWeight: 700, color: '#2C2C2C', margin: '0 0 6px' }}>
            {profile.full_name ?? '—'}
          </h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700,
              background: isCompany ? '#1E1E1E15' : '#C4581A15',
              color:      isCompany ? '#1E1E1E'   : '#C4581A',
              padding: '3px 10px', borderRadius: '20px',
            }}>
              {isCompany ? 'Empresa' : 'Independiente'}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', background: '#1E1E1E08', padding: '2px 8px', borderRadius: '4px', color: '#7A7A78' }}>
              {profile.id.substring(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        <Link
          href={`/admin/profesionales/${params.id}/solicitudes`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #7A7A7840', borderRadius: '8px', padding: '8px 14px', color: '#7A7A78', textDecoration: 'none' }}
        >
          <FileText style={{ width: 15, height: 15 }} />
          <span style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600 }}>
            {solicitudesCount ?? 0} solicitudes
          </span>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <Card title="Información de cuenta">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Nombre completo" value={profile.full_name} />
              <Field label="Teléfono" value={profile.phone} />
              <Field label="WhatsApp" value={pro?.whatsapp} />
              <Field label="Fecha de registro" value={profile.created_at ? new Date(profile.created_at).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'} />
            </div>
          </Card>

          {isCompany && (
            <Card title="Datos de empresa">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Nombre empresa" value={pro?.company_name} />
                <Field label="NRC" value={pro?.nrc} />
                <Field label="Años en el mercado" value={pro?.years_in_market} />
              </div>
            </Card>
          )}

          {pro?.bio && (
            <Card title="Biografía">
              <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C', lineHeight: 1.7, margin: 0 }}>
                {pro.bio}
              </p>
            </Card>
          )}

          {pro?.short_description && (
            <Card title="Descripción corta">
              <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C', lineHeight: 1.7, margin: 0 }}>
                {pro.short_description}
              </p>
            </Card>
          )}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card title="Estado de cuenta">
            <StatusActions userId={profile.id} currentStatus={profile.account_status ?? 'registered'} />
          </Card>

          <Card title="Cobertura">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: 16, height: 16, color: '#C4581A', flexShrink: 0 }} />
              <span style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#2C2C2C' }}>
                {pro?.covers_entire_country ? 'Todo el país' : 'Distritos seleccionados'}
              </span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
