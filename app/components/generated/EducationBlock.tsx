import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

export function EducationBlock() {
  const detail = [education.degree, education.concentration].filter((v) => v !== '').join(', ')
  return (
    <Reveal className={css({ paddingBlock: '24px', paddingInline: '6vw' })}>
      <SectionHead title="Education" />
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          paddingBlock: '16px',
          paddingInline: '4px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'border',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontSize: '30px',
            letterSpacing: '.02em',
            lineHeight: '1.05',
          })}
        >
          {education.school}
        </span>
        <span className={css({ textStyle: 'base', color: 'textMuted' })}>{detail}</span>
        {education.years ? (
          <span
            className={css({
              textStyle: 'sm',
              color: 'textFaint',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {education.years}
          </span>
        ) : null}
      </div>
    </Reveal>
  )
}
