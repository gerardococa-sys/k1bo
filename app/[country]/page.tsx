export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CategoryGrid } from '@/components/categories/CategoryGrid'
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard'
import { HowItWorks } from '@/components/HowItWorks'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/Logo'
import { CtaProfesional } from '@/components/sections/CtaProfesional'

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
      <section
        style={{
          position: 'relative',
          backgroundColor: '#1E1E1E',
          backgroundImage: 'url(/images/concrete-texture.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className="py-20 px-4"
      >
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(30,30,30,0.88) 0%, rgba(30,30,30,0.75) 100%)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }} className="container mx-auto text-center max-w-3xl">

          {/* Eyebrow */}
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", system-ui, sans-serif)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#D4963A',
              marginBottom: '20px',
            }}
          >
            {countryName} · Directorio de Servicios
          </p>

          {/* H1 */}
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              fontWeight: 700,
              color: '#F2F0ED',
              lineHeight: 1.15,
              marginBottom: '12px',
            }}
          >
            Encuentra al profesional<br />
            de la construcción ideal<br />
            para tu hogar, oficina o negocio
          </h1>

          {/* Italic slogan */}
          <p
            style={{
              fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
              fontSize: '26px',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#D4963A',
              marginBottom: '20px',
            }}
          >
            La red de los maestros de la construcción.
          </p>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", system-ui, sans-serif)',
              fontSize: '16px',
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
      <section id="categorias" className="py-16" style={{ backgroundColor: '#F2F0ED' }}>
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
        <section id="profesionales-destacados" className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="container mx-auto px-4">
            <h2
              style={{
                fontFamily: 'var(--font-serif,"Playfair Display",Georgia,serif)',
                fontSize: '46px',
                fontWeight: 700,
                color: '#2C2C2C',
                marginBottom: '8px',
              }}
            >
              Profesionales Destacados
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans,"DM Sans",system-ui,sans-serif)',
                fontSize: '20px',
                color: '#7A7A78',
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
                fontSize: '46px',
                fontWeight: 700,
                color: '#2C2C2C',
                marginBottom: '8px',
              }}
            >
              Testimonios de Propietarios
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans,"DM Sans",system-ui,sans-serif)',
                fontSize: '20px',
                color: '#7A7A78',
                marginBottom: '32px',
              }}
            >
              Lo que dicen nuestros propietarios
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
      <CtaProfesional countryName={countryName} />
    </div>
  )
}
