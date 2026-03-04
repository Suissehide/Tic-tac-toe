export function hexToRGBA(hex: string, alpha: number) {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function parseRGBA(rgbaStr: string): string {
  const match = rgbaStr.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/,
  )
  if (!match) {
    return ''
  }

  const [, r, g, b, a] = match
  return rgbaToHex(
    Number.parseInt(r),
    Number.parseInt(g),
    Number.parseInt(b),
    a !== undefined ? Number.parseFloat(a) : 1,
  )
}

export function rgbaToHex(r: number, g: number, b: number, a = 1): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  const alpha = Math.round(a * 255)
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`
}

export function getContrastTextColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 125 ? '#000' : '#fff'
}
