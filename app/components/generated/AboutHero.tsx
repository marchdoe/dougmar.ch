import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { HeroBand } from './HeroBand'

export function AboutHero() {
  return (
    <section
      className={css({
        paddingTop: '40px',
        paddingInline: '24px',
        lg: { paddingTop: '60px', paddingInline: '4vw' },
        xl: { paddingTop: '72px', paddingInline: '5vw' },
      })}
    >
      <HeroBand home={false}>
        <h1
          className={css({
            position: 'relative',
            bg: 'field',
            fontFamily: 'body',
            fontWeight: 'normal',
            textAlign: 'left',
            fontSize: { base: 'base', lg: 'lede' },
            lineHeight: 'normal',
            color: 'fieldInk',
            maxWidth: '52ch',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
        <div
          className={css({
            marginTop: '22px',
            bg: 'field',
            position: 'relative',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          <div
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontSize: { base: 'xl', lg: '2xl' },
              lineHeight: 'tight',
              color: 'fieldInk',
            })}
          >
            {identity.name}
          </div>
          <div className={css({ fontSize: 'base', color: 'fieldInkMuted', marginTop: '1' })}>
            {identity.role}
          </div>
        </div>
      </HeroBand>
    </section>
  )
}
