export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { STATUS_LABELS, STATUS_COLORS, formatDate } from '@/lib/utils'

export default async function ClientSolicitudesPage({ params }: { params: { country: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'client') redirect(`/${params.country}`)

  const { data: quotes } = await supabase
    .from('quote_requests')
    .select(`
      *,
      category:categories(name),
      subcategory:categories!subcategory_id(name),
      professional:professionals(id, profile:profiles(full_name, photo_url))
    `)
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Solicitudes</h1>

      {quotes && quotes.length > 0 ? (
        <div className="space-y-4">
          {quotes.map((q) => {
            const pro = q.professional as any
            return (
              <div key={q.id} className="rounded-lg border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{(q.category as any)?.name}</p>
                      {q.subcategory && (
                        <span className="text-xs text-muted-foreground">→ {(q.subcategory as any)?.name}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Profesional: <span className="font-medium">{pro?.profile?.full_name}</span>
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{q.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Fecha requerida: {formatDate(q.required_date)} · Enviada: {formatDate(q.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[q.status]}`}>
                      {STATUS_LABELS[q.status]}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/${params.country}/profesional/${pro?.id}`}>
                        Ver profesional
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Aún no has enviado solicitudes.</p>
          <Button asChild className="mt-4">
            <Link href={`/${params.country}`}>Buscar profesionales</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
