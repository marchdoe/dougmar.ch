import { css } from '../../../styled-system/css'
import { capabilities, education } from '../../content/timeline'

const educationLine = [education.concentration, education.years].filter(Boolean).join(', ')

export function Capabilities() {
  return (
    <section
      className={css({
        bg: 'surface',
        paddingBlock: { base: '38px', lg: '48px' },
        paddingLeft: { base: '20px', lg: '48px' },
        paddingRight: { base: '20px', lg: '6vw' },
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
        gap: '7',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div>
        <h2
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            textTransform: 'lowercase',
            textStyle: '2xl',
            lineHeight: 'tight',
            marginBottom: '5',
          })}
        >
          capabilities
        </h2>
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '5',
            rowGap: '2',
          })}
        >
          {capabilities.map((cap) => (
            <li
              key={cap}
              className={css({
                fontSize: 'sm',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                color: 'accentAlt',
              })}
            >
              {cap}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            textTransform: 'lowercase',
            textStyle: '2xl',
            lineHeight: 'tight',
            marginBottom: '5',
          })}
        >
          education
        </h2>
        <div className={css({ fontSize: 'base', fontWeight: 'bold', color: 'text' })}>
          {education.school}
        </div>
        <div className={css({ fontSize: 'sm', color: 'textMuted' })}>{education.degree}</div>
        <div className={css({ fontSize: 'sm', color: 'textFaint' })}>{educationLine}</div>
      </div>
    </section>
  )
}
