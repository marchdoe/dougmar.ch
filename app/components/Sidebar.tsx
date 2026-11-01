import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { identity } from '../content/about'

// The 820px fault ("A new design ships every morning...") is measured inside the rail that
// __root.tsx renders above Layout. Nothing in this shell renders or styles that element.

const signals: { label: string; value: ReactNode }[] = [
  {
    label: 'Detroit',
    value: <span className={css({ color: 'accent', fontWeight: 'bold' })}>Red Wings fall 4–5</span>,
  },
  { label: 'Golf', value: 'Mexico Open · Novak at 23 under, Ghim at 16 under' },
  { label: 'Market', value: 'SPY 755.72, down 1.77%' },
  { label: 'Sky', value: 'Last quarter moon, 53% lit · Air quality moderate' },
  { label: 'In rotation', value: 'The War on Drugs, Tobin Sprout' },
]

export function Sidebar() {
  const nav = [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: `mailto:${identity.email}` },
  ]
  return (
    <footer
      className={css({
        bg: 'bgAlt',
        color: 'text',
        paddingTop: { base: '6', lg: '8' },
        paddingBottom: { base: '6', lg: '7' },
        paddingInline: { base: '5', md: '7', xl: '8' },
        display: 'grid',
        gap: { base: '6', lg: '7' },
        gridTemplateColumns: { base: '1fr', lg: 'minmax(240px, 1fr) 1.4fr' },
        alignItems: 'start',
      })}
    >
      <nav aria-label="Primary" className={css({ display: 'flex', flexDirection: 'column' })}>
        {nav.map((item, i) => (
          <a
            key={item.label}
            href={item.href}
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBlock: '4',
              minHeight: '44px',
              fontFamily: 'display',
              fontWeight: 'normal',
              textStyle: { base: 'lg', lg: 'xl' },
              color: 'textMuted',
              borderTop: i === 0 ? 'none' : '1px solid',
              borderColor: 'fieldBorder',
              transition: 'color 0.2s ease',
              _hover: { color: 'accent' },
            })}
          >
            {item.label}
            <span aria-hidden="true" className={css({ fontSize: 'md', color: 'textFaint' })}>
              →
            </span>
          </a>
        ))}
      </nav>

      <div
        className={css({
          display: 'grid',
          gap: '5',
          borderTop: { base: '1px solid', lg: 'none' },
          borderLeft: { base: 'none', lg: '1px solid' },
          borderColor: 'fieldBorder',
          paddingTop: { base: '5', lg: '0' },
          paddingLeft: { base: '0', lg: '6' },
        })}
      >
        {signals.map((s) => (
          <div
            key={s.label}
            className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}
          >
            <span
              className={css({
                fontSize: '2xs',
                fontWeight: 'bold',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'textFaint',
              })}
            >
              {s.label}
            </span>
            <span
              className={css({
                fontSize: 'sm',
                color: 'textMuted',
                lineHeight: 'normal',
                maxWidth: '50ch',
              })}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>

      <div
        className={css({
          gridColumn: '1 / -1',
          borderTop: '1px solid',
          borderColor: 'fieldBorder',
          paddingTop: '5',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          rowGap: '2',
          columnGap: '4',
          fontSize: 'xs',
          color: 'textFaint',
        })}
      >
        <span>
          © 2026 {identity.name}, {identity.role} · Aldie, Virginia
        </span>
        <span>
          <em
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              color: 'textMuted',
              fontSize: 'sm',
            })}
          >
            Loss is nothing else but change.
          </em>{' '}
          Marcus Aurelius
        </span>
      </div>
    </footer>
  )
}
