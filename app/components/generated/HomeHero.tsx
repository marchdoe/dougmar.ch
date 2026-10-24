import { css } from '../../../styled-system/css'
import { Pod } from './Pod'

const signals: {
  key: 'golf' | 'moon' | 'market' | 'weather'
  label: string
  value: string
  sub: string
  solid: boolean
  down: boolean
}[] = [
  {
    key: 'golf',
    label: 'Golf',
    value: '−13',
    sub: 'Butterfield Bermuda · Hirata / Blanchet, tied',
    solid: false,
    down: false,
  },
  {
    key: 'moon',
    label: 'Moon · Full',
    value: '98.8%',
    sub: 'Late October',
    solid: true,
    down: false,
  },
  {
    key: 'market',
    label: 'SPY · Close',
    value: '759.97',
    sub: '▼ −0.52%',
    solid: false,
    down: true,
  },
  {
    key: 'weather',
    label: 'Aldie · Clear',
    value: '41.7°F',
    sub: 'Virginia sky',
    solid: false,
    down: false,
  },
]

const early = css({
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '160ms',
})
const late = css({
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '240ms',
})

const ghostWord = css({
  display: 'block',
  fontSize: 'clamp(56px, 11vw, 150px)',
  whiteSpace: 'nowrap',
})

// trailing room so the rotated +17 badge stays inside its own box
const scoreWord = css({
  display: 'inline-block',
  whiteSpace: 'nowrap',
  paddingInlineEnd: '0.06em',
})

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '3',
        paddingBottom: '7',
        paddingInline: { base: '5vw', lg: '6vw' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      })}
    >
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          inset: '-4%',
          bg: 'bg',
          zIndex: 0,
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      />
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
          transform: 'translateY(-50%)',
          fontFamily: 'display',
          lineHeight: '0.86',
          letterSpacing: '-0.02em',
          color: 'bgAlt',
          opacity: 0.3,
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        })}
      >
        <span className={ghostWord}>DETROIT</span>
        <span className={ghostWord}>DETROIT</span>
        <span className={ghostWord}>DETROIT</span>
      </div>

      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: { base: 'flex', lg: 'block' },
          flexDirection: 'column',
          alignItems: 'center',
          gap: '34px',
          marginTop: { base: '3', lg: '0' },
          minHeight: { lg: '84vh' },
        })}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '20px',
            lg: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(680px, 88%)',
            },
            xl: { width: 'min(820px, 88%)' },
          })}
        >
          <h1
            className={css({
              paddingTop: '3',
              fontWeight: 'normal',
              textAlign: 'center',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            <span
              className={css({
                display: 'flex',
                flexDirection: { base: 'column', lg: 'row' },
                alignItems: { base: 'center', lg: 'baseline' },
                justifyContent: 'center',
                gap: { base: '0', lg: '0.1em' },
                fontFamily: 'display',
                fontSize: { base: '96px', md: '128px', lg: '132px', xl: '160px' },
                lineHeight: '0.84',
                letterSpacing: '-0.01em',
                color: 'text',
              })}
            >
              <span className={scoreWord}>
                128
                <span
                  className={css({
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '0.06em',
                    fontFamily: 'body',
                    fontWeight: 'bold',
                    fontSize: 'max(12px, 0.19em)',
                    letterSpacing: '0.02em',
                    lineHeight: '1',
                    paddingBlock: '0.4em',
                    paddingInline: '0.55em',
                    bg: 'accent',
                    color: 'accentText',
                    borderRadius: 'sm',
                    transform: 'rotate(-6deg)',
                    whiteSpace: 'nowrap',
                  })}
                >
                  +17
                </span>
              </span>
              <span className={scoreWord}>
                <span
                  className={css({
                    display: { base: 'none', lg: 'inline' },
                    marginRight: '0.1em',
                  })}
                >
                  –
                </span>
                111
              </span>
            </span>{' '}
            <span
              className={css({
                display: 'block',
                marginTop: '3',
                marginInline: 'auto',
                maxWidth: '14ch',
                fontFamily: 'display',
                fontSize: { base: '30px', md: '40px', lg: '52px' },
                lineHeight: '1',
                letterSpacing: '0.004em',
                textTransform: 'uppercase',
                color: 'text',
              })}
            >
              Pistons run away with it
            </span>
          </h1>
          <p
            className={css({
              textStyle: 'lede',
              color: 'textMuted',
              maxWidth: '44ch',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            Final, Saturday. Seventeen points of daylight, wire to wire. A Pistons win is a Pistons
            win, and I just say the score.
          </p>
        </div>

        <div
          className={css({
            display: { base: 'flex', lg: 'contents' },
            flexDirection: { base: 'column', sm: 'row' },
            flexWrap: { sm: 'wrap' },
            justifyContent: { sm: 'center' },
            alignItems: 'center',
            rowGap: { base: '22px', sm: '28px' },
            columnGap: { sm: '44px' },
            width: '100%',
          })}
        >
          {signals.map((s, i) => (
            <Pod
              key={s.key}
              at={s.key}
              label={s.label}
              value={s.value}
              sub={s.sub}
              down={s.down}
              solid={s.solid}
              className={i < 2 ? early : late}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
