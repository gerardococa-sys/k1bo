'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'

type Tab = 'all' | 'pending' | 'verified'

export default function AdminProfesionalesPage() {
  const supabase = createClient()
  const [tab, setTab] = useState<Tab>('all')
  const [search, setSearch] = useState('')
  const [pros, setPros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    let query = supabase
      .from('professionals')
      .select('id, featured, total_projects, profile:profiles(full_name, photo_url, verified, active, email:id)')
      .order('id')

    const { data } = await query
    setPros(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const verify = async (id: string, verified: boolean) => {
    const adminClient = createClient()
    const { error } = await adminClient.from('profiles').update({ verified }).eq('id', id)
    if (error) { toast.error('Error'); return }
    load()
    toast.success(verified ? 'Profesional verificado' : 'Verificación revocada')
  }

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('profiles').update({ active }).eq('id', id)
    load()
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    await supabase.from('professionals').update({ featured }).eq('id', id)
    load()
  }

  const filtered = pros.filter((p) => {
    const profile = p.profile as any
    const name = profile?.full_name?.toLowerCase() ?? ''
    const matchSearch = name.includes(search.toLowerCase())
    if (tab === 'pending') return matchSearch && !profile?.verified
    if (tab === 'verified') return matchSearch && profile?.verified
    return matchSearch
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gestión de Profesionales</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex gap-2">
          {(['all', 'pending', 'verified'] as Tab[]).map((t) => (
            <Button
              key={t}
              variant={tab === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTab(t)}
            >
              {t === 'all' ? 'Todos' : t === 'pending' ? 'Pendientes' : 'Verificados'}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : (
        <div className="rounded-lg border bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profesional</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Destacado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((pro) => {
                const profile = pro.profile as any
                return (
                  <TableRow key={pro.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-muted overflow-hidden flex items-center justify-center text-sm font-semibold shrink-0">
                          {profile?.photo_url ? (
                            <Image src={profile.photo_url} alt="" width={36} height={36} className="object-cover" />
                          ) : (
                            getInitials(profile?.full_name ?? 'P')
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{profile?.full_name}</p>
                          <Link
                            href={`/sv/profesional/${pro.id}`}
                            target="_blank"
                            className="text-xs text-primary hover:underline"
                          >
                            Ver perfil
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {profile?.verified ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" /> Verificado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={profile?.active ?? true}
                        onCheckedChange={(v) => toggleActive(pro.id, v)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={pro.featured}
                        onCheckedChange={(v) => toggleFeatured(pro.id, v)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!profile?.verified ? (
                          <Button
                            size="sm"
                            onClick={() => verify(pro.id, true)}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" /> Verificar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verify(pro.id, false)}
                          >
                            <XCircle className="mr-1 h-3 w-3" /> Revocar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No se encontraron profesionales
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
