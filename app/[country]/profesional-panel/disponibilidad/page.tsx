'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { AvailabilityStatus } from '@/types'

const STATUS_COLORS_MAP: Record<AvailabilityStatus, string> = {
  available: 'bg-green-100 text-green-800 border-green-200',
  busy: 'bg-gray-100 text-gray-600 border-gray-200',
  blocked: 'bg-red-100 text-red-800 border-red-200',
}

const STATUS_LABELS_MAP: Record<AvailabilityStatus, string> = {
  available: 'Disponible',
  busy: 'Ocupado',
  blocked: 'Bloqueado',
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function DisponibilidadPage() {
  const supabase = createClient()
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [availability, setAvailability] = useState<Record<string, AvailabilityStatus>>({})
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedStatus, setSelectedStatus] = useState<AvailabilityStatus>('available')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      loadAvailability(user.id)
    })
  }, [year, month])

  const loadAvailability = async (uid: string) => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${getDaysInMonth(year, month)}`
    const { data } = await supabase
      .from('availability')
      .select('*')
      .eq('professional_id', uid)
      .gte('date', startDate)
      .lte('date', endDate)
    const map: Record<string, AvailabilityStatus> = {}
    data?.forEach((a) => { map[a.date] = a.status })
    setAvailability(map)
  }

  const handleDayClick = async (day: number) => {
    if (!userId) return
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const { error } = await supabase
      .from('availability')
      .upsert({ professional_id: userId, date, status: selectedStatus }, { onConflict: 'professional_id,date' })
    if (error) { toast.error('Error al guardar'); return }
    setAvailability((prev) => ({ ...prev, [date]: selectedStatus }))
  }

  const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Mi Disponibilidad</h1>
      <p className="text-muted-foreground mb-6">Marca los días según tu disponibilidad</p>

      {/* Status selector */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {(Object.entries(STATUS_LABELS_MAP) as [AvailabilityStatus, string][]).map(([status, label]) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-all ${
              selectedStatus === status
                ? STATUS_COLORS_MAP[status] + ' ring-2 ring-offset-1 ring-primary'
                : STATUS_COLORS_MAP[status] + ' opacity-60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => {
          if (month === 0) { setMonth(11); setYear(y => y - 1) }
          else setMonth(m => m - 1)
        }}>←</Button>
        <h2 className="font-semibold">{MONTH_NAMES[month]} {year}</h2>
        <Button variant="ghost" size="sm" onClick={() => {
          if (month === 11) { setMonth(0); setYear(y => y + 1) }
          else setMonth(m => m + 1)
        }}>→</Button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const status = availability[date]
          const isPast = new Date(date) < new Date(today.toDateString())
          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => handleDayClick(day)}
              className={`aspect-square rounded-lg text-sm font-medium border transition-all ${
                status ? STATUS_COLORS_MAP[status] : 'border-border hover:bg-muted'
              } ${isPast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-green-100 border border-green-200" /> Disponible</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-gray-100 border border-gray-200" /> Ocupado</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-red-100 border border-red-200" /> Bloqueado</span>
      </div>
    </div>
  )
}
