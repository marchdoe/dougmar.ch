import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const NAV = [
  { n: '01', label: 'Work', href: '/work' },
  { n: '02', label: 'About', href: '/about' },
  { n: '03', label: 'Contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingTop: { base: '6', lg: '7' },
        paddingBottom: { base: '5', lg: '6' },
        paddingInline: { base: '4', lg: '7', xl: '8' },
      })}
    >
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexDirection: { base: 'column', sm: 'row' },
          flexWrap: 'wrap',
          justifyContent: { base: 'flex-start', sm: 'flex-end' },
          rowGap: { base: '0', sm: '3' },
          columnGap: '6',
          paddingBottom: { base: '4', lg: '5' },
        })}
      >
        {NAV.map((item) => (
          <a
            key={item.n}
            href={item.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2',
              minHeight: '44px',
              minWidth: '88px',
              paddingBlock: '3',
              paddingInline: '1',
              textStyle: 'base',
              '&:hover [data-nl]': { borderBottomColor: 'fieldInk' },
            })}
          >
            <span
              className={css({
                textStyle: 'sm',
                color: 'accentAlt',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {item.n}
            </span>
            <span
              data-nl=""
              className={css({
                color: 'fieldInk',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'transparent',
              })}
            >
              {item.label}
            </span>
          </a>
        ))}
      </nav>
      <hr
        className={css({
          borderWidth: '0',
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          margin: '0',
        })}
      />
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '4',
          paddingTop: { base: '4', lg: '5' },
        })}
      >
        <span className={css({ textStyle: 'sm', color: 'fieldInkMuted', letterSpacing: 'wide' })}>
          {identity.name}, {identity.role}
        </span>
        <p
          className={css({
            textStyle: 'sm',
            color: 'fieldInkMuted',
            lineHeight: 'loose',
            maxWidth: '48ch',
            textAlign: { base: 'left', sm: 'right' },
          })}
        >
          Mist, 58°F, wind 2 mph · SPY 764.20 −0.18% · Waning gibbous, 78% lit · In rotation:
          Radiohead, Guided by Voices, Wet Leg
        </p>
      </div>
    </footer>
  )
}
