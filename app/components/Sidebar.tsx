import { css } from '../../styled-system/css'
import { identity, personal } from '../content/about'

const linkClass = css({
  fontFamily: 'display',
  fontSize: '14px',
  color: 'fieldInk',
  textDecoration: 'underline',
  textDecorationColor: 'accent',
  textUnderlineOffset: '0.18em',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  minWidth: '44px',
  paddingInline: '4px',
  _hover: { color: 'fieldInk' },
})

export function Sidebar() {
  const rows = [
    { key: 'Detroit', value: `${personal.teams.join(', ')}. Off-season.` },
    { key: 'Golf', value: 'Butterfield Bermuda Championship, scheduled. No leaders yet.' },
    { key: 'Market', value: 'SPY 766.48, up 0.42%.' },
    { key: 'Aldie, VA', value: 'Clear, 46°F. Waxing gibbous, 74% lit.' },
    { key: 'On rotation', value: 'The War on Drugs, My Morning Jacket.' },
  ]
  const credit = [identity.name, identity.role].filter(Boolean).join(', ')
  return (
    <footer
      id="contact"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: 'clamp(40px, 5vw, 72px)',
        paddingBottom: 'clamp(44px, 5vw, 64px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ display: 'grid', rowGap: '4px', maxWidth: '860px' })}>
        {rows.map((row) => (
          <div
            key={row.key}
            className={css({
              display: 'flex',
              gap: '14px',
              alignItems: 'baseline',
              paddingBlock: '10px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontSize: '12px',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
                flex: '0 0 118px',
              })}
            >
              {row.key}
            </span>
            <span
              className={css({
                fontFamily: 'body',
                fontSize: '14px',
                color: 'fieldInk',
                lineHeight: '1.4',
                minWidth: '0',
              })}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div
        className={css({
          marginTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: '16px',
          fontFamily: 'display',
          fontSize: '13px',
          letterSpacing: '0.04em',
          color: 'fieldInkMuted',
        })}
      >
        <span>{credit}. © 2026.</span>
        <a href="/about" className={linkClass}>
          About
        </a>
        <a href="/#work" className={linkClass}>
          Work
        </a>
        <a href={`mailto:${identity.email}`} className={linkClass}>
          {identity.email}
        </a>
      </div>
    </footer>
  )
}
