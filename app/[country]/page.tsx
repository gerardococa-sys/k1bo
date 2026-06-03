export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { CheckCircle, Star, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CategoryGrid } from '@/components/categories/CategoryGrid'
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard'
import { HowItWorks } from '@/components/HowItWorks'
import { Button } from '@/components/ui/button'

export default async function CountryPage({ params }: { params: { country: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return <div>Error de configuración</div>
  }

  const categoriesRes = await fetch(
    `${supabaseUrl}/rest/v1/categories?parent_id=is.null&order=order_index`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      cache: 'no-store',
    }
  )
  const categories = categoriesRes.ok ? await categoriesRes.json() : []

  const supabase = await createClient()

  const { data: country } = await supabase
    .from('countries')
    .select('id, name, flag_emoji')
    .eq('url_prefix', params.country)
    .single()

  const { data: featuredPros } = await supabase
    .from('professionals')
    .select(`
      *,
      profile:profiles!inner(*, country:countries(*)),
      categories:professional_categories(*, category:categories(*)),
      coverage:professional_coverage(*, department:departments(*)),
      services:professional_services(*)
    `)
    .eq('featured', true)
    .eq('profiles.country_id', country?.id ?? '')
    .limit(6)

  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      client:profiles!client_id(full_name),
      category:categories(name)
    `)
    .eq('country_id', country?.id ?? '')
    .gte('rating', 4)
    .order('created_at', { ascending: false })
    .limit(6)

  const countryName = country?.name ?? 'El Salvador'

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1B3A6B] text-white py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium mb-6">
            ✓ Profesionales verificados en {countryName}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Encuentra al profesional ideal para tu hogar, negocio u oficina
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Tabla roca, pintura, fontanería, electricidad y más. Compara perfiles,
            lee reseñas y contacta directamente.
          </p>

          {/* Trust badges */}
          <div className="flex justify-center gap-6 mt-8 text-sm text-white/80">
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Verificados</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4" /> Reseñas reales</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Contacto directo</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">Categorías de servicios</h2>
          <p className="text-muted-foreground mb-8">Encuentra el profesional para cada necesidad</p>
          <CategoryGrid categories={categories ?? []} countryPrefix={params.country} />
        </div>
      </section>

      {/* Featured professionals */}
      {featuredPros && featuredPros.length > 0 && (
        <section id="profesionales-destacados" className="bg-[#F9F9F9] py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Profesionales Destacados</h2>
            <p className="text-muted-foreground mb-8">Los mejores profesionales de {countryName}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPros.map((pro) => (
                <ProfessionalCard key={pro.id} professional={pro as any} countryPrefix={params.country} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Testimonios de Clientes</h2>
            <p className="text-muted-foreground mb-8">Lo que dicen nuestros clientes</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-lg bg-white border p-5">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                  {review.comment && <p className="text-sm mb-3 line-clamp-3">{review.comment}</p>}
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">{(review.client as any)?.full_name}</span>
                    {review.category && <span> · {(review.category as any)?.name}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <HowItWorks />

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Eres profesional?</h2>
          <p className="text-muted-foreground mb-6">
            Únete a K1BO y llega a más clientes en {countryName}.
          </p>
          <Button size="lg" asChild>
            <Link href="/registro/profesional">Registra tu negocio gratis</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
