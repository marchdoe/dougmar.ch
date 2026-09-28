import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { Catalog } from '../components/generated/Catalog'
import { EvidenceHead } from '../components/generated/EvidenceHead'
import { FeaturedRecord } from '../components/generated/FeaturedRecord'
import { HeroStatement } from '../components/generated/HeroStatement'
import { RevisionTable } from '../components/generated/RevisionTable'
import { EvidencePanel, Split } from '../components/generated/Split'
import { Thesis } from '../components/generated/Thesis'
import { experiments, selectedWork } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

const recordCount = `${String(selectedWork.length + experiments.length).padStart(2, '0')} records`

function HomePage() {
  return (
    <>
      <Split>
        <Thesis>
          <HeroStatement
            scale="home"
            eyebrow="Sheet 01 · Design intent"
            word="Buildable"
            deck={
              <>
                Buildable <b>before</b> the first line of code. Faithful <b>after</b> the last.
              </>
            }
          />
        </Thesis>
        <EvidencePanel id="evidence">
          <EvidenceHead title="Evidence: the shipped work" count={recordCount} />
          <FeaturedRecord />
          <Catalog />
          <RevisionTable />
        </EvidencePanel>
      </Split>
      <SiteCallout />
    </>
  )
}
