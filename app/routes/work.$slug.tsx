import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { WhitePaper } from '../components/WhitePaper'
import { CaseFacts } from '../components/generated/CaseFacts'
import { CaseHero } from '../components/generated/CaseHero'
import { CaseNarrative } from '../components/generated/CaseNarrative'
import { HeroTopbar } from '../components/generated/HeroTopbar'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function NotFound() {
  return (
    <header
      className={css({
        paddingTop: 'clamp(28px, 5vw, 56px)',
        paddingBottom: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        bg: 'surface',
        display: 'grid',
        gap: 'clamp(28px, 4vw, 44px)',
      })}
    >
      <HeroTopbar />
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(44px, 9vw, 140px)',
          lineHeight: '0.9',
          textTransform: 'lowercase',
        })}
      >
        out of bounds.
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          fontWeight: 'bold',
        })}
      >
        Back to the work
      </a>
    </header>
  )
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <NotFound />
  if (project.slug === 'dougmar-ch') {
    return (
      <>
        <CaseHero project={project} full={false} />
        <WhitePaper />
      </>
    )
  }
  return (
    <>
      <CaseHero project={project} full />
      <CaseNarrative project={project} />
      <CaseFacts project={project} />
    </>
  )
}
