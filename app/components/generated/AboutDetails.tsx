import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { capabilities, education } from '../../content/timeline'
import { KeyValueGrid, pickFilled } from './KeyValueGrid'
import { RevealSection } from './RevealSection'
import { TagList } from './TagList'

export function CapabilitiesSection() {
  return (
    <RevealSection label="Capabilities">
      <TagList items={capabilities} />
    </RevealSection>
  )
}

export function EducationSection() {
  const items = pickFilled([
    { k: 'School', v: education.school },
    { k: 'Degree', v: education.degree },
    { k: 'Concentration', v: education.concentration },
    { k: 'Years', v: education.years },
  ])
  return (
    <RevealSection label="Education">
      <KeyValueGrid
        items={items}
        className={css({ gridTemplateColumns: { md: 'repeat(2, 1fr)' } })}
      />
    </RevealSection>
  )
}

export function PersonalSection() {
  const items = pickFilled([
    { k: 'Holes in one', v: String(personal.holesInOne) },
    { k: 'Sport', v: personal.sport },
    { k: 'Teams', v: personal.teams.join(', ') },
    { k: 'Current focus', v: personal.currentFocus },
  ])
  return (
    <RevealSection label="Personal">
      <KeyValueGrid
        items={items}
        className={css({ gridTemplateColumns: { md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' } })}
      />
    </RevealSection>
  )
}
