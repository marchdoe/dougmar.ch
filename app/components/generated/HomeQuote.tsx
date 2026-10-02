import { css } from '../../../styled-system/css'

const line = css({ display: 'block', textAlign: 'justify', textAlignLast: 'justify' })
const outline = css({ color: 'transparent', WebkitTextStroke: '1.6px token(colors.accent)' })

export function HomeQuote() {
  return (
    <div
      className={css({
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBlock: 'clamp(28px, 5vh, 56px)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: 'clamp(34px, 6.5vw, 104px)',
          lineHeight: { base: '0.98', lg: '0.96' },
          letterSpacing: '-0.02em',
          color: 'text',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        <span className={line}>{"You can't go"}</span>
        <span className={line}>
          <span className={outline}>forward</span> and
        </span>
        <span className={line}>
          <span className={outline}>backwards</span> at
        </span>
        <span className={line}>the same time.</span>
      </h1>
      <p
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          textStyle: 'md',
          color: 'textMuted',
          marginTop: 'clamp(20px, 3vh, 34px)',
          letterSpacing: '0.01em',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        <span className={css({ color: 'text', fontWeight: 'bold', fontStyle: 'normal' })}>
          Steve Harvey
        </span>
      </p>
    </div>
  )
}
