import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { sentence } from './copyText'
import { HeroField } from './HeroField'

const shortStatement = css({
  marginTop: 'auto',
  paddingTop: 'clamp(40px,8vh,96px)',
  fontFamily: 'display',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  textAlign: 'left',
  textStyle: { base: '5xl', lg: 'hero' },
  lineHeight: '0.86',
  letterSpacing: '0.01em',
  color: 'text',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

// A long statement stays at or under 48px, so it never reads as display type set over a paragraph.
const longStatement = css({
  marginTop: 'auto',
  paddingTop: 'clamp(40px,8vh,96px)',
  maxWidth: '44ch',
  fontFamily: 'display',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  textAlign: 'left',
  fontSize: 'clamp(34px,3.4vw,48px)',
  lineHeight: '1',
  letterSpacing: '0.01em',
  color: 'text',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

export function AboutHero() {
  return (
    <HeroField>
      <h1 className={identity.statement.length < 60 ? shortStatement : longStatement}>
        {sentence(identity.statement)}
      </h1>
      <div
        className={css({
          marginTop: 'clamp(28px,4vh,48px)',
          alignSelf: 'flex-start',
          bg: 'bg',
          paddingBlock: '2',
          paddingInline: '3',
          textStyle: '2xl',
          color: 'text',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {identity.name}, {identity.role}
      </div>
    </HeroField>
  )
}
