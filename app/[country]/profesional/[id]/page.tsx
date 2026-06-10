export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle, Star, MapPin,
  Facebook, Instagram, ExternalLink
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { AvailabilityCalendar } from '@/components/professionals/AvailabilityCalendar'
import { PortfolioLightbox } from '@/components/professionals/PortfolioLightbox'
import { getInitials } from '@/lib/utils'

export default async function ProfessionalProfilePage({
  params,
}: {
  params: { country: string; id: string }
}) {
  const supabase = createClient()

  const { data: pro } = await supabase
    .from('professionals')
    .select(`
      *,
      profile:profiles(*, department:departments(*), municipality:municipalities(*)),
      categories:professional_categories(*, category:categories(*)),
      coverage:professional_coverage(*, department:departments(*), municipality:municipalities(*)),
      services:professional_services(*),
      portfolio:portfolio_photos(*),
      faq:professional_faq(*)
    `)
    .eq('id', params.id)
    .single()

  if (!pro) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, client:profiles!client_id(full_name), category:categories(name)')
    .eq('professional_id', params.id)
    .order('created_at', { ascending: false })

  const { data: availability } = await supabase
    .from('availability')
    .select('id, date, status')
    .eq('professional_id', params.id)
    .order('date', { ascending: true })

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const { data: { user } } = await supabase.auth.getUser()
  let clientProfile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role, id')
      .eq('id', user.id)
      .single()
    clientProfile = data
  }

  const profile = pro.profile as any
  const coverageText = pro.covers_entire_country
    ? 'Todo El Salvador'
    : (pro.coverage as any[])?.map((c: any) => c.department?.name).filter(Boolean).join(', ')

  const sortedPortfolio = ((pro.portfolio as any[]) ?? [])
    .sort((a: any, b: any) => a.order_index - b.order_index)
    .map((photo: any) => ({
      ...photo,
      publicUrl: photo.photo_url.startsWith('http')
        ? photo.photo_url
        : supabase.storage.from('portfolio').getPublicUrl(photo.photo_url).data.publicUrl,
    }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column — sticky panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-32 w-32 overflow-hidden rounded-full bg-muted">
              {profile?.photo_url ? (
                <Image src={profile.photo_url} alt={profile.full_name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-3xl font-bold">
                  {getInitials(profile?.full_name ?? 'P')}
                </div>
              )}
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold">{profile?.full_name}</h1>
              {profile?.verified && (
                <div className="flex items-center justify-center gap-1 mt-1 text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Verificado</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({reviews?.length ?? 0} reseñas)</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <p className="text-sm font-semibold mb-2">Especialidades</p>
            <div className="flex flex-wrap gap-2">
              {(pro.categories as any[])?.map((pc: any) => (
                <Badge key={pc.id} className="text-xs">{pc.category?.name}</Badge>
              ))}
            </div>
          </div>

          {/* Coverage */}
          {coverageText && (
            <div>
              <p className="text-sm font-semibold mb-2 flex items-center gap-1">
                <MapPin className="h-4 w-4" /> Cobertura
              </p>
              <p className="text-sm text-muted-foreground">{coverageText}</p>
            </div>
          )}

          {/* Availability calendar */}
          <div>
            <p className="text-sm font-semibold mb-3">Disponibilidad</p>
            {availability && availability.length > 0 ? (
              <AvailabilityCalendar availability={availability} />
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Este profesional aún no ha configurado su disponibilidad.
              </p>
            )}
          </div>

          <Separator />

          {/* Social links */}
          <div className="flex gap-3">
            {pro.facebook_url && (
              <a href={pro.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {pro.instagram_url && (
              <a href={pro.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {pro.tiktok_url && (
              <a href={pro.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>

          {/* CTA */}
          {clientProfile?.role === 'client' && (
            <Button asChild className="w-full" size="lg">
              <Link href={`/${params.country}/profesional/${params.id}/cotizar`}>
                Solicitar Cotización
              </Link>
            </Button>
          )}

          {!user && (
            <Button asChild className="w-full" size="lg">
              <Link href={`/login?redirect=/${params.country}/profesional/${params.id}`}>
                Solicitar Cotización
              </Link>
            </Button>
          )}

          {clientProfile?.role === 'professional' && (
            <div style={{
              background: '#F2F0ED',
              border: '1px solid #2C2C2C15',
              borderRadius: '8px',
              padding: '12px 16px',
              fontFamily: 'var(--font-sans, "DM Sans", system-ui, sans-serif)',
              fontSize: '14px',
              color: '#7A7A78',
              textAlign: 'center',
            }}>
              Los profesionales no pueden solicitar cotizaciones a otros profesionales.
            </div>
          )}
        </aside>

        {/* Right column — tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="about">Sobre mí</TabsTrigger>
              <TabsTrigger value="portfolio">Portafolio</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              <TabsTrigger value="faq">Preguntas</TabsTrigger>
            </TabsList>

            {/* About */}
            <TabsContent value="about" className="mt-6 space-y-6">
              {pro.bio && (
                <div>
                  <h2 className="font-semibold mb-3">Sobre mí</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{pro.bio}</p>
                </div>
              )}

              {(pro.services as any[])?.length > 0 && (
                <div>
                  <h2 className="font-semibold mb-3">Habilidades y experiencia:</h2>
                  <div className="flex flex-wrap gap-2">
                    {(pro.services as any[]).map((s: any) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white"
                        style={{ backgroundColor: '#1B3A6B' }}
                      >
                        {s.service_tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">
                  {pro.total_projects} proyectos completados
                </p>
              </div>
            </TabsContent>

            {/* Portfolio */}
            <TabsContent value="portfolio" className="mt-6">
              <PortfolioLightbox photos={sortedPortfolio} />
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="mt-6 space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{(review.client as any)?.full_name}</p>
                        {review.category && (
                          <p className="text-xs text-muted-foreground">{(review.category as any)?.name}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">Aún no hay reseñas.</p>
              )}
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq" className="mt-6">
              {(pro.faq as any[])?.length > 0 ? (
                <Accordion type="single" collapsible>
                  {(pro.faq as any[]).map((item: any) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No hay preguntas frecuentes aún.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
