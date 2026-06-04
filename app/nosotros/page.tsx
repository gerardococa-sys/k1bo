export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HowItWorks } from '@/components/HowItWorks'

export const metadata: Metadata = {
  title: 'Nosotros — Artifex7',
  description: 'Conectamos el talento técnico con los mejores proyectos de construcción y remodelación en Centroamérica.',
}

export default async function NosotrosPage() {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, client:profiles!client_id(full_name), category:categories(name)')
    .gte('rating', 4)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div>
      {/* Hero */}
      <section style={{ backgroundColor: '#1C1410' }} className="text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Nosotros</h1>
        </div>
      </section>

      {/* ARTIFEX 7 */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">ARTIFEX 7</h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              En la antigüedad, no cualquiera podía levantar un muro o colocar un acabado.
              A quienes dominaban los materiales con precisión, limpieza y orgullo, se les
              llamaba <strong className="text-foreground">Artifex</strong>: los maestros del oficio.
            </p>
            <p>
              Hoy, la construcción ha cambiado, pero el valor de hacer las cosas bien sigue
              intacto. Si eres de los que cuida cada milímetro, que entrega a tiempo y que
              respeta su trabajo, tú no eres solo mano de obra.{' '}
              <strong className="text-foreground">Tú eres un Artifex.</strong>
            </p>
            <p>
              Bienvenido a la red que conecta el talento técnico con los mejores proyectos
              de la región.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      {reviews && reviews.length > 0 && (
        <section className="bg-[#F9F9F9] py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Lo que dicen nuestros propietarios</h2>
            <p className="text-muted-foreground mb-8">Testimonios reales de nuestra comunidad</p>
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
                  {review.comment && (
                    <p className="text-sm mb-3 line-clamp-3">{review.comment}</p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">{(review.client as any)?.full_name}</span>
                    {review.category && (
                      <span> · {(review.category as any)?.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cómo funciona */}
      <HowItWorks />
    </div>
  )
}
