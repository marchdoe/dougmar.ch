import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { capabilities } from '../../content/timeline'
import { HeroNav } from './HeroNav'

// The statement carries a long dash in its source; set it as a comma.
const statement = identity.statement.replace(/\s*[\u2013\u2014]\s*/g, ', ')

const statementClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'clamp(28px, 3.4vw, 48px)',
  lineHeight: '0.95',
  textTransform: 'uppercase',
  textAlign: 'justify',
  color: 'text',
  maxWidth: '26ch',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

const deckClass = css({
  textStyle: '2xl',
  color: 'textMuted',
  maxWidth: '24ch',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})

const tagsClass = css({
  listStyle: 'none',
  margin: '0',
  padding: '0',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '160ms',
})

const tagClass = css({
  textStyle: 'sm',
  color: 'text',
  bg: 'bg',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border',
  borderRadius: 'none',
  paddingBlock: '6px',
  paddingInline: '10px',
})

const navMotion = css({
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '240ms',
})

export function AboutHero() {
  return (
    <>
      <h1 className={statementClass}>{statement}</h1>
      <p className={deckClass}>{identity.role}</p>
      <ul className={tagsClass}>
        {capabilities.map((cap) => (
          <li key={cap} className={tagClass}>
            {cap}
          </li>
        ))}
      </ul>
      <HeroNav className={navMotion} />
    </>
  )
}
