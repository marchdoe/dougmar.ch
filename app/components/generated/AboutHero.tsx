import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { FogField } from './FogField'

const statement = identity.statement.replace(/\s*\u2014\s*/g, ', ')

export function AboutHero() {
  return (
    <FogField>
      <div className={css({ paddingTop: 'clamp(48px, 10vh, 120px)', textAlign: 'center' })}>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'light',
            textStyle: '3xl',
            lineHeight: 'tight',
            textTransform: 'uppercase',
            textAlign: 'center',
            color: 'text',
            marginInline: 'auto',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.name}
        </h1>
        <span
          className={css({
            display: 'inline-block',
            marginTop: '4',
            bg: 'bg',
            paddingInline: '3',
            paddingBlock: '1',
            fontSize: 'sm',
            fontVariantCaps: 'all-small-caps',
            letterSpacing: 'widest',
            color: 'textMuted',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {identity.role}
        </span>
        <p
          className={css({
            marginTop: '5',
            marginInline: 'auto',
            bg: 'bg',
            padding: '4',
            fontSize: 'lede',
            lineHeight: 'normal',
            textAlign: 'left',
            color: 'text',
            maxWidth: '46ch',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          {statement}
        </p>
      </div>
    </FogField>
  )
}
