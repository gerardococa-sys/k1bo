'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Logo } from '@/components/ui/Logo'
import { createBrowserClient } from '@supabase/ssr'
import type { Department, Municipality, District } from '@/types'

const schema = z.object({
  full_name:        z.string().min(2, 'Nombre requerido'),
  email:            z.string().email('Email inválido'),
  password:         z.string().min(8, 'Mínimo 8 caracteres'),
  confirm_password: z.string().min(1, 'Confirmar contraseña requerida'),
  phone:            z.string().min(8, 'Teléfono requerido'),
  date_of_birth:    z.string().min(1, 'Fecha de nacimiento requerida'),
  address:          z.string().optional(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [svCountryId, setSvCountryId] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [phoneCountryCode, setPhoneCountryCode] = useState('+503')

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
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
    if (new Date(data.date_of_birth) >= new Date()) {
      setError('date_of_birth', { message: 'La fecha de nacimiento debe ser anterior a la fecha actual' })
      return
    }
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
      phone_country_code: phoneCountryCode,
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
          <Link href="/" style={{ color: '#1C1410' }}>
            <Logo size="lg" />
          </Link>
          <h1 className="mt-2 text-xl font-semibold">Registro de Propietario</h1>
          <p className="text-muted-foreground text-sm mt-1">Crea tu cuenta gratuita</p>
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                {...register('password')}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirmar contraseña *</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                {...register('confirm_password')}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-sm" style={{ color: '#B85C1A' }}>{errors.confirm_password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(212,169,106,0.25)',
                  background: '#F5F0E8',
                  fontFamily: 'var(--font-sans,"DM Sans",system-ui,sans-serif)',
                  fontSize: '15px',
                  color: '#1C1410',
                  width: '140px',
                  flexShrink: 0,
                }}
              >
                <option value="+503">🇸🇻 +503</option>
                <option value="+502">🇬🇹 +502</option>
                <option value="+504">🇭🇳 +504</option>
                <option value="+505">🇳🇮 +505</option>
                <option value="+506">🇨🇷 +506</option>
                <option value="+507">🇵🇦 +507</option>
                <option value="+501">🇧🇿 +501</option>
                <option disabled>──────────</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+52">🇲🇽 +52</option>
              </select>
              <Input id="phone" type="tel" placeholder="7XXX-XXXX" style={{ flex: 1 }} {...register('phone')} />
            </div>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Fecha de nacimiento *</Label>
            <Input id="date_of_birth" type="date" max={new Date().toISOString().split('T')[0]} {...register('date_of_birth')} />
            {errors.date_of_birth && <p style={{ fontFamily: 'var(--font-sans,"DM Sans",system-ui,sans-serif)', fontSize: '13px', color: '#B85C1A' }}>{errors.date_of_birth.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Foto de perfil <span className="text-muted-foreground">(opcional)</span></Label>
            {avatarPreview && (
              <div className="flex justify-center">
                <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid #D4A96A' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarPreview} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setAvatar(file)
                setAvatarPreview(file ? URL.createObjectURL(file) : null)
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" placeholder="Calle, colonia, ciudad" {...register('address')} />
          </div>

          {/* Location cascade */}
          <div className="space-y-2">
            <Label>Departamento</Label>
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
              <Label>Municipio</Label>
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
              <Label>Distrito <span className="text-muted-foreground">(opcional)</span></Label>
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

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || !!errors.confirm_password}
          >
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
