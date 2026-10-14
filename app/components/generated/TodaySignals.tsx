import { css } from '../../../styled-system/css'
import { Annotations } from './Annotations'

const signals = [
  { label: 'Detroit', body: 'Red Wings 4–5, one goal short.' },
  { label: 'On the tee', body: 'Butterfield Bermuda Championship, tees off.' },
  { label: 'Market', body: 'SPY 778.01, down 0.01%.' },
]

export function TodaySignals() {
  return (
    <Annotations label="Today" items={signals}>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          alignItems: { base: 'flex-start', lg: 'flex-end' },
        })}
      >
        <span
          className={css({
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: 'xs',
            color: 'textMuted',
          })}
        >
          Aside
        </span>
        <span
          className={css({
            fontSize: 'sm',
            color: 'textMuted',
            fontStyle: 'italic',
            lineHeight: 'normal',
          })}
        >
          You love the person as they are, and not as you’d like them to be.{' '}
          <cite className={css({ color: 'textFaint', fontStyle: 'normal' })}>Leo Tolstoy</cite>
        </span>
      </div>
    </Annotations>
  )
}
