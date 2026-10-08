import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { Band, SecHead } from './Band'

export function AboutCells() {
  const eduMeta = [education.degree, education.concentration, education.years]
    .filter(Boolean)
    .join(', ')
  const cells = [
    { label: 'Education', value: education.school, meta: eduMeta },
    { label: 'Holes in one', value: String(personal.holesInOne), meta: '' },
    { label: 'Sport', value: personal.sport, meta: '' },
    { label: 'Teams', value: personal.teams.join(', '), meta: '' },
    { label: 'Current focus', value: personal.currentFocus, meta: '' },
  ]
  return (
    <Band label="Education and personal">
      <SecHead title="Off the clock" />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1.3fr' },
          columnGap: { sm: 'clamp(16px, 2.4vw, 40px)' },
        })}
      >
        {cells.map((c) => (
          <div
            key={c.label}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              paddingBlock: '16px',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
            })}
          >
            <span
              className={css({
                fontSize: '2xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'textMuted',
                fontWeight: 'bold',
              })}
            >
              {c.label}
            </span>
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'md',
                letterSpacing: 'tight',
              })}
            >
              {c.value}
            </span>
            <span className={css({ fontSize: 'xs', color: 'textMuted' })}>{c.meta}</span>
          </div>
        ))}
      </div>
    </Band>
  )
}
