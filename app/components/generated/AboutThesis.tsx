import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { ThesisTop } from './ThesisTop'

export function AboutThesis() {
  return (
    <>
      <ThesisTop />
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          lg: { marginTop: 'clamp(24px, 5vh, 56px)' },
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textStyle: 'sm',
            color: 'accentAlt',
          })}
        >
          About
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: 'lg',
            lineHeight: 'snug',
            color: 'fieldInk',
            maxWidth: '34ch',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
      </div>
    </>
  )
}
