import { css } from '../../../styled-system/css'

type Fact = { k: string; v: string }

export function FactList({ facts }: { facts: Fact[] }) {
  return (
    <dl
      className={css({
        marginTop: '20px',
        marginBottom: '0',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      {facts
        .filter((f) => f.v !== '')
        .map((f) => (
          <div
            key={f.k}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: '10em 1fr' },
              columnGap: '24px',
              rowGap: '4px',
              paddingBlock: '12px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <dt
              className={css({
                textStyle: '2xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                fontWeight: 'bold',
                color: 'textMuted',
              })}
            >
              {f.k}
            </dt>
            <dd className={css({ margin: '0', textStyle: 'base', color: 'text' })}>{f.v}</dd>
          </div>
        ))}
    </dl>
  )
}
