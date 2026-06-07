import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const COUNTRY_PREFIXES = ['sv', 'gt', 'hn', 'ni', 'cr', 'pa', 'bz'] as const
export type CountryPrefix = (typeof COUNTRY_PREFIXES)[number]

export function isCountryPrefix(segment: string): segment is CountryPrefix {
  return COUNTRY_PREFIXES.includes(segment as CountryPrefix)
}

export const DAY_LABELS: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  responded: 'Cotizada',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
}

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  responded: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}
