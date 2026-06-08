export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Users, UserCheck, Star, Tag } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profesionales', label: 'Profesionales', icon: UserCheck },
  { href: '/admin/clientes', label: 'Propietarios', icon: Users },
  { href: '/admin/resenas', label: 'Reseñas', icon: Star },
  { href: '/admin/categorias', label: 'Categorías', icon: Tag },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" style={{ color: '#2C2C2C' }}><Logo size="md" /></Link>
          <p className="text-xs text-muted-foreground mt-1">Panel Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t text-xs text-muted-foreground">
          {profile.full_name}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-muted/30 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}
