import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { FeaturedCaesura } from './FeaturedCaesura'
import { NavSentence } from './NavSentence'

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bg',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: { base: '18px', md: '24px' },
      })}
    >
      <Ground material="rule" seed={977151964} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: { base: 'flex', md: 'grid' },
          flexDirection: 'column',
          gridTemplateColumns: { md: 'repeat(12, minmax(0, 1fr))' },
          rowGap: { base: '14px', md: '16px' },
          columnGap: { md: '24px' },
          alignItems: 'stretch',
        })}
      >
        <div
          className={css({
            bg: 'bgAlt',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'sm',
            paddingTop: { base: '22px', md: '28px' },
            paddingInline: { base: '20px', lg: '28px' },
            paddingBottom: { base: '24px', md: '30px' },
            display: { base: 'block', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: '0',
            gridColumn: { md: '7 / 13' },
            gridRow: { md: '1' },
          })}
        >
          <h1
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              textTransform: 'none',
              textAlign: 'left',
              textStyle: '2xl',
              fontSize: { base: '2xl', md: 'xl', lg: '3xl' },
              lineHeight: '1.14',
              letterSpacing: '-0.005em',
              maxWidth: { base: '26ch', md: '30ch', xl: '32ch' },
              color: 'text',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            Spend eighty percent of your time focusing on the opportunities of tomorrow rather than
            the problems of yesterday.
          </h1>
          <p
            className={css({
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              fontWeight: 'bold',
              fontVariantCaps: 'all-small-caps',
              letterSpacing: 'wider',
              fontSize: 'sm',
              color: 'textMuted',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            <span
              aria-hidden="true"
              className={css({
                display: 'inline-block',
                width: '14px',
                height: '2px',
                bg: 'accent',
              })}
            />
            Brian Tracy
          </p>
        </div>
        <NavSentence
          className={css({
            gridColumn: { md: '7 / 13' },
            gridRow: { md: '2' },
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        />
        <FeaturedCaesura />
      </div>
    </section>
  )
}
