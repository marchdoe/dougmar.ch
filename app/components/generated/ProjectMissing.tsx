import { css } from '../../../styled-system/css'
import { HeroBand } from './HeroBand'

export function ProjectMissing() {
  return (
    <HeroBand>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: '30px', md: '56px' },
          lineHeight: '1',
          textTransform: 'uppercase',
          color: 'fieldInk',
        })}
      >
        Not in the index
      </h1>
      <a
        href="/"
        className={css({
          display: 'inline-block',
          marginTop: '18px',
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: '13px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'fieldInk',
        })}
      >
        Back to the specimen →
      </a>
    </HeroBand>
  )
}
