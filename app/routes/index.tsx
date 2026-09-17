import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/generated/Hero'
import { Colophon } from '../components/generated/Colophon'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <Hero />
      <Colophon />
    </>
  )
}
