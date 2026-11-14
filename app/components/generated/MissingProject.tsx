import { css } from '../../../styled-system/css'
import { HeroField } from './HeroField'

export function MissingProject() {
  return (
    <HeroField label="Not found">
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'light',
          fontStyle: 'italic',
          fontSize: { base: '2xl', lg: '3xl' },
          lineHeight: 'tight',
          color: 'fieldInk',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        No project by that name.
      </h1>
      <a
        href="/work"
        className={css({
          marginTop: '5',
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          fontSize: 'sm',
          color: 'fieldInk',
          textDecoration: 'underline',
          textUnderlineOffset: '4px',
        })}
      >
        Back to the work
      </a>
    </HeroField>
  )
}
