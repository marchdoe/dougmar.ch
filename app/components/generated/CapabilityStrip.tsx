import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { SectionHead } from './SectionHead'

export function CapabilityStrip() {
  return (
    <section aria-label="Capabilities" className={css({ marginTop: '48px' })}>
      <SectionHead>Capabilities</SectionHead>
      <ul
        className={css({
          listStyle: 'none',
          marginTop: '16px',
          marginBottom: '0',
          padding: '20px',
          bg: 'surface',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'borderStrong',
          borderRadius: 'sm',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        })}
      >
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              fontSize: 'sm',
              color: 'text',
              paddingBlock: '6px',
              paddingInline: '12px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              borderRadius: 'sm',
              bg: 'bgAlt',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
    </section>
  )
}
