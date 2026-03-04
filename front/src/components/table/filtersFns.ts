import dayjs from 'dayjs'
import type { Row } from '@tanstack/react-table'

export const textFilterFn = <T>(
  row: Row<T>,
  columnId: string,
  filterValue: string,
): boolean => {
  const value = row.getValue(columnId)
  return String(value ?? '')
    .toLowerCase()
    .includes(String(filterValue ?? '').toLowerCase())
}

export const numberFilterFn = <T>(
  row: Row<T>,
  columnId: string,
  filterValue: number | string,
): boolean => {
  const value = row.getValue(columnId)

  if (filterValue === null || filterValue === undefined || filterValue === '') {
    return true
  }

  const numericValue = Number(value)
  const numericFilter = Number(filterValue)

  if (Number.isNaN(numericValue) || Number.isNaN(numericFilter)) {
    return false
  }

  return numericValue === numericFilter
}

export const numberRangeFilterFn = <T>(
  row: Row<T>,
  columnId: string,
  filterValue?: [number?, number?],
): boolean => {
  const [min, max] = filterValue ?? []
  let value = row.getValue(columnId)

  if (typeof value === 'string') {
    value = Number.parseFloat(value.replace('%', '').trim())
  }

  if (typeof value !== 'number' || Number.isNaN(value)) {
    return false
  }

  if (min !== undefined && value < min) {
    return false
  }

  if (max !== undefined && value > max) {
    return false
  }

  return true
}

export const dateFilterFn = <T>(
  row: Row<T>,
  columnId: string,
  filterValue?: [string?, string?],
): boolean => {
  const [start, end] = filterValue ?? []
  const date = dayjs(row.getValue(columnId))

  if (!date.isValid()) {
    return false
  }

  if (start && date.isBefore(dayjs(start), 'day')) {
    return false
  }

  if (end && date.isAfter(dayjs(end), 'day')) {
    return false
  }

  return true
}

export const dateRangeFilterFn = <T>(
  row: Row<T>,
  columnId: string,
  filterValue?: { start?: string; end?: string },
): boolean => {
  const { start, end } = filterValue ?? {}
  const cellValue = row.getValue(columnId) as string | number | Date | undefined

  if (!cellValue) {
    return false
  }

  const date = dayjs(cellValue)

  if (!date.isValid()) {
    return false
  }

  const isAfterStart = start ? date.isSameOrAfter(dayjs(start), 'day') : true
  const isBeforeEnd = end ? date.isSameOrBefore(dayjs(end), 'day') : true

  return isAfterStart && isBeforeEnd
}

export const selectFilterFn = <T>(
  row: Row<T>,
  columnId: string,
  filterValue: string,
): boolean => {
  const value = row.getValue(columnId)

  if (!filterValue) {
    return true
  }

  if (Array.isArray(value)) {
    return value.some((item) => String(item) === String(filterValue))
  }

  return String(value) === String(filterValue)
}

export const multiSelectFilterFn = <T>(
  row: Row<T>,
  columnId: string,
  filterValue: Array<string | { label: string }>,
): boolean => {
  const rawValue = row.getValue(columnId)

  const rowValues = Array.isArray(rawValue)
    ? rawValue
    : rawValue !== undefined && rawValue !== null
      ? [rawValue]
      : []

  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true
  }

  return filterValue.some((filterItem) => {
    const filterVal =
      typeof filterItem === 'object' ? filterItem.label : filterItem

    return rowValues.some((val) => {
      if (val == null) {
        return false
      }

      const rowVal = typeof val === 'object' ? val.label || val.value : val
      return String(rowVal).toLowerCase() === String(filterVal).toLowerCase()
    })
  })
}
