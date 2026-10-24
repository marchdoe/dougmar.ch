import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { Kicker } from './Kicker'
import { Pod } from './Pod'

export function PersonalSection() {
  return (
    <section
      className={css({
        paddingInline: '5vw',
        paddingBottom: '9',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ maxWidth: '1180px', marginInline: 'auto' })}>
        <Kicker>Away from the desk</Kicker>
        <div
          className={css({
            display: 'flex',
            flexDirection: { base: 'column', md: 'row' },
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6',
            textAlign: 'center',
            paddingBlock: '5',
          })}
        >
          <Pod label="Holes in one" value={String(personal.holesInOne)} solid />
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3',
              maxWidth: '44ch',
            })}
          >
            <span
              className={css({
                textStyle: '2xs',
                fontWeight: 'bold',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'textMuted',
              })}
            >
              Current focus
            </span>
            <p className={css({ textStyle: 'lede', color: 'text' })}>{personal.currentFocus}</p>
            <ul
              className={css({
                listStyle: 'none',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '2',
              })}
            >
              {personal.teams.map((team) => (
                <li
                  key={team}
                  className={css({
                    textStyle: 'sm',
                    fontWeight: 'bold',
                    letterSpacing: 'wide',
                    textTransform: 'uppercase',
                    color: 'text',
                    border: '1px solid',
                    borderColor: 'border',
                    borderRadius: 'full',
                    paddingBlock: '1',
                    paddingInline: '3',
                  })}
                >
                  {team}
                </li>
              ))}
            </ul>
          </div>
          <Pod label="Sport" value={personal.sport} />
        </div>
      </div>
    </section>
  )
}
