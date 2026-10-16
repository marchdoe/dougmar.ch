import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { CornerHeader } from './CornerHeader'
import { CreamPanel } from './Panels'

export function AboutThesis() {
  return (
    <CreamPanel>
      <div className={css({ position: { lg: 'sticky' }, top: '0' })}>
        <CornerHeader />
        <div
          className={css({
            fontSize: 'xs',
            fontWeight: 'bold',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'textFaint',
            marginBottom: '18px',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          The Standing Thesis
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: '20px', lg: '28px' },
            lineHeight: '1.3',
            letterSpacing: 'wide',
            fontVariant: 'small-caps',
            textAlign: 'justify',
            color: 'text',
            maxWidth: '34ch',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
        <div
          className={css({
            fontSize: 'lede',
            fontStyle: 'italic',
            color: 'textMuted',
            marginTop: '40px',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          {identity.name}, {identity.role}
        </div>
      </div>
    </CreamPanel>
  )
}
