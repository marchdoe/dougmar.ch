import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'
import { SectionLabel } from './SectionLabel'
import { joinParts } from './join'

export function EducationCell() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingTop: '6',
        paddingBottom: '7',
        paddingInline: 'clamp(40px, 6vw, 112px)',
      })}
    >
      <SectionLabel>Education</SectionLabel>
      <div
        className={css({
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'borderStrong',
          borderRadius: 'md',
          paddingBlock: '18px',
          paddingInline: '20px',
          maxWidth: '640px',
        })}
      >
        <div
          className={css({
            fontFamily: 'display',
            fontSize: 'lg',
            color: 'text',
            lineHeight: 'snug',
          })}
        >
          {education.school}
        </div>
        <div className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '1' })}>
          {joinParts([education.degree, education.concentration], ', ')}
        </div>
        {education.years ? (
          <div
            className={css({
              fontSize: 'sm',
              color: 'textFaint',
              marginTop: '1',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {education.years}
          </div>
        ) : null}
      </div>
    </section>
  )
}
