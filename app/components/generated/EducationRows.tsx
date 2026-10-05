import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'

export function EducationRows() {
  const rows = [
    { label: 'School', value: education.school },
    {
      label: 'Degree',
      value: [education.degree, education.concentration, education.years]
        .filter(Boolean)
        .join(', '),
    },
  ]
  return (
    <div>
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'all-small-caps',
          letterSpacing: '0.03em',
          fontSize: '2xl',
          color: 'text',
          paddingBottom: '12px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
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
              gridTemplateColumns: { base: '1fr', md: '140px minmax(0, 1fr)' },
              columnGap: '24px',
              rowGap: '2px',
              paddingBlock: '14px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <dt
              className={css({
                fontSize: 'xs',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
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
