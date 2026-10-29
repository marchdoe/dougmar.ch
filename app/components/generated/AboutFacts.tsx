import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'

export function AboutFacts() {
  const cells = [
    { lab: 'School', val: education.school },
    {
      lab: 'Degree',
      val: [education.degree, education.concentration, education.years].filter(Boolean).join(', '),
    },
    { lab: 'Holes in one', val: String(personal.holesInOne) },
    { lab: 'Sport', val: personal.sport },
    { lab: 'Teams', val: personal.teams.join(', ') },
    { lab: 'Current focus', val: personal.currentFocus },
  ]
  return (
    <section
      className={css({
        paddingInline: { base: '7vw', md: '6vw' },
        paddingTop: '6',
        paddingBottom: '7',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      <h2
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '5',
        })}
      >
        Education and off the clock
      </h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
          rowGap: '5',
          columnGap: '6',
        })}
      >
        {cells.map((cell) => (
          <div key={cell.lab}>
            <div
              className={css({
                fontSize: '2xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'textFaint',
                marginBottom: '6px',
              })}
            >
              {cell.lab}
            </div>
            <div className={css({ fontSize: '15px', lineHeight: '1.45', color: 'text' })}>
              {cell.val}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
