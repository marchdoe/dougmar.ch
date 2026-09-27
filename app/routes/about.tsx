import { createFileRoute } from '@tanstack/react-router'
import { FocusCell } from '../components/generated/FocusCell'
import { KeyValueList } from '../components/generated/KeyValueList'
import { LedgerSection } from '../components/generated/LedgerSection'
import { SignalBand } from '../components/generated/SignalBand'
import { StatementBanner } from '../components/generated/StatementBanner'
import { TagList } from '../components/generated/TagList'
import { TimelineList } from '../components/generated/TimelineList'
import { identity, personal } from '../content/about'
import { capabilities, education, timeline } from '../content/timeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const educationRows = [
    { k: 'School', v: education.school },
    { k: 'Degree', v: education.degree },
    { k: 'Concentration', v: education.concentration },
    { k: 'Years', v: education.years },
  ].filter((row) => row.v)
  const personalCells = [
    { k: 'Holes in one', n: String(personal.holesInOne), s: personal.sport },
    { k: 'Teams', n: String(personal.teams.length), s: personal.teams.join(', ') },
  ]
  const statement = identity.statement.replace(/\s*\u2014\s*/g, ', ')
  return (
    <>
      <StatementBanner
        statement={statement}
        kicker={[identity.name, identity.role].filter(Boolean).join(' · ')}
      />
      <LedgerSection label="Record" aside={`${timeline.length} entries`}>
        <TimelineList entries={timeline} />
      </LedgerSection>
      <LedgerSection label="Capabilities" aside={`${capabilities.length} tags`}>
        <TagList items={capabilities} />
      </LedgerSection>
      <LedgerSection label="Education" aside="On file">
        <KeyValueList rows={educationRows} />
      </LedgerSection>
      <SignalBand head="Personal ledger" aside="Holes in one, teams, focus" cells={personalCells}>
        <FocusCell text={personal.currentFocus} />
      </SignalBand>
    </>
  )
}
