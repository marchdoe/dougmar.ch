import { createFileRoute } from '@tanstack/react-router'
import { FieldBand } from '../components/generated/FieldBand'
import { TimelineLedger } from '../components/generated/TimelineLedger'
import { CapabilityTags } from '../components/generated/CapabilityTags'
import { DataGrid, type DataGridItem } from '../components/generated/DataGrid'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const statsItems: DataGridItem[] = [
    {
      k: 'Education',
      v: education.school,
      sub: `${education.degree} · ${education.concentration} · ${education.years}`,
    },
    { k: 'Holes in one', v: String(personal.holesInOne) },
    { k: 'Sport', v: personal.sport },
    { k: 'Teams', v: personal.teams.join(', ') },
    { k: 'Current focus', v: personal.currentFocus },
  ]

  return (
    <>
      <FieldBand eyebrow={identity.role} title={identity.name} standfirst={identity.statement} />
      <TimelineLedger entries={timeline} />
      <CapabilityTags items={capabilities} />
      <DataGrid heading="Education & personal" items={statsItems} />
    </>
  )
}
