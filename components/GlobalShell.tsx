'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar/Navbar'
import { Footer } from './footer/Footer'

export function GlobalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  )
}
