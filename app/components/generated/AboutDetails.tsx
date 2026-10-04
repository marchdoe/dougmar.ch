import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { capabilities, education } from '../../content/timeline'
import { DrenchLedger } from './DrenchLedger'
import { microClass, revealClass, sectionPadClass } from './styles'

export function AboutDetails() {
  const edu = [
    { label: 'School', value: education.school },
    { label: 'Degree', value: education.degree },
    { label: 'Concentration', value: education.concentration },
    { label: 'Years', value: education.years },
  ]
  const life = [
    { label: 'Holes in one', value: String(personal.holesInOne) },
    { label: 'Sport', value: personal.sport },
    { label: 'Teams', value: personal.teams.join(', ') },
    { label: 'Current focus', value: personal.currentFocus },
  ]
  return (
    <section className={revealClass}>
      <div
        className={`${sectionPadClass} ${css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1fr 1fr 1fr' },
          gap: { base: '40px', lg: '4vw' },
          alignItems: 'start',
        })}`}
      >
        <div>
          <div className={microClass}>Capabilities</div>
          <ul
            className={css({
              listStyle: 'none',
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '4',
              rowGap: '2',
            })}
          >
            {capabilities.map((c) => (
              <li
                key={c}
                className={css({ fontFamily: 'body', fontSize: 'sm', color: 'textMuted' })}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className={microClass}>Education</div>
          <DrenchLedger rows={edu} />
        </div>
        <div>
          <div className={microClass}>Off the clock</div>
          <DrenchLedger rows={life} />
        </div>
      </div>
    </section>
  )
}
