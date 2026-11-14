import type { projects } from '../../content/projects'

export type Project = (typeof projects)[number]

export function field(project: Project, key: string): string {
  const value = (project as unknown as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : ''
}
