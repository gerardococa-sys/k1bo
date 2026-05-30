'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(8),
  address: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function ClientProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [avatar, setAvatar] = useState<File | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) reset({ full_name: data.full_name ?? '', phone: data.phone ?? '', address: data.address ?? '' })
        setLoading(false)
      })
    })
  }, [])

  const onSubmit = async (data: FormData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let photo_url = undefined
    if (avatar) {
      const ext = avatar.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      await supabase.storage.from('avatars').upload(path, avatar, { upsert: true })
      const { data: url } = supabase.storage.from('avatars').getPublicUrl(path)
      photo_url = url.publicUrl
    }

    const { error } = await supabase.from('profiles').update({
      full_name: data.full_name,
      phone: data.phone,
      address: data.address,
      ...(photo_url ? { photo_url } : {}),
    }).eq('id', user.id)

    if (error) { toast.error('Error al guardar'); return }
    toast.success('Perfil actualizado')
    router.refresh()
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando...</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label>Nombre completo</Label>
          <Input {...register('full_name')} />
          {errors.full_name && <p className="text-sm text-destructive">{errors.full_name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Teléfono</Label>
          <Input {...register('phone')} />
        </div>
        <div className="space-y-2">
          <Label>Dirección</Label>
          <Input {...register('address')} />
        </div>
        <div className="space-y-2">
          <Label>Foto de perfil</Label>
          <Input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>
    </div>
  )
}
