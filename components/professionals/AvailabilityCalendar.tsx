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
  const today = new Date().toISOString().split('T')[0]

  const calendar = useCalendarApp({
    defaultView: 'month-grid',
    views: [createViewMonthGrid()],
    selectedDate: today,
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
    events: availability.map((a) => ({
      id: a.id,
      calendarId: a.status === 'available' ? 'available' : 'busy',
      title: a.status === 'available' ? 'Disponible' : 'Ocupado',
      start: a.date,
      end: a.date,
    })),
  })

  return (
    <div className="rounded-lg overflow-hidden">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
