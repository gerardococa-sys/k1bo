import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { COUNTRY_PREFIXES } from '@/lib/utils'

const ACTIVE_PREFIXES = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY
  ? [process.env.NEXT_PUBLIC_DEFAULT_COUNTRY]
  : ['sv']

const PROTECTED_ROUTES: Record<string, string[]> = {
  client: ['cliente'],
  professional: ['profesional-panel'],
  admin: ['admin'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabase, supabaseResponse, user } = await updateSession(request)

  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0] ?? ''

  // Validate country prefix
  if (COUNTRY_PREFIXES.includes(firstSegment as typeof COUNTRY_PREFIXES[number])) {
    if (!ACTIVE_PREFIXES.includes(firstSegment)) {
      const url = request.nextUrl.clone()
      url.pathname = '/coming-soon'
      url.searchParams.set('country', firstSegment)
      return NextResponse.redirect(url)
    }

    const secondSegment = segments[1] ?? ''

    // Role-based protection inside country routes
    for (const [role, paths] of Object.entries(PROTECTED_ROUTES)) {
      if (role === 'admin') continue // admin is top-level
      if (paths.includes(secondSegment)) {
        if (!user) {
          const url = request.nextUrl.clone()
          url.pathname = '/login'
          url.searchParams.set('redirect', pathname)
          return NextResponse.redirect(url)
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!profile || profile.role !== role) {
          return NextResponse.redirect(new URL('/', request.url))
        }
      }
    }
  }

  // Protect /admin routes
  if (firstSegment === 'admin') {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
