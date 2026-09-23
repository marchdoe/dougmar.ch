import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type CaseProject = (typeof projects)[number]

export function CaseLinks({ project }: { project: CaseProject }) {
  const links = [
    { label: 'Visit the live project →', href: project.liveUrl },
    { label: 'Source on GitHub →', href: project.githubUrl },
    { label: 'Open the project →', href: project.liveUrl ? undefined : project.externalUrl },
  ].filter((l) => Boolean(l.href))
  const stack = project.stack ?? []
  return (
    <section
      aria-label="Stack and links"
      className={css({
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(28px, 5vw, 44px)',
        paddingBottom: 'clamp(12px, 2vw, 20px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          textStyle: 'lg',
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '3',
        })}
      >
        Stack
      </h2>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
        {stack.map((s) => (
          <span
            key={s}
            className={css({
              fontSize: 'sm',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              paddingInline: '3',
              paddingBlock: '1',
            })}
          >
            {s}
          </span>
        ))}
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '5',
          rowGap: '0',
          marginTop: '3',
        })}
      >
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              fontWeight: 'bold',
              color: 'accent',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'transparent',
              _hover: { borderBottomColor: 'accent' },
            })}
          >
            {l.label}
          </a>
        ))}
      </div>
    </section>
  )
}
