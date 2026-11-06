import type { projects } from '../../content/projects'

export type CaseProject = (typeof projects)[number]

export function field(p: CaseProject, key: string): string {
  const v: unknown = (p as unknown as Record<string, unknown>)[key]
  return typeof v === 'string' ? v : ''
}
