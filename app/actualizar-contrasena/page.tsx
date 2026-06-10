'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserClient } from '@supabase/ssr'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  password:        z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path:    ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function ActualizarContrasenaPage() {
  const router  = useRouter()
  const [ready,   setReady]   = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [done,    setDone]    = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    // Supabase automatically processes the recovery token from the URL hash/params
    // and fires PASSWORD_RECOVERY once the session is established
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    // Also check if there's already an active recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
      else {
        // Give Supabase a moment to parse the URL hash
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: s } }) => {
            if (!s) setInvalid(true)
          })
        }, 1500)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const onSubmit = async (data: FormData) => {
    setSubmitError('')
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { error } = await supabase.auth.updateUser({ password: data.password })
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('different from the old password') || msg.includes('same password')) {
        setSubmitError('La nueva contraseña debe ser diferente a la actual.')
      } else if (msg.includes('weak password') || msg.includes('too short')) {
        setSubmitError('La contraseña es demasiado débil. Usa mínimo 8 caracteres.')
      } else {
        setSubmitError('Ocurrió un error al actualizar la contraseña. Intenta de nuevo.')
      }
      return
    }
    setDone(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" style={{ color: '#2C2C2C' }}>
            <Logo size="lg" />
          </Link>
          <p className="mt-2 text-muted-foreground">Nueva contraseña</p>
        </div>

        {done && (
          <div className="rounded-lg bg-primary/10 p-4 text-sm text-primary text-center">
            ✓ Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...
          </div>
        )}

        {!done && invalid && (
          <div className="space-y-4 text-center">
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              El enlace de recuperación no es válido o ha expirado.
            </div>
            <Link href="/olvide-contrasena" className="text-sm text-primary hover:underline">
              Solicitar un nuevo enlace
            </Link>
          </div>
        )}

        {!done && !invalid && (
          <>
            {!ready && (
              <p className="text-center text-sm text-muted-foreground mb-4">Verificando enlace...</p>
            )}

            {ready && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite la contraseña"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Actualizar contraseña'}
                </Button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
