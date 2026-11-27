import { css } from '../../../styled-system/css'
import { capabilities, education } from '../../content/timeline'
import { TimelineList } from './TimelineList'

const heading = css({
  textStyle: 'xs',
  fontWeight: 'bold',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textMuted',
  marginBottom: '12px',
})

const eduRows = [
  { k: 'School', v: education.school },
  { k: 'Degree', v: education.degree },
  { k: 'Concentration', v: education.concentration },
  { k: 'Years', v: education.years },
].filter((r) => r.v)

export function AboutDossier() {
  return (
    <section
      className={css({
        gridArea: { lg: 'dossier' },
        bg: 'surface',
        paddingTop: { base: '40px', lg: '132px' },
        paddingBottom: { base: '36px', lg: '32px' },
        paddingLeft: { base: '20px', lg: '5vw' },
        paddingRight: { base: '20px', lg: '0' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2 className={heading}>The record</h2>
      <TimelineList />
      <h2 className={`${heading} ${css({ marginTop: '30px' })}`}>Capabilities</h2>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
        })}
      >
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              textStyle: 'sm',
              textTransform: 'lowercase',
              color: 'text',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              borderRadius: 'sm',
              paddingBlock: '1',
              paddingInline: '3',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
      <h2 className={`${heading} ${css({ marginTop: '30px' })}`}>Education</h2>
      {eduRows.map((r) => (
        <div
          key={r.k}
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '4',
            paddingBlock: '15px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
          })}
        >
          <span
            className={css({ textStyle: 'sm', color: 'textMuted', textTransform: 'lowercase' })}
          >
            {r.k}
          </span>
          <span
            className={css({
              fontFamily: 'display',
              textStyle: 'base',
              color: 'text',
              textAlign: 'right',
            })}
          >
            {r.v}
          </span>
        </div>
      ))}
    </section>
  )
}
