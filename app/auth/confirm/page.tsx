'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '16px',
  padding: '48px 40px',
  maxWidth: '480px',
  width: '100%',
  textAlign: 'center',
  border: '0.5px solid #2C2C2C12',
}

const btnDark: React.CSSProperties = {
  display: 'inline-block',
  background: '#1E1E1E',
  color: '#D4963A',
  fontFamily: FONT_SANS,
  fontSize: '15px',
  fontWeight: 700,
  padding: '13px 28px',
  borderRadius: '8px',
  textDecoration: 'none',
}

const btnCobre: React.CSSProperties = {
  ...btnDark,
  background: '#C4581A',
  color: '#F2F0ED',
}

export default function AuthConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [dashPath, setDashPath] = useState('/sv/cliente/dashboard')

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    async function handleConfirm() {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        setStatus('error')
        return
      }

      // Apply pending profile fields saved before email confirmation
      const pendingProfile = localStorage.getItem('pending_profile')
      if (pendingProfile) {
        try {
          const profileData = JSON.parse(pendingProfile)
          await supabase.from('profiles').update(profileData).eq('id', user.id)
          localStorage.removeItem('pending_profile')
        } catch (_) {}
      }

      // Apply pending professionals record
      const pendingPro = localStorage.getItem('pending_professional')
      if (pendingPro) {
        try {
          const proData = JSON.parse(pendingPro)
          const { data: existing } = await supabase
            .from('professionals')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()
          if (existing) {
            await supabase.from('professionals').update(proData).eq('id', user.id)
          } else {
            await supabase.from('professionals').insert({ id: user.id, ...proData })
          }
          localStorage.removeItem('pending_professional')
        } catch (_) {}
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const path = profile?.role === 'professional'
        ? '/sv/profesional-panel/dashboard'
        : '/sv/cliente/dashboard'

      setDashPath(path)
      setStatus('success')

      setTimeout(() => router.push(path), 3000)
    }

    handleConfirm()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F2F0ED',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={cardStyle}>

        {status === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <h1 style={{ fontFamily: FONT_SERIF, fontSize: '24px', fontWeight: 700, color: '#1E1E1E', margin: 0 }}>
              Verificando tu cuenta...
            </h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>✅</div>
            <h1 style={{ fontFamily: FONT_SERIF, fontSize: '26px', fontWeight: 700, color: '#1E1E1E', marginBottom: '12px' }}>
              ¡Cuenta confirmada!
            </h1>
            <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#7A7A78', lineHeight: 1.7, marginBottom: '24px' }}>
              Tu email ha sido verificado correctamente. Serás redirigido a tu
              dashboard en unos segundos...
            </p>
            <Link href={dashPath} style={btnDark}>
              Ir a mi Dashboard
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>❌</div>
            <h1 style={{ fontFamily: FONT_SERIF, fontSize: '26px', fontWeight: 700, color: '#1E1E1E', marginBottom: '12px' }}>
              Enlace inválido
            </h1>
            <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#7A7A78', lineHeight: 1.7, marginBottom: '24px' }}>
              El enlace de confirmación es inválido o ya expiró. Intenta
              registrarte nuevamente.
            </p>
            <Link href="/registro" style={btnCobre}>
              Volver al registro
            </Link>
          </>
        )}

      </div>
    </div>
  )
}
