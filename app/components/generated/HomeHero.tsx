import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'
import { FieldHero } from './FieldHero'

export function HomeHero() {
  const years = projects.map((p) => p.year)
  const label = `selected work · ${Math.min(...years)}–${Math.max(...years)}`
  const place = (
    <p
      className={css({
        textStyle: 'sm',
        color: 'fieldInkMuted',
        maxWidth: '52ch',
        lineHeight: 'normal',
        animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '80ms',
      })}
    >
      aldie, virginia. overcast, 53°F, air moderate.{' '}
      {/* mockup #b592e3 (accentGlow) has no semantic token; fieldInkMuted is the nearest on field */}
      <span className={css({ color: 'fieldInkMuted', fontWeight: 'bold', whiteSpace: 'nowrap' })}>
        full moon, 98% lit.
      </span>
    </p>
  )
  return (
    <FieldHero label={label} place={place}>
      <h1
        className={css({
          alignSelf: 'flex-end',
          textAlign: 'right',
          marginTop: 'auto',
          paddingTop: '48px',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textTransform: 'lowercase',
          fontSize: { base: '30px', md: '44px', lg: '56px' },
          lineHeight: '1.1',
          letterSpacing: '-0.01em',
          color: 'fieldInk',
          maxWidth: { base: '14ch', md: '16ch' },
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
          md: { paddingTop: '64px' },
        })}
      >
        I build the things I want to exist.
      </h1>
    </FieldHero>
  )
}
