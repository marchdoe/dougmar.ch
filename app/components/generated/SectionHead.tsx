import { css } from '../../../styled-system/css'

export function SectionHead({ title, note }: { title: string; note?: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '16px',
        marginBottom: '8px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontSize: 'clamp(26px, 3vw, 38px)',
          letterSpacing: '.03em',
        })}
      >
        {title}
      </h2>
      {note ? (
        <span
          className={css({
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: '.14em',
            color: 'textMuted',
          })}
        >
          {note}
        </span>
      ) : null}
    </div>
  )
}
