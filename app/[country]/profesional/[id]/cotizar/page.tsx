import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QuoteRequestForm } from '@/components/quotes/QuoteRequestForm'

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
    .select('id, role, country_id')
    .eq('id', user.id)
    .single()

  if (!clientProfile || clientProfile.role !== 'client') {
    redirect(`/${params.country}/profesional/${params.id}`)
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Solicitar Cotización</h1>
      <QuoteRequestForm
        professional={pro as any}
        category={mainCategory}
        clientId={clientProfile.id}
        countryId={country?.id ?? ''}
      />
    </div>
  )
}
