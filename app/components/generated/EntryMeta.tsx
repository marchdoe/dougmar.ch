import { css } from '../../../styled-system/css'

export function EntryMeta({
  year,
  items,
}: {
  year: number | string
  items: (string | undefined)[]
}) {
  const rest = items.filter((i): i is string => Boolean(i))
  return (
    <div
      className={css({
        display: 'flex',
        columnGap: '14px',
        rowGap: '1',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        fontSize: '12px',
        letterSpacing: 'wider',
        textTransform: 'uppercase',
        color: 'textFaint',
        fontWeight: 'bold',
        marginBottom: '6px',
      })}
    >
      <span className={css({ color: 'textMuted', fontVariantNumeric: 'tabular-nums lining-nums' })}>
        {year}
      </span>
      {rest.map((i) => (
        <span key={i}>{i}</span>
      ))}
    </div>
  )
}
