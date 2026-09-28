import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { experiments, selectedWork } from '../../content/projects'

const pad = (n: number) => String(n).padStart(2, '0')

const cells = [
  { k: 'Drawn by', v: [identity.name, identity.role].filter(Boolean).join(', ') },
  { k: 'Date', v: '2026 · 09 · 28' },
  { k: 'Scale', v: '1 : 1' },
  { k: 'On rotation', v: 'Tobin Sprout · My Morning Jacket' },
  { k: 'Dateline', v: 'Aldie, Virginia, overcast, 59.6°F' },
  {
    k: 'Records',
    v: `${pad(selectedWork.length)} projects · ${pad(experiments.length)} experiments`,
  },
]

const cell = css({
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'fieldBorder',
  borderRightWidth: '1px',
  borderRightStyle: 'solid',
  borderRightColor: 'fieldBorder',
  paddingBlock: '12px',
  paddingInline: '14px',
})
const key = css({
  fontFamily: 'body',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'fieldInkMuted',
  marginBottom: '1',
})
const val = css({
  fontFamily: 'body',
  fontSize: 'sm',
  color: 'fieldInk',
  lineHeight: '1.35',
  fontVariantNumeric: 'tabular-nums',
})
const link = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  color: 'fieldInk',
  _hover: { color: 'fieldInkMuted' },
})

export function Ledger() {
  return (
    <footer
      id="contact"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingTop: '5',
        paddingBottom: '40px',
        paddingInline: 'clamp(20px, 5vw, 72px)',
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
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'sm',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'fieldInkMuted',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
          paddingBottom: '2',
        })}
      >
        Title block · Sheet 01 of 01
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'fieldBorder',
          borderTopWidth: '0',
        })}
      >
        {cells.map((c) => (
          <div key={c.k} className={cell}>
            <div className={key}>{c.k}</div>
            <div className={val}>{c.v}</div>
          </div>
        ))}
        <div className={cell}>
          <div className={key}>Index</div>
          <div className={val}>
            <a href="/work" className={link}>
              Work
            </a>{' '}
            ·{' '}
            <a href="/about" className={link}>
              About
            </a>{' '}
            ·{' '}
            <a href={`mailto:${identity.email}`} className={link}>
              Contact
            </a>
          </div>
        </div>
        <div className={cell}>
          <div className={key}>Contact</div>
          <div className={val}>
            <a href={`mailto:${identity.email}`} className={link}>
              {identity.email}
            </a>
          </div>
        </div>
      </div>
      <div
        className={css({
          marginTop: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '6px',
          columnGap: '20px',
          alignItems: 'center',
          fontFamily: 'body',
          fontSize: '2xs',
          color: 'fieldInkMuted',
          letterSpacing: '0.04em',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'sm',
            color: 'fieldInk',
          })}
        >
          {identity.name}
        </span>
        <span>© 2026. Buildable before the first line of code. Faithful after the last.</span>
      </div>
    </footer>
  )
}
