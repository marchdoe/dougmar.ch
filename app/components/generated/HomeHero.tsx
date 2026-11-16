import { css } from '../../../styled-system/css'

export function HomeHero() {
  return (
    <section
      data-split=""
      className={css({
        gridArea: 'hero',
        minWidth: '0',
        bg: 'bg',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: { base: '48px', lg: '96px' },
        paddingBottom: { base: '56px', lg: '80px' },
        paddingInline: { base: '24px', lg: '6vw' },
        minHeight: { base: '58vh', lg: '82vh' },
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
        Detroit · Week 11
      </div>
      <h1
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
        })}
      >
        <span
          className={css({
            display: 'block',
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textStyle: { base: '5xl', lg: 'hero' },
            lineHeight: '0.9',
            color: 'text',
          })}
        >
          Lions
        </span>
        {/* Mockup deck: 26px at 360, 40px on the wide layout. */}
        <span
          className={css({
            display: 'block',
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: { base: '26px', lg: '40px' },
            lineHeight: '1',
            letterSpacing: 'tight',
            color: 'text',
            marginTop: { base: '16px', lg: '24px' },
          })}
        >
          by <span className={css({ color: 'accent' })}>25</span>
        </span>
      </h1>
      <div
        className={css({
          marginTop: 'auto',
          paddingTop: '40px',
          textStyle: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'textFaint',
        })}
      >
        Final · <span className={css({ color: 'text' })}>35–10</span>
      </div>
    </section>
  )
}
