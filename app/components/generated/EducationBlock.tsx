import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'

export function EducationBlock() {
  return (
    <div
      className={css({
        borderTop: '1px solid',
        borderColor: 'border',
        paddingBlock: '6',
        marginTop: '9',
      })}
    >
      <span
        className={css({
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'textFaint',
          display: 'block',
          marginBottom: '4',
        })}
      >
        Education
      </span>
      <p
        className={css({
          fontFamily: 'display',
          textStyle: 'lg',
          color: 'text',
          marginBottom: '2',
        })}
      >
        {education.school}
      </p>
      <p className={css({ textStyle: 'sm', color: 'textMuted' })}>
        {education.degree} · {education.concentration} · {education.years}
      </p>
    </div>
  )
}
