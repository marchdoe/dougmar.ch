import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

export function AboutHero({
  name,
  role,
  statement,
  capabilities,
}: {
  name: string
  role: string
  statement: string
  capabilities: string[]
}) {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        padding: { base: '40px 20px 44px', lg: '64px 56px 56px' },
      })}
    >
      <Ground material="rule" seed={2143888891} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <p
          className={css({
            fontWeight: 'bold',
            fontSize: 'base',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'accent',
            marginBottom: '5',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {role}
        </p>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: 'xl',
            lineHeight: 'snug',
            color: 'fieldInk',
            maxWidth: '46ch',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {statement}
        </h1>
        <p
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'lg',
            color: 'fieldInkMuted',
            marginTop: '5',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          {name}
        </p>
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2 4',
            marginTop: '6',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        >
          {capabilities.map((c) => (
            <span
              key={c}
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wide',
                fontVariant: 'small-caps',
                textTransform: 'lowercase',
                color: 'fieldInkMuted',
                border: '1px solid',
                borderColor: 'fieldBorder',
                padding: '1 3',
              })}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
