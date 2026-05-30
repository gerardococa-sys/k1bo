'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createBrowserClient } from '@supabase/ssr'
import type { Department, Municipality, District } from '@/types'

const schema = z.object({
  full_name: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  phone: z.string().min(8, 'Teléfono requerido'),
  date_of_birth: z.string().min(1, 'Fecha de nacimiento requerida'),
  address: z.string().optional(),
})

type FormData = z.infer<typeof schema>

function mkClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default function RegistroClientePage() {
  const router = useRouter()

  const [departments, setDepartments] = useState<Department[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedMuni, setSelectedMuni] = useState('')
  const [selectedDist, setSelectedDist] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [svCountryId, setSvCountryId] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const load = async () => {
      const supabase = mkClient()
      const { data: country } = await supabase
        .from('countries')
        .select('id')
        .eq('url_prefix', process.env.NEXT_PUBLIC_DEFAULT_COUNTRY ?? 'sv')
        .single()
      if (country) {
        setSvCountryId(country.id)
        const { data: depts } = await supabase
          .from('departments')
          .select('*')
          .eq('country_id', country.id)
          .order('name')
        setDepartments(depts ?? [])
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedDept) return
    const supabase = mkClient()
    supabase
      .from('municipalities')
      .select('*')
      .eq('department_id', selectedDept)
      .order('name')
      .then(({ data }) => setMunicipalities(data ?? []))
    setSelectedMuni('')
    setSelectedDist('')
    setDistricts([])
  }, [selectedDept])

  useEffect(() => {
    if (!selectedMuni) return
    const supabase = mkClient()
    supabase
      .from('districts')
      .select('*')
      .eq('municipality_id', selectedMuni)
      .order('name')
      .then(({ data }) => setDistricts(data ?? []))
    setSelectedDist('')
  }, [selectedMuni])

  const onSubmit = async (data: FormData) => {
    const supabase = mkClient()
    const { data: auth, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError || !auth.user) {
      toast.error(authError?.message ?? 'Error al crear cuenta')
      return
    }

    let photo_url = null
    if (avatar) {
      const ext = avatar.name.split('.').pop()
      const path = `${auth.user.id}/avatar.${ext}`
      const { data: upload } = await supabase.storage.from('avatars').upload(path, avatar)
      if (upload) {
        const { data: url } = supabase.storage.from('avatars').getPublicUrl(path)
        photo_url = url.publicUrl
      }
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: auth.user.id,
      country_id: svCountryId || null,
      role: 'client',
      full_name: data.full_name,
      photo_url,
      phone: data.phone,
      date_of_birth: data.date_of_birth,
      address: data.address ?? null,
      department_id: selectedDept || null,
      municipality_id: selectedMuni || null,
      district_id: selectedDist || null,
    })

    if (profileError) {
      toast.error('Error al guardar el perfil')
      return
    }

    toast.success('¡Cuenta creada con éxito!')
    router.push('/sv')
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black uppercase text-[#1B3A6B]">K1BO</Link>
          <h1 className="mt-2 text-xl font-semibold">Registro de Cliente</h1>
          <p className="text-muted-foreground text-sm mt-1">Encuentra profesionales cerca de ti</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nombre completo *</Label>
            <Input id="full_name" placeholder="Ana García" {...register('full_name')} />
            {errors.full_name && <p className="text-sm text-destructive">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico *</Label>
            <Input id="email" type="email" placeholder="tu@correo.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input id="password" type="password" placeholder="Mínimo 8 caracteres" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input id="phone" placeholder="7777-8888" {...register('phone')} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Fecha de nacimiento *</Label>
            <Input id="date_of_birth" type="date" {...register('date_of_birth')} />
            {errors.date_of_birth && <p className="text-sm text-destructive">{errors.date_of_birth.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Foto de perfil</Label>
            <Input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" placeholder="Calle, colonia, ciudad" {...register('address')} />
          </div>

          {/* Location cascade */}
          <div className="space-y-2">
            <Label>Departamento *</Label>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger><SelectValue placeholder="Selecciona departamento" /></SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {municipalities.length > 0 && (
            <div className="space-y-2">
              <Label>Municipio *</Label>
              <Select value={selectedMuni} onValueChange={setSelectedMuni}>
                <SelectTrigger><SelectValue placeholder="Selecciona municipio" /></SelectTrigger>
                <SelectContent>
                  {municipalities.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {districts.length > 0 && (
            <div className="space-y-2">
              <Label>Distrito</Label>
              <Select value={selectedDist} onValueChange={setSelectedDist}>
                <SelectTrigger><SelectValue placeholder="Selecciona distrito" /></SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
