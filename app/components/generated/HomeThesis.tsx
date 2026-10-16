import { css } from '../../../styled-system/css'
import { ActPhrase } from './ActPhrase'
import { CornerHeader } from './CornerHeader'
import { CreamPanel } from './Panels'

export function HomeThesis() {
  return (
    <CreamPanel className={css({ minHeight: '100vh' })}>
      <CornerHeader />
      <div
        className={css({
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: { base: '12px', lg: '18px' },
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        The Thesis
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: '27px', lg: '44px' },
          lineHeight: '1.14',
          letterSpacing: 'wide',
          fontVariant: 'small-caps',
          fontStyle: 'normal',
          textAlign: 'justify',
          color: 'text',
          maxWidth: { base: '18ch', lg: '16ch' },
          marginTop: { lg: '2' },
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        <ActPhrase />
      </h1>
      <div
        className={css({
          fontFamily: 'body',
          fontSize: 'lede',
          fontStyle: 'italic',
          color: 'textMuted',
          marginTop: { base: '20px', lg: '40px' },
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        <span
          className={css({
            display: 'block',
            fontStyle: 'normal',
            fontSize: 'xs',
            fontWeight: 'bold',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'textFaint',
            marginBottom: '6px',
          })}
        >
          Attributed to
        </span>
        Thomas Jefferson
      </div>
    </CreamPanel>
  )
}
