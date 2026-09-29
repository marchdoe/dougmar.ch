import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'
import { AboutSection } from './AboutSection'

export function EducationRow() {
  const line = [education.school, education.degree, education.concentration, education.years]
    .filter(Boolean)
    .join(', ')
  return (
    <AboutSection label="education">
      <div
        className={css({
          paddingBlock: '4',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'border',
          fontSize: 'base',
          color: 'text',
        })}
      >
        {line}
      </div>
    </AboutSection>
  )
}
