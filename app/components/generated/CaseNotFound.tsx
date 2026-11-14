import { css } from '../../../styled-system/css'
import { Sky } from './Sky'
import { SkyMasthead } from './SkyMasthead'

export function CaseNotFound() {
  return (
    <Sky className={css({ minHeight: '60vh' })}>
      <SkyMasthead />
      <h1
        className={css({
          marginTop: '48px',
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '3xl',
          color: 'text',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        No project by that name
      </h1>
      <a
        href="/work"
        className={css({
          marginTop: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          alignSelf: 'flex-start',
          textStyle: 'base',
          color: 'text',
          textDecoration: 'underline',
          textDecorationColor: 'accentAlt',
          textUnderlineOffset: '4px',
        })}
      >
        See all work
      </a>
    </Sky>
  )
}
