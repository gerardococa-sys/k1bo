export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard'

export default async function BuscarPage({
  params,
  searchParams,
}: {
  params: { country: string }
  searchParams: { q?: string }
}) {
  const q = searchParams.q?.trim() ?? ''

  if (!q) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Escribe algo para buscar profesionales.</p>
        <Link href={`/${params.country}`} className="text-primary hover:underline text-sm mt-4 inline-block">
          ← Volver al inicio
        </Link>
      </div>
    )
  }

  const supabase = await createClient()

  const [{ data: categories }, { data: professionals }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug')
      .ilike('name', `%${q}%`)
      .is('parent_id', null)
      .limit(6),
    supabase
      .from('professionals')
      .select(`
        *,
        profile:profiles!inner(*, country:countries(*)),
        categories:professional_categories(*, category:categories(*)),
        coverage:professional_coverage(*, department:departments(*)),
        services:professional_services(*)
      `)
      .or(`short_description.ilike.%${q}%,bio.ilike.%${q}%`)
      .limit(12),
  ])

  const total = (categories?.length ?? 0) + (professionals?.length ?? 0)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">
          Resultados para <span className="text-primary">"{q}"</span>
        </h1>
        <p className="text-muted-foreground text-sm">{total} resultado(s) encontrado(s)</p>
      </div>

      {/* Matching categories */}
      {categories && categories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Categorías</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${params.country}/categoria/${cat.slug}`}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Matching professionals */}
      {professionals && professionals.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold mb-4">Profesionales</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((pro) => (
              <ProfessionalCard key={pro.id} professional={pro as any} countryPrefix={params.country} />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground text-lg font-medium mb-2">
            No encontramos resultados para "{q}"
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Intenta con otro término o explora nuestras categorías
          </p>
          <Link
            href={`/${params.country}`}
            className="text-primary hover:underline font-medium text-sm"
          >
            ← Ver todas las categorías
          </Link>
        </div>
      )}
    </div>
  )
}
