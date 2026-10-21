import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function SpecimenTail() {
  const fig = css({
    fontFamily: 'display',
    fontWeight: 'normal',
    lineHeight: '0.8',
    color: 'fieldInk',
  })
  const marks = [
    { fig: '8', cap: 'caption', size: css({ fontSize: '40px' }) },
    { fig: '11', cap: 'metadata', size: css({ fontSize: '52px' }) },
    { fig: '24', cap: 'standfirst', size: css({ fontSize: '68px' }) },
    { fig: '48', cap: 'section', size: css({ fontSize: '96px' }) },
    { fig: '150', cap: 'index title', size: css({ fontSize: '120px' }) },
  ]
  const strong = css({ color: 'fieldInk', fontWeight: 'bold' })
  return (
    <footer
      className={css({
        gridColumn: { md: '1 / -1' },
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(30px, 4vw, 52px)',
        paddingInline: '5vw',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(22px, 3vw, 34px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: 'clamp(18px, 3vw, 48px)',
          paddingBottom: 'clamp(18px, 2.5vw, 28px)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'fieldBorder',
        })}
      >
        {marks.map((mark) => (
          <div
            key={mark.fig}
            className={css({ display: 'flex', flexDirection: 'column', gap: '3px' })}
          >
            <span className={`${fig} ${mark.size}`}>{mark.fig}</span>
            <span
              className={css({
                fontSize: '12px',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
              })}
            >
              {mark.cap}
            </span>
          </div>
        ))}
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          rowGap: '14px',
          columnGap: '32px',
          fontSize: '14px',
          color: 'fieldInkMuted',
        })}
      >
        <span>
          Sunrise <b className={strong}>7:28</b> · Sunset <b className={strong}>18:24</b> · Aldie,
          Virginia
        </span>
        <span>
          Set in <b className={strong}>Bebas Neue</b> and <b className={strong}>IBM Plex Sans</b>
        </span>
        <a
          href={`mailto:${identity.email}`}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            minWidth: '44px',
            paddingBlock: '10px',
            paddingInline: '4px',
            color: 'fieldInk',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            _hover: { color: 'fieldInkMuted' },
          })}
        >
          {identity.email}
        </a>
        <span>
          © <b className={strong}>{identity.name}</b> 2026
        </span>
      </div>
    </footer>
  )
}
