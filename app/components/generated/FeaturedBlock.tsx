import { css } from '../../../styled-system/css'

type Props = { problem: string; url?: string }

function hostOf(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

// Mockup accentDeep (#223f10) has no token; nearest semantic ink on bg is `accent`.
export function FeaturedBlock({ problem, url }: Props) {
  return (
    <div
      className={css({
        display: 'block',
        marginTop: '16px',
        paddingBlock: '16px',
        paddingInline: '18px',
        bg: 'bg',
        borderLeftWidth: '3px',
        borderLeftStyle: 'solid',
        borderLeftColor: 'accent',
        maxWidth: '68ch',
      })}
    >
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          fontSize: '2xs',
          letterSpacing: 'wide',
          color: 'accent',
          marginBottom: '6px',
        })}
      >
        Problem
      </span>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: '15px',
          lineHeight: '1.5',
          color: 'text',
          maxWidth: '48ch',
        })}
      >
        {problem}
      </p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            marginTop: '10px',
            minHeight: '44px',
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: 'sm',
            color: 'accent',
            _hover: { textDecoration: 'underline' },
          })}
        >
          Visit {hostOf(url)} ↗
        </a>
      ) : null}
    </div>
  )
}
