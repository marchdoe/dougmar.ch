import { css } from '../../../styled-system/css'
import { capabilities, education } from '../../content/timeline'
import { IndexLabel } from './IndexLabel'
import { SigRow } from './SigRow'

export function CapabilitiesEducation() {
  return (
    <section
      className={css({
        marginTop: { base: '34px', md: '40px' },
        display: { base: 'block', md: 'grid' },
        gridTemplateColumns: { md: 'repeat(12, minmax(0, 1fr))' },
        columnGap: { md: '24px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ gridColumn: { md: '1 / 8' } })}>
        <IndexLabel>Capabilities</IndexLabel>
        <ul
          className={css({
            marginTop: '10px',
            listStyle: 'none',
            bg: 'surface',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'sm',
            paddingBlock: '18px',
            paddingInline: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '5',
            rowGap: '2',
          })}
        >
          {capabilities.map((c) => (
            <li
              key={c}
              className={css({
                fontSize: 'base',
                fontWeight: 'bold',
                fontVariantCaps: 'all-small-caps',
                letterSpacing: 'wide',
                color: 'text',
              })}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className={css({ gridColumn: { md: '8 / 13' }, marginTop: { base: '34px', md: '0' } })}>
        <IndexLabel>Education</IndexLabel>
        <div className={css({ marginTop: '8px' })}>
          <SigRow k={education.school}>{education.degree}</SigRow>
          <SigRow k={education.concentration}>{education.years}</SigRow>
        </div>
      </div>
    </section>
  )
}
