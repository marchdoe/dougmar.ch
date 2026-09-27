import type { CSSProperties } from 'react'
import { css, cx } from '../../../styled-system/css'

function longestWord(title: string) {
  return title.split(/\s+/).reduce((max, word) => Math.max(max, word.length), 4)
}

export function IndexRow({
  href,
  title,
  year,
  type,
}: {
  href: string
  title: string
  year: string
  type: string
}) {
  return (
    <li
      style={{ '--len': longestWord(title) } as CSSProperties}
      className={css({ containerType: 'inline-size' })}
    >
      <a
        href={href}
        className={cx(
          'group',
          css({
            display: 'grid',
            gridTemplateColumns: 'auto minmax(0, 1fr)',
            alignItems: 'baseline',
            columnGap: '12px',
            paddingBlock: '14px',
            paddingLeft: '6px',
            paddingRight: '2',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
            transition: 'background 0.15s ease',
            _hover: { bg: 'bgAlt' },
          })
        )}
      >
        <span
          aria-hidden="true"
          className={css({
            fontFamily: 'display',
            fontSize: 'sm',
            color: 'textFaint',
            alignSelf: 'start',
            paddingTop: '0.6em',
            _groupHover: { color: 'accent' },
          })}
        >
          ▸
        </span>
        {/* capitals in the display face run near 0.61em a letter; 0.66 keeps the longest title inside its track */}
        <span
          className={css({
            display: 'block',
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: {
              base: 'min(clamp(26px, 7.2vw, 40px), calc((100cqi - 40px) / (var(--len) * 0.66)))',
              lg: 'min(96px, calc((100cqi - 48px) / (var(--len) * 0.66)))',
            },
            lineHeight: { base: '1', lg: '0.98' },
            letterSpacing: '-0.01em',
            color: 'text',
            _groupHover: { color: 'accentAlt' },
          })}
        >
          {title}
        </span>
        <span
          className={css({
            gridColumn: '2',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            marginTop: { base: '2', lg: '12px' },
            fontFamily: 'display',
            fontSize: 'sm',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'textMuted',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          <span className={css({ color: 'accent' })}>{year}</span>
          <span>{type}</span>
        </span>
      </a>
    </li>
  )
}
