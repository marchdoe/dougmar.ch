import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { CapabilityList, TrajectoryShell } from './TrajectoryShell'

export function HomeTrajectory() {
  return (
    <TrajectoryShell rail={<CapabilityList />}>
      <ol
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {timeline.slice(0, 5).map((entry) => (
          <li
            key={`${entry.year}-${entry.role}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '4px',
              paddingBlock: '16px',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              _first: { borderTopWidth: '0' },
            })}
          >
            <span
              className={css({
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                color: 'accentAlt',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {entry.year}
            </span>
            <span
              className={css({
                fontSize: { base: '19px', md: '20px' },
                fontWeight: '600',
                color: 'text',
              })}
            >
              {[entry.role, entry.company].filter(Boolean).join(', ')}
            </span>
            {entry.description && (
              <span
                className={css({
                  fontSize: '15px',
                  lineHeight: '1.5',
                  color: 'textMuted',
                  maxWidth: '54ch',
                })}
              >
                {entry.description}
              </span>
            )}
          </li>
        ))}
      </ol>
    </TrajectoryShell>
  )
}
