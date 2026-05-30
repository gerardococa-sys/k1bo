import Link from 'next/link'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ComingSoonPage({
  searchParams,
}: {
  searchParams: { country?: string }
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <span className="text-6xl mb-6 block">🚧</span>
        <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-black text-[#1B3A6B] mb-2">Próximamente</h1>
        <p className="text-muted-foreground mb-6">
          K1BO aún no está disponible en{' '}
          <strong>{searchParams.country?.toUpperCase() ?? 'este país'}</strong>.
          Estamos trabajando para llegar pronto.
        </p>
        <Button asChild>
          <Link href="/">Ver países disponibles</Link>
        </Button>
      </div>
    </div>
  )
}
