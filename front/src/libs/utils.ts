import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

/**
 * Transforme un objet {clé: label} en [{value, label}]
 */
export function toSelectOptions<T extends Record<string, string>>(dict: T) {
  return Object.entries(dict).map(([value, label]) => ({
    value,
    label,
  }))
}

export function getLabel<T extends Record<string, string>>(
  dict: T,
  value: string | null | undefined,
  fallback: string = '-',
): string {
  if (!value) {
    return fallback
  }
  return dict[value] || value
}

/**
 * Date / Time
 */
export function combineDateAndTime(
  date: Date | string,
  time: Date | string,
): Date {
  const baseDate = dayjs.utc(date)
  const baseTime = dayjs.utc(time)

  return baseDate
    .hour(baseTime.hour())
    .minute(baseTime.minute())
    .second(baseTime.second())
    .millisecond(baseTime.millisecond())
    .toDate()
}

export const formatDuration = (start?: Date | string, end?: Date | string) => {
  if (!start || !end) {
    return ''
  }

  const diffInMinutes = dayjs(end).diff(dayjs(start), 'minute')
  const hours = Math.floor(diffInMinutes / 60)
  const minutes = diffInMinutes % 60

  if (hours === 0) {
    return `(${minutes}min)`
  }

  if (minutes === 0) {
    return `(${hours}h)`
  }

  return `(${hours}h${minutes})`
}

export const generateDurationOptions = (
  startDate?: string,
  maxDate?: string,
) => {
  if (!startDate || !maxDate) {
    return []
  }

  const maxMinutes = dayjs(maxDate).diff(dayjs(startDate), 'minute')
  const options = []

  for (let min = 15; min <= maxMinutes; min += 15) {
    const hours = Math.floor(min / 60)
    const minutes = min % 60
    let label = ''
    if (hours && minutes) {
      label = `${hours}h${minutes}`
    } else if (hours) {
      label = `${hours}h`
    } else {
      label = `${minutes}min`
    }

    options.push({ label, value: min.toString() })
  }

  return options
}
