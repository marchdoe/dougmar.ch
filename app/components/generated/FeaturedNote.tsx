import { css } from '../../../styled-system/css'

type Props = { title: string; problem: string; link: string }

export function FeaturedNote({ title, problem, link }: Props) {
  return (
    <div className={css({ display: 'grid', gap: '12px', paddingTop: '24px' })}>
      <span
        className={css({
          fontFamily: 'body',
          fontSize: 'xs',
          fontWeight: 600,
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'wide',
          color: 'accent',
        })}
      >
        Featured
      </span>
      <h3
        className={css({
          fontFamily: 'display',
          fontWeight: 500,
          fontSize: 'xl',
          letterSpacing: 'tight',
          lineHeight: '1.05',
          color: 'text',
        })}
      >
        {title}
      </h3>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: 'base',
          lineHeight: '1.6',
          color: 'textMuted',
          maxWidth: '46ch',
        })}
      >
        {problem}
      </p>
      {link ? (
        <a
          href={link}
          className={css({
            fontFamily: 'body',
            fontSize: 'sm',
            fontWeight: 600,
            letterSpacing: 'normal',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '44px',
            color: 'accent',
          })}
        >
          Visit {title} →
        </a>
      ) : null}
    </div>
  )
}
