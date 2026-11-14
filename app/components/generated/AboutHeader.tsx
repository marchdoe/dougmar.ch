import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { Sky } from './Sky'
import { SkyMasthead } from './SkyMasthead'

export function AboutHeader() {
  return (
    <Sky>
      <SkyMasthead />
      <h1
        className={css({
          marginTop: '48px',
          marginBottom: '16px',
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: { base: 'md', md: 'lg' },
          lineHeight: '1.4',
          color: 'text',
          maxWidth: '46ch',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.statement}
      </h1>
    </Sky>
  )
}
