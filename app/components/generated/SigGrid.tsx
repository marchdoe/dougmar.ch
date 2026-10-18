import { css } from '../../../styled-system/css'

type Item = { label: string; value: string }

export function SigGrid({ title, items }: { title: string; items: Item[] }) {
  const shown = items.filter((item) => Boolean(item.value))
  return (
    <div className={css({ paddingBlock: '5' })}>
      <h2
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
          marginBottom: '4',
        })}
      >
        {title}
      </h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          rowGap: 'clamp(16px, 2.4vw, 28px)',
          columnGap: 'clamp(24px, 3vw, 48px)',
        })}
      >
        {shown.map((item) => (
          <div
            key={item.label}
            className={css({ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '0' })}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                textStyle: '2xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'textMuted',
              })}
            >
              {item.label}
            </span>
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'normal',
                textStyle: 'md',
                color: 'text',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
