import { css } from '../../../styled-system/css'
import { HeroField } from './HeroField'
import { heroBreak, heroCite, heroLead } from './heroPhrase'

export function HomeHero() {
  return (
    <HeroField label="Dogen">
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'light',
          textAlign: 'left',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        <span
          className={css({
            display: 'block',
            fontStyle: 'italic',
            fontSize: { base: '2xl', lg: '4xl' },
            lineHeight: 'snug',
            color: 'fieldInk',
            maxWidth: '18ch',
          })}
        >
          {heroLead}
        </span>
        <span
          className={css({
            display: 'block',
            marginTop: '0.08em',
            fontStyle: 'normal',
            fontSize: { base: '2xl', lg: '4xl' },
            lineHeight: 'tight',
            color: 'accent',
            WebkitTextFillColor: 'transparent',
            WebkitTextStrokeColor: 'currentColor',
            WebkitTextStrokeWidth: { base: '1.6px', lg: '2px' },
          })}
        >
          {heroBreak}
        </span>
      </h1>
      <p
        className={css({
          marginTop: '5',
          fontFamily: 'display',
          fontStyle: 'italic',
          fontSize: 'lede',
          color: 'fieldInkMuted',
          display: 'flex',
          alignItems: 'center',
          gap: '3',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
          _before: {
            content: '""',
            display: 'block',
            width: '24px',
            height: '1px',
            bg: 'fieldBorder',
          },
        })}
      >
        {heroCite}
      </p>
    </HeroField>
  )
}
