import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'

export const metadata: Metadata = {
  title: 'K1BO',
  description: 'Encuentra al profesional ideal para tu hogar',
}

export default function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { country: string }
}) {
  return (
    <>
      <Navbar countryPrefix={params.country} />
      <main>{children}</main>
      <Footer countryPrefix={params.country} />
    </>
  )
}
