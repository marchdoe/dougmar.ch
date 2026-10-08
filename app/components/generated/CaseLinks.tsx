import { css } from '../../../styled-system/css'
import { OutLink } from './OutLink'

export function CaseLinks({
  stack,
  liveUrl,
  githubUrl,
}: {
  stack?: string[]
  liveUrl?: string
  githubUrl?: string
}) {
  const items = stack ?? []
  return (
    <div className={css({ marginTop: '7' })}>
      <span
        className={css({
          display: 'block',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'text',
          fontWeight: 'bold',
          marginBottom: '3',
        })}
      >
        Stack
      </span>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
        })}
      >
        {items.map((s) => (
          <li
            key={s}
            className={css({
              fontSize: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              bg: 'surface',
              borderRadius: 'sm',
              paddingBlock: '1',
              paddingInline: '3',
            })}
          >
            {s}
          </li>
        ))}
      </ul>
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', marginTop: '4' })}>
        <OutLink href={liveUrl} label="Visit the live site" />
        <OutLink href={githubUrl} label="Read the source on GitHub" />
      </div>
    </div>
  )
}
