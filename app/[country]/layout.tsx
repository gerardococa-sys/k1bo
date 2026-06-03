import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'K1BO',
  description: 'Encuentra al profesional ideal para tu hogar',
}

export default function CountryLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>
}
