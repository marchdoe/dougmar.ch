import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { ClientLedger } from './ClientLedger'
import { FeaturedMeta } from './FeaturedMeta'
import { FeaturedTitle } from './FeaturedTitle'
import { RunningSentence } from './RunningSentence'

type Project = (typeof projects)[number]

export function HomeHero({ project }: { project: Project | undefined }) {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        minHeight: '92vh',
        bg: 'bg',
        paddingBlock: 'clamp(22px, 6vw, 56px)',
        paddingInline: 'clamp(20px, 6vw, 80px)',
      })}
    >
      <Ground material="rule" seed={960521440} />
      <span
        aria-hidden="true"
        className={css({
          display: { base: 'none', lg: 'block' },
          position: 'absolute',
          top: 'clamp(22px, 6vw, 56px)',
          right: 'clamp(20px, 6vw, 80px)',
          zIndex: 0,
          pointerEvents: 'none',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontStyle: 'italic',
          fontVariant: 'all-small-caps',
          fontSize: 'hero',
          lineHeight: '1',
          whiteSpace: 'nowrap',
          color: 'text',
          opacity: 0.06,
        })}
      >
        Hustle
      </span>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'repeat(12, minmax(0, 1fr))' },
          rowGap: { base: 'clamp(26px, 4vh, 40px)', lg: '0px' },
          columnGap: { base: '0px', lg: 'clamp(16px, 2vw, 32px)' },
          alignItems: { lg: 'start' },
        })}
      >
        <div
          className={css({
            gridColumn: { lg: '1 / 5' },
            gridRow: { lg: '1' },
            marginBottom: { lg: 'clamp(30px, 5vh, 56px)' },
          })}
        >
          <BrandLockup variant="stacked-md" mode="original" />
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontVariant: 'all-small-caps',
            letterSpacing: 'wide',
            textAlign: 'left',
            fontSize: { base: '3xl', lg: '64px' },
            lineHeight: '1.08',
            color: 'text',
            maxWidth: '16ch',
            gridColumn: { lg: '1 / 8' },
            gridRow: { lg: '2' },
            marginBottom: { lg: 'clamp(24px, 4vh, 44px)' },
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          The dream is free, but the hustle is sold separately.
          <span
            className={css({
              display: 'block',
              width: 'fit-content',
              bg: 'bg',
              fontFamily: 'body',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontVariant: 'normal',
              fontSize: 'md',
              color: 'textMuted',
              marginTop: '18px',
              letterSpacing: '0.01em',
              lineHeight: '1.4',
              maxWidth: '40ch',
            })}
          >
            <span className={css({ color: 'text' })}>Steve Harvey.</span> Ten years of Spaceman is
            the hustle, itemised.
          </span>
        </h1>
        <FeaturedTitle project={project} />
        <FeaturedMeta project={project} />
        <RunningSentence
          className={css({
            gridColumn: { lg: '1 / 5' },
            gridRow: { lg: '5' },
            marginTop: { lg: 'clamp(28px, 4vh, 48px)' },
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        />
        <ClientLedger project={project} />
      </div>
    </header>
  )
}
