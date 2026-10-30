import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Label } from './Label'

type Project = (typeof projects)[number]

export function CaseStack({ project }: { project: Project }) {
  const stack = project.stack ?? []
  const links = [
    { k: 'Live site', v: project.liveUrl ?? '' },
    { k: 'Visit', v: project.externalUrl ?? '' },
    { k: 'Source', v: project.githubUrl ?? '' },
  ].filter((l) => l.v !== '')
  return (
    <section
      className={css({
        marginTop: '12px',
        paddingTop: '22px',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <Label>Stack</Label>
      <div className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '8px', columnGap: '20px' })}>
        {stack.map((s) => (
          <span
            key={s}
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontSize: 'base',
              color: 'text',
            })}
          >
            {s}
          </span>
        ))}
      </div>
      <div className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '4px', columnGap: '20px' })}>
        {links.map((l) => (
          <a
            key={l.k}
            href={l.v}
            target="_blank"
            rel="noopener"
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              minWidth: '44px',
              fontFamily: 'body',
              fontWeight: 'bold',
              fontSize: '13px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'accent',
            })}
          >
            {l.k} →
          </a>
        ))}
      </div>
    </section>
  )
}
