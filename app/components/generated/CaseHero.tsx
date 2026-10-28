import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { FogField } from './FogField'

type CaseProject = (typeof projects)[number] & { timeline?: string; status?: string }

export function CaseHero({ project }: { project: CaseProject }) {
  const meta = [
    { label: 'Type', value: project.type },
    { label: 'Year', value: String(project.year) },
    { label: 'Role', value: project.role ?? '' },
    { label: 'Timeline', value: project.timeline ?? '' },
    { label: 'Status', value: project.status ?? '' },
  ].filter((m) => m.value !== '')
  return (
    <FogField>
      <div
        className={css({
          paddingTop: 'clamp(48px, 10vh, 120px)',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', xl: '1fr 280px' },
          columnGap: '7',
          rowGap: '5',
          alignItems: 'end',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'light',
            textStyle: { base: '4xl', md: '5xl' },
            color: 'text',
            minWidth: '0',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
        <dl
          className={css({
            margin: '0',
            bg: 'bg',
            padding: '4',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            columnGap: '4',
            rowGap: '2',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {meta.map((m) => (
            <div key={m.label} className={css({ display: 'contents' })}>
              <dt
                className={css({
                  fontSize: 'sm',
                  fontVariantCaps: 'all-small-caps',
                  letterSpacing: 'wider',
                  color: 'textMuted',
                })}
              >
                {m.label}
              </dt>
              <dd className={css({ margin: '0', fontSize: 'sm', color: 'text' })}>{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </FogField>
  )
}
