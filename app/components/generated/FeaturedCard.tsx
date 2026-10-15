import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

export function FeaturedCard() {
  if (!featuredProject) return null
  const p = featuredProject
  const meta = [p.role, String(p.year)].filter(Boolean).join(' · ')
  return (
    <article
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: 'minmax(0, 0.9fr) minmax(0, 1.1fr)' },
        alignItems: { lg: 'start' },
        gap: { base: '4', lg: '6' },
        bg: 'bgAlt',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        borderRadius: 'md',
        padding: { base: '4', md: '5' },
        marginBottom: '6',
      })}
    >
      <div className={css({ display: 'flex', flexDirection: 'column', minWidth: '0' })}>
        <span
          className={css({
            fontWeight: 'bold',
            fontSize: '2xs',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'accentAlt',
          })}
        >
          Featured
        </span>
        <h3
          className={css({
            fontFamily: 'display',
            textStyle: { base: 'lg', lg: 'xl' },
            fontWeight: 'normal',
            lineHeight: 'tight',
            color: 'text',
            marginTop: '2',
          })}
        >
          {p.title}
        </h3>
        <div
          className={css({
            fontSize: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'textFaint',
            marginTop: '12px',
          })}
        >
          {meta}
        </div>
      </div>
      <div className={css({ minWidth: '0' })}>
        <p
          className={css({
            fontSize: 'base',
            lineHeight: 'normal',
            color: 'textMuted',
            maxWidth: '50ch',
          })}
        >
          {p.problem ?? p.description}
        </p>
        <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5' })}>
          <a
            href={`/work/${p.slug}`}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2',
              fontWeight: 'bold',
              fontSize: 'sm',
              paddingBlock: '12px',
              minHeight: '44px',
              color: 'accent',
              _hover: { color: 'accentAlt' },
            })}
          >
            Read the case study <span aria-hidden="true">→</span>
          </a>
          {p.externalUrl ? (
            <a
              href={p.externalUrl}
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2',
                fontWeight: 'bold',
                fontSize: 'sm',
                paddingBlock: '12px',
                minHeight: '44px',
                color: 'accent',
                _hover: { color: 'accentAlt' },
              })}
            >
              Visit the site <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
