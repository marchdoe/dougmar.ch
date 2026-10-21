import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseStack({ project }: { project: Project }) {
  const links = [
    { label: 'Visit the live site ↗', href: project.liveUrl },
    { label: 'Open the project ↗', href: project.externalUrl },
    { label: 'Source on GitHub ↗', href: project.githubUrl },
  ].filter((link) => Boolean(link.href))
  const stack = project.stack ?? []
  return (
    <section
      aria-label="Stack and links"
      className={css({
        paddingInline: '5vw',
        paddingBottom: 'clamp(30px, 4vw, 56px)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '24px',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '18px',
          rowGap: '8px',
          maxWidth: '60ch',
        })}
      >
        {stack.map((item) => (
          <span
            key={item}
            className={css({
              fontSize: '15px',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'textMuted',
            })}
          >
            {item}
          </span>
        ))}
      </div>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '12px' })}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              paddingBlock: '10px',
              paddingInline: '20px',
              bg: 'field',
              color: 'fieldInk',
              fontSize: '14px',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              borderRadius: 'sm',
              _hover: { bg: 'accent', color: 'fieldInk' },
            })}
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  )
}
