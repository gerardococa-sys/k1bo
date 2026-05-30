import Link from 'next/link'
import { Wrench, PaintBucket, Zap, Droplets, TreePine, Layers, Wind, Building2, Hammer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Category } from '@/types'

const ICON_MAP: Record<string, React.ReactNode> = {
  wrench: <Wrench className="h-6 w-6" />,
  paintbucket: <PaintBucket className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  droplets: <Droplets className="h-6 w-6" />,
  treepine: <TreePine className="h-6 w-6" />,
  layers: <Layers className="h-6 w-6" />,
  wind: <Wind className="h-6 w-6" />,
  building2: <Building2 className="h-6 w-6" />,
  hammer: <Hammer className="h-6 w-6" />,
}

interface CategoryGridProps {
  categories: Category[]
  countryPrefix: string
}

export function CategoryGrid({ categories, countryPrefix }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((cat) => (
        <Link key={cat.id} href={`/${countryPrefix}/categoria/${cat.slug}`}>
          <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md h-full">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {cat.icon && ICON_MAP[cat.icon.toLowerCase()]
                  ? ICON_MAP[cat.icon.toLowerCase()]
                  : <Wrench className="h-6 w-6" />}
              </div>
              <div>
                <p className="font-semibold text-sm">{cat.name}</p>
                {cat.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                )}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <p className="mt-1 text-xs text-primary">
                    {cat.subcategories.length} especialidades
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
