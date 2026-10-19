import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]

export function field(obj: object, key: string): string {
  const value: unknown = Reflect.get(obj, key)
  return typeof value === 'string' ? value : ''
}

export function list(obj: object, key: string): string[] {
  const value: unknown = Reflect.get(obj, key)
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

export function projectHref(p: Proj): string {
  return p.depth === 'lightweight' && p.externalUrl ? p.externalUrl : `/work/${p.slug}`
}
