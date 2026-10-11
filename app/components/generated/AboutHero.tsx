import { css, cx } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { HeroShell } from './HeroShell'
import { Lab } from './Lab'
import { wipeFirst, wipeSecond } from './motion'

export function AboutHero() {
  return (
    <HeroShell
      lead={
        <>
          <h1
            className={cx(
              wipeFirst,
              css({
                fontFamily: 'display',
                fontStyle: 'italic',
                fontWeight: 'normal',
                fontSize: 'clamp(26px, 3.4vw, 46px)',
                lineHeight: '1.15',
                letterSpacing: 'tight',
                color: 'text',
                maxWidth: '26ch',
                marginTop: 'clamp(26px, 4vw, 40px)',
              })
            )}
          >
            {identity.statement}
          </h1>
          <div className={cx(wipeSecond, css({ marginTop: '4', bg: 'bg', width: 'fit-content' }))}>
            <Lab>{identity.role}</Lab>
          </div>
        </>
      }
    />
  )
}
