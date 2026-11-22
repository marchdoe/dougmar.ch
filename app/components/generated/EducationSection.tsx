import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'
import { RevealSection } from './RevealSection'
import { SectionLabel } from './SectionLabel'
import { fixedGrid, metaCell, sectionPad } from './rows'

export function EducationSection() {
  const detail = [education.degree, education.concentration, education.years]
    .filter(Boolean)
    .join(' · ')
  return (
    <RevealSection label="Education" className={sectionPad}>
      <SectionLabel ruled>education</SectionLabel>
      <article className={fixedGrid}>
        <p className={metaCell}>{detail}</p>
        <h3
          className={css({
            textAlign: 'right',
            fontFamily: 'display',
            fontWeight: 'normal',
            color: 'text',
            textStyle: { base: 'base', md: 'xl', lg: '2xl' },
            md: { gridColumn: '3', gridRow: '1' },
          })}
        >
          {education.school}
        </h3>
      </article>
    </RevealSection>
  )
}
