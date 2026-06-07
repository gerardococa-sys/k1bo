'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createBrowserClient } from '@supabase/ssr'
import type { Department, Municipality, District } from '@/types'

const FONT_SANS = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'
const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'

const profileSchema = z.object({
  full_name:     z.string().min(2, 'Nombre requerido'),
  phone:         z.string().min(8, 'Teléfono requerido'),
  date_of_birth: z.string().min(1, 'Fecha requerida'),
  address:       z.string().optional(),
})

type ProfileData = z.infer<typeof profileSchema>

function mkClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default function ClientProfilePage() {
  const router = useRouter()
  const params = useParams<{ country: string }>()
  const [loading, setLoading]         = useState(true)
  const [userId, setUserId]           = useState('')
  const [email, setEmail]             = useState('')
  const [avatar, setAvatar]           = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [phoneCountryCode, setPhoneCountryCode] = useState('+503')

  const [departments, setDepartments]   = useState<Department[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [districts, setDistricts]       = useState<District[]>([])
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedMuni, setSelectedMuni] = useState('')
  const [selectedDist, setSelectedDist] = useState('')

  const [currentPwd, setCurrentPwd]     = useState('')
  const [newPwd, setNewPwd]             = useState('')
  const [confirmPwd, setConfirmPwd]     = useState('')
  const [showCurrent, setShowCurrent]   = useState(false)
  const [showNew, setShowNew]           = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [pwdMismatch, setPwdMismatch]   = useState(false)
  const [pwdSaving, setPwdSaving]       = useState(false)
  const [pwdSuccess, setPwdSuccess]     = useState(false)

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const load = async () => {
      const supabase = mkClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      setEmail(user.email ?? '')

      const [{ data: profile }, { data: depts }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('departments').select('*').order('name'),
      ])
      setDepartments(depts ?? [])

      if (profile) {
        reset({
          full_name:     profile.full_name ?? '',
          phone:         profile.phone ?? '',
          date_of_birth: profile.date_of_birth ?? '',
          address:       profile.address ?? '',
        })
        setPhoneCountryCode(profile.phone_country_code ?? '+503')
        if (profile.photo_url) setAvatarPreview(profile.photo_url)

        if (profile.department_id) {
          setSelectedDept(profile.department_id)
          const { data: munis } = await supabase
            .from('municipalities').select('*').eq('department_id', profile.department_id).order('name')
          setMunicipalities(munis ?? [])
          if (profile.municipality_id) {
            setSelectedMuni(profile.municipality_id)
            const { data: dists } = await supabase
              .from('districts').select('*').eq('municipality_id', profile.municipality_id).order('name')
            setDistricts(dists ?? [])
            if (profile.district_id) setSelectedDist(profile.district_id)
          }
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedDept) return
    const supabase = mkClient()
    supabase.from('municipalities').select('*').eq('department_id', selectedDept).order('name')
      .then(({ data }) => setMunicipalities(data ?? []))
    setSelectedMuni('')
    setSelectedDist('')
    setDistricts([])
  }, [selectedDept])

  useEffect(() => {
    if (!selectedMuni) return
    const supabase = mkClient()
    supabase.from('districts').select('*').eq('municipality_id', selectedMuni).order('name')
      .then(({ data }) => setDistricts(data ?? []))
    setSelectedDist('')
  }, [selectedMuni])

  const onSubmit = async (data: ProfileData) => {
    if (new Date(data.date_of_birth) >= new Date()) {
      setError('date_of_birth', { message: 'La fecha de nacimiento debe ser anterior a la fecha actual' })
      return
    }
    const supabase = mkClient()
    let photo_url: string | undefined

    if (avatar) {
      const ext = avatar.name.split('.').pop()
      const path = `${userId}/avatar.${ext}`
      await supabase.storage.from('avatars').upload(path, avatar, { upsert: true })
      const { data: url } = supabase.storage.from('avatars').getPublicUrl(path)
      photo_url = url.publicUrl
    }

    const { error } = await supabase.from('profiles').update({
      full_name:          data.full_name,
      phone:              data.phone,
      phone_country_code: phoneCountryCode,
      date_of_birth:      data.date_of_birth,
      address:            data.address ?? null,
      department_id:      selectedDept  || null,
      municipality_id:    selectedMuni  || null,
      district_id:        selectedDist  || null,
      ...(photo_url ? { photo_url } : {}),
    }).eq('id', userId)

    if (error) { toast.error('Error al guardar el perfil'); return }
    toast.success('Perfil actualizado correctamente')
    router.refresh()
  }

  const handlePasswordUpdate = async () => {
    if (newPwd !== confirmPwd) { setPwdMismatch(true); return }
    setPwdMismatch(false)
    if (newPwd.length < 8) return
    setPwdSaving(true)
    const supabase = mkClient()
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    setPwdSaving(false)
    if (error) { toast.error(error.message); return }
    setPwdSuccess(true)
    setCurrentPwd('')
    setNewPwd('')
    setConfirmPwd('')
    setTimeout(() => setPwdSuccess(false), 3000)
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando...</div>

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <Link
        href={`/${params?.country ?? 'sv'}/cliente/dashboard`}
        style={{
          fontFamily: FONT_SANS, fontSize: '15px', color: '#B85C1A', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px',
        }}
        className="perfil-back-link"
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver al Dashboard
      </Link>
      <style>{`.perfil-back-link:hover { text-decoration: underline; }`}</style>
      <h1 style={{ fontFamily: FONT_SERIF, fontSize: '28px', fontWeight: 700, color: '#1C1410', marginBottom: '8px' }}>
        Mi Perfil
      </h1>
      <p style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#6B7B6E', marginBottom: '32px' }}>
        Administra tu información personal y de ubicación
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Información personal */}
        <section style={{ backgroundColor: '#fff', border: '1px solid #1C141015', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 600, color: '#1C1410', marginBottom: '20px' }}>
            Información personal
          </h2>

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
            {avatarPreview ? (
              <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', border: '3px solid #D4A96A' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarPreview} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ width: 88, height: 88, borderRadius: '50%', backgroundColor: '#B85C1A12', border: '3px solid #D4A96A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: FONT_SERIF, fontSize: '32px', color: '#B85C1A', fontWeight: 700 }}>
                  {/* initials placeholder */}
                </span>
              </div>
            )}
            <Label style={{ fontFamily: FONT_SANS, fontSize: '14px', cursor: 'pointer', color: '#B85C1A', fontWeight: 600 }}>
              Cambiar foto
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setAvatar(file)
                  setAvatarPreview(file ? URL.createObjectURL(file) : avatarPreview)
                }}
              />
            </Label>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo *</Label>
              <Input id="full_name" {...register('full_name')} />
              {errors.full_name && <p className="text-sm text-destructive">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <Input value={email} disabled className="bg-muted" />
              <p style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#6B7B6E' }}>El correo no puede modificarse desde aquí.</p>
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
          </div>
        </section>

        {/* Ubicación */}
        <section style={{ backgroundColor: '#fff', border: '1px solid #1C141015', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 600, color: '#1C1410', marginBottom: '20px' }}>
            Ubicación
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" placeholder="Calle, colonia, ciudad" {...register('address')} />
            </div>

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
          </div>
        </section>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
          style={{ backgroundColor: '#1C1410', color: '#D4A96A', fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700, borderRadius: '8px' }}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>

      {/* Cambiar contraseña */}
      <section style={{ backgroundColor: '#fff', border: '1px solid #1C141015', borderRadius: '12px', padding: '24px', marginTop: '20px' }}>
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 600, color: '#1C1410', marginBottom: '20px' }}>
          Cambiar contraseña
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_pwd">Contraseña actual</Label>
            <div className="relative">
              <Input
                id="current_pwd"
                type={showCurrent ? 'text' : 'password'}
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="Tu contraseña actual"
                className="pr-10"
              />
              <button type="button" tabIndex={-1}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                onClick={() => setShowCurrent((v) => !v)}>
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_pwd">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="new_pwd"
                type={showNew ? 'text' : 'password'}
                value={newPwd}
                onChange={(e) => { setNewPwd(e.target.value); setPwdMismatch(false) }}
                placeholder="Mínimo 8 caracteres"
                className="pr-10"
              />
              <button type="button" tabIndex={-1}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                onClick={() => setShowNew((v) => !v)}>
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_pwd">Confirmar nueva contraseña</Label>
            <div className="relative">
              <Input
                id="confirm_pwd"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPwd}
                onChange={(e) => { setConfirmPwd(e.target.value); setPwdMismatch(false) }}
                placeholder="Repite la nueva contraseña"
                className="pr-10"
              />
              <button type="button" tabIndex={-1}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirm((v) => !v)}>
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {pwdMismatch && (
              <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#B85C1A' }}>Las contraseñas no coinciden</p>
            )}
            {pwdSuccess && (
              <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>Contraseña actualizada</p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={pwdSaving || !newPwd || !confirmPwd}
            onClick={handlePasswordUpdate}
            style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 600 }}
          >
            {pwdSaving ? 'Actualizando...' : 'Actualizar contraseña'}
          </Button>
        </div>
      </section>
    </div>
  )
}
