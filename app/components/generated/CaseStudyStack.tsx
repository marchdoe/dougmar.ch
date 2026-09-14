import { css } from '../../../styled-system/css'

export function CaseStudyStack({ stack, liveUrl }: { stack?: string[]; liveUrl?: string }) {
  if (!stack && !liveUrl) return null
  return (
    <section
      className={css({
        bg: 'bgAlt',
        padding: { base: '8 5', lg: '48px 56px' },
        borderTop: '1px solid',
        borderColor: 'borderStrong',
      })}
    >
      {stack && (
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
            marginBottom: liveUrl ? '5' : '0',
          })}
        >
          {stack.map((s) => (
            <span
              key={s}
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'textMuted',
                border: '1px solid',
                borderColor: 'border',
                padding: '1 3',
              })}
            >
              {s}
            </span>
          ))}
        </div>
      )}
      {liveUrl && (
        <a
          href={liveUrl}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2',
            fontWeight: 'bold',
            fontSize: 'base',
            color: 'accentAlt',
            minHeight: '44px',
          })}
        >
          <span
            className={css({
              borderBottom: '2px solid',
              borderColor: 'accentAlt',
              paddingBottom: '1',
            })}
          >
            Visit the live build
          </span>{' '}
          →
        </a>
      )}
    </section>
  )
}
