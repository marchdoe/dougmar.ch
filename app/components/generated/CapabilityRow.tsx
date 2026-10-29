import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilityRow() {
  return (
    <section className={css({ paddingInline: { base: '7vw', md: '6vw' }, paddingBottom: '7' })}>
      <h2
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '4',
        })}
      >
        Capabilities
      </h2>
      <ul className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
        {capabilities.map((cap) => (
          <li
            key={cap}
            className={css({
              fontSize: 'sm',
              color: 'text',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              borderRadius: 'sm',
              paddingBlock: '1',
              paddingInline: '3',
            })}
          >
            {cap}
          </li>
        ))}
      </ul>
    </section>
  )
}
