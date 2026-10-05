import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

export function PersonalPanel() {
  const rows = [
    { label: 'Holes in one', value: String(personal.holesInOne) },
    { label: 'Sport', value: personal.sport },
    { label: 'Teams', value: personal.teams.join(', ') },
    { label: 'Current focus', value: personal.currentFocus },
  ]
  return (
    <aside
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        padding: 'clamp(24px, 3vw, 40px)',
      })}
    >
      <div
        className={css({
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
          paddingBottom: '16px',
        })}
      >
        <span
          className={css({
            display: 'block',
            fontSize: 'sm',
            color: 'fieldInkMuted',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          })}
        >
          The ledger · off the clock
        </span>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'all-small-caps',
            letterSpacing: '0.04em',
            fontSize: '2xl',
            color: 'fieldInk',
            lineHeight: '1',
          })}
        >
          Scorecard
        </h2>
      </div>
      <dl className={css({ margin: '0' })}>
        {rows.map((r) => (
          <div
            key={r.label}
            className={css({
              paddingBlock: '12px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
            })}
          >
            <dt
              className={css({
                fontSize: 'xs',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
              })}
            >
              {r.label}
            </dt>
            <dd
              className={css({
                margin: '0',
                fontSize: 'base',
                color: 'fieldInk',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
