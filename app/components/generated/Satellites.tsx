import { css } from '../../../styled-system/css'

type Tone = 'plain' | 'highlight' | 'down'

const chip = css({
  position: { base: 'static', lg: 'absolute' },
  transform: { lg: 'translate(-50%, -50%)' },
  textAlign: 'center',
  minWidth: '170px',
  bg: 'surface',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: 'md',
  paddingBlock: '3',
  paddingInline: '4',
})

// The mockup's down-state red (#FF4D63 / #5A2434) has no semantic token; nearest semantic inks used.
const frame: Record<Tone, string> = {
  plain: css({ borderColor: 'border' }),
  highlight: css({ borderColor: 'borderStrong' }),
  down: css({ borderColor: 'borderStrong' }),
}
const ink: Record<Tone, string> = {
  plain: css({ color: 'text' }),
  highlight: css({ color: 'accentAlt' }),
  down: css({ color: 'accent' }),
}

const keyClass = css({
  display: 'block',
  textStyle: 'sm',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
})
const valClass = css({
  display: 'block',
  textStyle: 'xs',
  letterSpacing: 'wide',
  color: 'textMuted',
  fontVariantNumeric: 'tabular-nums',
  marginTop: '1',
})

const sats: { k: string; v: string; tone: Tone; pos: string; moon?: boolean }[] = [
  {
    k: 'FishSticks',
    v: 'SaaS · 2025',
    tone: 'plain',
    pos: css({ lg: { top: '17%', left: '23%' } }),
  },
  { k: '15th Club', v: 'AI · 2025', tone: 'plain', pos: css({ lg: { top: '21%', left: '76%' } }) },
  {
    k: 'WWT Championship',
    v: 'Kirk −9',
    tone: 'highlight',
    pos: css({ lg: { top: '12%', left: '50%' } }),
  },
  {
    k: 'Moon',
    v: 'Waning · 7%',
    tone: 'plain',
    moon: true,
    pos: css({ lg: { top: '30%', left: '12%' } }),
  },
  { k: 'SPY 733.00', v: '−4.41%', tone: 'down', pos: css({ lg: { top: '28%', left: '89%' } }) },
  {
    k: 'TeeTurn',
    v: 'Experiment · 2020',
    tone: 'plain',
    pos: css({ lg: { top: '72%', left: '17%' } }),
  },
  {
    k: 'Politweets',
    v: 'Experiment · 2008',
    tone: 'plain',
    pos: css({ lg: { top: '78%', left: '66%' } }),
  },
  {
    k: 'Twittertale',
    v: 'Experiment · 2008',
    tone: 'plain',
    pos: css({ lg: { top: '85%', left: '41%' } }),
  },
]

function Crescent() {
  // Mockup fill #6B4BD1 has no semantic token; accent is the nearest.
  return (
    <span
      aria-hidden="true"
      className={css({
        display: 'block',
        position: 'relative',
        width: '24px',
        height: '24px',
        marginInline: 'auto',
        marginBottom: '1',
        borderRadius: 'full',
        bg: 'accent',
        overflow: 'hidden',
      })}
    >
      <span
        className={css({
          position: 'absolute',
          top: '-2px',
          left: '6px',
          width: '22px',
          height: '22px',
          borderRadius: 'full',
          bg: 'surface',
        })}
      />
    </span>
  )
}

export function Satellites() {
  return (
    <div
      className={css({
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3',
        marginTop: '7',
        lg: { position: 'absolute', inset: '0', margin: '0', display: 'block' },
      })}
    >
      {sats.map((s) => (
        <div key={s.k} className={`${chip} ${frame[s.tone]} ${s.pos}`}>
          {s.moon ? <Crescent /> : null}
          <span className={`${keyClass} ${ink[s.tone]}`}>{s.k}</span>
          <span className={valClass}>{s.v}</span>
        </div>
      ))}
    </div>
  )
}
