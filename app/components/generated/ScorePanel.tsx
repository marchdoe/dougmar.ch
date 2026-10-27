import { css } from '../../../styled-system/css'

const games = [
  { team: 'Lions', meta: 'NFL · Win', win: '20', lose: '17' },
  { team: 'Red Wings', meta: 'NHL · Win', win: '4', lose: '3' },
]

export function ScorePanel() {
  return (
    <section
      aria-label="Detroit weekend results"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        border: '1px solid',
        borderColor: 'fieldBorder',
        borderRadius: 'sm',
        width: '100%',
        maxWidth: '560px',
        minWidth: '0',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '240ms',
      })}
    >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '2',
          paddingBlock: '12px',
          paddingInline: '18px',
          borderBottom: '1px solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        <span
          className={css({
            fontFamily: 'body',
            textTransform: 'uppercase',
            letterSpacing: '0.11em',
            fontSize: '2xs',
            fontWeight: 'bold',
            color: 'fieldInkMuted',
          })}
        >
          The evidence
        </span>
        <span
          className={css({
            fontFamily: 'body',
            fontSize: '2xs',
            letterSpacing: '0.05em',
            color: 'fieldInkMuted',
          })}
        >
          Final · Oct 25–26
        </span>
      </div>
      {games.map((g) => (
        <div
          key={g.team}
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '4',
            paddingBlock: '16px',
            paddingInline: '18px',
            '& + &': { borderTop: '1px solid', borderTopColor: 'fieldBorder' },
          })}
        >
          <span
            className={css({ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '0' })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontStyle: 'italic',
                fontSize: { base: '22px', lg: '28px' },
                lineHeight: '0.95',
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
                color: 'fieldInk',
              })}
            >
              {g.team}
            </span>
            <span
              className={css({
                fontFamily: 'body',
                fontSize: '2xs',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'fieldInkMuted',
              })}
            >
              {g.meta}
            </span>
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: { base: '34px', lg: '52px' },
              lineHeight: '0.9',
              color: 'fieldInk',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            })}
          >
            {g.win}
            <span className={css({ color: 'fieldInkMuted', paddingInline: '2px' })}>–</span>
            {g.lose}
          </span>
        </div>
      ))}
    </section>
  )
}
