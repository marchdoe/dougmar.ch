import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { identity } from '../../content/about'

type Cell = { label: string; value: string; sub?: string }

export function ScorecardFooter({
  title,
  dateLabel,
  cells,
}: {
  title: string
  dateLabel: string
  cells: Cell[]
}) {
  return (
    <footer
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        padding: { base: '6', md: '8' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <Ground material="rule" seed={1942557463} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '3',
          marginBottom: '5',
          borderBottom: '1px solid',
          borderColor: 'fieldBorder',
          paddingBottom: '3',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'xl',
            color: 'fieldInk',
          })}
        >
          {title}
        </h2>
        <span
          className={css({
            fontSize: 'sm',
            color: 'fieldInkMuted',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
          })}
        >
          {dateLabel}
        </span>
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: '1px',
          bg: 'fieldBorder',
          border: '1px solid',
          borderColor: 'fieldBorder',
        })}
      >
        {cells.map((cell) => (
          <div
            key={cell.label}
            className={css({
              bg: 'field',
              padding: '4',
              display: 'flex',
              flexDirection: 'column',
              gap: '1',
              minHeight: '96px',
            })}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                fontSize: '2xs',
                color: 'fieldInkMuted',
              })}
            >
              {cell.label}
            </span>
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'lg',
                color: 'fieldInk',
              })}
            >
              {cell.value}
            </span>
            {cell.sub ? (
              <span className={css({ fontSize: 'sm', color: 'fieldInkMuted' })}>{cell.sub}</span>
            ) : null}
          </div>
        ))}
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          marginTop: '5',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4',
          alignItems: 'center',
          fontSize: 'sm',
          color: 'fieldInkMuted',
        })}
      >
        <BrandLockup
          variant="stacked-md"
          mode="original"
          roleLine={false}
          className={css({ color: 'fieldInk' })}
        />
        <span>
          {identity.name}, {identity.role}
        </span>
        <a href={`mailto:${identity.email}`} className={css({ color: 'fieldInk' })}>
          {identity.email}
        </a>
      </div>
    </footer>
  )
}
