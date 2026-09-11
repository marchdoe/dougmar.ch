import { createFileRoute } from '@tanstack/react-router'
import { OwnedPanel } from '../components/generated/OwnedPanel'
import { ProduceField } from '../components/generated/ProduceField'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <OwnedPanel />
      <ProduceField />
      <WorkIndex />
    </>
  )
}
