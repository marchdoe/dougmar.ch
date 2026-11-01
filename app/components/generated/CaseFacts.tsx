import { css } from '../../../styled-system/css'

export function CaseFacts({ stack, liveUrl }: { stack: string[]; liveUrl?: string }) {
  return (
    <div
      className={css({
        marginTop: '7',
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
        borderTop: '1px solid',
        borderColor: 'fieldBorder',
        paddingTop: '5',
      })}
    >
      {stack.length > 0 ? (
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
          {stack.map((s) => (
            <li
              key={s}
              className={css({
                fontSize: 'sm',
                color: 'textMuted',
                border: '1px solid',
                borderColor: 'borderStrong',
                borderRadius: 'md',
                paddingBlock: '1',
                paddingInline: '3',
              })}
            >
              {s}
            </li>
          ))}
        </ul>
      ) : null}
      {liveUrl ? (
        <a
          href={liveUrl}
          className={css({
            alignSelf: 'flex-start',
            fontSize: 'sm',
            fontWeight: 'bold',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'text',
            paddingBlock: '3',
            paddingInline: '5',
            borderRadius: 'md',
            border: '1px solid',
            borderColor: 'borderStrong',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            _hover: { bg: 'accent', color: 'accentText', borderColor: 'accent' },
          })}
        >
          Visit the live site ↗
        </a>
      ) : null}
    </div>
  )
}
