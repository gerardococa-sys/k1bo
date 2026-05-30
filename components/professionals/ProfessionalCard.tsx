import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getInitials } from '@/lib/utils'
import type { Professional } from '@/types'

interface ProfessionalCardProps {
  professional: Professional
  countryPrefix: string
}

export function ProfessionalCard({ professional, countryPrefix }: ProfessionalCardProps) {
  const profile = professional.profile
  const avgRating = professional.avg_rating ?? 0
  const totalReviews = professional.total_reviews ?? 0

  const coverageText = professional.covers_entire_country
    ? `Todo ${profile?.country?.name ?? 'el país'}`
    : professional.coverage
        ?.map((c) => c.department?.name)
        .filter(Boolean)
        .slice(0, 2)
        .join(', ') ?? ''

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Avatar */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted">
            {profile?.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={profile.full_name ?? ''}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xl font-bold">
                {getInitials(profile?.full_name ?? 'P')}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">
                  {profile?.full_name}
                </h3>
                {profile?.verified && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs text-primary font-medium">Verificado</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({totalReviews})</span>
              </div>
            </div>

            {/* Coverage */}
            {coverageText && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{coverageText}</span>
              </div>
            )}

            {/* Short description */}
            {professional.short_description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {professional.short_description}
              </p>
            )}

            {/* Service tags */}
            {professional.services && professional.services.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {professional.services.slice(0, 4).map((s) => (
                  <Badge key={s.id} variant="secondary" className="text-xs">
                    {s.service_tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3">
          <Button asChild size="sm" className="w-full">
            <Link href={`/${countryPrefix}/profesional/${professional.id}`}>
              Ver Perfil Completo
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
