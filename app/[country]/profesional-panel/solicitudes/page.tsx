'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { STATUS_LABELS, STATUS_COLORS, formatDate, getInitials } from '@/lib/utils'
import type { QuoteRequest } from '@/types'

export default function ProSolicitudesPage() {
  const supabase = createClient()
  const router = useRouter()
  const [quotes, setQuotes] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      supabase
        .from('quote_requests')
        .select('*, category:categories(name), subcategory:categories!subcategory_id(name), client:profiles!client_id(full_name, photo_url), photos:quote_request_photos(*)')
        .eq('professional_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => { setQuotes(data ?? []); setLoading(false) })
    })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('quote_requests').update({ status }).eq('id', id)
    if (error) { toast.error('Error al actualizar'); return }
    setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status } : q))
    setSelected(null)
    toast.success('Estado actualizado')
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Solicitudes</h1>

      {quotes.length > 0 ? (
        <div className="space-y-4">
          {quotes.map((q) => {
            const client = q.client as any
            return (
              <div key={q.id} className="rounded-lg border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* Client avatar */}
                    <div className="h-10 w-10 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center text-sm font-semibold">
                      {client?.photo_url ? (
                        <Image src={client.photo_url} alt="" width={40} height={40} className="object-cover" />
                      ) : (
                        getInitials(client?.full_name ?? 'C')
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{client?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{(q.category as any)?.name}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{q.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fecha requerida: {formatDate(q.required_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[q.status]}`}>
                      {STATUS_LABELS[q.status]}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => setSelected(q)}>
                      Ver detalle
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-center py-12 text-muted-foreground">No hay solicitudes aún.</p>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de solicitud</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold">Cliente</p>
                <p className="text-sm text-muted-foreground">{selected.client?.full_name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Servicio</p>
                <p className="text-sm text-muted-foreground">
                  {selected.category?.name}
                  {selected.subcategory ? ` → ${selected.subcategory.name}` : ''}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">Descripción</p>
                <p className="text-sm text-muted-foreground">{selected.description}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Fecha requerida</p>
                <p className="text-sm text-muted-foreground">{formatDate(selected.required_date)}</p>
              </div>
              {selected.photos?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Fotos adjuntas</p>
                  <div className="flex gap-2 flex-wrap">
                    {selected.photos.map((p: any) => (
                      <a key={p.id} href={p.photo_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary underline">
                        Ver foto
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {selected?.status === 'pending' && (
              <>
                <Button onClick={() => updateStatus(selected.id, 'accepted')} className="flex-1">
                  Aceptar
                </Button>
                <Button variant="destructive" onClick={() => updateStatus(selected.id, 'rejected')} className="flex-1">
                  Rechazar
                </Button>
                <Button variant="outline" onClick={() => updateStatus(selected.id, 'responded')} className="flex-1">
                  Responder
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
