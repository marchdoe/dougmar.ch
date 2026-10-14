import { createFileRoute } from '@tanstack/react-router'
import { AboutIntro } from '../components/generated/AboutIntro'
import { Annotations } from '../components/generated/Annotations'
import { Capabilities } from '../components/generated/Capabilities'
import { Timeline } from '../components/generated/Timeline'
import { personal } from '../content/about'

export const Route = createFileRoute('/about')({ component: AboutPage })

const personalNotes = [
  { label: 'Holes in one', body: String(personal.holesInOne) },
  { label: 'Sport', body: personal.sport },
  { label: 'Teams', body: personal.teams.join(', ') },
  { label: 'Current focus', body: personal.currentFocus },
]

function AboutPage() {
  return (
    <>
      <AboutIntro />
      <Timeline />
      <Capabilities />
      <Annotations label="Personal" items={personalNotes} />
    </>
  )
}
