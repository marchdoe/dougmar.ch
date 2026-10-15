import { css } from '../../../styled-system/css'

const words = ['Just', 'get', 'out', 'and', 'do', 'it.']

export function HomeHero() {
  return (
    <div className={css({ paddingBlock: '2', textAlign: 'left' })}>
      <h1
        className={css({
          fontFamily: 'display',
          textStyle: { base: '4xl', lg: 'hero' },
          fontWeight: 'light',
          fontStyle: 'normal',
          textTransform: 'none',
          lineHeight: 'tight',
          color: 'text',
          display: 'flex',
          flexDirection: 'column',
          margin: '0',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) 0ms both',
          animationDelay: '0ms',
        })}
      >
        {words.map((w) => (
          <span key={w} className={css({ display: 'block' })}>
            {w}
          </span>
        ))}
      </h1>
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: 'lg',
          letterSpacing: 'wide',
          color: 'accentAlt',
          marginTop: '12px',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both',
          animationDelay: '80ms',
        })}
      >
        Christopher McCandless
      </div>
      <p
        className={css({
          fontFamily: 'body',
          textStyle: 'xl',
          fontWeight: 'normal',
          color: 'text',
          marginTop: '12px',
          maxWidth: '46ch',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) 160ms both',
          animationDelay: '160ms',
        })}
      >
        You will be very, very glad that you did.
      </p>
    </div>
  )
}
