export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CountryProvider } from '@/contexts/CountryContext'
import { Navbar } from '@/components/navbar/Navbar'
import type { CountryContext } from '@/types'

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { country: string }
}) {
  const supabase = createClient()

  const { data: countryData } = await supabase
    .from('countries')
    .select('*')
    .eq('url_prefix', params.country)
    .eq('active', true)
    .single()

  if (!countryData) notFound()

  const ctx: CountryContext = {
    countryCode: countryData.code,
    countryName: countryData.name,
    currencyCode: countryData.currency_code,
    currencySymbol: countryData.currency_symbol,
    currencyName: countryData.currency_name,
    flagEmoji: countryData.flag_emoji,
    urlPrefix: countryData.url_prefix,
    countryId: countryData.id,
  }

  return (
    <CountryProvider value={ctx}>
      <Navbar countryPrefix={params.country} />
      <main>{children}</main>
      <footer className="bg-[#1B3A6B] text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <p className="text-2xl font-black uppercase mb-2">K1BO</p>
              <p className="text-white/80 text-sm">
                El directorio de profesionales para el hogar en Centroamérica.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-3">Navegación</p>
              <div className="space-y-2 text-sm text-white/80">
                <a href={`/${params.country}`} className="block hover:text-white">Inicio</a>
                <a href="/registro/profesional" className="block hover:text-white">Registra tu negocio</a>
                <a href="/login" className="block hover:text-white">Iniciar sesión</a>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-3">K1BO {countryData.flag_emoji} {countryData.name}</p>
              <p className="text-sm text-white/80">
                Encuentra profesionales verificados para tu hogar.
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
            Copyright © K1BO 2026. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </CountryProvider>
  )
}
