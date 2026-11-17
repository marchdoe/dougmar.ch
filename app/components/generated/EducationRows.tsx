import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'
import { RuledList } from './RuledList'
import { SectionHead } from './SectionHead'

const row = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  paddingBlock: 'clamp(14px, 2.2vw, 22px)',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  _first: { borderTopWidth: '0' },
})

const strong = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontVariant: 'small-caps',
  fontSize: { base: 'base', lg: 'lg' },
  color: 'text',
})
const quiet = css({ fontFamily: 'body', textStyle: 'base', color: 'textMuted' })

export function EducationRows() {
  return (
    <section className={css({ marginTop: 'clamp(32px, 5vw, 56px)' })}>
      <SectionHead label="Education" aside={education.school} />
      <RuledList>
        <div className={row}>
          <span className={strong}>{education.school}</span>
          {education.years ? (
            <span
              className={css({
                fontFamily: 'display',
                fontVariantNumeric: 'tabular-nums',
                textStyle: 'sm',
                color: 'textMuted',
              })}
            >
              {education.years}
            </span>
          ) : null}
        </div>
        <div className={row}>
          <span className={strong}>{education.degree}</span>
          <span className={quiet}>{education.concentration}</span>
        </div>
      </RuledList>
    </section>
  )
}
