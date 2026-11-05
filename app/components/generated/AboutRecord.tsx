import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { sentence } from './copyText'

const headClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  fontSize: 'clamp(24px,3vw,34px)',
  letterSpacing: '0.03em',
  color: 'text',
  marginBottom: '18px',
})

const personalRows = [
  { label: 'Holes in one', value: String(personal.holesInOne) },
  { label: 'Sport', value: personal.sport },
  { label: 'Teams', value: personal.teams.join(' · ') },
  { label: 'Current focus', value: sentence(personal.currentFocus) },
]

function EducationBlock() {
  const lines = [education.degree, education.concentration, education.years].filter(Boolean)
  return (
    <div className={css({ minWidth: '0' })}>
      <h2 className={headClass}>Education</h2>
      <div
        className={css({
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'borderStrong',
          padding: '5',
        })}
      >
        <div
          className={css({
            fontFamily: 'display',
            textTransform: 'uppercase',
            fontSize: 'clamp(28px,4vw,46px)',
            lineHeight: '0.95',
            letterSpacing: '0.01em',
            color: 'text',
            marginBottom: '3',
          })}
        >
          {education.school}
        </div>
        {lines.map((line) => (
          <div
            key={line}
            className={css({ fontSize: 'base', lineHeight: '1.5', color: 'textMuted' })}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

function PersonalMarkers() {
  return (
    <div className={css({ minWidth: '0' })}>
      <h2 className={headClass}>Personal</h2>
      <div
        className={css({
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        })}
      >
        {personalRows.map((row) => (
          <div
            key={row.label}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', lg: '140px 1fr' },
              alignItems: { lg: 'baseline' },
              columnGap: '14px',
              rowGap: '4px',
              paddingBlock: '14px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
            })}
          >
            <span
              className={css({
                textStyle: 'xs',
                fontWeight: 'bold',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'accent',
              })}
            >
              {row.label}
            </span>
            <span
              className={css({
                fontFamily: 'display',
                textTransform: 'uppercase',
                fontSize: 'clamp(20px,2.4vw,27px)',
                lineHeight: '1',
                letterSpacing: '0.015em',
                color: 'text',
                minWidth: '0',
              })}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AboutRecord() {
  return (
    <section
      className={css({
        bg: 'surface',
        paddingInline: 'clamp(28px,6vw,112px)',
        paddingBlock: 'clamp(48px,6vh,96px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
        gap: { base: 'clamp(48px,6vh,96px)', lg: 'clamp(28px,6vw,112px)' },
        alignItems: { lg: 'start' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <EducationBlock />
      <PersonalMarkers />
    </section>
  )
}
