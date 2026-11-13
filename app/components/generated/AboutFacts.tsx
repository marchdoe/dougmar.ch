import { css, cx } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { capabilities, education } from '../../content/timeline'
import { FactList } from './FactList'
import { grid, reveal } from './styles'

const head = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontVariant: 'small-caps',
  fontSize: '22px',
  marginBottom: '14px',
})
const pad = {
  paddingTop: '32px',
  paddingBottom: '36px',
  paddingInline: '22px',
  minWidth: '0',
} as const

export function AboutFacts() {
  return (
    <section className={cx(reveal, css({ marginTop: '80px' }))}>
      <div className={grid}>
        <div className={css({ ...pad, gridColumn: '1 / -1', bg: 'field', color: 'fieldInk' })}>
          <h2 className={head}>Capabilities</h2>
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
                  fontSize: 'sm',
                  color: 'fieldInk',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'fieldBorder',
                  paddingBlock: '6px',
                  paddingInline: '12px',
                })}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div
          className={css({
            ...pad,
            gridColumn: { base: 'auto', md: 'span 2' },
            bg: 'bg',
            color: 'text',
          })}
        >
          <h2 className={head}>Education</h2>
          <FactList
            onField={false}
            rows={[
              { term: 'School', detail: education.school },
              { term: 'Degree', detail: education.degree },
              { term: 'Concentration', detail: education.concentration },
              { term: 'Years', detail: education.years },
            ]}
          />
        </div>
        <div
          className={css({
            ...pad,
            gridColumn: { base: 'auto', md: 'span 2' },
            bg: 'field',
            color: 'fieldInk',
          })}
        >
          <h2 className={head}>Off the clock</h2>
          <FactList
            onField
            rows={[
              { term: 'Holes in one', detail: String(personal.holesInOne) },
              { term: 'Sport', detail: personal.sport },
              { term: 'Teams', detail: personal.teams.join(', ') },
              { term: 'Current focus', detail: personal.currentFocus },
            ]}
          />
        </div>
      </div>
    </section>
  )
}
