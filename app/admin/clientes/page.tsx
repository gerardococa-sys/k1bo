import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export default async function AdminClientesPage() {
  const supabase = createClient()

  const { data: clients } = await supabase
    .from('profiles')
    .select('*, country:countries(name, flag_emoji)')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gestión de Clientes</h1>
      <p className="text-muted-foreground mb-4">{clients?.length ?? 0} clientes registrados</p>

      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Registrado</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{c.full_name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {(c.country as any)?.flag_emoji} {(c.country as any)?.name ?? '—'}
                </TableCell>
                <TableCell>{c.phone ?? '—'}</TableCell>
                <TableCell>{formatDate(c.created_at)}</TableCell>
                <TableCell>
                  {c.active ? (
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  ) : (
                    <Badge variant="destructive">Inactivo</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!clients || clients.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
