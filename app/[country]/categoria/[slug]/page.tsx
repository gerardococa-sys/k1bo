import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard'
import { CategoryGrid } from '@/components/categories/CategoryGrid'
import { Badge } from '@/components/ui/badge'

export default async function CategoryPage({
  params,
}: {
  params: { country: string; slug: string }
}) {
  const supabase = createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*, parent:categories!parent_id(*), subcategories:categories!parent_id(*)')
    .eq('slug', params.slug)
    .eq('active', true)
    .single()

  if (!category) notFound()

  const { data: country } = await supabase
    .from('countries')
    .select('id, name')
    .eq('url_prefix', params.country)
    .single()

  // Fetch professionals for this category (and parent if subcategory)
  const categoryIds = [category.id]
  if (category.parent_id) categoryIds.push(category.parent_id)

  const { data: professionals } = await supabase
    .from('professionals')
    .select(`
      *,
      profile:profiles!inner(*, country:countries(*)),
      categories:professional_categories!inner(*, category:categories(*)),
      coverage:professional_coverage(*, department:departments(*)),
      services:professional_services(*)
    `)
    .eq('profiles.country_id', country?.id ?? '')
    .in('professional_categories.category_id', categoryIds)
    .eq('profile.active', true)

  const hasSubcategories = category.subcategories && category.subcategories.length > 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href={`/${params.country}`} className="hover:text-foreground">Inicio</Link>
        {category.parent && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/${params.country}/categoria/${(category.parent as any).slug}`} className="hover:text-foreground">
              {(category.parent as any).name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-muted-foreground mb-8">{category.description}</p>
      )}

      {/* Subcategories grid if parent category */}
      {hasSubcategories && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Especialidades</h2>
          <CategoryGrid
            categories={category.subcategories as any[]}
            countryPrefix={params.country}
          />
        </section>
      )}

      {/* Professionals list */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Profesionales de {category.name}
            <Badge variant="secondary" className="ml-2">{professionals?.length ?? 0}</Badge>
          </h2>
        </div>

        {professionals && professionals.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((pro) => (
              <ProfessionalCard
                key={pro.id}
                professional={pro as any}
                countryPrefix={params.country}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              Aún no hay profesionales registrados en esta categoría.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ¿Eres profesional?{' '}
              <Link href="/registro/profesional" className="text-primary hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
