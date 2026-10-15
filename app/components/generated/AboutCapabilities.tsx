import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function AboutCapabilities() {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        paddingBlock: '7',
        paddingInline: '6vw',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
      })}
    >
      <div className={css({ maxWidth: '1400px', marginInline: 'auto' })}>
        <div
          className={css({
            fontWeight: 'bold',
            fontSize: '2xs',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'accentAlt',
            marginBottom: '4',
          })}
        >
          Capabilities
        </div>
        <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', rowGap: '3' })}>
          {capabilities.map((c) => (
            <span
              key={c}
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2',
                fontSize: 'base',
                color: 'text',
                _before: {
                  content: '""',
                  width: '8px',
                  height: '8px',
                  borderRadius: 'full',
                  bg: 'accentAlt',
                  flex: '0 0 auto',
                },
              })}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
