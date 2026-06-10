'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle2, X, HardHat } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { createBrowserClient } from '@supabase/ssr'
import type { Department, Municipality, Category } from '@/types'

const STEPS = 6

const step1Schema = z.object({
  full_name:       z.string().min(2, 'Nombre requerido'),
  email:           z.string().email('Email inválido'),
  password:        z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
  phone:           z.string().min(8, 'Teléfono requerido'),
  date_of_birth:   z.string().min(1, 'Fecha requerida'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path:    ['confirmPassword'],
})

type Step1Data = z.infer<typeof step1Schema>

function mkClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default function RegistroProfesionalPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState('')
  const [svCountryId, setSvCountryId] = useState('')

  // Step 1 data
  const [avatar, setAvatar] = useState<File | null>(null)
  const [accountType, setAccountType] = useState<'independent' | 'company'>('independent')
  const step1Form = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })

  // Step 2 — coverage
  const [coversAll, setCoversAll] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [selectedDepts, setSelectedDepts] = useState<string[]>([])
  const [selectedMunis, setSelectedMunis] = useState<string[]>([])

  // Step 3 — services
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([])
  const [serviceTags, setServiceTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [bio, setBio] = useState('')

  const [phoneCountryCode, setPhoneCountryCode] = useState('+503')
  const [signUpError, setSignUpError] = useState<string | null>(null)

  // Step 4 — portfolio
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([])

  // Step 5 — documents
  const [duiFront, setDuiFront] = useState<File | null>(null)
  const [duiBack, setDuiBack] = useState<File | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = mkClient()
      const { data: country } = await supabase.from('countries').select('id').eq('url_prefix', process.env.NEXT_PUBLIC_DEFAULT_COUNTRY ?? 'sv').single()
      if (country) {
        setSvCountryId(country.id)
        const { data: depts } = await supabase.from('departments').select('*').eq('country_id', country.id).order('name')
        setDepartments(depts ?? [])
      }
      const { data: cats } = await supabase.from('categories').select('*, subcategories:categories(*)').is('parent_id', null).eq('active', true).order('order_index')
      setCategories(cats ?? [])
    }
    load()
  }, [])

  useEffect(() => {
    if (selectedDepts.length === 0) { setMunicipalities([]); return }
    const supabase = mkClient()
    supabase.from('municipalities').select('*').in('department_id', selectedDepts).order('name')
      .then(({ data }) => setMunicipalities(data ?? []))
  }, [selectedDepts])

  const handleStep1 = async (data: Step1Data) => {
    setSignUpError(null)
    if (new Date(data.date_of_birth) >= new Date()) {
      step1Form.setError('date_of_birth', { message: 'La fecha de nacimiento debe ser anterior a la fecha actual' })
      return
    }
    const supabase = mkClient()
    const { data: auth, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: 'professional',
          phone: `${phoneCountryCode}${data.phone}`,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
    if (error || !auth.user) {
      if (
        error?.message?.includes('already registered') ||
        error?.message?.includes('User already registered') ||
        (error?.message?.toLowerCase().includes('email') && (error as any)?.status === 400)
      ) {
        setSignUpError('Este correo ya está registrado. ¿Quieres iniciar sesión?')
      } else if ((error as any)?.status === 429 || error?.message?.includes('rate')) {
        setSignUpError('Demasiados intentos. Por favor espera unos minutos.')
      } else {
        setSignUpError(error?.message ?? 'Error al crear cuenta')
      }
      return
    }
    // Supabase devuelve user con identities vacío cuando el email ya existe (modo con confirmación)
    if ((auth.user.identities?.length ?? 0) === 0) {
      setSignUpError('Este correo ya está registrado. ¿Quieres iniciar sesión?')
      return
    }
    setUserId(auth.user.id)

    // Email confirmation required — no active session yet
    if (!auth.session) {
      localStorage.setItem('pending_profile', JSON.stringify({
        phone:              data.phone,
        phone_country_code: phoneCountryCode,
        date_of_birth:      data.date_of_birth,
        country_id:         svCountryId || null,
      }))
      localStorage.setItem('pending_professional', JSON.stringify({
        account_type:          accountType,
        covers_entire_country: false,
        featured:              false,
        total_projects:        0,
        whatsapp:              phoneCountryCode + data.phone,
      }))
      toast.success('¡Cuenta creada! Revisa tu correo para confirmarla.')
      router.push('/registro/confirmar-email')
      return
    }

    // Session available — proceed with immediate writes
    let photo_url = null
    if (avatar) {
      const ext = avatar.name.split('.').pop()
      const path = `${auth.user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatar)
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
        photo_url = publicUrl
      }
    }

    await supabase.from('profiles').insert({
      id: auth.user.id,
      country_id: svCountryId,
      role: 'professional',
      full_name: data.full_name,
      photo_url,
      phone: data.phone,
      phone_country_code: phoneCountryCode,
      date_of_birth: data.date_of_birth,
    })

    await supabase.from('professionals').insert({
      id: auth.user.id,
      account_type: accountType,
      covers_entire_country: false,
      featured: false,
      total_projects: 0,
      whatsapp: phoneCountryCode + data.phone,
    })

    setStep(2)
  }

  const handleStep2 = async () => {
    const supabase = mkClient()
    await supabase.from('professionals').update({ covers_entire_country: coversAll }).eq('id', userId)
    if (!coversAll) {
      const coverageRows = selectedDepts.map((dept_id) => ({
        professional_id: userId,
        department_id: dept_id,
        municipality_id: null,
        district_id: null,
      }))
      if (coverageRows.length) await supabase.from('professional_coverage').insert(coverageRows)
    }
    setStep(3)
  }

  const handleStep3 = async () => {
    const supabase = mkClient()
    await supabase.from('professionals').update({
      short_description: shortDesc,
      bio,
    }).eq('id', userId)

    const catRows = selectedCatIds.slice(0, 3).map((cat_id) => ({
      professional_id: userId,
      category_id: cat_id,
    }))
    if (catRows.length) await supabase.from('professional_categories').insert(catRows)

    const tagRows = serviceTags.map((tag) => ({ professional_id: userId, service_tag: tag }))
    if (tagRows.length) await supabase.from('professional_services').insert(tagRows)

    setStep(4)
  }

  const handleStep4 = async () => {
    const supabase = mkClient()
    for (const file of portfolioFiles.slice(0, 25)) {
      const ext = file.name.split('.').pop()
      const path = `${userId}/${Date.now()}_${Math.random()}.${ext}`
      const { data: up } = await supabase.storage.from('portfolio').upload(path, file)
      if (up) {
        const { data: url } = supabase.storage.from('portfolio').getPublicUrl(path)
        await supabase.from('portfolio_photos').insert({
          professional_id: userId,
          photo_url: url.publicUrl,
          order_index: portfolioFiles.indexOf(file),
        })
      }
    }
    setStep(5)
  }

  const handleStep5 = async () => {
    const supabase = mkClient()
    if (!duiFront || !duiBack) { toast.error('Ambas fotos del DUI son requeridas'); return }

    const upload = async (file: File, side: string) => {
      const ext = file.name.split('.').pop()
      const path = `${userId}/dui_${side}.${ext}`
      const { data: up } = await supabase.storage.from('documents').upload(path, file)
      return up?.path ?? null
    }

    const frontPath = await upload(duiFront, 'front')
    const backPath = await upload(duiBack, 'back')

    await supabase.from('professionals').update({
      dui_front_url: frontPath,
      dui_back_url: backPath,
    }).eq('id', userId)

    setStep(6)
  }

  const progress = Math.round(((step - 1) / (STEPS - 1)) * 100)

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link href="/" style={{ color: '#2C2C2C' }}><Logo size="lg" /></Link>
          <h1 className="mt-2 text-xl font-semibold">Registro de Profesional Independiente</h1>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Paso {step} de {STEPS}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step 1 — Personal data */}
        {step === 1 && (
          <form onSubmit={step1Form.handleSubmit(handleStep1)} className="space-y-4">
            <h2 className="font-semibold text-lg">Paso 1 — Datos personales</h2>
            <div className="space-y-2">
              <Label>Nombre completo *</Label>
              <Input placeholder="Juan Pérez" {...step1Form.register('full_name')} />
              {step1Form.formState.errors.full_name && <p className="text-sm text-destructive">{step1Form.formState.errors.full_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Correo electrónico *</Label>
              <Input type="email" placeholder="tu@correo.com" {...step1Form.register('email')} />
              {step1Form.formState.errors.email && <p className="text-sm text-destructive">{step1Form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Contraseña *</Label>
              <Input type="password" placeholder="Mínimo 8 caracteres" autoComplete="new-password" {...step1Form.register('password')} />
              {step1Form.formState.errors.password && <p className="text-sm text-destructive">{step1Form.formState.errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Confirmar contraseña *</Label>
              <Input type="password" placeholder="Repite tu contraseña" autoComplete="new-password" {...step1Form.register('confirmPassword')} />
              {step1Form.formState.errors.confirmPassword && <p className="text-sm text-destructive">{step1Form.formState.errors.confirmPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Foto de perfil *</Label>
              <Input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} />
            </div>
            <div className="space-y-2">
              <Label>Teléfono *</Label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(212,150,58,0.25)',
                    background: '#F2F0ED',
                    fontFamily: 'var(--font-sans,"DM Sans",system-ui,sans-serif)',
                    fontSize: '15px',
                    color: '#2C2C2C',
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
                <Input type="tel" placeholder="7XXX-XXXX" style={{ flex: 1 }} {...step1Form.register('phone')} />
              </div>
              {step1Form.formState.errors.phone && <p className="text-sm text-destructive">{step1Form.formState.errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Fecha de nacimiento *</Label>
              <Input type="date" max={new Date().toISOString().split('T')[0]} {...step1Form.register('date_of_birth')} />
              {step1Form.formState.errors.date_of_birth && <p style={{ fontFamily: 'var(--font-sans,"DM Sans",system-ui,sans-serif)', fontSize: '13px', color: '#C4581A' }}>{step1Form.formState.errors.date_of_birth.message}</p>}
            </div>

            {/* Account type — fixed as independent */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Label>Tipo de cuenta</Label>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#C4581A12',
                  color: '#C4581A',
                  border: '1.5px solid #C4581A40',
                  borderRadius: '8px',
                  padding: '12px 18px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans,"DM Sans",system-ui,sans-serif)',
                  lineHeight: 1,
                }}
              >
                <HardHat style={{ width: 18, height: 18, flexShrink: 0 }} />
                Profesional Independiente
              </div>
              <p style={{ fontSize: '13px', color: '#7A7A78', margin: 0, fontFamily: 'var(--font-sans,"DM Sans",system-ui,sans-serif)' }}>
                ¿Eres una empresa?{' '}
                <Link href="/registro/empresa" style={{ color: '#7A7A78', textDecoration: 'underline' }}>
                  Regístrate aquí →
                </Link>
              </p>
            </div>

            {signUpError && (
              <div style={{ background: '#C4581A10', border: '1px solid #C4581A40', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#C4581A' }}>
                {signUpError}
                {signUpError.includes('ya está registrado') && (
                  <p style={{ marginTop: '6px', fontSize: '14px', color: '#7A7A78' }}>
                    <Link href="/login" style={{ color: '#C4581A', fontWeight: 600, textDecoration: 'none' }}>
                      Ir a iniciar sesión →
                    </Link>
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={step1Form.formState.isSubmitting}>
              {step1Form.formState.isSubmitting ? 'Creando cuenta...' : 'Continuar'}
            </Button>
          </form>
        )}

        {/* Step 2 — Coverage */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Paso 2 — Zona de cobertura</h2>
            <div className="flex items-center gap-2">
              <Checkbox id="coversAll" checked={coversAll} onCheckedChange={(v) => setCoversAll(!!v)} />
              <Label htmlFor="coversAll">Trabajo en todo el país</Label>
            </div>
            {!coversAll && (
              <div className="space-y-2">
                <Label>Departamentos donde trabajas</Label>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map((d) => (
                    <div key={d.id} className="flex items-center gap-2">
                      <Checkbox
                        id={d.id}
                        checked={selectedDepts.includes(d.id)}
                        onCheckedChange={(v) =>
                          setSelectedDepts((prev) => v ? [...prev, d.id] : prev.filter((x) => x !== d.id))
                        }
                      />
                      <Label htmlFor={d.id} className="text-sm">{d.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={handleStep2} className="w-full">Continuar</Button>
          </div>
        )}

        {/* Step 3 — Services */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Paso 3 — Servicios y descripción</h2>

            <div className="space-y-2">
              <Label>Categorías (máx. 3)</Label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <Checkbox
                      id={cat.id}
                      checked={selectedCatIds.includes(cat.id)}
                      disabled={!selectedCatIds.includes(cat.id) && selectedCatIds.length >= 3}
                      onCheckedChange={(v) =>
                        setSelectedCatIds((prev) => v ? [...prev, cat.id] : prev.filter((x) => x !== cat.id))
                      }
                    />
                    <Label htmlFor={cat.id}>{cat.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags de servicios</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Ej: Impermeabilización"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault()
                      setServiceTags((prev) => [...prev, tagInput.trim()])
                      setTagInput('')
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => { if (tagInput.trim()) { setServiceTags((prev) => [...prev, tagInput.trim()]); setTagInput('') } }}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {serviceTags.map((t, i) => (
                  <Badge key={i} className="gap-1">
                    {t}
                    <button onClick={() => setServiceTags((prev) => prev.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción corta *</Label>
              <Textarea rows={2} placeholder="Breve descripción para tu tarjeta (2–3 líneas)" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Bio completa *</Label>
              <Textarea rows={4} placeholder="Cuéntanos tu experiencia y especialidades" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <Button onClick={handleStep3} className="w-full">Continuar</Button>
          </div>
        )}

        {/* Step 4 — Portfolio */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Paso 4 — Portafolio</h2>
            <div className="space-y-2">
              <Label>Fotos de trabajos (máx. 25)</Label>
              <Input type="file" accept="image/*" multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? [])
                  if (portfolioFiles.length + files.length > 25) { toast.error('Máximo 25 fotos'); return }
                  setPortfolioFiles((prev) => [...prev, ...files])
                }}
              />
              <p className="text-sm text-muted-foreground">{portfolioFiles.length} foto(s) seleccionada(s)</p>
            </div>
            <Button onClick={handleStep4} className="w-full">
              {portfolioFiles.length > 0 ? 'Subir y continuar' : 'Continuar sin fotos'}
            </Button>
          </div>
        )}

        {/* Step 5 — Documents */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Paso 5 — Documentos</h2>
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm text-muted-foreground">
              🔒 Tus documentos solo son vistos por el equipo de Artifex7 para verificar tu identidad. No son públicos.
            </div>
            <div className="space-y-2">
              <Label>DUI — Cara frontal *</Label>
              <Input type="file" accept="image/*" onChange={(e) => setDuiFront(e.target.files?.[0] ?? null)} />
            </div>
            <div className="space-y-2">
              <Label>DUI — Cara posterior *</Label>
              <Input type="file" accept="image/*" onChange={(e) => setDuiBack(e.target.files?.[0] ?? null)} />
            </div>
            <Button onClick={handleStep5} className="w-full" disabled={!duiFront || !duiBack}>
              Enviar registro
            </Button>
          </div>
        )}

        {/* Step 6 — Confirmation */}
        {step === 6 && (
          <div className="text-center space-y-6">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">¡Registro enviado con éxito!</h2>
            <div className="rounded-lg bg-muted p-6 text-left space-y-2">
              <p className="font-semibold mb-3">¿Qué sigue después de enviar tu registro?</p>
              <p className="text-sm">✅ Revisaremos tu solicitud en 24–48 horas</p>
              <p className="text-sm">✅ Te contactaremos para una entrevista breve</p>
              <p className="text-sm">✅ Validaremos tus documentos para verificar tu información</p>
              <p className="text-sm">✅ Comenzarás a recibir solicitudes de trabajo</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/registro/confirmar-email">Revisar mi correo</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
