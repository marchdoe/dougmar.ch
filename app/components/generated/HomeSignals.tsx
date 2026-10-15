import { css } from '../../../styled-system/css'
import { Score, Sig, SigNote } from './Rail'

// The 820px fault ("A new design ships every morning...") is raised by the rail that
// __root.tsx renders above Layout ([data-live-frame]). No file in this run renders
// that element, and the brief forbids styling or targeting the rail.
export function HomeSignals() {
  return (
    <>
      <Sig label="Detroit Pistons">
        <Score>128–106</Score>
        <SigNote>Pistons over the floor, 128–106. A win, stated as a score.</SigNote>
      </Sig>
      <Sig label="Aldie, Virginia">
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            fontSize: 'base',
            color: 'text',
          })}
        >
          <span className={css({ fontFamily: 'display', fontSize: 'lg', color: 'textMuted' })}>
            61°F
          </span>
          <span>Overcast</span>
        </div>
      </Sig>
      <Sig label="Tonight's moon">
        <div className={css({ display: 'flex', alignItems: 'center', gap: '12px' })}>
          <svg
            className={css({ color: 'accentAlt', flex: '0 0 auto' })}
            width="30"
            height="30"
            viewBox="0 0 30 30"
            aria-hidden="true"
          >
            <path d="M15 1 A14 14 0 1 0 15 29 A19 19 0 0 1 15 1 Z" fill="currentColor" />
          </svg>
          <span className={css({ fontSize: 'sm', color: 'textMuted' })}>Waxing crescent</span>
        </div>
      </Sig>
      <Sig label="Markets · SPY">
        <div
          className={css({ display: 'flex', alignItems: 'baseline', gap: '2', flexWrap: 'wrap' })}
        >
          <span
            className={css({
              fontFamily: 'display',
              fontSize: '22px',
              lineHeight: 'tight',
              color: 'textMuted',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            -1.08
          </span>
          <span
            className={css({
              fontFamily: 'body',
              fontSize: '14px',
              lineHeight: 'normal',
              color: 'textFaint',
            })}
          >
            % on the day
          </span>
        </div>
      </Sig>
      <Sig label="On rotation">
        <p
          className={css({
            fontSize: 'sm',
            lineHeight: 'normal',
            color: 'textFaint',
            maxWidth: '45ch',
          })}
        >
          <strong className={css({ color: 'textMuted', fontWeight: 'bold' })}>
            Guided by Voices
          </strong>{' '}
          &amp;{' '}
          <strong className={css({ color: 'textMuted', fontWeight: 'bold' })}>
            My Morning Jacket
          </strong>
          . Taste, not news.
        </p>
      </Sig>
    </>
  )
}
