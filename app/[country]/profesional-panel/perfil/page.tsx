'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { DAY_LABELS, getInitials } from '@/lib/utils'

const FONT_SANS  = 'var(--font-sans, "DM Sans", system-ui, sans-serif)'
const FONT_SERIF = 'var(--font-serif, "Playfair Display", Georgia, serif)'

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

  const [userId,          setUserId]          = useState('')
  const [loading,         setLoading]         = useState(true)
  const [portfolio,       setPortfolio]       = useState<any[]>([])
  const [faq,             setFaq]             = useState<any[]>([])
  const [newQuestion,     setNewQuestion]     = useState('')
  const [newAnswer,       setNewAnswer]       = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('+503')
  const [workingHours,    setWorkingHours]    = useState<Record<string, { open: boolean; from: string; to: string }>>(
    Object.fromEntries(Object.keys(DAY_LABELS).map((d) => [d, { open: false, from: '08:00', to: '17:00' }]))
  )
  const [avatarPreview,   setAvatarPreview]   = useState<string | null>(null)
  const [newPhotoFile,    setNewPhotoFile]    = useState<File | null>(null)

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const fullName = watch('full_name', '')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('professionals').select('*').eq('id', user.id).single(),
        supabase.from('portfolio_photos').select('*').eq('professional_id', user.id).order('order_index'),
        supabase.from('professional_faq').select('*').eq('professional_id', user.id).order('order_index'),
      ]).then(([{ data: prof }, { data: pro }, { data: port }, { data: faqData }]) => {
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
          if (pro.working_hours) setWorkingHours(pro.working_hours)
        }
        setPortfolio(port   ?? [])
        setFaq(faqData      ?? [])
        setLoading(false)
      })
    })
  }, [])

  const onSaveProfile = async (data: ProfileFormData) => {
    // 1. Upload new photo if selected
    if (newPhotoFile) {
      const ext      = newPhotoFile.name.split('.').pop()
      const filePath = `${userId}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, newPhotoFile, { upsert: true })

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)

        await supabase.from('profiles').update({ photo_url: publicUrl }).eq('id', userId)
        setAvatarPreview(publicUrl)
        setNewPhotoFile(null)
      }
    }

    // 2. Save profiles + professionals fields
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
      working_hours:     workingHours,
    }).eq('id', userId)

    toast.success('Perfil actualizado correctamente')
    router.refresh()
  }

  const deletePhoto = async (id: string) => {
    await supabase.from('portfolio_photos').delete().eq('id', id)
    setPortfolio((prev) => prev.filter((p) => p.id !== id))
    toast.success('Foto eliminada')
  }

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

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando...</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl" style={{ paddingBottom: '100px' }}>
      <Link
        href={`/${params.country}/profesional-panel/dashboard`}
        style={{
          fontFamily: FONT_SANS,
          fontSize: '15px', color: '#B85C1A', textDecoration: 'none',
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
        </TabsList>

        {/* ── Info tab ── */}
        <TabsContent value="info" className="mt-6">
          <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5">

            {/* Foto de perfil */}
            <div className="space-y-2">
              <Label>Foto de perfil</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Avatar preview */}
                <div
                  style={{
                    width: 80, height: 80, borderRadius: '50%',
                    overflow: 'hidden', flexShrink: 0,
                    border: '3px solid #D4A96A',
                    backgroundColor: '#B85C1A15',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Foto de perfil"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontFamily: FONT_SERIF, fontSize: '28px', color: '#B85C1A', fontWeight: 700 }}>
                      {getInitials(fullName || 'P')}
                    </span>
                  )}
                </div>

                {/* File picker */}
                <div>
                  <label
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#F5F0E8',
                      border: '1px solid rgba(212,169,106,0.35)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontFamily: FONT_SANS,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#B85C1A',
                    }}
                  >
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
                    <p style={{ fontFamily: FONT_SANS, fontSize: '12px', color: '#6B7B6E', marginTop: '6px' }}>
                      {newPhotoFile.name} — se subirá al guardar
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input {...register('full_name')} />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(212,169,106,0.25)',
                    background: '#F5F0E8',
                    fontFamily: FONT_SANS,
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
                <Input type="tel" placeholder="7XXX-XXXX" style={{ flex: 1 }} {...register('phone')} />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label>Descripción corta</Label>
              <Textarea rows={2} {...register('short_description')} />
            </div>
            <div className="space-y-2">
              <Label>Bio completa</Label>
              <Textarea rows={5} {...register('bio')} />
            </div>

            {/* Redes sociales */}
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

            {/* Horario laboral */}
            <div className="space-y-3">
              <Label>Horario laboral</Label>
              {Object.entries(DAY_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  <Checkbox
                    id={`wh_${key}`}
                    checked={workingHours[key]?.open ?? false}
                    onCheckedChange={(v) => setWorkingHours((p) => ({ ...p, [key]: { ...p[key], open: !!v } }))}
                  />
                  <Label htmlFor={`wh_${key}`} className="w-24 text-sm">{label}</Label>
                  {workingHours[key]?.open && (
                    <>
                      <Input
                        type="time"
                        className="w-28"
                        value={workingHours[key].from}
                        onChange={(e) => setWorkingHours((p) => ({ ...p, [key]: { ...p[key], from: e.target.value } }))}
                      />
                      <span className="text-sm text-muted-foreground">a</span>
                      <Input
                        type="time"
                        className="w-28"
                        value={workingHours[key].to}
                        onChange={(e) => setWorkingHours((p) => ({ ...p, [key]: { ...p[key], to: e.target.value } }))}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* ── Guardar — sticky en mobile, normal en desktop ── */}
            <div className="ax7-save-wrapper">
              <button type="submit" disabled={isSubmitting} className="ax7-save-btn">
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </TabsContent>

        {/* ── Portfolio tab ── */}
        <TabsContent value="portfolio" className="mt-6 space-y-4">
          <div>
            <Label>Subir fotos (máx. 25 en total)</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              className="mt-2"
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? [])
                if (portfolio.length + files.length > 25) { toast.error('Máximo 25 fotos'); return }
                for (const file of files) {
                  const ext  = file.name.split('.').pop()
                  const path = `${userId}/${Date.now()}_${Math.random()}.${ext}`
                  const { data: up } = await supabase.storage.from('portfolio').upload(path, file)
                  if (up) {
                    const { data: url } = supabase.storage.from('portfolio').getPublicUrl(path)
                    const { data: photo } = await supabase.from('portfolio_photos').insert({
                      professional_id: userId,
                      photo_url:       url.publicUrl,
                      order_index:     portfolio.length,
                    }).select().single()
                    if (photo) setPortfolio((prev) => [...prev, photo])
                  }
                }
                toast.success('Fotos subidas')
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {portfolio.map((photo) => (
              <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── FAQ tab ── */}
        <TabsContent value="faq" className="mt-6 space-y-5">
          {faq.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.question}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                </div>
                <button onClick={() => deleteFaq(item.id)} className="text-destructive ml-2">
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

        /* Save button — normal en desktop */
        .ax7-save-wrapper {
          margin-top: 8px;
        }
        .ax7-save-btn {
          background: #1C1410;
          color: #D4A96A;
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

        /* Sticky en mobile */
        @media (max-width: 768px) {
          .ax7-save-wrapper {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 50;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-top: 1px solid rgba(28, 20, 16, 0.08);
            margin-top: 0;
          }
          .ax7-save-btn {
            border-radius: 8px;
          }
        }
      `}</style>
    </div>
  )
}
