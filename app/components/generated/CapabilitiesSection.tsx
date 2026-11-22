import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { RevealSection } from './RevealSection'
import { SectionLabel } from './SectionLabel'
import { sectionPad } from './rows'

export function CapabilitiesSection() {
  return (
    <RevealSection label="Capabilities" className={sectionPad}>
      <SectionLabel ruled>capabilities</SectionLabel>
      <ul
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          columnGap: '5',
          rowGap: '2',
          borderTop: '1px solid',
          borderColor: 'border',
          paddingTop: '18px',
        })}
      >
        {capabilities.map((cap) => (
          <li
            key={cap}
            className={css({ textStyle: 'base', color: 'textMuted', textTransform: 'lowercase' })}
          >
            {cap}
          </li>
        ))}
      </ul>
    </RevealSection>
  )
}
