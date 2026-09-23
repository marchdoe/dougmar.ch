import { css } from '../../../styled-system/css'
import { ArtifactTitle } from './ArtifactTitle'
import { Band } from './Band'
import { ClientRoster } from './ClientRoster'

function ClaimLabel() {
  return (
    <div
      className={css({
        fontFamily: 'body',
        fontSize: 'xs',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
        color: 'fieldInkMuted',
        fontWeight: 'bold',
        marginBottom: '0.7em',
        animationName: 'wipe',
        animationDuration: '500ms',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        animationFillMode: 'both',
        animationDelay: '80ms',
      })}
    >
      In his own words
    </div>
  )
}

export function HomeHero() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        lg: {
          display: 'grid',
          gridTemplateColumns: '1.65fr 1fr',
          gridTemplateRows: 'auto 1fr auto',
          gridTemplateAreas: '"title roster" "deck roster" "band band"',
          columnGap: 'clamp(32px, 5vw, 80px)',
          minHeight: '88vh',
          alignItems: 'start',
        },
      })}
    >
      <div className={css({ lg: { gridArea: 'title' } })}>
        <ArtifactTitle />
      </div>
      <div
        className={css({
          display: 'flex',
          lg: { gridArea: 'band', minHeight: '46vh', alignSelf: 'stretch' },
        })}
      >
        <Band label={<ClaimLabel />}>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: { base: 'clamp(34px, 12vw, 44px)', lg: 'clamp(84px, 8vw, 115px)' },
              lineHeight: '0.9',
              letterSpacing: '0.01em',
              color: 'fieldInk',
              animationName: 'wipe',
              animationDuration: '500ms',
              animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              animationFillMode: 'both',
              animationDelay: '0ms',
            })}
          >
            <span className={css({ display: 'block' })}>Deep in both.</span>
            <span className={css({ display: 'block' })}>Not a generalist.</span>
          </h1>
        </Band>
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          bg: 'bg',
          paddingInline: 'clamp(28px, 6vw, 104px)',
          paddingTop: 'clamp(18px, 3vw, 28px)',
          paddingBottom: 'clamp(18px, 3vw, 24px)',
          animationName: 'wipe',
          animationDuration: '500ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationFillMode: 'both',
          animationDelay: '240ms',
          lg: { gridArea: 'deck', paddingRight: '0' },
        })}
      >
        <p
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: 'lg',
            lineHeight: '1.34',
            maxWidth: '38ch',
            color: 'text',
          })}
        >
          <b className={css({ fontWeight: 'bold', color: 'accent' })}>
            Design and engineering as one job.
          </b>{' '}
          Not two teams passing files.
        </p>
      </div>
      <div className={css({ lg: { gridArea: 'roster' } })}>
        <ClientRoster />
      </div>
    </div>
  )
}
