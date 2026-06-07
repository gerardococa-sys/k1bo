'use client'

import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewMonthGrid } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'

interface AvailabilityDay {
  id: string
  date: string   // 'YYYY-MM-DD'
  status: 'available' | 'busy' | 'blocked'
}

interface Props {
  availability: AvailabilityDay[]
}

export function AvailabilityCalendar({ availability }: Props) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayStr = today.toISOString().split('T')[0]
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Build a map of explicit records
  const explicitMap = new Map(availability.map((a) => [a.date, a]))

  // For every day in the current month, if no explicit record exists → treat as available
  const currentMonthEvents = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const record = explicitMap.get(dateStr)
    const status = record?.status ?? 'available'
    return {
      id: record?.id ?? `implicit-${dateStr}`,
      calendarId: status === 'available' ? 'available' : 'busy',
      title: status === 'available' ? 'Disponible' : 'Ocupado',
      start: dateStr,
      end: dateStr,
    }
  })

  // Include any explicit records outside the current month (past/future)
  const outsideMonthEvents = availability
    .filter((a) => {
      const d = new Date(a.date + 'T00:00:00')
      return d.getFullYear() !== year || d.getMonth() !== month
    })
    .map((a) => ({
      id: a.id,
      calendarId: a.status === 'available' ? 'available' : 'busy',
      title: a.status === 'available' ? 'Disponible' : 'Ocupado',
      start: a.date,
      end: a.date,
    }))

  const calendar = useCalendarApp({
    defaultView: 'month-grid',
    views: [createViewMonthGrid()],
    selectedDate: todayStr,
    firstDayOfWeek: 0,
    calendars: {
      available: {
        colorName: 'available',
        lightColors: {
          main: '#22c55e',
          container: '#dcfce7',
          onContainer: '#166534',
        },
      },
      busy: {
        colorName: 'busy',
        lightColors: {
          main: '#9ca3af',
          container: '#f3f4f6',
          onContainer: '#374151',
        },
      },
    },
    events: [...currentMonthEvents, ...outsideMonthEvents],
  })

  return (
    <div className="rounded-lg overflow-hidden">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
