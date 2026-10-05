import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { RunningSentence } from './RunningSentence'

export function MissingCase() {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        minHeight: '60vh',
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
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'all-small-caps',
            fontSize: '3xl',
            lineHeight: '1',
            color: 'text',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          No project at this address
        </h1>
        <RunningSentence
          className={css({
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        />
      </div>
    </header>
  )
}
