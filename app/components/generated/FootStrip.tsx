import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

type Signal = { label: string; bold?: string; rest?: string; lit?: boolean }

const signals: Signal[] = [
  { label: 'Pistons', bold: '122–109', lit: true },
  { label: 'Red Wings', bold: '1–4' },
  { label: 'RSM Classic', rest: 'John Parry -1 · five tied' },
  { label: 'SPY', bold: '730.20', rest: ' -0.31%' },
  { label: 'Aldie VA', rest: 'Sunny · 50°F' },
  { label: 'Ahead', rest: 'Thanksgiving in 7' },
]

// accent fails 3:1 on field in the light scheme, so the lit value falls back to fieldInk there
const litClass = css({ color: { base: 'accent', _light: 'fieldInk' }, fontWeight: 'bold' })
const downClass = css({ color: 'fieldInkMuted', fontWeight: 'bold' })

const footLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  minWidth: '44px',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  color: 'fieldInkMuted',
  paddingBlock: '2',
  _hover: { color: 'accent' },
})

function FootCell({ signal }: { signal: Signal }) {
  return (
    <span
      className={css({
        fontSize: 'xs',
        letterSpacing: '0.04em',
        color: 'fieldInkMuted',
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
      })}
    >
      <span
        className={css({
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'fieldInkMuted',
          marginRight: '7px',
        })}
      >
        {signal.label}
      </span>
      {signal.bold && <b className={signal.lit ? litClass : downClass}>{signal.bold}</b>}
      {signal.rest}
    </span>
  )
}

export function FootStrip() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingInline: '6vw',
        paddingTop: '30px',
        paddingBottom: '40px',
        borderTop: '1px solid',
        borderColor: 'fieldBorder',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '10px',
          columnGap: '28px',
          alignItems: 'baseline',
          borderBottom: '1px solid',
          borderColor: 'fieldBorder',
          paddingBottom: '5',
          marginBottom: '18px',
        })}
      >
        {signals.map((s) => (
          <FootCell key={s.label} signal={s} />
        ))}
      </div>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '2',
          fontSize: 'sm',
          color: 'fieldInkMuted',
          lineHeight: '1.55',
        })}
      >
        <p className={css({ fontStyle: 'italic', color: 'fieldInkMuted', maxWidth: '50ch' })}>
          “May you find grace as you surrender to life.”{' '}
          <span className={css({ fontStyle: 'normal' })}>Dan Millman</span>
        </p>
        <p className={css({ maxWidth: '50ch' })}>
          On rotation: Guided by Voices, The War on Drugs, Wet Leg.
        </p>
        <p className={css({ maxWidth: '50ch' })}>
          © 2026 {identity.name} · {identity.role} · Aldie, Virginia
        </p>
        <nav aria-label="Footer" className={css({ display: 'flex', gap: '5', marginTop: '1' })}>
          <a href="/#work" className={footLink}>
            Work
          </a>
          <a href="/about" className={footLink}>
            About
          </a>
          <a href={`mailto:${identity.email}`} className={footLink}>
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}
