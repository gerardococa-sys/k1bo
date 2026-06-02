import Link from 'next/link'
import { Wrench, PaintBucket, Zap, Droplets, TreePine, Layers, Wind, Building2, Hammer, LayoutGrid, PanelTop } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Category } from '@/types'

const ICON_MAP: Record<string, React.ReactNode> = {
  wrench: <Wrench className="h-7 w-7 text-[#1B3A6B]" />,
  paintbucket: <PaintBucket className="h-7 w-7 text-[#1B3A6B]" />,
  zap: <Zap className="h-7 w-7 text-[#1B3A6B]" />,
  droplets: <Droplets className="h-7 w-7 text-[#1B3A6B]" />,
  treepine: <TreePine className="h-7 w-7 text-[#1B3A6B]" />,
  layers: <Layers className="h-7 w-7 text-[#1B3A6B]" />,
  wind: <Wind className="h-7 w-7 text-[#1B3A6B]" />,
  building2: <Building2 className="h-7 w-7 text-[#1B3A6B]" />,
  hammer: <Hammer className="h-7 w-7 text-[#1B3A6B]" />,
  'layout-grid': <LayoutGrid className="h-7 w-7 text-[#1B3A6B]" />,
  'panel-top': <PanelTop className="h-7 w-7 text-[#1B3A6B]" />,
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
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1B3A6B]/10">
                {cat.icon && ICON_MAP[cat.icon.toLowerCase()]
                  ? ICON_MAP[cat.icon.toLowerCase()]
                  : <Wrench className="h-7 w-7 text-[#1B3A6B]" />}
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
