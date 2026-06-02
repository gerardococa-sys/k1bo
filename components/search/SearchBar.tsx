'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SearchBar({ countryPrefix }: { countryPrefix: string }) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    const q = query.trim()
    if (q) router.push(`/${countryPrefix}/buscar?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="flex gap-2 max-w-md mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10 bg-white text-foreground"
          placeholder="¿Qué servicio necesitas?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <Button
        onClick={handleSearch}
        className="bg-white text-[#1B3A6B] hover:bg-white/90 font-semibold"
      >
        Buscar
      </Button>
    </div>
  )
}
