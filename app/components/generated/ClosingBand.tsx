import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const link = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  paddingInline: '4px',
  fontFamily: 'display',
  fontWeight: 'bold',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  textStyle: 'sm',
  color: 'fieldInk',
  _hover: { color: 'accentAlt', textDecoration: 'underline', textDecorationColor: 'accentAlt' },
})

export function ClosingBand() {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(36px, 7vw, 80px)',
        paddingInline: 'clamp(20px, 5vw, 72px)',
      })}
    >
      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '72ch' })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textStyle: 'sm',
            color: 'accentAlt',
          })}
        >
          The index
        </span>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            fontSize: 'clamp(22px, 3.4vw, 38px)',
            lineHeight: '1.1',
            letterSpacing: '-0.01em',
            color: 'fieldInk',
          })}
        >
          Every project started as an experiment.
        </h2>
        <div
          className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '24px', rowGap: '4px' })}
        >
          <a href="/work" className={link}>
            All work
          </a>
          <a href="/about" className={link}>
            About Doug
          </a>
          <a href={`mailto:${identity.email}`} className={link}>
            {identity.email}
          </a>
        </div>
      </div>
    </section>
  )
}
