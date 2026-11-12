import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { DayRow } from './DayRow'
import { bleed, mintRule, SectionHead } from './LedgerParts'

const section = css({ marginTop: { base: '64px', md: '96px' } })

const facts = [
  { label: 'Holes in one', value: String(personal.holesInOne) },
  { label: 'Sport', value: personal.sport },
  { label: 'Teams', value: personal.teams.join(', ') },
  { label: 'Current focus', value: personal.currentFocus },
]

export function AboutPersonal() {
  return (
    <section className={section} aria-labelledby="personal-h">
      <SectionHead id="personal-h">Personal</SectionHead>
      <div className={`${bleed} ${mintRule}`}>
        {facts.map((fact) => (
          <DayRow key={fact.label} label={fact.label}>
            {fact.value}
          </DayRow>
        ))}
      </div>
    </section>
  )
}
