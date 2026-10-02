import { css } from '../../../styled-system/css'
import { PageNav } from './PageNav'
import { VoidHero } from './VoidHero'

export function MissingProject() {
  return (
    <VoidHero>
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: 'clamp(34px, 6vw, 88px)',
          lineHeight: '0.95',
          color: 'text',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Project not found
      </h1>
      <div
        className={css({
          marginTop: '6',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        <PageNav />
      </div>
    </VoidHero>
  )
}
