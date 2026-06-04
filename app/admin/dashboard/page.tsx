export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, FileText, Star } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = createClient()

  const [
    { count: totalPros },
    { count: verifiedPros },
    { count: totalClients },
    { count: totalQuotes },
    { count: pendingPros },
  ] = await Promise.all([
    supabase.from('professionals').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'professional').eq('verified', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('quote_requests').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'professional').eq('verified', false),
  ])

  const stats = [
    { label: 'Total profesionales', value: totalPros ?? 0, icon: UserCheck, color: 'text-purple-600' },
    { label: 'Verificados', value: verifiedPros ?? 0, icon: UserCheck, color: 'text-green-600' },
    { label: 'Pendientes verificación', value: pendingPros ?? 0, icon: UserCheck, color: 'text-yellow-600' },
    { label: 'Propietarios', value: totalClients ?? 0, icon: Users, color: 'text-blue-600' },
    { label: 'Solicitudes de cotización', value: totalQuotes ?? 0, icon: FileText, color: 'text-orange-600' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-lg border bg-white p-6">
        <h2 className="font-semibold mb-4">Solicitudes por estado</h2>
        <QuotesByStatus />
      </div>
    </div>
  )
}

async function QuotesByStatus() {
  const supabase = createClient()
  const statuses = ['pending', 'responded', 'accepted', 'rejected']
  const labels: Record<string, string> = {
    pending: 'Pendientes',
    responded: 'Respondidas',
    accepted: 'Aceptadas',
    rejected: 'Rechazadas',
  }
  const colors: Record<string, string> = {
    pending: 'bg-yellow-400',
    responded: 'bg-blue-400',
    accepted: 'bg-green-400',
    rejected: 'bg-red-400',
  }

  const counts = await Promise.all(
    statuses.map((s) =>
      supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', s)
    )
  )

  const total = counts.reduce((sum, { count }) => sum + (count ?? 0), 0)

  return (
    <div className="space-y-3">
      {statuses.map((s, i) => {
        const count = counts[i].count ?? 0
        const pct = total > 0 ? Math.round((count / total) * 100) : 0
        return (
          <div key={s}>
            <div className="flex justify-between text-sm mb-1">
              <span>{labels[s]}</span>
              <span className="font-medium">{count}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${colors[s]} rounded-full`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
