import { css } from '../../../styled-system/css'

type Signal = {
  marker: string
  name: string
  note: string
  fig: string
  rest: string
  win: boolean
}

const SIGNALS: Signal[] = [
  {
    marker: '72',
    name: 'Detroit Red Wings',
    note: 'the one bright note',
    fig: '7–4',
    rest: 'W',
    win: true,
  },
  { marker: '48', name: 'Detroit Tigers', note: 'dropped it', fig: '1–3', rest: 'L', win: false },
  {
    marker: '36',
    name: 'Presidents Cup',
    note: 'no leaders yet',
    fig: '',
    rest: 'Scheduled',
    win: false,
  },
  { marker: '30', name: 'S&P 500 (SPY)', note: '', fig: '', rest: '773.38 −0.02%', win: false },
  { marker: '24', name: 'Weather', note: 'patchy rain', fig: '', rest: '55°F', win: false },
  { marker: '18', name: 'Moon', note: 'waxing gibbous', fig: '', rest: '93%', win: false },
]

function Row({ s }: { s: Signal }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: '46px 1fr auto',
        alignItems: 'baseline',
        gap: '3',
        paddingBlock: '2',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          textStyle: 'md',
          color: 'textFaint',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: '1',
        })}
      >
        {s.marker}
      </span>
      <span
        className={css({
          fontSize: 'sm',
          color: 'textMuted',
          letterSpacing: '0.01em',
          minWidth: '0',
        })}
      >
        <b className={css({ color: 'text', fontWeight: 'bold' })}>{s.name}</b>
        {s.note ? `, ${s.note}` : ''}
      </span>
      <span
        className={css({
          fontSize: 'sm',
          color: 'textMuted',
          fontVariantNumeric: 'tabular-nums',
          textAlign: 'right',
        })}
      >
        {s.fig && (
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'lg',
              lineHeight: '1',
              marginRight: '1',
              color: s.win ? 'accentAlt' : 'text',
            })}
          >
            {s.fig}
          </span>
        )}
        {s.rest}
      </span>
    </div>
  )
}

export function SignalLedger() {
  return (
    <section
      aria-label="Signals"
      className={css({
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(28px, 5vw, 44px)',
        paddingBottom: 'clamp(30px, 5vw, 48px)',
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
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
          fontWeight: 'bold',
          marginBottom: '4',
        })}
      >
        Ledger, Aldie VA, 23 Sep 2026
      </h2>
      {SIGNALS.map((s) => (
        <Row key={s.name} s={s} />
      ))}
      <p
        className={css({
          marginTop: '3',
          fontSize: 'sm',
          color: 'textMuted',
          letterSpacing: '0.02em',
        })}
      >
        <b className={css({ color: 'text', fontWeight: 'bold' })}>On now:</b> Tobin Sprout · Guided
        by Voices · Radiohead
      </p>
    </section>
  )
}
