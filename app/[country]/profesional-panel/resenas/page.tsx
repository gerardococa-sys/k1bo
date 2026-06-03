export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function ProResenasPage({
  params,
}: {
  params: { country: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'professional') redirect(`/${params.country}`)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, client:profiles!client_id(full_name), category:categories(name)')
    .eq('professional_id', user.id)
    .order('created_at', { ascending: false })

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href={`/${params.country}/profesional-panel/dashboard`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mis Reseñas</h1>
          <p className="text-muted-foreground">{reviews?.length ?? 0} reseñas en total</p>
        </div>
        {(reviews?.length ?? 0) > 0 && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">promedio</span>
          </div>
        )}
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-lg border bg-white p-5">
              {/* Header: client + stars */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-sm">
                    {(review.client as any)?.full_name ?? 'Cliente'}
                  </p>
                  {review.category && (
                    <p className="text-xs text-muted-foreground">
                      {(review.category as any)?.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              )}

              {/* Date */}
              <p className="text-xs text-muted-foreground mt-3">
                {formatDate(review.created_at)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Aún no tienes reseñas.</p>
          <p className="text-sm mt-1">Las reseñas aparecerán aquí cuando tus clientes califiquen tu trabajo.</p>
        </div>
      )}
    </div>
  )
}
