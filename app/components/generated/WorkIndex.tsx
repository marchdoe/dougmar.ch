import { css } from '../../../styled-system/css'
import { selectedWork } from '../../content/projects'
import { RevealSection } from './RevealSection'

export function WorkIndex() {
  return (
    <RevealSection
      id="work"
      aria-label="Selected work"
      className={css({
        bg: 'bg',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: { base: '40px', lg: '56px' },
        paddingBottom: { base: '44px', lg: '48px' },
        paddingInline: { base: '24px', lg: '6vw' },
      })}
    >
      <h2
        className={css({
          textStyle: 'md',
          fontWeight: 'bold',
          letterSpacing: 'normal',
          color: 'text',
          marginBottom: '28px',
        })}
      >
        Selected Work
      </h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: 'repeat(3, minmax(0, 1fr))' },
          gap: { base: '24px', lg: 'clamp(24px, 3vw, 48px)' },
        })}
      >
        {selectedWork.map((project) => (
          <article
            key={project.slug}
            className={css({
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
            })}
          >
            <a
              href={`/work/${project.slug}`}
              className={css({
                display: 'block',
                paddingTop: '16px',
                paddingBottom: '4px',
                _hover: { textDecoration: 'none' },
              })}
            >
              <span
                className={css({
                  display: 'block',
                  fontFamily: 'body',
                  fontWeight: 'bold',
                  fontSize: { base: '30px', sm: '40px', lg: '28px', xl: '40px' },
                  lineHeight: '0.95',
                  color: 'text',
                  'a:hover &': { color: 'accent' },
                })}
              >
                {project.title}
              </span>
              <span
                className={css({
                  display: 'block',
                  marginTop: '10px',
                  textStyle: 'xs',
                  letterSpacing: 'wide',
                  textTransform: 'uppercase',
                  color: 'textMuted',
                  'a:hover &': { color: 'text' },
                })}
              >
                {project.type} · {project.year}
              </span>
            </a>
          </article>
        ))}
      </div>
    </RevealSection>
  )
}
