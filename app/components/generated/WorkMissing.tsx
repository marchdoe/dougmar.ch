import { css } from '../../../styled-system/css'
import { HeroBand } from './HeroBand'

export function WorkMissing() {
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
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'light',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: { base: '2xl', lg: '4xl' },
            lineHeight: 'tight',
            color: 'fieldInk',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          No project by that name
        </h1>
        <a
          href="/work"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            marginTop: '4',
            bg: 'field',
            position: 'relative',
            fontVariant: 'small-caps',
            letterSpacing: 'wider',
            color: 'fieldInk',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
            _hover: { color: 'fieldInkMuted' },
          })}
        >
          See the work index ↗
        </a>
      </HeroBand>
    </section>
  )
}
