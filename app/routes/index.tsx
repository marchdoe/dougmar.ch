import { createFileRoute } from '@tanstack/react-router'
import { HeroScoreboard } from '../components/generated/HeroScoreboard'
import { BoxScoreStrip } from '../components/generated/BoxScoreStrip'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroScoreboard />
      <BoxScoreStrip />
    </>
  )
}
