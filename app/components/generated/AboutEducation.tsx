import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'
import { bleed, Label, SectionHead, track } from './LedgerParts'

const section = css({ marginTop: { base: '64px', md: '96px' } })

const row = css({
  rowGap: '6px',
  alignItems: 'start',
  paddingTop: { base: '16px', md: '20px' },
  paddingBottom: { base: '16px', md: '20px' },
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
})

const yearCell = css({
  gridColumn: { md: '2' },
  gridRow: { md: '1' },
  paddingTop: { md: '6px' },
})

const bodyCell = css({
  gridColumn: { md: '1' },
  gridRow: { md: '1' },
  minWidth: 0,
})

const school = css({
  fontFamily: { base: 'body', md: 'display' },
  fontWeight: 'bold',
  textStyle: { base: 'base', md: 'lg' },
  lineHeight: '1.25',
  color: 'text',
})

const degree = css({
  textStyle: 'base',
  lineHeight: '1.5',
  color: 'textMuted',
  maxWidth: '56ch',
})

const degreeLine = [education.degree, education.concentration].filter(Boolean).join(', ')

export function AboutEducation() {
  return (
    <section className={section} aria-labelledby="education-h">
      <SectionHead id="education-h">Education</SectionHead>
      <div className={`${bleed} ${track} ${row}`}>
        {education.years ? (
          <div className={yearCell}>
            <Label>{education.years}</Label>
          </div>
        ) : null}
        <div className={bodyCell}>
          <h3 className={school}>{education.school}</h3>
          {degreeLine ? <p className={degree}>{degreeLine}</p> : null}
        </div>
      </div>
    </section>
  )
}
