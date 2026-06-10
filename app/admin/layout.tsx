'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Home, Star, Tag, Menu, X, LogOut } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'
const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'

const NAV_ITEMS = [
  { label: 'Dashboard',     href: '/admin/dashboard',    icon: LayoutDashboard },
  { label: 'Profesionales', href: '/admin/profesionales', icon: Users           },
  { label: 'Propietarios',  href: '/admin/propietarios',  icon: Home            },
  { label: 'Reseñas',       href: '/admin/resenas',       icon: Star            },
  { label: 'Categorías',    href: '/admin/categorias',    icon: Tag             },
]

async function handleLogout() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  await supabase.auth.signOut()
  window.location.href = '/login'
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 16px' }}>

      {/* Logo */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 700, color: '#F2F0ED' }}>
          Artifex<span style={{ color: '#C4581A' }}>7</span>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#F2F0ED50', marginTop: '2px' }}>
          Panel Admin
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', textDecoration: 'none',
                background: active ? '#F2F0ED15' : 'transparent',
                color: active ? '#F2F0ED' : '#F2F0ED60',
                fontFamily: FONT_SANS, fontSize: '14px',
                fontWeight: active ? 600 : 400,
                transition: 'all 150ms',
              }}
            >
              <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #F2F0ED15', paddingTop: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link
          href="/sv"
          style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#F2F0ED40', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← Volver al sitio
        </Link>
        <button
          onClick={handleLogout}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontFamily: FONT_SANS, fontSize: '13px', color: '#F2F0ED40',
            display: 'flex', alignItems: 'center', gap: '6px',
            textAlign: 'left',
          }}
        >
          <LogOut style={{ width: 14, height: 14 }} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F2F0ED' }}>

      {/* Sidebar desktop — visible en ≥1024px vía CSS */}
      <aside
        className="admin-sidebar-desktop"
        style={{
          width: '240px', background: '#1E1E1E', flexShrink: 0,
          position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40,
          display: 'none',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 48 }}
        />
      )}

      {/* Sidebar mobile — drawer */}
      <aside style={{
        width: '260px', background: '#1E1E1E',
        position: 'fixed', top: 0, left: sidebarOpen ? 0 : '-260px',
        height: '100vh', zIndex: 49, transition: 'left 250ms ease',
      }}>
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#F2F0ED60', cursor: 'pointer', padding: '4px', display: 'flex' }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Contenido principal */}
      <div className="admin-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar mobile */}
        <header
          className="admin-topbar"
          style={{
            background: '#1E1E1E', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: '12px',
            position: 'sticky', top: 0, zIndex: 30,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: '#F2F0ED', cursor: 'pointer', padding: '4px', display: 'flex', flexShrink: 0 }}
          >
            <Menu style={{ width: 22, height: 22 }} />
          </button>
          <span style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 700, color: '#F2F0ED' }}>
            Artifex<span style={{ color: '#C4581A' }}>7</span>
            <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#F2F0ED50', fontWeight: 400, marginLeft: '8px' }}>
              Admin
            </span>
          </span>
        </header>

        {/* Página */}
        <main style={{ flex: 1, overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-topbar           { display: none  !important; }
          .admin-main-content     { margin-left: 240px; }
        }
        @media (max-width: 1023px) {
          .admin-table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  )
}
