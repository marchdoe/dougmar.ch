import { css } from '../../../styled-system/css'
import { identity, personal } from '../../content/about'
import { education } from '../../content/timeline'
import { PlateMeta } from './PlateMeta'

const rows = [
  { k: 'School', v: education.school },
  { k: 'Degree', v: education.degree },
  { k: 'Concentration', v: education.concentration },
  { k: 'Years', v: education.years },
  { k: 'Holes in one', v: String(personal.holesInOne) },
  { k: 'Sport', v: personal.sport },
  { k: 'Teams', v: personal.teams.join(', ') },
  { k: 'Current focus', v: personal.currentFocus },
]

export function AboutHero() {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'field',
        color: 'fieldInk',
        paddingInline: '6vw',
        paddingTop: { base: '40px', lg: '64px' },
        paddingBottom: { base: '48px', lg: '72px' },
      })}
    >
      <div
        className={css({
          display: { base: 'flex', lg: 'grid' },
          flexDirection: 'column',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          columnGap: '48px',
          alignItems: 'start',
        })}
      >
        <div
          className={css({
            gridColumn: { lg: '1 / 10' },
            display: 'flex',
            flexDirection: 'column',
            minWidth: '0',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontSize: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'fieldInkMuted',
              borderBottom: '1px solid',
              borderColor: 'fieldBorder',
              paddingBottom: '3',
              marginBottom: '5',
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '160ms',
            })}
          >
            About · {identity.role}
          </span>
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: { base: '4xl', lg: 'hero' },
              lineHeight: '0.9',
              letterSpacing: '0.01em',
              color: 'fieldInk',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: { base: '1.5px currentColor', lg: '2.5px currentColor' },
              marginBottom: '4',
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            {identity.name}
          </h2>
          <h1
            className={css({
              fontFamily: 'body',
              fontWeight: 'normal',
              fontSize: { base: 'base', lg: 'lede' },
              lineHeight: 'normal',
              color: 'fieldInk',
              maxWidth: '50ch',
              borderTop: '1px solid',
              borderColor: 'fieldBorder',
              paddingTop: '5',
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            {identity.statement}
          </h1>
        </div>
        <div
          className={css({
            gridColumn: { lg: '10 / 13' },
            marginTop: { base: '28px', lg: '4px' },
            minWidth: '0',
          })}
        >
          <PlateMeta rows={rows} />
        </div>
      </div>
    </section>
  )
}
