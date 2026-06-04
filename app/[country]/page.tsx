export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Star } from 'lucide-react'
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
      <section style={{ backgroundColor: '#1C1410' }} className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">

          {/* Eyebrow */}
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", system-ui, sans-serif)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#D4A96A',
              marginBottom: '20px',
            }}
          >
            {countryName} · Directorio de Servicios
          </p>

          {/* H1 */}
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              color: '#F5F0E8',
              lineHeight: 1.15,
              marginBottom: '12px',
            }}
          >
            Encuentra al profesional que tu hogar merece
          </h1>

          {/* Italic slogan */}
          <p
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: '18px',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#D4A96A',
              marginBottom: '20px',
            }}
          >
            Maestros de la Instalación y el Acabado.
          </p>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", system-ui, sans-serif)',
              fontSize: '15px',
              color: 'rgba(245,240,232,0.55)',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Conecta con profesionales verificados en construcción, remodelación, electricidad y más.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <CategoryGrid
            categories={categories ?? []}
            countryPrefix={params.country}
            title="Categorías"
            subtitle="Encuentra el profesional para cada necesidad"
          />
        </div>
      </section>

      {/* Featured professionals */}
      {featuredPros && featuredPros.length > 0 && (
        <section id="profesionales-destacados" className="bg-[#F9F9F9] py-16">
          <div className="container mx-auto px-4">
            <h2
              style={{
                fontFamily: 'var(--font-serif,"Playfair Display",Georgia,serif)',
                fontSize: '36px',
                fontWeight: 700,
                color: '#1C1410',
                marginBottom: '8px',
              }}
            >
              Profesionales Destacados
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans,"DM Sans",system-ui,sans-serif)',
                fontSize: '17px',
                color: '#6B7B6E',
                marginBottom: '32px',
              }}
            >
              Los mejores profesionales de {countryName}
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
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
            <h2
              style={{
                fontFamily: 'var(--font-serif,"Playfair Display",Georgia,serif)',
                fontSize: '36px',
                fontWeight: 700,
                color: '#1C1410',
                marginBottom: '8px',
              }}
            >
              Testimonios de Clientes
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans,"DM Sans",system-ui,sans-serif)',
                fontSize: '17px',
                color: '#6B7B6E',
                marginBottom: '32px',
              }}
            >
              Lo que dicen nuestros clientes
            </p>
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
            Únete a Artifex7 y llega a más clientes en {countryName}.
          </p>
          <Button size="lg" asChild>
            <Link href="/registro/profesional">Registra tu negocio gratis</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
