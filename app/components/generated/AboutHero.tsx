import { css, cx } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { grid, label } from './styles'

export function AboutHero() {
  return (
    <section className={grid}>
      <div
        className={css({
          gridColumn: '1 / -1',
          bg: 'bg',
          minHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '22px',
          paddingTop: { base: '26px', md: '34px' },
          paddingBottom: { base: '34px', md: '40px' },
          paddingInline: { base: 'clamp(16px, 5vw, 64px)', md: '40px' },
        })}
      >
        <span
          className={cx(
            label,
            css({
              color: 'textMuted',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })
          )}
        >
          About · {identity.name}
        </span>
        {/* The statement is prose (340 characters), so it sits on a body-scale step, never a display clamp. */}
        <h1
          className={css({
            fontFamily: 'body',
            fontWeight: 'normal',
            fontSize: { base: 'md', lg: 'lg' },
            lineHeight: '1.4',
            maxWidth: '48ch',
            color: 'text',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
      </div>
    </section>
  )
}
