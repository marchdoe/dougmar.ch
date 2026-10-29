import { css } from '../../../styled-system/css'

const label = css({
  fontSize: 'xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textFaint',
  marginBottom: '3',
})

export function Lede({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div className={css({ paddingBottom: '6' })}>
      <h2 className={label}>Problem</h2>
      <p
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(20px, 2.4vw, 30px)',
          lineHeight: '1.35',
          color: 'text',
          maxWidth: '34ch',
        })}
      >
        {text}
      </p>
    </div>
  )
}

export function ProseBlock({ heading, text }: { heading: string; text?: string }) {
  if (!text) return null
  return (
    <div
      className={css({
        paddingBlock: '5',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      <h2 className={label}>{heading}</h2>
      <p
        className={css({
          fontSize: 'base',
          lineHeight: '1.6',
          color: 'textMuted',
          maxWidth: '60ch',
        })}
      >
        {text}
      </p>
    </div>
  )
}

export function StackRow({ stack }: { stack?: string[] }) {
  if (!stack || stack.length === 0) return null
  return (
    <div
      className={css({
        paddingBlock: '5',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      <h2 className={label}>Stack</h2>
      <ul className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
        {stack.map((item) => (
          <li
            key={item}
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
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LiveLink({ url }: { url?: string }) {
  if (!url) return null
  return (
    <a
      href={url}
      className={css({
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: '44px',
        marginTop: '3',
        fontSize: 'base',
        fontWeight: 'normal',
        color: 'accent',
      })}
    >
      Visit the live project →
    </a>
  )
}
