import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

export function AboutBand() {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        clipPath: 'polygon(0 14%, 100% 0, 100% 100%, 0 100%)',
        paddingTop: 'clamp(64px, 8vw, 120px)',
        paddingBottom: 'clamp(32px, 5vw, 64px)',
        paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        alignItems: { base: 'flex-start', md: 'baseline' },
        gap: { base: '2', md: '6' },
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'light',
          fontSize: 'clamp(72px, 12vw, 160px)',
          lineHeight: '1',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {personal.holesInOne}
      </span>
      <span
        className={css({
          textStyle: 'sm',
          fontWeight: 'semibold',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'fieldInk',
        })}
      >
        Holes in one, {personal.sport}
      </span>
    </section>
  )
}
