import { css } from '../../../styled-system/css'

type Personal = { holesInOne: number; sport: string; teams: string[]; currentFocus: string }

const row = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '2',
  flexWrap: 'wrap',
  paddingBlock: '3',
  borderTop: '1px solid',
  borderColor: 'fieldBorder',
})

const key = css({ color: 'fieldInkMuted', fontSize: 'sm', fontWeight: 'bold' })
const val = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'base',
  color: 'fieldInk',
  textAlign: 'right',
})

export function PersonalLedger({ personal }: { personal: Personal }) {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        margin: '6vw',
        border: '1px solid',
        borderColor: 'fieldBorder',
        borderRadius: 'md',
        paddingInline: '6',
        paddingBlock: '7',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'lg',
          color: 'fieldInk',
          marginBottom: '4',
        })}
      >
        Off the Clock
      </h2>
      <ul className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
        <li className={row}>
          <span className={key}>Holes in one</span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'base',
              color: 'fieldInk',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {personal.holesInOne}
          </span>
        </li>
        <li className={row}>
          <span className={key}>Sport</span>
          <span className={val}>{personal.sport}</span>
        </li>
        <li className={row}>
          <span className={key}>Teams</span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'base',
              color: 'fieldInk',
              textAlign: 'right',
              maxWidth: '32ch',
            })}
          >
            {personal.teams.join(', ')}
          </span>
        </li>
        <li className={row}>
          <span className={key}>Current focus</span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'base',
              color: 'fieldInk',
              textAlign: 'right',
              maxWidth: '32ch',
            })}
          >
            {personal.currentFocus}
          </span>
        </li>
      </ul>
    </section>
  )
}
