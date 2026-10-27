import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

type Props = { eyebrow: string; title: string; big?: boolean }

const bigTitle = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  fontSize: { base: '40px', md: '88px', xl: '120px' },
  lineHeight: '0.92',
  letterSpacing: '-0.02em',
  textAlign: 'right',
  color: 'text',
  maxWidth: '100%',
  animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

// a long statement is prose, so it stays well under 48px
const statementTitle = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  fontSize: { base: '22px', lg: '32px' },
  lineHeight: '1.2',
  letterSpacing: '-0.005em',
  textAlign: 'right',
  color: 'text',
  maxWidth: '32ch',
  animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

export function PageField({ eyebrow, title, big }: Props) {
  return (
    <section className={css({ position: 'relative', overflow: 'hidden', bg: 'bg' })}>
      <Ground material="rule" seed={658870071} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          paddingTop: 'clamp(28px, 6vw, 72px)',
          paddingInline: 'clamp(18px, 6vw, 96px)',
          paddingBottom: 'clamp(36px, 5vw, 72px)',
        })}
      >
        <div
          className={css({
            fontFamily: 'body',
            fontSize: 'xs',
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            color: 'textMuted',
            fontWeight: 'bold',
            marginBottom: '10px',
            bg: 'bg',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {eyebrow}
        </div>
        <h1 className={big ? bigTitle : statementTitle}>{title}</h1>
      </div>
    </section>
  )
}
