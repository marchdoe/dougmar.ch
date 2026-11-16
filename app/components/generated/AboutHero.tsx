import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutHero() {
  return (
    <section
      data-split=""
      className={css({
        gridArea: 'hero',
        minWidth: '0',
        bg: 'bg',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: { base: '48px', lg: '96px' },
        paddingBottom: { base: '48px', lg: '64px' },
        paddingInline: { base: '24px', lg: '6vw' },
        minHeight: { lg: '420px' },
      })}
    >
      <div
        className={css({
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'textMuted',
          marginBottom: { base: '28px', lg: '40px' },
        })}
      >
        About
      </div>
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textStyle: '4xl',
          lineHeight: '0.9',
          color: 'text',
        })}
      >
        {identity.name}
      </div>
      <h1
        className={css({
          marginTop: { base: '24px', lg: '32px' },
          textStyle: 'lede',
          fontWeight: 'bold',
          color: 'text',
          maxWidth: '46ch',
        })}
      >
        {identity.statement}
      </h1>
    </section>
  )
}
