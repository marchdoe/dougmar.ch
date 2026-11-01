import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { HeroField } from './HeroField'
import { Topbar } from './Topbar'

type Project = (typeof projects)[number]

function field(p: object, key: string): string {
  const v = (p as Record<string, unknown>)[key]
  return typeof v === 'string' ? v : ''
}

export function WorkHero({ project }: { project: Project }) {
  const meta = [
    project.type,
    String(project.year),
    project.role ?? '',
    field(project, 'timeline'),
    field(project, 'status'),
  ].filter(Boolean)
  return (
    <HeroField>
      <Topbar />
      <div
        className={css({
          paddingTop: { base: '6', lg: '7' },
          display: 'flex',
          flexDirection: { base: 'column', lg: 'row' },
          alignItems: { base: 'flex-start', lg: 'flex-end' },
          justifyContent: 'space-between',
          gap: '5',
          minWidth: '0',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            // fixed step at lg: the longest title ("Twittertale") must fit its track beside the meta list
            fontSize: { base: '36px', md: '56px', lg: '84px' },
            lineHeight: 'tight',
            textTransform: 'uppercase',
            color: 'text',
            bg: 'bg',
            paddingBlock: '2',
            paddingInline: '3',
            borderRadius: 'md',
            maxWidth: '100%',
            minWidth: '0',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            bg: 'bg',
            paddingBlock: '3',
            paddingInline: '4',
            borderRadius: 'md',
            display: 'flex',
            flexDirection: 'column',
            gap: '1',
            flexShrink: 0,
            textAlign: { base: 'left', lg: 'right' },
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {meta.map((m) => (
            <li key={m} className={css({ fontSize: 'md', color: 'textMuted' })}>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </HeroField>
  )
}
