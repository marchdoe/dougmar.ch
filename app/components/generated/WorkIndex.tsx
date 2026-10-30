import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { Label } from './Label'

export function WorkIndex() {
  const lead = featuredProject ? [featuredProject] : []
  const list = [...lead, ...selectedWork, ...experiments]
  return (
    <section
      className={css({
        marginTop: '48px',
        marginBottom: '38px',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: '18px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ marginBottom: '16px' })}>
        <Label>Index · Selected Work &amp; Experiments</Label>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          columnGap: { md: '40px' },
        })}
      >
        {list.map((p, i) => (
          <a
            key={p.slug}
            href={`/work/${p.slug}`}
            className={`group ${css({
              display: 'grid',
              gridTemplateColumns: '34px 1fr',
              alignItems: 'baseline',
              gap: '12px',
              paddingBlock: { base: '16px', lg: '20px' },
              paddingInline: { base: '6px', lg: '8px' },
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              color: 'text',
              transition: 'background 0.15s ease',
              _hover: { bg: 'bgAlt', textDecoration: 'none' },
            })}`}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: '2xs',
                letterSpacing: '0.08em',
                color: 'textFaint',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className={css({
                minWidth: '0',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              })}
            >
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'clamp(20px, 5vw, 28px)',
                  letterSpacing: '0.005em',
                  color: 'text',
                  lineHeight: '1.1',
                  transition: 'color 0.15s ease',
                  _groupHover: { color: 'accent' },
                })}
              >
                {p.title}
              </span>
              <span
                className={css({
                  fontFamily: 'body',
                  fontWeight: 'medium',
                  fontSize: '2xs',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'textMuted',
                })}
              >
                {p.type}{' '}
                <b
                  className={css({
                    color: 'text',
                    fontWeight: 'bold',
                    fontVariantNumeric: 'tabular-nums',
                  })}
                >
                  {p.year}
                </b>
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
