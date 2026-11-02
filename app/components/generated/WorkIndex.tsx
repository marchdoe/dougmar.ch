import { css, cx } from '../../../styled-system/css'
import { projects } from '../../content/projects'
import { SectionHead, revealSection } from './SectionHead'

export function WorkIndex() {
  return (
    <section
      id="work"
      aria-label="Selected work"
      className={cx(
        css({
          bg: 'bgAlt',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingBlock: 'clamp(36px, 6vh, 64px)',
          paddingInline: { base: '6vw', lg: '5vw' },
        }),
        revealSection
      )}
    >
      <SectionHead>The Work Index</SectionHead>
      <ul
        className={css({ listStyle: 'none', marginTop: '16px', marginBottom: '0', padding: '0' })}
      >
        {projects.map((p) => (
          <li
            key={p.slug}
            className={css({
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <a
              href={`/work/${p.slug}`}
              className={css({
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '12px',
                paddingBlock: '16px',
                paddingInline: '2px',
                flexWrap: 'wrap',
                minHeight: '44px',
                color: 'text',
                _hover: { color: 'accentAlt' },
              })}
            >
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'clamp(26px, 3.6vw, 40px)',
                  lineHeight: '1',
                  letterSpacing: '0.005em',
                })}
              >
                {p.title}
              </span>
              <span
                className={css({
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'baseline',
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'sm',
                  textTransform: 'uppercase',
                  letterSpacing: 'wider',
                  color: 'text',
                })}
              >
                <span>{p.type}</span>
                <span
                  className={css({
                    color: 'text',
                    paddingLeft: '10px',
                    borderLeftWidth: '3px',
                    borderLeftStyle: 'solid',
                    borderLeftColor: 'accent',
                  })}
                >
                  {p.year}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
