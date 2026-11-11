import { css } from '../../../styled-system/css'

export function HonorBand() {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        paddingBlock: 'clamp(48px, 8vh, 96px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        display: 'grid',
        gap: '18px',
        justifyItems: 'center',
        textAlign: 'center',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <p
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(22px, 3.2vw, 36px)',
          color: 'text',
          maxWidth: '24ch',
          lineHeight: '1.18',
        })}
      >
        “Help others and give something back.”
      </p>
      <p className={css({ fontFamily: 'body', fontSize: 'sm', color: 'textMuted' })}>
        Arnold Schwarzenegger
      </p>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: 'clamp(15px, 1.6vw, 17px)',
          color: 'textMuted',
          maxWidth: '56ch',
          lineHeight: '1.6',
        })}
      >
        Veterans Day marks the 1918 Armistice. The guns fell silent at the eleventh hour of the
        eleventh day of the eleventh month. A day to honor those who served, and a fitting reminder
        to give something back.
      </p>
    </section>
  )
}
