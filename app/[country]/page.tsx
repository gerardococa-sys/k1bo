import Link from 'next/link'
import Image from 'next/image'
import { Search, CheckCircle, Star, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CategoryGrid } from '@/components/categories/CategoryGrid'
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function CountryHomePage({ params }: { params: { country: string } }) {
  const supabase = createClient()

  // Fetch categories with subcategories
  const { data: categories } = await supabase
    .from('categories')
    .select('*, subcategories:categories!parent_id(*)')
    .is('parent_id', null)
    .eq('active', true)
    .order('order_index')

  // Fetch country
  const { data: country } = await supabase
    .from('countries')
    .select('id, name, flag_emoji')
    .eq('url_prefix', params.country)
    .single()

  // Fetch featured professionals
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

  // Fetch recent reviews with high rating
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
            Cielos falsos, pintura, fontanería, electricidad y más. Compara perfiles,
            lee reseñas y contacta directamente.
          </p>

          {/* Search */}
          <div className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 bg-white text-foreground"
                placeholder="¿Qué servicio necesitas?"
              />
            </div>
            <Button className="bg-white text-[#1B3A6B] hover:bg-white/90 font-semibold">
              Buscar
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex justify-center gap-6 mt-8 text-sm text-white/80">
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Verificados</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4" /> Reseñas reales</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Contacto directo</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-2">Categorías de servicios</h2>
        <p className="text-muted-foreground mb-8">Encuentra el profesional para cada necesidad</p>
        <CategoryGrid categories={categories ?? []} countryPrefix={params.country} />
      </section>

      {/* Featured professionals */}
      {featuredPros && featuredPros.length > 0 && (
        <section className="bg-muted/50 py-16">
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

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">¿Cómo funciona K1BO?</h2>
        <p className="text-center text-muted-foreground mb-12">Simple y rápido</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { n: 1, title: 'Busca', desc: 'Elige la categoría del servicio que necesitas' },
            { n: 2, title: 'Selecciona', desc: 'Elige el tipo de trabajo específico' },
            { n: 3, title: 'Compara', desc: 'Revisa perfiles, fotos y reseñas' },
            { n: 4, title: 'Cotiza', desc: 'Solicita cotización (registro gratuito)' },
            { n: 5, title: 'Decide', desc: 'Acepta o rechaza la propuesta' },
          ].map((s) => (
            <div key={s.n} className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {s.n}
              </div>
              <p className="font-semibold mb-1">{s.title}</p>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Testimonios de Clientes</h2>
            <p className="text-muted-foreground mb-8">Lo que dicen nuestros clientes</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-lg bg-background border p-5">
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

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">¿Eres profesional?</h2>
        <p className="text-muted-foreground mb-6">
          Únete a K1BO y llega a más clientes en {countryName}.
        </p>
        <Button size="lg" asChild>
          <Link href="/registro/profesional">Registra tu negocio gratis</Link>
        </Button>
      </section>
    </div>
  )
}
