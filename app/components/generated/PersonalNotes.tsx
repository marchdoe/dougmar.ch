import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

const notes = [
  { k: 'holes in one', v: String(personal.holesInOne) },
  { k: 'sport', v: personal.sport },
  { k: 'teams', v: personal.teams.join(', ') },
  { k: 'current focus', v: personal.currentFocus },
]

export function PersonalNotes() {
  return (
    <aside
      aria-label="Off the course and on it"
      className={css({
        position: 'relative',
        zIndex: 1,
        marginTop: { base: '32px', lg: '0' },
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        bg: 'bg',
        padding: '4',
        borderRadius: 'md',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '80ms',
      })}
    >
      <div
        className={css({
          fontSize: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'accent',
          fontWeight: 'bold',
        })}
      >
        marginalia
      </div>
      {notes.map((n) => (
        <div
          key={n.k}
          className={css({
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            paddingTop: '12px',
          })}
        >
          <div
            className={css({
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'textMuted',
              marginBottom: '5px',
            })}
          >
            {n.k}
          </div>
          <div
            className={css({
              fontSize: '15px',
              color: 'text',
              fontVariantNumeric: 'tabular-nums',
              maxWidth: '40ch',
            })}
          >
            {n.v}
          </div>
        </div>
      ))}
    </aside>
  )
}
