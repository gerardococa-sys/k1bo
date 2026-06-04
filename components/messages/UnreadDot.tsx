'use client'

import { useEffect, useState } from 'react'

interface UnreadDotProps {
  solicitudId: string
  latestAt: string | null
}

export function UnreadDot({ solicitudId, latestAt }: UnreadDotProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!latestAt) return
    const lastVisit = localStorage.getItem('visit_' + solicitudId)
    if (!lastVisit || new Date(latestAt) > new Date(lastVisit)) setShow(true)
  }, [solicitudId, latestAt])

  if (!show) return null
  return (
    <span style={{
      width: 8, height: 8, borderRadius: '50%',
      backgroundColor: '#B85C1A', display: 'inline-block', flexShrink: 0,
    }} />
  )
}
