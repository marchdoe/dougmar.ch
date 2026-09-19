import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { identity } from '../../content/about'

const stats = [
  { label: 'Market · SPY', value: '761.69', sub: '+0.13%', up: true },
  { label: 'Weather', value: '61.9°F', sub: 'Partly cloudy', up: false },
  { label: 'Moon', value: '59%', sub: 'First quarter', up: false },
  { label: 'Air quality', value: 'Good', sub: 'AQI nominal', up: false },
]

const scores = [
  { label: 'Tigers', value: '11–8 W' },
  { label: 'Lions', value: '31–41 L' },
]

export function FooterLedger() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        px: { base: '4', lg: '9' },
        py: { base: '8', lg: '9' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          mb: '5',
        })}
      >
        The day, on the record
      </h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: '1px',
          bg: 'fieldBorder',
          border: '1px solid',
          borderColor: 'fieldBorder',
        })}
      >
        {stats.map((s) => (
          <div key={s.label} className={css({ bg: 'field', p: '4' })}>
            <div
              className={css({
                textStyle: '2xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
                mb: '2',
              })}
            >
              {s.label}
            </div>
            <div
              className={css({
                textStyle: 'lg',
                fontWeight: 'bold',
                color: s.up ? 'accentAlt' : 'fieldInk',
              })}
            >
              {s.value}
            </div>
            <div className={css({ textStyle: 'sm', color: 'fieldInkMuted', mt: '1' })}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6',
          mt: '6',
          pt: '5',
          borderTop: '1px solid',
          borderColor: 'fieldBorder',
        })}
      >
        {scores.map((s) => (
          <div key={s.label}>
            <div
              className={css({
                textStyle: '2xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
                mb: '1',
              })}
            >
              {s.label}
            </div>
            <div className={css({ textStyle: 'lg', fontWeight: 'bold' })}>{s.value}</div>
          </div>
        ))}
      </div>
      <p className={css({ textStyle: 'sm', color: 'fieldInkMuted', mt: '5' })}>
        In rotation: <b className={css({ color: 'fieldInk', fontWeight: 'bold' })}>Wet Leg</b> ·{' '}
        <b className={css({ color: 'fieldInk', fontWeight: 'bold' })}>My Morning Jacket</b>
      </p>
      <p
        className={css({
          textStyle: 'sm',
          color: 'fieldInkMuted',
          mt: '5',
          pt: '5',
          borderTop: '1px solid',
          borderColor: 'fieldBorder',
          maxWidth: '60ch',
          lineHeight: 'loose',
        })}
      >
        “A successful man is one who can lay a firm foundation with the bricks others have thrown at
        him,” said{' '}
        <cite className={css({ fontStyle: 'normal', color: 'fieldInk' })}>David Brinkley</cite>.
      </p>
      <div
        className={css({
          mt: '6',
          display: 'flex',
          alignItems: 'center',
          gap: '3',
          flexWrap: 'wrap',
          color: 'fieldInkMuted',
        })}
      >
        <BrandLockup variant="mark-only-md" mode="original" />
        <span className={css({ textStyle: 'sm' })}>Doug March, design and build as one job.</span>
        <a
          href={`mailto:${identity.email}`}
          className={css({
            textStyle: 'sm',
            color: 'accentAlt',
            fontWeight: 'bold',
            textDecoration: 'underline',
          })}
        >
          {identity.email}
        </a>
      </div>
    </footer>
  )
}
