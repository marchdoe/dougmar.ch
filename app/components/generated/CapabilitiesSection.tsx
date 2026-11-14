import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { RevealSection } from './RevealSection'
import { SecLabel } from './SecLabel'

export function CapabilitiesSection() {
  return (
    <RevealSection
      className={css({
        paddingBlock: 'clamp(24px, 3vw, 40px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
      })}
    >
      <SecLabel>Capabilities</SecLabel>
      <ul
        className={css({
          listStyle: 'none',
          marginTop: '20px',
          marginBottom: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        })}
      >
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              textStyle: 'sm',
              textTransform: 'lowercase',
              color: 'text',
              paddingBlock: '6px',
              paddingInline: '12px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              borderRadius: 'md',
              bg: 'surface',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
    </RevealSection>
  )
}
