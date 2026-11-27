import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { Guides } from './Guides'

export function AboutStatement() {
  return (
    <section
      className={css({
        gridArea: { lg: 'statement' },
        alignSelf: { lg: 'stretch' },
        bg: 'bgAlt',
        color: 'text',
        paddingTop: { base: '96px', lg: '132px' },
        paddingBottom: { base: '44px', lg: '76px' },
        paddingInline: { base: '20px', lg: '5vw' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        textAlign: 'right',
        gap: { base: '26px', lg: '34px' },
        overflow: 'hidden',
      })}
    >
      <p
        className={css({
          textStyle: 'sm',
          letterSpacing: 'wider',
          textTransform: 'lowercase',
          color: 'textMuted',
          '& em': { fontStyle: 'normal', color: 'accent' },
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        about · {identity.name} · <em>2006 to present</em>
      </p>
      <div
        className={css({
          position: 'relative',
          alignSelf: 'flex-end',
          maxWidth: '100%',
          paddingTop: '26px',
          paddingBottom: '22px',
        })}
      >
        <Guides />
        <h1
          className={css({
            position: 'relative',
            zIndex: 1,
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: { base: '28px', lg: '46px' },
            lineHeight: '1.14',
            textTransform: 'lowercase',
            maxWidth: '19ch',
            color: 'text',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.role}
        </h1>
      </div>
      <p
        className={css({
          textStyle: 'lede',
          lineHeight: '1.6',
          maxWidth: '46ch',
          color: 'textMuted',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        {identity.statement}
      </p>
    </section>
  )
}
