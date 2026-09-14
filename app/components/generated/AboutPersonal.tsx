import { css } from '../../../styled-system/css'

type Personal = { holesInOne: number; sport: string; teams: string[]; currentFocus: string }

const rowStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2 0',
  borderBottom: '1px solid',
  borderColor: 'border',
})

export function AboutPersonal({ personal }: { personal: Personal }) {
  return (
    <section
      className={css({
        bg: 'surface',
        borderTop: '1px solid',
        borderColor: 'borderStrong',
        padding: { base: '8 5', lg: '48px 40px' },
      })}
    >
      <p
        className={css({
          fontWeight: 'bold',
          fontSize: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'accentAlt',
          marginBottom: '4',
        })}
      >
        Off the clock
      </p>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          padding: '2 0',
          borderBottom: '1px solid',
          borderTop: '1px solid',
          borderColor: 'border',
        })}
      >
        <span className={css({ fontSize: 'sm', color: 'textMuted' })}>Holes in one</span>
        <span className={css({ fontSize: 'sm', fontWeight: 'bold', color: 'text' })}>
          {personal.holesInOne}
        </span>
      </div>
      <div className={rowStyle}>
        <span className={css({ fontSize: 'sm', color: 'textMuted' })}>Sport</span>
        <span className={css({ fontSize: 'sm', fontWeight: 'bold', color: 'text' })}>
          {personal.sport}
        </span>
      </div>
      <div className={rowStyle}>
        <span className={css({ fontSize: 'sm', color: 'textMuted' })}>Teams</span>
        <span className={css({ fontSize: 'sm', fontWeight: 'bold', color: 'text' })}>
          {personal.teams.join(', ')}
        </span>
      </div>
      <div className={rowStyle}>
        <span className={css({ fontSize: 'sm', color: 'textMuted' })}>Current focus</span>
        <span className={css({ fontSize: 'sm', fontWeight: 'bold', color: 'text' })}>
          {personal.currentFocus}
        </span>
      </div>
    </section>
  )
}
