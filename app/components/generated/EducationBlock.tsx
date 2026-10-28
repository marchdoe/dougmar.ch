import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'

const rows = [
  { label: 'School', value: education.school },
  { label: 'Degree', value: education.degree },
  { label: 'Concentration', value: education.concentration },
  { label: 'Years', value: education.years },
].filter((r) => r.value !== '')

export function EducationBlock() {
  return (
    <div className={css({ marginTop: '7' })}>
      <h2
        className={css({
          fontSize: 'sm',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '3',
        })}
      >
        Education
      </h2>
      <dl className={css({ margin: '0' })}>
        {rows.map((r) => (
          <div
            key={r.label}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: '140px 1fr' },
              columnGap: '5',
              paddingBlock: '3',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderColor: 'border',
              _last: { borderBottomWidth: '1px', borderBottomStyle: 'solid' },
            })}
          >
            <dt
              className={css({
                fontSize: 'sm',
                fontVariantCaps: 'all-small-caps',
                letterSpacing: 'wide',
                color: 'textMuted',
              })}
            >
              {r.label}
            </dt>
            <dd className={css({ margin: '0', fontSize: 'base', color: 'text' })}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
