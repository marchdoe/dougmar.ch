import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { SectionHead } from './SectionHead'

const TAIL = [
  { k: 'Market close', v: 'SPY 771.35 ▲' },
  { k: 'Moon', v: '97% · rising' },
  { k: 'Weather', v: 'Aldie 60°F · cloudy' },
  { k: 'Air', v: 'Good' },
]

export function LogTail() {
  const signature = [identity.name, identity.role, 'Ashburn Virginia', '2026']
    .filter(Boolean)
    .join(' · ')
  return (
    <footer
      className={css({
        gridArea: 'footer',
        paddingTop: { base: '5', lg: '56px' },
        paddingInline: { base: '3', lg: '6vw' },
        paddingBottom: { base: '44px', lg: '72px' },
      })}
    >
      <SectionHead label="Log tail" aside="Closing entries" />
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {TAIL.map((row) => (
          <li
            key={row.k}
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
              gap: '3',
              paddingBlock: '11px',
              paddingInline: '1',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              fontFamily: 'display',
              fontSize: 'sm',
              color: 'textMuted',
            })}
          >
            <span className={css({ display: 'inline-flex', alignItems: 'center', gap: '2' })}>
              {/* decorative marker drawn as a box, not a glyph, so the line never opens on a separator */}
              <span
                aria-hidden="true"
                className={css({
                  display: 'inline-block',
                  width: '4px',
                  height: '4px',
                  bg: 'textFaint',
                  flexShrink: '0',
                })}
              />
              <span>{row.k}</span>
            </span>
            <span className={css({ textAlign: 'right' })}>{row.v}</span>
          </li>
        ))}
      </ul>
      <div
        className={css({
          marginTop: '22px',
          fontFamily: 'display',
          fontSize: '2xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'text',
        })}
      >
        {signature}
      </div>
      <a
        href={`mailto:${identity.email}`}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          fontFamily: 'display',
          fontSize: 'sm',
          color: 'text',
          textDecoration: 'underline',
          textDecorationColor: 'accent',
          textDecorationThickness: '2px',
          textUnderlineOffset: '4px',
          _hover: { color: 'accent' },
        })}
      >
        {identity.email}
      </a>
      <div
        className={css({
          marginTop: '2',
          fontFamily: 'display',
          fontSize: '2xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textFaint',
        })}
      >
        On rotation: Radiohead / The War on Drugs / My Morning Jacket
      </div>
    </footer>
  )
}
