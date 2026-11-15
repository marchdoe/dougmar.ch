import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

export function FeaturedCard() {
  const f = featuredProject
  if (!f) return null
  const href = f.externalUrl ?? f.liveUrl ?? `/work/${f.slug}`
  return (
    <div
      className={css({
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        borderRadius: 'sm',
        bg: 'field',
        color: 'fieldInk',
        padding: 'clamp(24px, 3vw, 40px)',
        marginBottom: '32px',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '4xl',
          fontSize: { base: '40px', md: '4xl' },
          lineHeight: '1',
        })}
      >
        {f.title}
      </div>
      <div
        className={css({
          fontSize: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          fontWeight: 'bold',
          marginTop: '14px',
        })}
      >
        {f.type} · {f.year}
      </div>
      {f.problem ? (
        <p
          className={css({
            fontSize: 'base',
            color: 'fieldInkMuted',
            maxWidth: '50ch',
            marginTop: '18px',
            marginBottom: '22px',
            lineHeight: '1.55',
          })}
        >
          {f.problem}
        </p>
      ) : null}
      <a
        href={href}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: 'sm',
          fontWeight: 'bold',
          color: 'fieldInk',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'fieldInk',
          borderRadius: 'md',
          paddingBlock: '11px',
          paddingInline: '20px',
          minHeight: '44px',
          _hover: { color: 'accent', borderColor: 'accent' },
        })}
      >
        Visit {f.title} →
      </a>
    </div>
  )
}
