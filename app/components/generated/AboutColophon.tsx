import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'

const rows = [
  { k: 'School', v: education.school },
  { k: 'Degree', v: education.degree },
  { k: 'Concentration', v: education.concentration },
  { k: 'Years', v: education.years },
  { k: 'Holes in one', v: String(personal.holesInOne) },
  { k: 'Sport', v: personal.sport },
  { k: 'Teams', v: personal.teams.join(', ') },
  { k: 'Current focus', v: personal.currentFocus },
].filter((r) => r.v !== '')

export function AboutColophon() {
  return (
    <section
      className={css({
        marginTop: '40px',
        bg: 'field',
        color: 'fieldInk',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        paddingBlock: { base: '24px', lg: '36px' },
        paddingInline: { base: '18px', lg: '36px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: '14px',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'fieldInk',
          paddingBottom: '12px',
          marginBottom: '8px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        Education &amp; Personal
      </span>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
          columnGap: { md: '40px' },
        })}
      >
        {rows.map((r, i) => (
          <div
            key={r.k}
            className={css({
              display: 'grid',
              gridTemplateColumns: '28px 1fr',
              gap: '12px',
              paddingBlock: '12px',
              alignItems: 'baseline',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'fieldBorder',
            })}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: '13px',
                fontVariantNumeric: 'tabular-nums',
                color: 'fieldInk',
              })}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={css({ display: 'flex', flexDirection: 'column', gap: '2px' })}>
              <span
                className={css({
                  fontFamily: 'body',
                  fontWeight: 'bold',
                  fontSize: '2xs',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'fieldInk',
                })}
              >
                {r.k}
              </span>
              <span
                className={css({
                  fontFamily: 'body',
                  fontWeight: 'medium',
                  fontSize: 'base',
                  color: 'fieldInk',
                })}
              >
                {r.v}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
