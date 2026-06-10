'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Plus, Trash2, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'
import { CategoriasPicker } from '@/components/profesional/CategoriasPicker'
import { getPhoneConfig, cleanPhone } from '@/lib/phone'
import { CoberturaEditor } from '@/components/profesional/CoberturaEditor'

const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'
const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'

const DOC_TYPES = [
  { value: 'dui',      label: 'DUI',                placeholder: '12345678-9' },
  { value: 'passport', label: 'Pasaporte',           placeholder: 'A1234567'   },
  { value: 'resident', label: 'Carnet de Residente', placeholder: 'Número de carnet' },
] as const

const profileSchema = z.object({
  full_name:         z.string().min(2),
  phone:             z.string().min(8),
  short_description: z.string().optional(),
  bio:               z.string().optional(),
  facebook_url:      z.string().optional(),
  instagram_url:     z.string().optional(),
  tiktok_url:        z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProProfilePage() {
  const supabase = createClient()
  const router   = useRouter()
  const params   = useParams<{ country: string }>()

  // ── Profile state ──────────────────────────────────────────────────────────
  const [userId,           setUserId]           = useState('')
  const [email,            setEmail]            = useState('')
  const [loading,          setLoading]          = useState(true)
  const [phoneCountryCode, setPhoneCountryCode] = useState('+503')
  const [avatarPreview,    setAvatarPreview]    = useState<string | null>(null)
  const [newPhotoFile,     setNewPhotoFile]     = useState<File | null>(null)

  // ── Portfolio state ────────────────────────────────────────────────────────
  const [portfolio,     setPortfolio]     = useState<any[]>([])
  const [selectedFile,  setSelectedFile]  = useState<File | null>(null)
  const [previewUrl,    setPreviewUrl]    = useState<string | null>(null)
  const [uploading,     setUploading]     = useState(false)
  const portfolioInputRef = useRef<HTMLInputElement>(null)

  // ── FAQ state ──────────────────────────────────────────────────────────────
  const [faq,         setFaq]         = useState<any[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer,   setNewAnswer]   = useState('')

  // ── Categorías state ───────────────────────────────────────────────────────
  const [misCatIds,       setMisCatIds]       = useState<string[]>([])
  const [todasCategorias, setTodasCategorias] = useState<{ id: string; name: string; parent_id: string | null }[]>([])

  // ── Cobertura state ────────────────────────────────────────────────────────
  type CoverageItem = {
    id?:               string
    department_id:     string
    department_name:   string
    municipality_id?:  string | null
    municipality_name?: string | null
    district_id?:      string | null
    district_name?:    string | null
  }
  const [coberturaActual,      setCoberturaActual]      = useState<CoverageItem[]>([])
  const [allDepartments,       setAllDepartments]       = useState<{ id: string; name: string }[]>([])
  const [coversEntireCountry,  setCoversEntireCountry]  = useState(false)

  // ── Documentos state ──────────────────────────────────────────────────────
  const [docType,         setDocType]         = useState<'dui' | 'passport' | 'resident' | ''>('')
  const [docNumber,       setDocNumber]       = useState('')
  const [docFrontFile,    setDocFrontFile]    = useState<File | null>(null)
  const [docBackFile,     setDocBackFile]     = useState<File | null>(null)
  const [docFrontPreview, setDocFrontPreview] = useState<string | null>(null)
  const [docBackPreview,  setDocBackPreview]  = useState<string | null>(null)
  const [savingDoc,       setSavingDoc]       = useState(false)

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })
  const fullName = watch('full_name', '')

  // ── Load portfolio with public URLs ───────────────────────────────────────
  const loadPortfolioPhotos = async (uid: string) => {
    const { data } = await supabase
      .from('portfolio_photos')
      .select('id, photo_url, caption, order_index')
      .eq('professional_id', uid)
      .order('order_index')

    const photos = (data ?? []).map(p => ({
      ...p,
      // handle both stored paths and legacy full URLs
      publicUrl: p.photo_url.startsWith('http')
        ? p.photo_url
        : supabase.storage.from('portfolio').getPublicUrl(p.photo_url).data.publicUrl,
    }))
    setPortfolio(photos)
  }

  // ── Initial data load ─────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      setEmail(user.email ?? '')

      Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('professionals').select('*').eq('id', user.id).single(),
        supabase.from('professional_faq').select('*').eq('professional_id', user.id).order('order_index'),
        supabase.from('professional_categories').select('id, category:categories(id, name, parent_id)').eq('professional_id', user.id),
        supabase.from('categories').select('id, name, parent_id').eq('active', true).order('name'),
        supabase.from('professional_coverage').select('id, department_id, municipality_id, district_id, department:departments(id,name), municipality:municipalities(id,name), district:districts(id,name)').eq('professional_id', user.id),
        supabase.from('departments').select('id, name').order('name'),
      ]).then(([{ data: prof }, { data: pro }, { data: faqData }, { data: misCats }, { data: allCats }, { data: cobertura }, { data: depts }]) => {
        if (prof && pro) {
          reset({
            full_name:         prof.full_name         ?? '',
            phone:             prof.phone             ?? '',
            short_description: pro.short_description  ?? '',
            bio:               pro.bio                ?? '',
            facebook_url:      pro.facebook_url       ?? '',
            instagram_url:     pro.instagram_url      ?? '',
            tiktok_url:        pro.tiktok_url         ?? '',
          })
          setPhoneCountryCode(prof.phone_country_code ?? '+503')
          if (prof.photo_url) setAvatarPreview(prof.photo_url)
          setCoversEntireCountry((pro as any).covers_entire_country ?? false)
          setDocType((pro as any).doc_type   ?? '')
          setDocNumber((pro as any).doc_number ?? '')
          if ((pro as any).doc_front_url) setDocFrontPreview((pro as any).doc_front_url)
          if ((pro as any).doc_back_url)  setDocBackPreview((pro as any).doc_back_url)
        }
        setFaq(faqData ?? [])
        const ids = (misCats ?? []).map((mc: any) => mc.category?.id).filter(Boolean) as string[]
        setMisCatIds(ids)
        setTodasCategorias((allCats ?? []) as { id: string; name: string; parent_id: string | null }[])
        setCoberturaActual(
          (cobertura ?? []).map((c: any) => ({
            id:                c.id,
            department_id:     c.department_id,
            department_name:   c.department?.name ?? '',
            municipality_id:   c.municipality_id ?? null,
            municipality_name: c.municipality?.name ?? null,
            district_id:       c.district_id ?? null,
            district_name:     c.district?.name ?? null,
          }))
        )
        setAllDepartments((depts ?? []) as { id: string; name: string }[])
        setLoading(false)
        loadPortfolioPhotos(user.id)
      })
    })
  }, [])

  // ── Save profile (info tab) ───────────────────────────────────────────────
  const onSaveProfile = async (data: ProfileFormData) => {
    if (newPhotoFile) {
      const ext      = newPhotoFile.name.split('.').pop()
      const filePath = `${userId}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, newPhotoFile, { upsert: true })
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
        await supabase.from('profiles').update({ photo_url: publicUrl }).eq('id', userId)
        setAvatarPreview(publicUrl)
        setNewPhotoFile(null)
      }
    }

    await supabase.from('profiles').update({
      full_name:          data.full_name,
      phone:              data.phone,
      phone_country_code: phoneCountryCode,
    }).eq('id', userId)

    await supabase.from('professionals').update({
      short_description: data.short_description,
      bio:               data.bio,
      whatsapp:          phoneCountryCode + data.phone,
      facebook_url:      data.facebook_url,
      instagram_url:     data.instagram_url,
      tiktok_url:        data.tiktok_url,
    }).eq('id', userId)

    toast.success('Perfil actualizado correctamente')
    router.refresh()
  }

  // ── Portfolio: upload ─────────────────────────────────────────────────────
  const uploadPortfolioPhoto = async (file: File) => {
    setUploading(true)
    const ext      = file.name.split('.').pop()
    const filePath = `${userId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, { upsert: false })

    if (uploadError) {
      toast.error('Error al subir la foto')
      setUploading(false)
      return
    }

    const { error: dbError } = await supabase.from('portfolio_photos').insert({
      professional_id: userId,
      photo_url:       filePath,
      order_index:     portfolio.length,
    })

    if (!dbError) {
      await loadPortfolioPhotos(userId)
      setSelectedFile(null)
      setPreviewUrl(null)
      toast.success('Foto subida correctamente')
    } else {
      toast.error('Error al guardar la foto')
    }
    setUploading(false)
  }

  // ── Portfolio: delete ─────────────────────────────────────────────────────
  const deletePortfolioPhoto = async (photo: any) => {
    // Remove from storage only if stored as path (not legacy full URL)
    if (!photo.photo_url.startsWith('http')) {
      await supabase.storage.from('portfolio').remove([photo.photo_url])
    }
    await supabase.from('portfolio_photos').delete().eq('id', photo.id)
    await loadPortfolioPhotos(userId)
    toast.success('Foto eliminada')
  }

  // ── FAQ ───────────────────────────────────────────────────────────────────
  const addFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return
    const { data } = await supabase.from('professional_faq').insert({
      professional_id: userId,
      question:        newQuestion.trim(),
      answer:          newAnswer.trim(),
      order_index:     faq.length,
    }).select().single()
    if (data) setFaq((prev) => [...prev, data])
    setNewQuestion('')
    setNewAnswer('')
    toast.success('Pregunta agregada')
  }

  const deleteFaq = async (id: string) => {
    await supabase.from('professional_faq').delete().eq('id', id)
    setFaq((prev) => prev.filter((f) => f.id !== id))
  }

  // ── Save document ─────────────────────────────────────────────────────────
  const saveDocuments = async () => {
    setSavingDoc(true)
    let frontUrl: string | null = docFrontPreview?.startsWith('http') ? docFrontPreview : null
    let backUrl:  string | null = docBackPreview?.startsWith('http')  ? docBackPreview  : null

    if (docFrontFile) {
      const ext  = docFrontFile.name.split('.').pop()
      const path = `${userId}/doc_front.${ext}`
      const { error: err } = await supabase.storage.from('documents').upload(path, docFrontFile, { upsert: true })
      if (!err) {
        frontUrl = supabase.storage.from('documents').getPublicUrl(path).data.publicUrl
        setDocFrontPreview(frontUrl)
        setDocFrontFile(null)
      }
    }

    if (docBackFile) {
      const ext  = docBackFile.name.split('.').pop()
      const path = `${userId}/doc_back.${ext}`
      const { error: err } = await supabase.storage.from('documents').upload(path, docBackFile, { upsert: true })
      if (!err) {
        backUrl = supabase.storage.from('documents').getPublicUrl(path).data.publicUrl
        setDocBackPreview(backUrl)
        setDocBackFile(null)
      }
    }

    await supabase.from('professionals').update({
      doc_type:      docType      || null,
      doc_number:    docNumber.trim() || null,
      doc_front_url: frontUrl,
      doc_back_url:  backUrl,
    }).eq('id', userId)

    toast.success('Documento guardado correctamente')
    setSavingDoc(false)
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando...</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl" style={{ paddingBottom: '100px' }}>
      <Link
        href={`/${params.country}/profesional-panel/dashboard`}
        style={{
          fontFamily: FONT_SANS, fontSize: '15px', color: '#C4581A', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px',
        }}
        className="pro-perfil-back-link"
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        Volver al Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="portfolio">Portafolio</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="cobertura">Cobertura</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        {/* ── Info tab ─────────────────────────────────────────────────────── */}
        <TabsContent value="info" className="mt-6">
          <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5">

            {/* Foto de perfil */}
            <div className="space-y-2">
              <Label>Foto de perfil</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                  flexShrink: 0, border: '3px solid #D4963A', backgroundColor: '#C4581A15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Foto de perfil"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    <span style={{ fontFamily: FONT_SERIF, fontSize: '28px', color: '#C4581A', fontWeight: 700 }}>
                      {getInitials(fullName || 'P')}
                    </span>
                  )}
                </div>
                <div>
                  <label style={{
                    display: 'inline-block', padding: '8px 16px',
                    backgroundColor: '#F2F0ED', border: '1px solid rgba(212,150,58,0.35)',
                    borderRadius: '8px', cursor: 'pointer',
                    fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#C4581A',
                  }}>
                    {newPhotoFile ? 'Cambiar selección' : 'Cambiar foto'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        setNewPhotoFile(file)
                        if (file) setAvatarPreview(URL.createObjectURL(file))
                      }}
                    />
                  </label>
                  {newPhotoFile && (
                    <p style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#7A7A78', marginTop: '6px' }}>
                      {newPhotoFile.name} — se subirá al guardar
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                border: '1px solid rgba(44,44,44,0.12)', background: '#F2F0ED',
                fontFamily: FONT_SANS, fontSize: '15px', color: '#7A7A78',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                {email}
                <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600, color: '#7A7A78', background: '#2C2C2C12', padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                  Solo lectura
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input {...register('full_name')} />
            </div>

            <div className="space-y-2">
              <Label>Teléfono</Label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  style={{
                    padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid rgba(212,150,58,0.25)', background: '#F2F0ED',
                    fontFamily: FONT_SANS, fontSize: '15px', color: '#2C2C2C',
                    width: '140px', flexShrink: 0,
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
                <Input
                  type="tel"
                  inputMode="numeric"
                  style={{ flex: 1 }}
                  maxLength={getPhoneConfig(phoneCountryCode).max}
                  placeholder={getPhoneConfig(phoneCountryCode).placeholder}
                  {...register('phone')}
                  onKeyDown={(e) => {
                    if (e.ctrlKey || e.metaKey) return
                    if (['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) return
                    if (!/^\d$/.test(e.key)) e.preventDefault()
                  }}
                  onPaste={(e) => {
                    e.preventDefault()
                    const val = cleanPhone(e.clipboardData.getData('text'), getPhoneConfig(phoneCountryCode).max)
                    setValue('phone', val)
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción corta</Label>
              <Textarea rows={2} {...register('short_description')} />
            </div>
            <div className="space-y-2">
              <Label>Bio completa</Label>
              <Textarea rows={5} {...register('bio')} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input placeholder="https://facebook.com/..." {...register('facebook_url')} />
              </div>
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input placeholder="https://instagram.com/..." {...register('instagram_url')} />
              </div>
              <div className="space-y-2">
                <Label>TikTok URL</Label>
                <Input placeholder="https://tiktok.com/@..." {...register('tiktok_url')} />
              </div>
            </div>

            <div className="ax7-save-wrapper">
              <button type="submit" disabled={isSubmitting} className="ax7-save-btn">
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </TabsContent>

        {/* ── Portfolio tab ─────────────────────────────────────────────────── */}
        <TabsContent value="portfolio" className="mt-6 space-y-5">

          {/* Hidden file input */}
          <input
            ref={portfolioInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              if (!file) return
              setSelectedFile(file)
              setPreviewUrl(URL.createObjectURL(file))
              e.target.value = '' // allow re-selecting same file
            }}
          />

          {/* Add button + counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={() => portfolioInputRef.current?.click()}
              disabled={portfolio.length >= 25 || !!selectedFile}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '8px',
                border: '1px solid rgba(212,150,58,0.35)',
                backgroundColor: '#F2F0ED', cursor: portfolio.length >= 25 ? 'not-allowed' : 'pointer',
                fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, color: '#C4581A',
                opacity: portfolio.length >= 25 || !!selectedFile ? 0.5 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
              Agregar foto
            </button>
            <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78' }}>
              {portfolio.length}/25 fotos
            </span>
          </div>

          {/* Preview + confirm/cancel */}
          {previewUrl && selectedFile && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{
                position: 'relative', width: 180, height: 180,
                borderRadius: '10px', overflow: 'hidden', flexShrink: 0,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(30,30,30,0.62)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px',
                }}>
                  <button
                    type="button"
                    onClick={() => uploadPortfolioPhoto(selectedFile)}
                    disabled={uploading}
                    style={{
                      width: '100%', padding: '10px 0',
                      background: '#1E1E1E', color: '#D4963A',
                      fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                      border: 'none', borderRadius: '8px', cursor: 'pointer',
                      opacity: uploading ? 0.6 : 1,
                    }}
                  >
                    {uploading ? 'Subiendo...' : 'Subir foto'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null) }}
                    disabled={uploading}
                    style={{
                      width: '100%', padding: '8px 0',
                      background: 'transparent', color: '#F2F0ED',
                      fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 500,
                      border: '1px solid rgba(245,240,232,0.4)',
                      borderRadius: '8px', cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              <p style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', paddingTop: '4px' }}>
                {selectedFile.name}
              </p>
            </div>
          )}

          {/* Existing photos grid */}
          {portfolio.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {portfolio.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.publicUrl}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => deletePortfolioPhoto(photo)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    title="Eliminar foto"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : !selectedFile ? (
            <p style={{
              fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78',
              textAlign: 'center', padding: '32px 16px',
              border: '1px dashed rgba(30,30,30,0.12)', borderRadius: '10px',
            }}>
              Aún no tienes fotos en tu portafolio
            </p>
          ) : null}
        </TabsContent>

        {/* ── Categorías tab ───────────────────────────────────────────────── */}
        <TabsContent value="categorias" className="mt-6">
          <div style={{
            backgroundColor: '#fff',
            border:          '0.5px solid #2C2C2C12',
            borderRadius:    '12px',
            padding:         '24px',
          }}>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 6px' }}>
              Mis categorías de servicio
            </h2>
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', margin: '0 0 24px', lineHeight: 1.6 }}>
              Indica en qué categorías ofreces tus servicios. Los propietarios te encontrarán según estas categorías.
            </p>
            {userId && todasCategorias.length > 0 ? (
              <CategoriasPicker
                professionalId={userId}
                initialSelected={misCatIds}
                allCategories={todasCategorias}
              />
            ) : (
              <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Cargando categorías...</p>
            )}
          </div>
        </TabsContent>

        {/* ── Cobertura tab ────────────────────────────────────────────────── */}
        <TabsContent value="cobertura" className="mt-6">
          <div style={{
            backgroundColor: '#fff',
            border:          '0.5px solid #2C2C2C12',
            borderRadius:    '12px',
            padding:         '24px',
          }}>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 6px' }}>
              Zonas de cobertura
            </h2>
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', margin: '0 0 24px', lineHeight: 1.6 }}>
              Define las zonas donde puedes prestar tus servicios. Los propietarios podrán filtrarte por ubicación.
            </p>
            {userId && allDepartments.length > 0 ? (
              <CoberturaEditor
                professionalId={userId}
                initialCoverage={coberturaActual}
                initialEntireCountry={coversEntireCountry}
                departments={allDepartments}
              />
            ) : (
              <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78' }}>Cargando datos de cobertura...</p>
            )}
          </div>
        </TabsContent>

        {/* ── Documentos tab ──────────────────────────────────────────────── */}
        <TabsContent value="documentos" className="mt-6">
          <div style={{ backgroundColor: '#fff', border: '0.5px solid #2C2C2C12', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: '18px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 6px' }}>
              Documento de identidad
            </h2>
            <p style={{ fontFamily: FONT_SANS, fontSize: '14px', color: '#7A7A78', margin: '0 0 24px', lineHeight: 1.6 }}>
              Sube una foto de tu documento para verificar tu cuenta. Esta información es confidencial y solo será revisada por el equipo de K1BO.
            </p>

            {/* Tipo */}
            <div style={{ marginBottom: '20px' }}>
              <Label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
                Tipo de documento
              </Label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {DOC_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setDocType(t.value)}
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '10px 18px', borderRadius: '8px',
                      border: `1.5px solid ${docType === t.value ? '#1E1E1E' : '#1E1E1E25'}`,
                      background: docType === t.value ? '#1E1E1E' : 'transparent',
                      color: docType === t.value ? '#D4963A' : '#7A7A78',
                      fontFamily: FONT_SANS, fontSize: '14px', fontWeight: docType === t.value ? 700 : 500,
                      cursor: 'pointer', transition: 'all 150ms',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Número */}
            <div style={{ marginBottom: '24px' }}>
              <Label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Número de documento
              </Label>
              <Input
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder={DOC_TYPES.find((t) => t.value === docType)?.placeholder ?? 'Selecciona el tipo primero'}
                disabled={!docType}
              />
            </div>

            {/* Fotos */}
            <div style={{ marginBottom: '24px' }}>
              <Label style={{ fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                Fotografías del documento
              </Label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Frente */}
                <div>
                  <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#1E1E1E', marginBottom: '8px' }}>
                    Parte frontal
                  </p>
                  <label className="doc-upload-label" style={{ display: 'block', cursor: 'pointer' }}>
                    {docFrontPreview ? (
                      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '3/2' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={docFrontPreview} alt="Frente del documento" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div className="doc-img-overlay" style={{
                          position: 'absolute', inset: 0, background: 'rgba(30,30,30,0.6)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          gap: '6px', opacity: 0, transition: 'opacity 150ms',
                        }}>
                          <Upload style={{ width: 22, height: 22, color: '#fff' }} />
                          <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#fff', fontWeight: 600 }}>Cambiar</span>
                        </div>
                      </div>
                    ) : (
                      <div className="doc-upload-placeholder" style={{
                        border: '2px dashed #1E1E1E20', borderRadius: '10px', aspectRatio: '3/2',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', background: '#F2F0ED', transition: 'border-color 150ms',
                      }}>
                        <Upload style={{ width: 24, height: 24, color: '#7A7A78' }} />
                        <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', fontWeight: 500 }}>Subir imagen</span>
                      </div>
                    )}
                    <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        if (!file) return
                        setDocFrontFile(file)
                        setDocFrontPreview(URL.createObjectURL(file))
                        e.target.value = ''
                      }}
                    />
                  </label>
                  {docFrontFile && (
                    <p style={{ fontFamily: FONT_SANS, fontSize: '11px', color: '#C4581A', marginTop: '4px' }}>
                      Nueva imagen — se subirá al guardar
                    </p>
                  )}
                </div>

                {/* Reverso */}
                <div>
                  <p style={{ fontFamily: FONT_SANS, fontSize: '13px', fontWeight: 600, color: '#1E1E1E', marginBottom: '8px' }}>
                    Parte trasera
                  </p>
                  <label className="doc-upload-label" style={{ display: 'block', cursor: 'pointer' }}>
                    {docBackPreview ? (
                      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '3/2' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={docBackPreview} alt="Trasera del documento" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div className="doc-img-overlay" style={{
                          position: 'absolute', inset: 0, background: 'rgba(30,30,30,0.6)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          gap: '6px', opacity: 0, transition: 'opacity 150ms',
                        }}>
                          <Upload style={{ width: 22, height: 22, color: '#fff' }} />
                          <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#fff', fontWeight: 600 }}>Cambiar</span>
                        </div>
                      </div>
                    ) : (
                      <div className="doc-upload-placeholder" style={{
                        border: '2px dashed #1E1E1E20', borderRadius: '10px', aspectRatio: '3/2',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', background: '#F2F0ED', transition: 'border-color 150ms',
                      }}>
                        <Upload style={{ width: 24, height: 24, color: '#7A7A78' }} />
                        <span style={{ fontFamily: FONT_SANS, fontSize: '13px', color: '#7A7A78', fontWeight: 500 }}>Subir imagen</span>
                      </div>
                    )}
                    <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        if (!file) return
                        setDocBackFile(file)
                        setDocBackPreview(URL.createObjectURL(file))
                        e.target.value = ''
                      }}
                    />
                  </label>
                  {docBackFile && (
                    <p style={{ fontFamily: FONT_SANS, fontSize: '11px', color: '#C4581A', marginTop: '4px' }}>
                      Nueva imagen — se subirá al guardar
                    </p>
                  )}
                </div>

              </div>
            </div>

            <button
              type="button"
              onClick={saveDocuments}
              disabled={savingDoc || !docType || !docNumber.trim()}
              style={{
                background: '#1E1E1E', color: '#D4963A',
                fontFamily: FONT_SANS, fontSize: '15px', fontWeight: 700,
                padding: '13px 32px', borderRadius: '8px', border: 'none',
                cursor: savingDoc || !docType || !docNumber.trim() ? 'not-allowed' : 'pointer',
                opacity: savingDoc || !docType || !docNumber.trim() ? 0.55 : 1,
                width: '100%', transition: 'opacity 150ms',
              }}
            >
              {savingDoc ? 'Guardando...' : 'Guardar documento'}
            </button>
          </div>
        </TabsContent>

        {/* ── FAQ tab ──────────────────────────────────────────────────────── */}
        <TabsContent value="faq" className="mt-6 space-y-5">
          {faq.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.question}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                </div>
                <button type="button" onClick={() => deleteFaq(item.id)} className="text-destructive ml-2">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-lg border p-4 space-y-3">
            <p className="font-semibold text-sm">Nueva pregunta</p>
            <div className="space-y-2">
              <Input
                placeholder="¿Cuál es tu pregunta?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <Textarea
                placeholder="Respuesta..."
                rows={3}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={addFaq} disabled={!newQuestion.trim() || !newAnswer.trim()}>
              <Plus className="h-4 w-4 mr-1" /> Agregar
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <style>{`
        .pro-perfil-back-link:hover { text-decoration: underline; }
        .doc-upload-label:hover .doc-img-overlay { opacity: 1 !important; }
        .doc-upload-label:hover .doc-upload-placeholder { border-color: #C4581A80 !important; }

        .ax7-save-wrapper { margin-top: 8px; }
        .ax7-save-btn {
          background: #1E1E1E;
          color: #D4963A;
          font-family: var(--font-sans, "DM Sans", system-ui, sans-serif);
          font-size: 16px;
          font-weight: 700;
          padding: 14px 32px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          width: 100%;
          transition: opacity 0.15s;
        }
        .ax7-save-btn:hover:not(:disabled) { opacity: 0.88; }
        .ax7-save-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        @media (max-width: 768px) {
          .ax7-save-wrapper {
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 50;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-top: 1px solid rgba(30, 30, 30, 0.08);
            margin-top: 0;
          }
          .ax7-save-btn { border-radius: 8px; }
        }
      `}</style>
    </div>
  )
}
