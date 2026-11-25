import { css } from '../../../styled-system/css'

type Fact = { label: string; value: string }

export function FactList({ heading, facts }: { heading: string; facts: Fact[] }) {
  return (
    <div>
      <h2
        className={css({
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          fontWeight: 'bold',
          textStyle: 'xs',
          color: 'accent',
          paddingBottom: '10px',
          borderBottom: '1px solid',
          borderBottomColor: 'border',
        })}
      >
        {heading}
      </h2>
      <dl className={css({ margin: '0' })}>
        {facts.map((f) => (
          <div
            key={`${f.label}-${f.value}`}
            className={css({
              paddingBlock: '10px',
              borderBottom: '1px solid',
              borderBottomColor: 'border',
            })}
          >
            <dt
              className={css({
                fontFamily: 'body',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
                fontWeight: 'bold',
                textStyle: '2xs',
                color: 'textMuted',
              })}
            >
              {f.label}
            </dt>
            <dd
              className={css({
                margin: '0',
                fontFamily: 'display',
                textStyle: 'base',
                color: 'text',
                marginTop: '2px',
              })}
            >
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
