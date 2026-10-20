import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { hostOf } from './hostOf'

type Project = (typeof projects)[number]
type Link = { label: string; href: string }

export function CaseFacts({ project }: { project: Project }) {
  const stack = project.stack ?? []
  const links = [
    { label: 'Live', href: project.liveUrl },
    { label: 'Source', href: project.githubUrl },
    { label: 'Elsewhere', href: project.externalUrl },
  ].filter((l): l is Link => Boolean(l.href))
  return (
    <section
      className={css({
        bg: 'surface',
        paddingBlock: 'clamp(36px, 5vw, 64px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {stack.length > 0 ? (
        <ul
          className={css({
            listStyle: 'none',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '20px',
          })}
        >
          {stack.map((item) => (
            <li
              key={item}
              className={css({
                fontFamily: 'display',
                fontSize: 'sm',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                color: 'text',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'borderStrong',
                paddingInline: '12px',
                paddingBlock: '6px',
              })}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '24px' })}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={css({
              fontFamily: 'display',
              fontSize: '14px',
              color: 'text',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              textDecoration: 'underline',
              textDecorationColor: 'accent',
              textUnderlineOffset: '0.18em',
            })}
          >
            {link.label}: {hostOf(link.href)} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
