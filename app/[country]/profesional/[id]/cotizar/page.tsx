export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { QuoteRequestForm } from '@/components/quotes/QuoteRequestForm'
import { AccountStatusBanner } from '@/components/ui/AccountStatusBanner'

export default async function CotizarPage({
  params,
}: {
  params: { country: string; id: string }
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?redirect=/${params.country}/profesional/${params.id}/cotizar`)
  }

  const { data: clientProfile } = await supabase
    .from('profiles')
    .select('id, role, country_id, account_status')
    .eq('id', user.id)
    .single()

  if (clientProfile?.role === 'admin') {
    redirect(`/${params.country}`)
  }

  if (!clientProfile || clientProfile.role !== 'client') {
    redirect(`/${params.country}/profesional/${params.id}`)
  }

  if (clientProfile.account_status !== 'active') {
    return (
      <div style={{ maxWidth: '600px', margin: '64px auto', padding: '24px' }}>
        <AccountStatusBanner status={(clientProfile.account_status as any) ?? 'review'} />
        <Link
          href={`/${params.country}`}
          style={{ display: 'inline-block', marginTop: '8px', color: '#C4581A', textDecoration: 'none', fontSize: '15px' }}
        >
          ← Volver al inicio
        </Link>
      </div>
    )
  }

  const { data: pro } = await supabase
    .from('professionals')
    .select('*, profile:profiles(full_name, photo_url, verified), categories:professional_categories(*, category:categories(*))')
    .eq('id', params.id)
    .single()

  if (!pro) notFound()

  const { data: country } = await supabase
    .from('countries')
    .select('id')
    .eq('url_prefix', params.country)
    .single()

  const categories = (pro.categories as any[]) ?? []
  const mainCategory = categories[0]?.category

  if (!mainCategory) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg text-center">
        <p className="text-muted-foreground">Este profesional aún no tiene categorías configuradas.</p>
      </div>
    )
  }

  if (!country?.id) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg text-center">
        <p className="text-muted-foreground">Error de configuración. Intenta de nuevo.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Solicitar Cotización</h1>
      <QuoteRequestForm
        professional={pro as any}
        category={mainCategory}
        clientId={clientProfile.id}
        countryId={country.id}
      />
    </div>
  )
}
