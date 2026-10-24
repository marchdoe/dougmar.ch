export function textField(project: unknown, key: string): string {
  if (typeof project !== 'object' || project === null) return ''
  const value = (project as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : ''
}

// a date range written with a dash reads as "2018 to Present"
export function rangeText(value: string): string {
  return value.replace(/\s*[\u2014\u2013]\s*/g, ' to ')
}

// a spaced dash inside a sentence becomes a comma
export function plainDash(value: string): string {
  return value.replace(/\s*\u2014\s*/g, ', ')
}
