import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'

export function EducationRow() {
  const degree = [education.degree, education.concentration].filter(Boolean).join(', ')
  return (
    <div>
      <h2
        className={css({
          textStyle: 'lg',
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '2',
        })}
      >
        Education
      </h2>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '1',
          paddingBlock: '3',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'border',
          md: {
            display: 'grid',
            gridTemplateColumns: '130px 1fr',
            columnGap: '4',
            alignItems: 'baseline',
          },
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            textStyle: { base: 'sm', md: 'md' },
            color: 'textMuted',
          })}
        >
          {education.years}
        </span>
        <div className={css({ minWidth: '0' })}>
          <p className={css({ fontSize: 'base', color: 'text' })}>
            <b className={css({ fontWeight: 'bold' })}>{education.school}</b>
          </p>
          <p className={css({ fontSize: 'sm', color: 'textMuted', maxWidth: '56ch' })}>{degree}</p>
        </div>
      </div>
    </div>
  )
}
