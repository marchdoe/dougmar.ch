import { css } from '../../../styled-system/css'

const signals = [
  {
    kicker: 'Almanac · Thanksgiving tomorrow',
    title: 'The Sky',
    figure: '97% lit',
    body: 'The moon rises all but full tonight, the brightest ceiling of the holiday week, and the last clear read before the tables fill tomorrow.',
    sub: 'Full moon · rises 4:52 pm',
  },
  {
    kicker: 'Conditions',
    title: 'The Weather',
    figure: '39° / overcast',
    body: 'A flat grey lid holds at thirty-nine degrees through the afternoon, the sun gone by 4:44. Nine hours and thirty-six minutes of daylight, and shrinking.',
    sub: 'Daylight 9h 36m · dark by 4:44',
  },
  {
    kicker: 'Markets & Greens',
    title: 'The Tape',
    figure: '718.78 ▾0.49%',
    body: 'The broad market slipped a half percent to 718.78. In the Bahamas the Hero World Challenge tees off, twenty players, no leaders yet, everything still to settle.',
    sub: 'SPY down 0.49% · Hero World Challenge, R1',
  },
]

export function SignalColumns() {
  return (
    <section
      aria-label="Today's signals"
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'repeat(3, 1fr)' },
        columnGap: 'clamp(24px, 3vw, 40px)',
        borderTop: '2px solid',
        borderTopColor: 'borderStrong',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {signals.map((s) => (
        <article
          key={s.title}
          className={css({
            paddingTop: { base: '20px', lg: '22px' },
            paddingBottom: { base: '20px', lg: '30px' },
            paddingRight: { base: '0', lg: '24px' },
            borderBottom: { base: '1px solid', lg: 'none' },
            borderRight: { base: 'none', lg: '1px solid' },
            borderColor: 'border',
            minWidth: '0',
            _last: { borderRight: 'none' },
          })}
        >
          <div
            className={css({
              fontFamily: 'body',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              fontWeight: 'bold',
              textStyle: 'xs',
              color: 'accent',
              paddingBottom: '10px',
              marginBottom: '10px',
              borderBottom: '1px solid',
              borderBottomColor: 'border',
            })}
          >
            {s.kicker}
          </div>
          <h3
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'normal',
              textStyle: 'md',
              color: 'text',
              marginBottom: '6px',
            })}
          >
            {s.title}
          </h3>
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              color: 'accent',
              textStyle: '2xl',
              lineHeight: '1',
              letterSpacing: 'tight',
              marginTop: '4px',
              marginBottom: '10px',
            })}
          >
            {s.figure}
          </div>
          <p
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              textStyle: 'base',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '50ch',
            })}
          >
            {s.body}
          </p>
          <div
            className={css({
              fontFamily: 'body',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              fontWeight: 'bold',
              textStyle: '2xs',
              color: 'textMuted',
              marginTop: '12px',
            })}
          >
            {s.sub}
          </div>
        </article>
      ))}
    </section>
  )
}
