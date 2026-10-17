import { css } from '../../../styled-system/css'
import { Masthead } from './Masthead'

export function CaseMissing() {
  return (
    <Masthead>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '3xl',
          textTransform: 'uppercase',
          textAlign: 'right',
          color: 'fieldInk',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Not found
      </h1>
      <p
        className={css({
          marginTop: '4',
          textStyle: 'sm',
          color: 'fieldInkMuted',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        <a href="/work" className={css({ color: 'fieldInk', textDecoration: 'underline' })}>
          Back to the work index
        </a>
      </p>
    </Masthead>
  )
}
