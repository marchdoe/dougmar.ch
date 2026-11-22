import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { FieldHero } from './FieldHero'

export function AboutHero() {
  const statement = identity.statement.replace(/\s*[—–]\s*/g, ', ')
  return (
    <FieldHero label={identity.role}>
      <h1
        className={css({
          alignSelf: 'flex-end',
          textAlign: 'right',
          marginTop: 'auto',
          paddingTop: '48px',
          paddingLeft: '28px',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textTransform: 'lowercase',
          textStyle: { base: '3xl', md: '4xl' },
          color: 'fieldInk',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
          md: { paddingTop: '64px', paddingLeft: '40px' },
        })}
      >
        {identity.name}
      </h1>
      <p
        className={css({
          alignSelf: 'flex-end',
          textAlign: 'right',
          marginTop: '5',
          paddingLeft: '28px',
          textStyle: { base: 'base', md: 'lede' },
          lineHeight: 'normal',
          color: 'fieldInkMuted',
          maxWidth: '46ch',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
          md: { paddingLeft: '40px' },
        })}
      >
        {statement}
      </p>
    </FieldHero>
  )
}
