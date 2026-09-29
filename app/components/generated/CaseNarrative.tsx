import { css } from '../../../styled-system/css'

type NarrativeProps = { approach?: string; outcome?: string; stack?: string[] }

export function CaseNarrative({ approach, outcome, stack }: NarrativeProps) {
  const parts = [
    { k: 'approach', v: approach },
    { k: 'outcome', v: outcome },
  ].filter((p) => Boolean(p.v))
  const tools = stack ?? []
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
      {parts.map((p) => (
        <div key={p.k}>
          <h2
            className={css({
              fontSize: 'xs',
              letterSpacing: 'wide',
              color: 'textMuted',
              marginBottom: '3',
            })}
          >
            {p.k}
          </h2>
          <p
            className={css({
              fontSize: 'base',
              lineHeight: 'loose',
              maxWidth: '48ch',
              color: 'text',
            })}
          >
            {p.v}
          </p>
        </div>
      ))}
      <ul
        className={css({
          listStyle: 'none',
          paddingInlineStart: '0',
          margin: '0',
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '5',
          rowGap: '2',
        })}
      >
        {tools.map((t) => (
          <li
            key={t}
            className={css({ fontSize: 'base', fontVariant: 'small-caps', letterSpacing: 'wide' })}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}
