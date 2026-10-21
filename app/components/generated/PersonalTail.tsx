import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

export function PersonalTail() {
  const cap = css({
    fontSize: '12px',
    letterSpacing: 'wider',
    textTransform: 'uppercase',
    color: 'fieldInkMuted',
  })
  const fig = css({
    fontFamily: 'display',
    fontWeight: 'normal',
    lineHeight: '0.85',
    color: 'fieldInk',
  })
  const mark = css({ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' })
  return (
    <section
      aria-label="Personal"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(30px, 4vw, 52px)',
        paddingInline: '5vw',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: 'clamp(22px, 3vw, 48px)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'fieldBorder',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={mark}>
        <span className={`${fig} ${css({ fontSize: '120px' })}`}>{personal.holesInOne}</span>
        <span className={cap}>holes in one</span>
      </div>
      <div className={mark}>
        <span className={`${fig} ${css({ fontSize: '68px' })}`}>{personal.sport}</span>
        <span className={cap}>sport</span>
      </div>
      <div className={mark}>
        <div
          className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '18px', rowGap: '4px' })}
        >
          {personal.teams.map((team) => (
            <span key={team} className={`${fig} ${css({ fontSize: '40px' })}`}>
              {team}
            </span>
          ))}
        </div>
        <span className={cap}>teams</span>
      </div>
      <div className={mark}>
        <p
          className={css({
            fontSize: '16px',
            lineHeight: '1.45',
            fontWeight: 'bold',
            color: 'fieldInk',
            maxWidth: '44ch',
          })}
        >
          {personal.currentFocus}
        </p>
        <span className={cap}>current focus</span>
      </div>
    </section>
  )
}
