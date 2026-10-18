import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const strong = css({ color: 'text', fontWeight: '500' })

export function FooterStrip() {
  // Mockup ice blue (#52A5E0) has no token; nearest semantic ink used is textMuted.
  const data: { k: string; v: ReactNode }[] = [
    { k: 'Where', v: <span className={strong}>Aldie, VA</span> },
    {
      k: 'Weather',
      v: (
        <>
          <span className={strong}>38°F</span> clear
        </>
      ),
    },
    { k: 'Air', v: 'AQI 1 · good' },
    { k: 'Moon', v: 'first quarter · 54%' },
    {
      k: 'Market',
      v: (
        <>
          SPY <span className={strong}>763.25</span> ▼ 1.1%
        </>
      ),
    },
    { k: 'On the tee', v: 'Butterfield, Bermuda' },
    { k: 'On rotation', v: 'Guided by Voices · Radiohead · Tobin Sprout' },
    {
      k: 'Write',
      v: (
        <a
          href={`mailto:${identity.email}`}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            color: { base: 'accent', _light: 'text' },
            textDecoration: { base: 'none', _light: 'underline' },
            _hover: { color: 'accentAlt' },
          })}
        >
          {identity.email}
        </a>
      ),
    },
  ]
  return (
    <footer
      className={css({
        marginTop: '48px',
        borderTop: '2px solid',
        borderColor: 'borderStrong',
        paddingTop: { base: '36px', lg: '64px' },
        paddingBottom: { base: '56px', lg: '72px' },
        paddingLeft: { base: '20px', lg: 'clamp(32px, 4vw, 64px)' },
        paddingRight: { base: '20px', lg: 'clamp(40px, 6vw, 112px)' },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '18px',
          columnGap: '28px',
          marginBottom: '28px',
        })}
      >
        {data.map((d) => (
          <div
            key={d.k}
            className={css({ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' })}
          >
            <span
              className={css({
                fontSize: '13px',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                color: 'textFaint',
              })}
            >
              {d.k}
            </span>
            <span
              className={css({
                fontSize: '14px',
                color: 'textMuted',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {d.v}
            </span>
          </div>
        ))}
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '16px',
          paddingTop: '24px',
          borderTop: '1px solid',
          borderColor: 'border',
        })}
      >
        <p className={css({ fontSize: '14px', maxWidth: '52ch', color: 'textMuted' })}>
          "Shoot for the moon. Even if you miss, you'll land among the stars."{' '}
          <cite className={css({ color: 'textFaint', fontStyle: 'normal' })}>Les Brown</cite>
        </p>
        <div className={css({ fontSize: '13px', color: 'textFaint' })}>
          {identity.name} · {identity.role} · © 2026
        </div>
      </div>
    </footer>
  )
}
