import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Masthead } from './Masthead'

type Project = (typeof projects)[number]
type Extras = { timeline?: string; status?: string }

export function CaseHero({ project }: { project: Project }) {
  const extra = project as Project & Extras
  const facts: [string, string | undefined][] = [
    ['Year', String(project.year)],
    ['Type', project.type],
    ['Role', project.role],
    ['Timeline', extra.timeline],
    ['Status', extra.status],
    ['Clients', project.clients?.map((c) => c.name).join(', ')],
  ]
  const shown = facts.filter(([, value]) => Boolean(value))
  return (
    <Masthead>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'hero',
          fontSize: 'clamp(36px, 9vw, 128px)',
          lineHeight: '0.98',
          textTransform: 'uppercase',
          textAlign: 'right',
          color: 'fieldInk',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {project.title}
      </h1>
      <div
        className={css({
          marginTop: 'clamp(16px, 2vw, 26px)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          rowGap: '3',
          columnGap: '6',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {shown.map(([label, value]) => (
          <div
            key={label}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '1',
              alignItems: 'flex-end',
              minWidth: '0',
            })}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                textStyle: '2xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
              })}
            >
              {label}
            </span>
            <span
              className={css({
                fontFamily: 'body',
                textStyle: 'sm',
                color: 'fieldInk',
                textAlign: 'right',
              })}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </Masthead>
  )
}
