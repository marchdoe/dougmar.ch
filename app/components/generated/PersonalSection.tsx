import { css } from '../../../styled-system/css'

type Personal = { holesInOne: number; sport: string; teams: string[]; currentFocus: string }

export function PersonalSection({ personal }: { personal: Personal }) {
  return (
    <footer
      className={css({
        position: 'relative',
        bg: 'bgAlt',
        borderTop: '3px solid',
        borderColor: 'borderStrong',
        paddingTop: { base: '6', md: '8' },
        paddingBottom: { base: '10', md: '12' },
        paddingLeft: { base: '5', md: '6vw' },
        paddingRight: { base: '5', md: '6vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          fontWeight: 'bold',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'textFaint',
          marginBottom: '5',
        })}
      >
        off the clock
      </div>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '8', marginBottom: '6' })}>
        <Metric v={String(personal.holesInOne)} k="holes in one" />
        <Metric v={personal.sport} k="sport" />
        <Metric v={personal.teams.join(', ')} k="teams" />
      </div>
      <p
        className={css({ fontFamily: 'display', fontSize: 'sm', color: 'text', maxWidth: '62ch' })}
      >
        {personal.currentFocus}
      </p>
    </footer>
  )
}

function Metric({ v, k }: { v: string; k: string }) {
  return (
    <div>
      <div className={css({ fontFamily: 'display', fontSize: 'lg', color: 'text' })}>{v}</div>
      <div
        className={css({
          fontFamily: 'body',
          fontSize: '2xs',
          color: 'textFaint',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          marginTop: '1',
        })}
      >
        {k}
      </div>
    </div>
  )
}
