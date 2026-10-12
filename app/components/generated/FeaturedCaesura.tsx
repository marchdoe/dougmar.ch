import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

function CaesuraDeck({ text, href, title }: { text?: string; href?: string; title: string }) {
  return (
    <p
      className={css({
        marginTop: '12px',
        maxWidth: '46ch',
        fontSize: 'base',
        lineHeight: '1.5',
        color: 'fieldInkMuted',
      })}
    >
      {text}{' '}
      {href ? (
        <a
          href={href}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            marginTop: '6px',
            fontWeight: 'bold',
            color: 'fieldInk',
            textDecorationLine: 'underline',
            textDecorationColor: 'accentAlt',
            textUnderlineOffset: '3px',
            textDecorationThickness: '2px',
            _hover: { color: 'accentAlt' },
          })}
        >
          Visit {title} →
        </a>
      ) : null}
    </p>
  )
}

export function FeaturedCaesura() {
  const p = featuredProject
  if (!p) return null
  return (
    <article
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderRadius: 'sm',
        paddingTop: { base: '24px', md: '30px' },
        paddingInline: { base: '22px', md: '30px' },
        paddingBottom: { base: '28px', md: '34px' },
        display: { base: 'block', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gridColumn: { md: '1 / 7' },
        gridRow: { md: '1 / 3' },
        animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '240ms',
      })}
    >
      <span
        className={css({
          display: 'inline-block',
          fontWeight: 'bold',
          letterSpacing: '0.02em',
          fontSize: 'xl',
          color: 'accentAlt',
          marginBottom: '2px',
        })}
      >
        01
      </span>
      <a
        href={`/work/${p.slug}`}
        className={css({
          display: 'block',
          minHeight: '44px',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontVariant: 'small-caps',
          letterSpacing: 'normal',
          fontSize: { base: '44px', md: 'clamp(40px, 5.2vw, 96px)' },
          lineHeight: '0.94',
          color: 'fieldInk',
          _hover: { color: 'accentAlt' },
        })}
      >
        {p.title}
      </a>
      {/* Small year label moved from accentAlt to fieldInk: accentAlt on field measured 4.30:1. */}
      <span
        className={css({
          display: 'block',
          marginTop: '6px',
          fontWeight: 'bold',
          fontSize: 'sm',
          color: 'fieldInk',
          letterSpacing: '0.04em',
        })}
      >
        {p.year}
      </span>
      <span
        className={css({
          display: 'block',
          fontSize: 'sm',
          color: 'fieldInkMuted',
          letterSpacing: '0.02em',
        })}
      >
        {[p.type, p.role].filter(Boolean).join(' · ')}
      </span>
      <CaesuraDeck
        text={p.problem ?? p.description}
        href={p.liveUrl ?? p.externalUrl}
        title={p.title}
      />
    </article>
  )
}
