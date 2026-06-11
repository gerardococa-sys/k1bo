export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, FileText, Calendar, User } from 'lucide-react'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/utils'
import { AccountStatusBanner } from '@/components/ui/AccountStatusBanner'

export default async function ProDashboardPage({ params }: { params: { country: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, account_status')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'professional') redirect(`/${params.country}`)

  const { data: pro } = await supabase
    .from('professionals')
    .select('total_projects, activation_requested, categories:professional_categories(projects_count, category:categories(name))')
    .eq('id', user.id)
    .single()

  const { data: quotes } = await supabase
    .from('quote_requests')
    .select('id, status, created_at, category:categories(name), client:profiles!client_id(full_name)')
    .eq('professional_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: pendingCount } = await supabase
    .from('quote_requests')
    .select('*', { count: 'exact', head: true })
    .eq('professional_id', user.id)
    .eq('status', 'pending')

  const { count: totalCount } = await supabase
    .from('quote_requests')
    .select('*', { count: 'exact', head: true })
    .eq('professional_id', user.id)

  console.log('[dashboard] pending:', pendingCount, 'total:', totalCount, 'user:', user.id)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('professional_id', user.id)

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const pending = pendingCount ?? 0

  return (
    <div className="container mx-auto px-4 py-8">
      <AccountStatusBanner
        status={(profile.account_status as any) ?? 'review'}
        role={profile.role}
        professionalId={user.id}
        activationRequested={pro?.activation_requested ?? false}
        country={params.country}
      />
      <h1 className="text-2xl font-bold mb-2">Dashboard del Profesional</h1>
      <p className="text-muted-foreground mb-8">Bienvenido, {profile.full_name}</p>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-1">
              <FileText className="h-4 w-4" /> Solicitudes pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{pending}</p>
          </CardContent>
        </Card>
        <Link href={`/${params.country}/profesional-panel/resenas`}>
          <Card className="cursor-pointer hover:border-primary hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-1">
                <Star className="h-4 w-4" /> Calificación promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
              <p className="text-xs text-primary mt-1">Ver todas las reseñas →</p>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Proyectos completados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pro?.total_projects ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category counts */}
      {(pro?.categories as any[])?.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-3">Proyectos por categoría</h2>
          <div className="flex flex-wrap gap-3">
            {(pro!.categories as any[]).map((pc: any) => (
              <div key={pc.category?.name} className="rounded-lg border px-4 py-2 text-sm">
                <span className="font-medium">{pc.category?.name}</span>
                <span className="text-muted-foreground ml-2">({pc.projects_count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        {[
          { href: `/${params.country}/profesional-panel/solicitudes`, icon: FileText, title: 'Mis Solicitudes', desc: 'Gestiona tus cotizaciones' },
          { href: `/${params.country}/profesional-panel/disponibilidad`, icon: Calendar, title: 'Disponibilidad', desc: 'Gestiona tu calendario' },
          { href: `/${params.country}/profesional-panel/perfil`, icon: User, title: 'Mi Perfil', desc: 'Edita tu información' },
        ].map((link) => (
          <Button key={link.href} asChild variant="outline" className="h-auto p-4 justify-start gap-3">
            <Link href={link.href}>
              <link.icon className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">{link.title}</p>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </div>
            </Link>
          </Button>
        ))}
      </div>

      {/* Recent quotes */}
      {quotes && quotes.length > 0 && (
        <div>
          <h2 className="font-semibold mb-4">Solicitudes recientes</h2>
          <div className="space-y-3">
            {quotes.map((q) => (
              <div key={q.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-sm">{(q.category as any)?.name}</p>
                  <p className="text-xs text-muted-foreground">{(q.client as any)?.full_name}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[q.status]}`}>
                  {STATUS_LABELS[q.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
