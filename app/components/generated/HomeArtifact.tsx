import { css } from '../../../styled-system/css'
import { FeaturedDeck } from './FeaturedDeck'
import { Guides } from './Guides'
import { MetaLine } from './MetaLine'
import { heroProject } from './heroProject'

const heroCopy = 'Most golf apps are digital scorecards. This one is not.'
const words = (heroProject?.title ?? '15th Club').split(' ')

export function HomeArtifact() {
  return (
    <section
      className={css({
        gridArea: { lg: 'artifact' },
        alignSelf: { lg: 'stretch' },
        bg: 'bgAlt',
        color: 'text',
        paddingTop: { base: '84px', lg: '96px' },
        paddingBottom: { base: '44px', lg: '76px' },
        paddingInline: { base: '20px', lg: '5vw' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: { lg: 'center' },
        textAlign: 'right',
        gap: { base: '26px', lg: '34px' },
        overflow: 'hidden',
      })}
    >
      <div
        className={css({
          position: 'relative',
          alignSelf: 'flex-end',
          maxWidth: '100%',
          paddingTop: '26px',
          paddingBottom: '22px',
        })}
      >
        <Guides />
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: '48px', lg: '144px' },
            lineHeight: '0.9',
            letterSpacing: '-0.01em',
            color: 'text',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        >
          {words.map((w) => (
            <span key={w} className={css({ display: 'block' })}>
              {w}
            </span>
          ))}
        </div>
      </div>
      <p
        className={css({
          textStyle: 'sm',
          fontWeight: 'normal',
          letterSpacing: 'wider',
          textTransform: 'lowercase',
          color: 'textMuted',
          marginTop: '2',
          '& em': { fontStyle: 'normal', color: 'accent' },
        })}
      >
        dm serif display · optical size 150 · <em>x-height 0.71</em>
      </p>
      <MetaLine />
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'normal',
          fontSize: { base: '28px', lg: '46px' },
          lineHeight: '1.14',
          letterSpacing: 'normal',
          textTransform: 'lowercase',
          maxWidth: '19ch',
          color: 'text',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {heroCopy}
      </h1>
      <FeaturedDeck />
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginTop: '1',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          paddingTop: '22px',
        })}
      >
        <span
          aria-hidden="true"
          className={css({
            width: '54px',
            height: '54px',
            borderRadius: 'sm',
            bg: 'field',
            flex: 'none',
          })}
        />
        <div
          className={css({
            textStyle: 'xs',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            lineHeight: '1.5',
            color: 'textMuted',
            textAlign: 'left',
            '& em': { fontStyle: 'normal', color: 'accentAlt' },
          })}
        >
          spruce <em>162°</em>
          <br />
          the single ink
        </div>
      </div>
    </section>
  )
}
