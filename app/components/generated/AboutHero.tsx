import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { RunningSentence } from './RunningSentence'

export function AboutHero() {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        paddingBlock: 'clamp(22px, 6vw, 56px)',
        paddingInline: 'clamp(20px, 6vw, 80px)',
      })}
    >
      <Ground material="rule" seed={960521440} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(26px, 4vh, 40px)',
        })}
      >
        <BrandLockup variant="stacked-md" mode="original" />
        {/* eyebrow in text ink on a flat bg box so it clears 4.5:1 over the ruled ground */}
        <span
          className={css({
            display: 'block',
            width: 'fit-content',
            alignSelf: 'flex-start',
            bg: 'bg',
            paddingBlock: '2px',
            paddingInline: '8px',
            borderLeftWidth: '3px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'accent',
            fontSize: 'sm',
            fontWeight: 'bold',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'text',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          About {identity.name}
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontVariant: 'all-small-caps',
            letterSpacing: 'wide',
            textAlign: 'left',
            fontSize: { base: 'lg', lg: 'xl' },
            lineHeight: '1.2',
            color: 'text',
            maxWidth: '40ch',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
        <RunningSentence
          className={css({
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        />
      </div>
    </header>
  )
}
