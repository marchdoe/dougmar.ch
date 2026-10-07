import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { SignalRow, SignalStack } from './SignalStack'

const schooling = [
  { label: 'School', value: education.school },
  { label: 'Degree', value: education.degree },
  { label: 'Concentration', value: education.concentration },
  { label: 'Years', value: education.years },
].filter((row) => row.value !== '')

const life = [
  { label: 'Holes in one', value: String(personal.holesInOne) },
  { label: 'Sport', value: personal.sport },
  { label: 'Teams', value: personal.teams.join(', ') },
  { label: 'Current focus', value: personal.currentFocus },
].filter((row) => row.value !== '')

export function AboutFacts() {
  return (
    <div
      className={css({
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr',
        columnGap: '7',
        lg: { gridTemplateColumns: '1fr 1fr' },
      })}
    >
      <SignalStack head="Education" label="Education">
        {schooling.map((row) => (
          <SignalRow key={row.label} label={row.label}>
            {row.value}
          </SignalRow>
        ))}
      </SignalStack>
      <SignalStack head="Personal" label="Personal">
        {life.map((row) => (
          <SignalRow key={row.label} label={row.label}>
            {row.value}
          </SignalRow>
        ))}
      </SignalStack>
    </div>
  )
}
