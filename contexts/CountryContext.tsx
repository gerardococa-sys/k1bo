'use client'

import { createContext, useContext } from 'react'
import type { CountryContext as CountryContextType } from '@/types'

const CountryContext = createContext<CountryContextType | null>(null)

export function CountryProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: CountryContextType
}) {
  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
}

export function useCountry(): CountryContextType {
  const ctx = useContext(CountryContext)
  if (!ctx) throw new Error('useCountry must be used within CountryProvider')
  return ctx
}
