import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

export function FeaturedRow() {
  if (!featuredProject) return null
  const p = featuredProject
  const out = p.externalUrl ?? p.liveUrl
  return (
    <div
      className={css({
        position: 'relative',
        paddingBlock: '20px',
        paddingInline: '6px',
        borderTop: '1px solid',
        borderColor: 'border',
        lg: {
          gridColumn: '6 / 13',
          paddingBlock: '26px',
          paddingInline: '0',
        },
      })}
    >
      <a
        href={`/work/${p.slug}`}
        className={css({ display: 'block', color: 'text', _hover: { color: 'text' } })}
      >
        <span
          className={css({
            display: 'flex',
            alignItems: 'baseline',
            gap: '14px',
            flexWrap: 'wrap',
          })}
        >
          <span
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              lineHeight: 'tight',
              fontSize: { base: '44px', lg: 'clamp(64px, 6.5vw, 94px)' },
              color: 'text',
            })}
          >
            {p.title}
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 'tight',
              fontSize: { base: 'xl', lg: '3xl' },
              color: 'textFaint',
              marginLeft: 'auto',
            })}
          >
            {p.year}
          </span>
        </span>
        <span
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: '1',
            columnGap: '20px',
            alignItems: 'baseline',
            marginTop: '12px',
            fontSize: 'sm',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
          })}
        >
          <span className={css({ color: 'textFaint' })}>{p.type}</span>
          <span className={css({ color: 'accentAlt', letterSpacing: 'wider' })}>View ↗</span>
        </span>
      </a>
      <p
        className={css({
          marginTop: '16px',
          maxWidth: '48ch',
          color: 'textMuted',
          fontSize: 'base',
          lineHeight: 'normal',
        })}
      >
        {p.problem}
      </p>
      {out ? (
        <a
          href={out}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            marginTop: '2',
            fontVariant: 'small-caps',
            letterSpacing: 'wider',
            fontSize: 'sm',
            color: 'accentAlt',
            borderBottom: '2px solid',
            borderColor: 'accent',
            paddingBottom: '2px',
            _hover: { color: 'text' },
          })}
        >
          Visit {p.title} ↗
        </a>
      ) : null}
    </div>
  )
}
