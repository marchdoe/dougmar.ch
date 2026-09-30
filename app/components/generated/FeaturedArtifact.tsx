import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { ClientRoster } from './ClientRoster'
import { ExtLink } from './ExtLink'
import { HeroMeta } from './HeroMeta'

const HERO = 'Design and engineering as one job, not two teams passing files.'

export function FeaturedMeta() {
  const line = [featuredProject?.role, featuredProject?.year].filter(Boolean).join(' · ')
  return <HeroMeta kicker="Featured project" line={line} />
}

function Deck({ text }: { text?: string }) {
  if (!text) return null
  return (
    <p
      className={css({
        fontSize: '15px',
        lineHeight: 'normal',
        color: 'textMuted',
        maxWidth: '46ch',
        marginTop: '3',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '160ms',
      })}
    >
      {text}
    </p>
  )
}

export function FeaturedArtifact() {
  const p = featuredProject
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        marginTop: 'auto',
        width: '100%',
      })}
    >
      {p ? (
        <h2
          className={css({
            display: 'block',
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: 'hero',
            // Mockup: 152px marquee at 1440, the one dominant scale.
            fontSize: 'clamp(4rem, 10.5vw, 9.5rem)',
            lineHeight: '0.9',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {p.title}
        </h2>
      ) : null}
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: '3xl',
          // Mockup: caption one step under the marquee, 34px to 62px.
          fontSize: 'clamp(2.125rem, 4.3vw, 3.875rem)',
          lineHeight: 'snug',
          maxWidth: '22ch',
          marginTop: { base: '4', lg: '5' },
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {HERO}
      </h1>
      {p?.problem ? (
        <p
          className={css({
            textStyle: 'base',
            color: 'textMuted',
            maxWidth: '48ch',
            marginTop: '4',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          {p.problem}
        </p>
      ) : null}
      <Deck text={p?.description} />
      <ExtLink href={p?.externalUrl ?? p?.liveUrl} label="Visit the studio" />
      <ClientRoster clients={p?.clients ?? []} />
    </div>
  )
}
