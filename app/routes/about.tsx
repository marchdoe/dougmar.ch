import { createFileRoute } from '@tanstack/react-router'
import { AboutBoard } from '../components/generated/AboutBoard'
import { AboutSheet } from '../components/generated/AboutSheet'
import { SplitPage } from '../components/generated/Split'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <SplitPage>
      <AboutBoard />
      <AboutSheet />
    </SplitPage>
  )
}
