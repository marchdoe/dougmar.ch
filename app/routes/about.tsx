import { createFileRoute } from '@tanstack/react-router'
import { AboutBody } from '../components/generated/AboutBody'
import { AboutMasthead } from '../components/generated/AboutMasthead'
import { CapabilitiesBand } from '../components/generated/CapabilitiesBand'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutMasthead />
      <AboutBody />
      <CapabilitiesBand />
    </>
  )
}
