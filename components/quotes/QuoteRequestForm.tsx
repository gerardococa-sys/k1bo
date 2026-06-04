'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import type { Professional, Category } from '@/types'

const schema = z.object({
  required_date: z.string().min(1, 'Selecciona una fecha'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
})

type FormData = z.infer<typeof schema>

interface QuoteRequestFormProps {
  professional: Professional
  category: Category
  subcategory?: Category
  clientId: string
  countryId: string
  onSuccess?: () => void
}

export function QuoteRequestForm({
  professional,
  category,
  subcategory,
  clientId,
  countryId,
  onSuccess,
}: QuoteRequestFormProps) {
  const [photos, setPhotos] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (photos.length + files.length > 10) {
      toast.error('Máximo 10 fotos por solicitud')
      return
    }
    setPhotos((prev) => [...prev, ...files])
  }

  const onSubmit = async (data: FormData) => {
    const { data: quote, error } = await supabase
      .from('quote_requests')
      .insert({
        country_id: countryId,
        client_id: clientId,
        professional_id: professional.id,
        category_id: category.id,
        subcategory_id: subcategory?.id ?? null,
        description: data.description,
        required_date: data.required_date,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      toast.error('Error al enviar la solicitud. Intenta de nuevo.')
      return
    }

    // Upload photos
    for (const photo of photos) {
      const ext = photo.name.split('.').pop()
      const path = `${quote.id}/${Date.now()}.${ext}`
      const { data: upload } = await supabase.storage
        .from('quote-photos')
        .upload(path, photo)

      if (upload) {
        await supabase.from('quote_request_photos').insert({
          quote_request_id: quote.id,
          photo_url: upload.path,
        })
      }
    }

    setSubmitted(true)
    onSuccess?.()
  }

  const params = useParams<{ country: string }>()
  const country = params?.country ?? 'sv'

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h3 className="text-xl font-semibold">¡Solicitud enviada con éxito!</h3>
        <p className="text-muted-foreground">El profesional te contactará pronto.</p>
        <div className="flex flex-col items-center gap-3 mt-2">
          <Link
            href={`/${country}/cliente/solicitudes`}
            style={{
              backgroundColor: '#1C1410',
              color: '#D4A96A',
              fontFamily: 'var(--font-sans, "DM Sans", system-ui, sans-serif)',
              fontSize: '16px',
              fontWeight: 700,
              padding: '13px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Ir a mis solicitudes
          </Link>
          <Link
            href={`/${country}/profesional/${professional.id}`}
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", system-ui, sans-serif)',
              fontSize: '15px',
              color: '#B85C1A',
              textDecoration: 'none',
            }}
            className="quote-back-link"
          >
            Volver al perfil del profesional
          </Link>
        </div>
        <style>{`.quote-back-link:hover { text-decoration: underline; }`}</style>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Professional info (read-only) */}
      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">Solicitando cotización a</p>
        <p className="font-semibold">{professional.profile?.full_name}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {category.name}{subcategory ? ` → ${subcategory.name}` : ''}
        </p>
      </div>

      {/* Required date */}
      <div className="space-y-2">
        <Label htmlFor="required_date">Fecha requerida *</Label>
        <Input
          id="required_date"
          type="date"
          min={new Date().toISOString().split('T')[0]}
          {...register('required_date')}
        />
        {errors.required_date && (
          <p className="text-sm text-destructive">{errors.required_date.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción del trabajo *</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Describe en detalle el trabajo que necesitas. Incluye medidas, materiales deseados y cualquier detalle relevante."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Photos */}
      <div className="space-y-2">
        <Label>Fotos del área (máx. 10)</Label>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 hover:border-primary transition-colors">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {photos.length > 0
              ? `${photos.length} foto(s) seleccionada(s)`
              : 'Arrastra o haz clic para subir fotos'}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoChange}
          />
        </label>
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {photos.map((f, i) => (
              <span key={i} className="rounded bg-secondary px-2 py-1 text-xs">
                {f.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
      </Button>
    </form>
  )
}
