import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { AboutSection } from './AboutSection'

export function CapabilitiesList() {
  return (
    <AboutSection label="capabilities">
      <ul
        className={css({
          listStyle: 'none',
          paddingInlineStart: '0',
          margin: '0',
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
              fontSize: 'base',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'text',
            })}
          >
            {cap}
          </li>
        ))}
      </ul>
    </AboutSection>
  )
}
