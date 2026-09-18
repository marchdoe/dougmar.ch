import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

// mockup accentLt (#5CCB8C) has no exact token; using accentAlt as the nearest saturated accent register
export function AboutThesis({ statement, role }: { statement: string; role: string }) {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        minWidth: 0,
        bg: 'field',
        color: 'fieldInk',
        display: 'flex',
        flexDirection: 'column',
        gap: '4',
        justifyContent: 'center',
        padding: { base: '5', md: '7' },
        minHeight: { lg: '100vh' },
      })}
    >
      <Ground material="rule" seed={1942557463} />
      <div className={css({ position: 'relative', zIndex: 1, minWidth: 0 })}>
        <p
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            fontSize: 'sm',
            color: 'accentAlt',
            marginBottom: '3',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {role}
        </p>
        <h1
          className={css({
            fontFamily: 'body',
            fontWeight: 'normal',
            fontSize: { base: 'lg', md: 'xl', lg: '2xl' },
            lineHeight: 'loose',
            color: 'fieldInk',
            maxWidth: '48ch',
            overflowWrap: 'anywhere',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {statement}
        </h1>
      </div>
    </section>
  )
}
