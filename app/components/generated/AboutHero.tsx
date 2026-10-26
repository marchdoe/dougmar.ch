import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { Masthead } from './Masthead'

export function AboutHero() {
  return (
    <Masthead>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(26px, 3.4vw, 46px)',
          lineHeight: 'snug',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          color: 'fieldInk',
          textAlign: 'left',
          maxWidth: '32ch',
        })}
      >
        {identity.statement}
      </h1>
    </Masthead>
  )
}
