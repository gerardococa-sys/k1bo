'use client'

import { Globe, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { Country } from '@/types'

const ALL_COUNTRIES: Omit<Country, 'id' | 'created_at'>[] = [
  { name: 'El Salvador', code: 'SV', url_prefix: 'sv', currency_name: 'Dólar estadounidense', currency_code: 'USD', currency_symbol: '$', flag_emoji: '🇸🇻', active: true },
  { name: 'Guatemala',   code: 'GT', url_prefix: 'gt', currency_name: 'Quetzal',              currency_code: 'GTQ', currency_symbol: 'Q',  flag_emoji: '🇬🇹', active: false },
]

interface CountrySelectorProps {
  currentPrefix?: string
}

export function CountrySelector({ currentPrefix }: CountrySelectorProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Seleccionar país">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Selecciona tu país</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ALL_COUNTRIES.map((country) => (
          <DropdownMenuItem
            key={country.code}
            disabled={!country.active}
            className={!country.active ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            onClick={() => {
              if (country.active) {
                localStorage.setItem('k1bo_country', country.url_prefix)
                router.push(`/${country.url_prefix}`)
              }
            }}
          >
            <span className="mr-2 text-base">{country.flag_emoji}</span>
            <span className="flex-1">{country.name}</span>
            {!country.active && (
              <span className="text-xs text-muted-foreground">Próximamente</span>
            )}
            {country.active && currentPrefix === country.url_prefix && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
