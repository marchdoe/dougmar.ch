import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'

export function AboutEducation() {
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
    <section className={css({ bg: 'surface', paddingBlock: '7', paddingInline: '6vw' })}>
      <div className={css({ maxWidth: '1400px', marginInline: 'auto', minWidth: '0' })}>
        <h2
          className={css({
            fontFamily: 'display',
            textStyle: { base: 'lg', md: '2xl' },
            fontWeight: 'normal',
            color: 'text',
            paddingBottom: '3',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'borderStrong',
          })}
        >
          Education
        </h2>
        {rows.map((r) => (
          <div
            key={r.label}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' },
              columnGap: '4',
              rowGap: '1',
              alignItems: 'baseline',
              paddingBlock: '3',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
            })}
          >
            <span
              className={css({
                fontWeight: 'bold',
                fontSize: '2xs',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'textFaint',
              })}
            >
              {r.label}
            </span>
            <span
              className={css({
                fontFamily: { base: 'body', lg: 'display' },
                fontSize: { base: 'base', lg: 'lg' },
                color: 'text',
              })}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
