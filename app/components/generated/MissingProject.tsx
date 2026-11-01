import { css } from '../../../styled-system/css'
import { HeroField } from './HeroField'
import { Topbar } from './Topbar'

export function MissingProject() {
  return (
    <HeroField>
      <Topbar />
      <div
        className={css({
          marginTop: { base: '6', lg: '7' },
          alignSelf: 'start',
          justifySelf: 'start',
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          bg: 'bg',
          color: 'text',
          paddingBlock: '5',
          paddingInline: '5',
          borderRadius: 'md',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: '36px', lg: '56px' },
            lineHeight: 'tight',
            textTransform: 'uppercase',
            color: 'text',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          No project here
        </h1>
        <a
          href="/#work"
          className={css({ fontSize: 'base', color: 'accent', textDecoration: 'underline' })}
        >
          Back to the work
        </a>
      </div>
    </HeroField>
  )
}
