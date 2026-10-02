import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { PageNav } from './PageNav'
import { VoidHero } from './VoidHero'

export function AboutHero() {
  return (
    <VoidHero>
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontSize: 'clamp(24px, 3vw, 44px)',
          lineHeight: 'snug',
          letterSpacing: 'tight',
          color: 'text',
          maxWidth: '32ch',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.statement}
      </h1>
      <div
        className={css({
          marginTop: '7',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        <PageNav />
      </div>
    </VoidHero>
  )
}
