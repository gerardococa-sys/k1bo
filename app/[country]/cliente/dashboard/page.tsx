export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/utils'
import { FileText, User } from 'lucide-react'

export default async function ClientDashboardPage({ params }: { params: { country: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'client') redirect(`/${params.country}`)

  const [
    { count: total },
    { count: pending },
    { data: quotes },
  ] = await Promise.all([
    supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('client_id', user.id),
    supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('client_id', user.id).eq('status', 'pending'),
    supabase
      .from('quote_requests')
      .select('id, status, created_at, category:categories(name), professional:professionals(profile:profiles(full_name))')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Panel del Propietario</h1>
      <p className="text-muted-foreground mb-8">Bienvenido, {profile.full_name}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Solicitudes pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{total}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
        <Button asChild variant="outline" className="h-auto p-4 justify-start gap-3">
          <Link href={`/${params.country}/cliente/solicitudes`}>
            <FileText className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-semibold">Mis Solicitudes</p>
              <p className="text-xs text-muted-foreground">Ver todas tus solicitudes</p>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto p-4 justify-start gap-3">
          <Link href={`/${params.country}/cliente/perfil`}>
            <User className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-semibold">Mi Perfil</p>
              <p className="text-xs text-muted-foreground">Editar datos personales</p>
            </div>
          </Link>
        </Button>
      </div>

      {quotes && quotes.length > 0 && (
        <div>
          <h2 className="font-semibold mb-4">Solicitudes recientes</h2>
          <div className="space-y-3">
            {quotes.map((q) => (
              <div key={q.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-sm">{(q.category as any)?.name}</p>
                  <p className="text-xs text-muted-foreground">{(q.professional as any)?.profile?.full_name}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[q.status]}`}>
                  {STATUS_LABELS[q.status]}
                </span>
              </div>
            ))}
          </div>
          <Button asChild variant="link" className="mt-2 px-0">
            <Link href={`/${params.country}/cliente/solicitudes`}>Ver todas →</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
