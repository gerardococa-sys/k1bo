'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User, LayoutDashboard } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'

interface UserMenuProps {
  profile: { full_name: string | null; photo_url: string | null; role: string }
  countryPrefix?: string
}

export function UserMenu({ profile, countryPrefix }: UserMenuProps) {
  const router = useRouter()
  const supabase = createClient()
  const base = countryPrefix ? `/${countryPrefix}` : ''

  const panelPath =
    profile.role === 'professional'
      ? `${base}/profesional-panel/dashboard`
      : profile.role === 'admin'
      ? '/admin/dashboard'
      : `${base}/cliente/dashboard`

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center gap-2 cursor-pointer rounded-md px-1 py-0.5 hover:bg-muted transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.photo_url ?? ''} alt={profile.full_name ?? ''} />
            <AvatarFallback
              className="text-xs font-semibold"
              style={{ backgroundColor: '#B85C1A20', color: '#B85C1A' }}
            >
              {getInitials(profile.full_name ?? 'U')}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm font-medium text-foreground">
            {profile.full_name?.split(' ')[0] ?? 'Usuario'}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="truncate">{profile.full_name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(panelPath)}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Mi Panel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`${panelPath.replace('dashboard', 'perfil')}`)}>
          <User className="mr-2 h-4 w-4" />
          Mi Perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
