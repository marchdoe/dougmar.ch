import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutStatement() {
  return (
    <div className={css({ paddingBlock: '2', textAlign: 'left', minWidth: '0' })}>
      <h1
        className={css({
          fontFamily: 'display',
          textStyle: 'lg',
          fontWeight: 'light',
          color: 'text',
          maxWidth: '40ch',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) 0ms both',
          animationDelay: '0ms',
        })}
      >
        {identity.statement}
      </h1>
      <div
        className={css({
          fontWeight: 'bold',
          fontSize: 'lg',
          letterSpacing: 'wide',
          color: 'accentAlt',
          marginTop: '12px',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both',
          animationDelay: '80ms',
        })}
      >
        {identity.name}
      </div>
    </div>
  )
}
