'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle2, X, Building2 } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createBrowserClient } from '@supabase/ssr'
import type { Department, Municipality, District, Category } from '@/types'

const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'
const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'
const STEPS = 7

const step1Schema = z.object({
  company_name:    z.string().min(2, 'Nombre de empresa requerido'),
  email:           z.string().email('Email inválido'),
  password:        z.string().min(8, 'Mínimo 8 caracteres'),
  confirm_password:z.string().min(1, 'Confirmar contraseña requerida'),
  phone:           z.string().min(8, 'Teléfono requerido'),
  rep_name:        z.string().min(2, 'Nombre del representante requerido'),
  nrc:             z.string().min(1, 'NRC / Registro fiscal requerido'),
  years_market:    z.string().optional(),
}).refine(d => d.password === d.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
})

type Step1Data = z.infer<typeof step1Schema>

const PHONE_CODES = [
  { code: '+503', label: '🇸🇻 +503' },
  { code: '+502', label: '🇬🇹 +502' },
  { code: '+504', label: '🇭🇳 +504' },
  { code: '+506', label: '🇨🇷 +506' },
  { code: '+507', label: '🇵🇦 +507' },
  { code: '+1',   label: '🇺🇸 +1'   },
  { code: '+52',  label: '🇲🇽 +52'  },
]

const phoneSelectStyle: React.CSSProperties = {
  padding: '10px 12px', borderRadius: '8px',
  border: '1px solid rgba(212,150,58,0.25)',
  background: '#F2F0ED',
  fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C',
  width: '140px', flexShrink: 0,
}

function mkClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export default function RegistroEmpresaPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState('')
  const [svCountryId, setSvCountryId] = useState('')

  // Step 1
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [phoneCode, setPhoneCode] = useState('+503')
  const [step1Error, setStep1Error] = useState<string | null>(null)
  const step1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })

  // Step 2 — location
  const [coversAll, setCoversAll] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedMuni, setSelectedMuni] = useState('')
  const [selectedDist, setSelectedDist] = useState('')
  const [address, setAddress] = useState('')

  // Step 3 — services
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [serviceTags, setServiceTags] = useState<string[]>([])
  const [shortDesc, setShortDesc] = useState('')
  const [bio, setBio] = useState('')

  // Step 4 — portfolio
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([])

  // Step 5 — documents
  const [duiFront, setDuiFront] = useState<File | null>(null)
  const [duiBack, setDuiBack] = useState<File | null>(null)
  const [nit, setNit] = useState<File | null>(null)
  const [escritura, setEscritura] = useState<File | null>(null)

  const progress = Math.round(((step - 1) / (STEPS - 1)) * 100)

  // ── Data load ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const supabase = mkClient()
      const { data: country } = await supabase
        .from('countries').select('id')
        .eq('url_prefix', process.env.NEXT_PUBLIC_DEFAULT_COUNTRY ?? 'sv').single()
      if (country) {
        setSvCountryId(country.id)
        const { data: depts } = await supabase
          .from('departments').select('*').eq('country_id', country.id).order('name')
        setDepartments(depts ?? [])
      }
      const { data: cats } = await supabase
        .from('categories').select('*, subcategories:categories(*)')
        .is('parent_id', null).eq('active', true).order('order_index')
      setCategories(cats ?? [])
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedDept) { setMunicipalities([]); setSelectedMuni(''); return }
    mkClient().from('municipalities').select('*').eq('department_id', selectedDept).order('name')
      .then(({ data }) => setMunicipalities(data ?? []))
    setSelectedMuni('')
    setSelectedDist('')
    setDistricts([])
  }, [selectedDept])

  useEffect(() => {
    if (!selectedMuni) { setDistricts([]); setSelectedDist(''); return }
    mkClient().from('districts').select('id, name, municipality_id').eq('municipality_id', selectedMuni).order('name')
      .then(({ data }) => setDistricts(data ?? []))
    setSelectedDist('')
  }, [selectedMuni])

  // ── Step handlers ──────────────────────────────────────────────────────────

  const handleStep1 = async (data: Step1Data) => {
    setStep1Error(null)
    const supabase = mkClient()
    const { data: auth, error } = await supabase.auth.signUp({ email: data.email, password: data.password })

    if (error || !auth.user) {
      if (
        (error as any)?.status === 429 ||
        error?.message?.includes('rate') ||
        error?.message?.includes('429')
      ) {
        setStep1Error('Demasiados intentos de registro. Por favor espera unos minutos e intenta de nuevo.')
      } else {
        setStep1Error(error?.message ?? 'Error al crear cuenta')
      }
      return
    }

    setUserId(auth.user.id)

    // Esperar 1 segundo para evitar rate limit en queries siguientes
    await new Promise(resolve => setTimeout(resolve, 1000))

    let photo_url = null
    if (logo) {
      const ext = logo.name.split('.').pop()
      const path = `${auth.user.id}/avatar.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, logo)
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
        photo_url = publicUrl
      }
    }

    const { error: profErr } = await supabase.from('profiles').insert({
      id:                 auth.user.id,
      country_id:         svCountryId || null,
      role:               'professional',
      account_status:     'review',
      full_name:          data.rep_name,
      photo_url,
      phone:              data.phone,
      phone_country_code: phoneCode,
    })

    if (profErr) { toast.error('Error al guardar perfil'); return }

    await supabase.from('professionals').insert({
      id:                    auth.user.id,
      account_type:          'company',
      company_name:          data.company_name,
      nrc:                   data.nrc,
      years_in_market:       data.years_market ? Number(data.years_market) : null,
      covers_entire_country: false,
      featured:              false,
      total_projects:        0,
      whatsapp:              phoneCode + data.phone,
    })

    setStep(2)
  }

  const handleStep2 = async () => {
    const supabase = mkClient()
    await supabase.from('professionals').update({
      covers_entire_country: coversAll,
      address: address || null,
    }).eq('id', userId)

    if (!coversAll && selectedDept) {
      await supabase.from('professional_coverage').insert({
        professional_id: userId,
        department_id:   selectedDept,
        municipality_id: selectedMuni || null,
        district_id:     selectedDist || null,
      })
    }
    setStep(3)
  }

  const handleStep3 = async () => {
    const supabase = mkClient()
    await supabase.from('professionals').update({ short_description: shortDesc, bio }).eq('id', userId)

    const catRows = selectedCatIds.slice(0, 5).map(cat_id => ({ professional_id: userId, category_id: cat_id }))
    if (catRows.length) await supabase.from('professional_categories').insert(catRows)

    const tagRows = serviceTags.map(tag => ({ professional_id: userId, service_tag: tag }))
    if (tagRows.length) await supabase.from('professional_services').insert(tagRows)

    setStep(4)
  }

  const handleStep4 = async () => {
    const supabase = mkClient()
    for (const file of portfolioFiles.slice(0, 50)) {
      const ext = file.name.split('.').pop()
      const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { data: up } = await supabase.storage.from('portfolio').upload(path, file)
      if (up) {
        const { data: url } = supabase.storage.from('portfolio').getPublicUrl(path)
        await supabase.from('portfolio_photos').insert({
          professional_id: userId, photo_url: url.publicUrl,
          order_index: portfolioFiles.indexOf(file),
        })
      }
    }
    setStep(5)
  }

  const handleStep5 = async () => {
    if (!duiFront || !duiBack) { toast.error('Las fotos del DUI son requeridas'); return }
    const supabase = mkClient()

    const upload = async (file: File, name: string) => {
      const ext = file.name.split('.').pop()
      const path = `${userId}/${name}.${ext}`
      const { data: up } = await supabase.storage.from('documents').upload(path, file)
      return up?.path ?? null
    }

    const [frontPath, backPath, nitPath, escritPath] = await Promise.all([
      upload(duiFront, 'dui_front'),
      upload(duiBack, 'dui_back'),
      nit        ? upload(nit,       'nit')      : Promise.resolve(null),
      escritura  ? upload(escritura, 'escritura'): Promise.resolve(null),
    ])

    await supabase.from('professionals').update({
      dui_front_url:   frontPath,
      dui_back_url:    backPath,
      nit_url:         nitPath,
      escritura_url:   escritPath,
    }).eq('id', userId)

    setStep(6)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" style={{ color: '#2C2C2C' }}><Logo size="lg" /></Link>
          <h1 className="mt-2 text-xl font-semibold">Registro de Empresa</h1>
          <p className="text-muted-foreground text-sm mt-1">Plan Empresa — Perfil destacado permanente</p>
        </div>

        {/* Progress */}
        {step < 7 && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Paso {step} de {STEPS}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* ── PASO 1 — Datos de la empresa ── */}
        {step === 1 && (
          <form onSubmit={step1.handleSubmit(handleStep1)} className="space-y-4">
            <h2 className="font-semibold text-lg">Paso 1 — Datos de la empresa</h2>

            <div className="space-y-2">
              <Label>Nombre de la empresa *</Label>
              <Input placeholder="Constructora Ejemplo S.A. de C.V." {...step1.register('company_name')} />
              {step1.formState.errors.company_name && <p className="text-sm text-destructive">{step1.formState.errors.company_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Logo de la empresa <span className="text-muted-foreground">(opcional)</span></Label>
              {logoPreview && (
                <div className="flex justify-center">
                  <div style={{ width: 80, height: 80, borderRadius: '12px', overflow: 'hidden', border: '2px solid #D4963A' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}
              <Input type="file" accept="image/*" onChange={e => {
                const f = e.target.files?.[0] ?? null
                setLogo(f)
                setLogoPreview(f ? URL.createObjectURL(f) : null)
              }} />
            </div>

            <div className="space-y-2">
              <Label>Email corporativo *</Label>
              <Input type="email" placeholder="contacto@empresa.com" {...step1.register('email')} />
              {step1.formState.errors.email && <p className="text-sm text-destructive">{step1.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Contraseña *</Label>
              <Input type="password" placeholder="Mínimo 8 caracteres" {...step1.register('password')} />
              {step1.formState.errors.password && <p className="text-sm text-destructive">{step1.formState.errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Confirmar contraseña *</Label>
              <Input type="password" placeholder="Repite la contraseña" {...step1.register('confirm_password')} />
              {step1.formState.errors.confirm_password && <p className="text-sm" style={{ color: '#C4581A' }}>{step1.formState.errors.confirm_password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Teléfono *</Label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)} style={phoneSelectStyle}>
                  {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                </select>
                <Input type="tel" placeholder="7XXX-XXXX" style={{ flex: 1 }} {...step1.register('phone')} />
              </div>
              {step1.formState.errors.phone && <p className="text-sm text-destructive">{step1.formState.errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Nombre del representante legal *</Label>
              <Input placeholder="María López" {...step1.register('rep_name')} />
              {step1.formState.errors.rep_name && <p className="text-sm text-destructive">{step1.formState.errors.rep_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>NRC / Registro fiscal *</Label>
              <Input placeholder="12345-6" {...step1.register('nrc')} />
              {step1.formState.errors.nrc && <p className="text-sm text-destructive">{step1.formState.errors.nrc.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Años en el mercado <span className="text-muted-foreground">(opcional)</span></Label>
              <Input type="number" min="0" max="200" placeholder="Ej. 10" {...step1.register('years_market')} />
            </div>

            {step1Error && (
              <div style={{
                background: '#C4581A10',
                border: '1px solid #C4581A40',
                borderRadius: '8px',
                padding: '12px 16px',
                fontFamily: FONT_SANS,
                fontSize: '14px',
                color: '#C4581A',
              }}>
                {step1Error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={step1.formState.isSubmitting}>
              {step1.formState.isSubmitting ? 'Guardando...' : 'Continuar →'}
            </Button>
          </form>
        )}

        {/* ── PASO 2 — Ubicación y cobertura ── */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Paso 2 — Ubicación y cobertura</h2>

            <div className="space-y-2">
              <Label>País</Label>
              <Input value="El Salvador" disabled style={{ background: '#F2F0ED', color: '#7A7A78' }} />
            </div>

            <div className="space-y-2">
              <Label>¿Cubre todo el país?</Label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[{ val: true, label: 'Sí' }, { val: false, label: 'No' }].map(opt => (
                  <button
                    key={String(opt.val)}
                    type="button"
                    onClick={() => setCoversAll(opt.val)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px',
                      border: `1.5px solid ${coversAll === opt.val ? '#C4581A' : 'rgba(212,150,58,0.25)'}`,
                      background: coversAll === opt.val ? '#C4581A12' : 'transparent',
                      color: coversAll === opt.val ? '#C4581A' : '#2C2C2C',
                      fontFamily: FONT_SANS, fontSize: '15px', fontWeight: coversAll === opt.val ? 700 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {!coversAll && (
              <>
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Select value={selectedDept} onValueChange={setSelectedDept}>
                    <SelectTrigger><SelectValue placeholder="Selecciona departamento" /></SelectTrigger>
                    <SelectContent>
                      {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {municipalities.length > 0 && (
                  <div className="space-y-2">
                    <Label>Municipio <span className="text-muted-foreground">(opcional)</span></Label>
                    <Select value={selectedMuni} onValueChange={setSelectedMuni}>
                      <SelectTrigger><SelectValue placeholder="Selecciona municipio" /></SelectTrigger>
                      <SelectContent>
                        {municipalities.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
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
                        {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label>Dirección de la empresa <span className="text-muted-foreground">(opcional)</span></Label>
              <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Calle, colonia, municipio" />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>← Atrás</Button>
              <Button className="flex-1" onClick={handleStep2}>Continuar →</Button>
            </div>
          </div>
        )}

        {/* ── PASO 3 — Servicios ── */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Paso 3 — Servicios</h2>

            <div className="space-y-2">
              <Label>Categorías <span className="text-muted-foreground">(máx. 5)</span></Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto', padding: '4px' }}>
                {categories.map((cat: any) => (
                  <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${selectedCatIds.includes(cat.id) ? '#C4581A' : 'rgba(212,150,58,0.2)'}`, background: selectedCatIds.includes(cat.id) ? '#C4581A08' : 'transparent' }}>
                    <input
                      type="checkbox"
                      checked={selectedCatIds.includes(cat.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          if (selectedCatIds.length < 5) setSelectedCatIds(prev => [...prev, cat.id])
                          else toast.error('Máximo 5 categorías')
                        } else {
                          setSelectedCatIds(prev => prev.filter(id => id !== cat.id))
                        }
                      }}
                      style={{ accentColor: '#C4581A', width: 16, height: 16 }}
                    />
                    <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C' }}>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags de servicios <span className="text-muted-foreground">(presiona Enter para agregar)</span></Label>
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault()
                    setServiceTags(prev => [...prev, tagInput.trim()])
                    setTagInput('')
                  }
                }}
                placeholder="Ej. instalación eléctrica, plomería..."
              />
              {serviceTags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {serviceTags.map(tag => (
                    <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#C4581A12', color: '#C4581A', fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', border: '1px solid #C4581A30' }}>
                      {tag}
                      <button type="button" onClick={() => setServiceTags(prev => prev.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#C4581A', lineHeight: 1 }}>
                        <X style={{ width: 12, height: 12 }} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Descripción breve *</Label>
              <Textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={3} placeholder="Describe los servicios principales de la empresa (hasta 180 caracteres)" maxLength={180} />
            </div>

            <div className="space-y-2">
              <Label>Bio extendida <span className="text-muted-foreground">(opcional)</span></Label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={5} placeholder="Historia de la empresa, metodología, valores, proyectos destacados..." />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>← Atrás</Button>
              <Button className="flex-1" onClick={handleStep3} disabled={!shortDesc.trim()}>Continuar →</Button>
            </div>
          </div>
        )}

        {/* ── PASO 4 — Portafolio ── */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Paso 4 — Portafolio</h2>

            <div className="space-y-2">
              <Label>Fotos de proyectos <span className="text-muted-foreground">(máx. 50)</span></Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={e => {
                  const files = Array.from(e.target.files ?? [])
                  setPortfolioFiles(prev => [...prev, ...files].slice(0, 50))
                }}
              />
              {portfolioFiles.length > 0 && (
                <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>
                  {portfolioFiles.length} foto{portfolioFiles.length !== 1 ? 's' : ''} seleccionada{portfolioFiles.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>← Atrás</Button>
              <Button className="flex-1" onClick={handleStep4}>
                {portfolioFiles.length > 0 ? 'Subir fotos y continuar →' : 'Continuar sin fotos →'}
              </Button>
            </div>
          </div>
        )}

        {/* ── PASO 5 — Documentos ── */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Paso 5 — Documentos legales</h2>

            <div style={{ background: '#D4963A12', border: '1px solid #D4963A40', borderRadius: '8px', padding: '12px 16px' }}>
              <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', margin: 0, lineHeight: 1.6 }}>
                Los documentos son confidenciales y solo serán revisados por el equipo de ARTIFEX7 para verificar tu empresa.
              </p>
            </div>

            <div className="space-y-2">
              <Label>DUI del representante — frente *</Label>
              <Input type="file" accept="image/*,application/pdf" onChange={e => setDuiFront(e.target.files?.[0] ?? null)} />
              {duiFront && <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>✓ {duiFront.name}</p>}
            </div>

            <div className="space-y-2">
              <Label>DUI del representante — reverso *</Label>
              <Input type="file" accept="image/*,application/pdf" onChange={e => setDuiBack(e.target.files?.[0] ?? null)} />
              {duiBack && <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>✓ {duiBack.name}</p>}
            </div>

            <div className="space-y-2">
              <Label>NIT de la empresa <span className="text-muted-foreground">(opcional)</span></Label>
              <Input type="file" accept="image/*,application/pdf" onChange={e => setNit(e.target.files?.[0] ?? null)} />
              {nit && <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>✓ {nit.name}</p>}
            </div>

            <div className="space-y-2">
              <Label>Escritura de constitución <span className="text-muted-foreground">(opcional)</span></Label>
              <Input type="file" accept="image/*,application/pdf" onChange={e => setEscritura(e.target.files?.[0] ?? null)} />
              {escritura && <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>✓ {escritura.name}</p>}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" className="flex-1" onClick={() => setStep(4)}>← Atrás</Button>
              <Button className="flex-1" onClick={handleStep5} disabled={!duiFront || !duiBack}>Continuar →</Button>
            </div>
          </div>
        )}

        {/* ── PASO 6 — Suscripción ── */}
        {step === 6 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Paso 6 — Plan Empresa</h2>

            {/* Plan card */}
            <div style={{ background: '#1E1E1E', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <span style={{ background: '#C4581A', color: '#F2F0ED', fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Plan Empresa
                </span>
              </div>

              <p style={{ fontFamily: FONT_SERIF, fontSize: '32px', fontWeight: 700, color: '#D4963A', textAlign: 'center', margin: '0 0 20px' }}>
                $99 <span style={{ fontSize: '18px', fontWeight: 400 }}>/ año</span>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {[
                  'Perfil destacado permanente',
                  'Hasta 5 categorías',
                  '50 fotos en portafolio',
                  'Badge "Empresa Verificada"',
                  'Estadísticas de visitas',
                  'Posición prioritaria en búsquedas',
                ].map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 style={{ width: 18, height: 18, color: '#D4963A', flexShrink: 0 }} />
                    <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#F2F0ED' }}>{b}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#F2F0ED60', lineHeight: 1.65, textAlign: 'center', margin: 0 }}>
                El pago se coordinará con el equipo de ARTIFEX7 una vez revisada tu solicitud. Te contactaremos en un plazo de 24–48 horas.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" className="flex-1" onClick={() => setStep(5)}>← Atrás</Button>
              <button
                onClick={() => setStep(7)}
                style={{
                  flex: 1, background: '#C4581A', color: '#F2F0ED',
                  fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700,
                  padding: '14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                }}
              >
                Enviar solicitud de registro
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 7 — Confirmación ── */}
        {step === 7 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#C4581A12', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Building2 style={{ width: 40, height: 40, color: '#C4581A' }} />
            </div>

            <h2 style={{ fontFamily: FONT_SERIF, fontSize: '28px', fontWeight: 700, color: '#1E1E1E', marginBottom: '8px' }}>
              ¡Solicitud enviada!
            </h2>
            <p style={{ fontFamily: FONT_SANS, fontSize: '16px', color: '#7A7A78', marginBottom: '28px' }}>
              Gracias por registrar tu empresa en Artifex7.
            </p>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '0.5px solid #2C2C2C12', textAlign: 'left', marginBottom: '24px' }}>
              <p style={{ fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700, color: '#1E1E1E', marginBottom: '14px' }}>
                ¿Qué sigue después de enviar tu registro?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Revisaremos tu solicitud en 24–48 horas',
                  'Te contactaremos para verificar documentos',
                  'Coordinaremos el proceso de pago',
                  'Activaremos tu perfil como Empresa Verificada',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ background: '#C4581A', color: '#F2F0ED', fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 700, borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      {i + 1}
                    </span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/registro/confirmar-email"
              style={{ display: 'block', background: '#1E1E1E', color: '#D4963A', fontFamily: FONT_SANS, fontSize: '16px', fontWeight: 700, padding: '14px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center' }}
            >
              Revisar mi correo
            </Link>
          </div>
        )}

        {/* Link a profesional */}
        {step === 1 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Eres profesional independiente?{' '}
            <Link href="/registro/profesional" className="text-primary hover:underline font-medium">
              Regístrate aquí
            </Link>
          </p>
        )}

      </div>
    </div>
  )
}
