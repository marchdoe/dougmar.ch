import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { SectionHead } from './SectionHead'

export function AboutCapabilities() {
  return (
    <section>
      <SectionHead label="Capabilities" />
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2',
        })}
      >
        {capabilities.map((item) => (
          <li
            key={item}
            className={css({
              textStyle: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'text',
              border: '1px solid',
              borderColor: 'accent',
              borderRadius: 'full',
              paddingBlock: '1',
              paddingInline: '3',
            })}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
