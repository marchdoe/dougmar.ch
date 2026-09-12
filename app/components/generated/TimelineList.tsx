import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

export function TimelineList() {
  return (
    <ul className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
      {timeline.map((entry) => (
        <li
          key={`${entry.year}-${entry.company}`}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: '120px 1fr' },
            gap: { base: '2', md: '6' },
            paddingBlock: '5',
            borderBottom: '1px solid',
            borderColor: 'border',
            alignItems: 'baseline',
          })}
        >
          <span
            className={css({
              textStyle: 'xs',
              textTransform: 'lowercase',
              letterSpacing: 'wide',
              color: 'textFaint',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {entry.year}
          </span>
          <div>
            <p
              className={css({
                textStyle: 'sm',
                textTransform: 'lowercase',
                letterSpacing: 'wide',
                color: 'text',
                marginBottom: '2',
              })}
            >
              {entry.role} · {entry.company}
            </p>
            <p className={css({ textStyle: 'base', color: 'textMuted', maxWidth: '65ch' })}>
              {entry.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
