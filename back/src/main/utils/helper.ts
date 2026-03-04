export const toWords = (s: string): RegExpMatchArray | null => {
  const regex =
    /[A-Z\u00C0-\u00D6\u00D8-\u00DE]?[a-z\u00DF-\u00F6\u00F8-\u00FF]+|[A-Z\u00C0-\u00D6\u00D8-\u00DE]+(?![a-z\u00DF-\u00F6\u00F8-\u00FF])|\d+/g
  return s.match(regex)
}

export const toCamelCase = (s: string): string => {
  const words = toWords(s)
  if (!words) {
    return ''
  }
  const camelCaseWords: string[] = words.map((word, index) => {
    const lowerCaseWord = word.toLowerCase()
    return index > 0
      ? `${lowerCaseWord.slice(0, 1).toUpperCase()}${lowerCaseWord.slice(1)}`
      : lowerCaseWord
  })
  return camelCaseWords.join('')
}

export const isKey = <T extends object>(o: T, k: PropertyKey): k is keyof T => {
  return k in o
}

export const recordToString = (record: Record<string, unknown>): string =>
  Object.keys(record)
    .sort((key1, key2) => key1.localeCompare(key2))
    .reduce((lines: string[], key: string) => {
      const val = [key, record[key]].join(': ')
      lines.push(val)
      return lines
    }, [])
    .join('\n\t')

export const pickFromDict = <T extends { [s: string]: unknown }>(
  source: NodeJS.Dict<string>,
  keys: string[],
  keyTransformer?: (key: string) => string,
): T =>
  keys.reduce(
    (acc, name) => {
      const key = keyTransformer?.(name) ?? name
      acc[key] = source[name]
      return acc
    },
    Object.create({} as T),
  )

export const normalizeEmail = (email: string): string => {
  return email.trim().replace(/\s+/g, '').toLowerCase()
}

export const normalizePhone = (phone: string): string => {
  const cleanedPhone = phone.replace(/[^\d]/g, '')
  const withoutPrefix = cleanedPhone.replace(/^(0|33|\+33)/, '')
  return `+33${withoutPrefix}`
}


type PickNullable<T> = {
  [P in keyof T as null extends T[P] ? P : never]: T[P]
}

type PickNotNullable<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P]
}

export type OptionalNullable<T> = T extends object
  ? {
      [K in keyof PickNullable<T>]?: OptionalNullable<Exclude<T[K], null>>
    } & {
      [K in keyof PickNotNullable<T>]: OptionalNullable<T[K]>
    }
  : T
