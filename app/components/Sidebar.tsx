import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { ScoreStrip } from './generated/ScoreStrip'

const signals = [
  {
    k: 'Final',
    v: (
      <>
        <b>Tigers 8</b>, 7
      </>
    ),
  },
  {
    k: 'Presidents Cup',
    v: (
      <>
        +3 / +7 <b>live</b>
      </>
    ),
  },
  {
    k: 'Moon',
    v: (
      <>
        <b>99.7%</b> gibbous
      </>
    ),
  },
  { k: 'SPY', v: <b>+0.54%</b> },
  {
    k: 'Sky',
    v: (
      <>
        Clear <b>54°F</b>, NW 9.8
      </>
    ),
  },
  {
    k: 'Sun',
    v: (
      <>
        <b>07:08</b> to 18:53
      </>
    ),
  },
]

const navLink = css({
  fontFamily: 'body',
  fontSize: 'sm',
  fontWeight: 'bold',
  color: 'fieldInk',
  paddingBlock: '12px',
  paddingInline: '2',
  minHeight: '44px',
  minWidth: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  _hover: { color: 'accent' },
})

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTop: '2px solid',
        borderColor: 'fieldBorder',
        paddingTop: { base: '26px', md: '34px', lg: '40px' },
        paddingBottom: { base: '30px', md: '40px', lg: '40px' },
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
        minHeight: { lg: '128px' },
      })}
    >
      <div
        className={css({
          paddingBottom: '22px',
          borderBottom: '1px solid',
          borderColor: 'fieldBorder',
        })}
      >
        <ScoreStrip items={signals} />
      </div>
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          rowGap: '10px',
          columnGap: '26px',
          paddingTop: '22px',
        })}
      >
        <div className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '2', columnGap: '5' })}>
          <a href="/work" className={navLink}>
            Work
          </a>
          <a href="/about" className={navLink}>
            About
          </a>
          <a href={`mailto:${identity.email}`} className={navLink}>
            Contact
          </a>
        </div>
        {/* mockup gold700 labels on field fall under 3:1; fieldInkMuted is the nearest readable token */}
        <span
          className={css({
            fontSize: 'xs',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          {identity.name} · {identity.role} · Aldie VA
        </span>
      </nav>
    </footer>
  )
}
