import type { CSSProperties } from 'react'
import { css } from '../../../styled-system/css'
import { featuredProject, projects } from '../../content/projects'

type Bar = { year: number; count: number; pct: number; hot: boolean }

function countByYear(): Map<number, number> {
  const counts = new Map<number, number>()
  for (const p of projects) counts.set(p.year, (counts.get(p.year) ?? 0) + 1)
  return counts
}

function toBars(): Bar[] {
  const counts = countByYear()
  const max = Math.max(1, ...counts.values())
  const hotYear = featuredProject?.year
  return [...counts.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({
      year,
      count,
      hot: year === hotYear,
      pct: year === hotYear ? 72 : Math.round(14 + (count / max) * 32),
    }))
}

export function HustleChart() {
  const bars = toBars()
  const summary = bars.map((b) => `${b.year}: ${b.count}`).join(', ')
  return (
    <figure
      className={css({
        margin: '0',
        marginBottom: 'clamp(40px, 5vh, 64px)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border',
        bg: 'bg',
        padding: 'clamp(20px, 3vw, 32px)',
        minWidth: '0',
      })}
    >
      <figcaption
        className={css({
          fontSize: 'sm',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'textMuted',
          marginBottom: '4px',
        })}
      >
        Figure 1 · the hustle, by year
      </figcaption>
      <p
        className={css({
          margin: '0',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'all-small-caps',
          fontSize: 'xl',
          color: 'text',
          letterSpacing: '0.02em',
          marginBottom: '22px',
        })}
      >
        Eighteen years of shipping
      </p>
      <div role="img" aria-label={`Projects per year, ${summary}.`}>
        <div
          className={css({
            position: 'relative',
            height: '200px',
            borderBottomWidth: '1.5px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'borderStrong',
            borderLeftWidth: '1.5px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'borderStrong',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 'clamp(6px, 2vw, 22px)',
            paddingInline: '6px',
          })}
        >
          {bars.map((b) => (
            <div
              key={b.year}
              style={{ '--h': `${b.pct}%` } as CSSProperties}
              className={css({
                flex: '1',
                minWidth: '0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                height: '100%',
              })}
            >
              <span
                className={css({
                  display: 'block',
                  width: '100%',
                  maxWidth: '46px',
                  height: 'var(--h)',
                  borderTopRadius: '2px',
                  bg: b.hot ? 'accent' : 'field',
                })}
              />
              <span
                className={css({
                  fontSize: 'xs',
                  color: 'textMuted',
                  fontVariantNumeric: 'tabular-nums',
                })}
              >
                {b.count}
                {b.hot ? '★' : ''}
              </span>
            </div>
          ))}
        </div>
        <div
          className={css({
            display: 'flex',
            gap: 'clamp(6px, 2vw, 22px)',
            paddingTop: '8px',
            paddingInline: '6px',
          })}
        >
          {bars.map((b) => (
            <span
              key={b.year}
              className={css({
                flex: '1',
                minWidth: '0',
                textAlign: 'center',
                fontSize: 'xs',
                color: 'textMuted',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.04em',
              })}
            >
              {b.year}
            </span>
          ))}
        </div>
      </div>
    </figure>
  )
}
