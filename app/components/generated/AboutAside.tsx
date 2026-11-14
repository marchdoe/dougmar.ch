import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { capabilities, education } from '../../content/timeline'

const head = css({
  fontFamily: 'body',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  color: 'textFaint',
  marginBottom: '3',
})
const kv = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: '3',
  paddingBlock: '2',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  fontSize: 'sm',
})

const facts = [
  { k: 'Holes in one', v: String(personal.holesInOne) },
  { k: 'Sport', v: personal.sport },
  { k: 'Teams', v: personal.teams.join(', ') },
  { k: 'Current focus', v: personal.currentFocus },
]

export function AboutAside() {
  const eduLine = [education.degree, education.concentration, education.years]
    .filter(Boolean)
    .join(', ')
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
      <div>
        <div className={head}>Capabilities</div>
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
          })}
        >
          {capabilities.map((c) => (
            <li
              key={c}
              className={css({
                bg: 'surface',
                color: 'text',
                fontSize: 'sm',
                paddingInline: '3',
                paddingBlock: '1',
                borderRadius: 'sm',
              })}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className={head}>Education</div>
        <div className={css({ fontFamily: 'display', fontSize: 'lede', color: 'text' })}>
          {education.school}
        </div>
        <div className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '1' })}>{eduLine}</div>
      </div>
      <div>
        <div className={head}>Off the clock</div>
        {facts.map((f) => (
          <div key={f.k} className={kv}>
            <span className={css({ color: 'textMuted' })}>{f.k}</span>
            <span className={css({ color: 'text', textAlign: 'right' })}>{f.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
