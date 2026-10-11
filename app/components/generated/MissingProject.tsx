import { css, cx } from '../../../styled-system/css'
import { HeroShell } from './HeroShell'
import { wipeFirst, wipeSecond } from './motion'

export function MissingProject() {
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
                fontSize: 'clamp(26px, 3.9vw, 56px)',
                lineHeight: '1.1',
                color: 'text',
                maxWidth: '18ch',
                marginTop: 'clamp(26px, 4vw, 40px)',
              })
            )}
          >
            That project is not in the index.
          </h1>
          <a
            href="/"
            className={cx(
              wipeSecond,
              css({
                marginTop: '5',
                bg: 'bg',
                width: 'fit-content',
                fontFamily: 'display',
                fontStyle: 'italic',
                fontSize: '22px',
                color: 'text',
              })
            )}
          >
            Back to the selected work&nbsp;→
          </a>
        </>
      }
    />
  )
}
