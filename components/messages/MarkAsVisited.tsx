'use client'

import { useEffect } from 'react'

export function MarkAsVisited({ solicitudId }: { solicitudId: string }) {
  useEffect(() => {
    localStorage.setItem('visit_' + solicitudId, new Date().toISOString())
  }, [solicitudId])
  return null
}
