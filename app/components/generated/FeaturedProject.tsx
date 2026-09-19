import { css } from '../../../styled-system/css'

type Props = {
  slug: string
  title: string
  role?: string
  year: number
  problem?: string
  description?: string
  externalUrl?: string
  liveUrl?: string
}

export function FeaturedProject(p: Props) {
  const href = p.externalUrl || p.liveUrl || `/work/${p.slug}`
  const meta = [p.role, String(p.year)].filter(Boolean).join(' · ')
  const copy = p.problem || p.description

  return (
    <article
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderRadius: 'md',
        p: { base: '5', lg: '7' },
        mb: '6',
      })}
    >
      <span
        className={css({
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
        })}
      >
        Featured
      </span>
      <h3
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'lg',
          mt: '2',
          mb: '1',
          letterSpacing: 'tight',
        })}
      >
        {p.title}
      </h3>
      <p className={css({ textStyle: 'sm', color: 'fieldInkMuted', mb: '4' })}>{meta}</p>
      {copy && (
        <p
          className={css({
            textStyle: 'base',
            lineHeight: 'loose',
            color: 'fieldInk',
            maxWidth: '56ch',
            mb: '4',
          })}
        >
          {copy}
        </p>
      )}
      <a
        href={href}
        className={css({
          color: 'accentAlt',
          fontWeight: 'bold',
          textStyle: 'sm',
          letterSpacing: 'wide',
        })}
      >
        Open the case →
      </a>
    </article>
  )
}
