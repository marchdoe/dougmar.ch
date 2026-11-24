import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function WorkIndex({ items, label }: { items: Project[]; label: string }) {
  return (
    <section
      aria-label={label}
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(44px, 6vw, 72px)',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'accent',
          marginBottom: '24px',
        })}
      >
        {label}
      </div>
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {items.map((project) => (
          <li
            key={project.slug}
            className={css({
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              _last: {
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'border',
              },
            })}
          >
            <a
              href={`/work/${project.slug}`}
              className={css({
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                rowGap: '16px',
                columnGap: '24px',
                flexWrap: { base: 'wrap', lg: 'nowrap' },
                paddingBlock: '16px',
                minHeight: '44px',
                color: 'text',
                _hover: { textDecoration: 'none' },
                '&:hover [data-wtitle]': { color: 'accent' },
              })}
            >
              <span
                data-wtitle=""
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  textStyle: { base: 'xl', lg: '2xl' },
                  lineHeight: '1.05',
                  letterSpacing: '-0.01em',
                })}
              >
                {project.title}
              </span>
              <span
                className={css({
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'baseline',
                  fontFamily: 'body',
                  textStyle: 'xs',
                  letterSpacing: '0.02em',
                  color: 'textMuted',
                })}
              >
                <span
                  className={css({
                    textTransform: 'uppercase',
                    letterSpacing: 'wide',
                    color: 'textFaint',
                    textStyle: '2xs',
                  })}
                >
                  {project.type}
                </span>
                <span className={css({ fontVariantNumeric: 'tabular-nums' })}>{project.year}</span>
                <span className={css({ color: 'accent', fontWeight: 'bold' })}>→</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
