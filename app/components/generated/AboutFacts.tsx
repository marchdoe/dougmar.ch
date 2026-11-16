import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { capabilities, education } from '../../content/timeline'
import { BlockLabel } from './BlockLabel'
import { FactRows } from './FactRows'
import { RevealSection } from './RevealSection'

export function AboutFacts() {
  const school = [
    { k: 'School', v: education.school },
    { k: 'Degree', v: education.degree },
    { k: 'Focus', v: education.concentration },
    { k: 'Years', v: education.years },
  ]
  const life = [
    { k: 'Holes in one', v: String(personal.holesInOne) },
    { k: 'Sport', v: personal.sport },
    { k: 'Teams', v: personal.teams.join(', ') },
    { k: 'Now', v: personal.currentFocus },
  ]
  return (
    <RevealSection
      aria-label="Capabilities, education and personal"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        display: 'grid',
        gridTemplateColumns: {
          base: 'minmax(0, 1fr)',
          md: 'repeat(2, minmax(0, 1fr))',
          xl: 'repeat(3, minmax(0, 1fr))',
        },
        gap: { base: '32px', lg: '36px' },
        paddingTop: { base: '40px', lg: '56px' },
        paddingBottom: { base: '44px', lg: '56px' },
        paddingInline: { base: '24px', lg: '6vw' },
      })}
    >
      <div>
        <BlockLabel>Capabilities</BlockLabel>
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '2',
          })}
        >
          {capabilities.map((item) => (
            <li
              key={item}
              className={css({
                textStyle: 'sm',
                fontWeight: 'bold',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
              })}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <BlockLabel>Education</BlockLabel>
        <FactRows rows={school} />
      </div>
      <div>
        <BlockLabel>Off the clock</BlockLabel>
        <FactRows rows={life} />
      </div>
    </RevealSection>
  )
}
