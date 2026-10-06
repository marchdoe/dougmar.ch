import { css } from '../../../styled-system/css'
import { HeroNav } from './HeroNav'

// Leading opened to 1 so no line's caps reach into the next line's box; each
// line also sits on its own flat bg plate, clear of the mesh behind the hero.
const monumentClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  color: 'text',
  bg: 'bg',
  lineHeight: '1',
  textTransform: 'uppercase',
  textAlign: 'justify',
  width: 'fit-content',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
})

const l1 = css({
  display: 'block',
  whiteSpace: 'nowrap',
  bg: 'bg',
  lineHeight: '1',
  letterSpacing: '-0.005em',
  fontSize: 'clamp(21.5px, 2.94vw, 47px)',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})
const l2 = css({
  display: 'block',
  whiteSpace: 'nowrap',
  bg: 'bg',
  lineHeight: '1',
  letterSpacing: '-0.005em',
  fontSize: 'clamp(34px, 4.62vw, 74px)',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})
const l3 = css({
  display: 'block',
  whiteSpace: 'nowrap',
  bg: 'bg',
  lineHeight: '1',
  letterSpacing: '-0.005em',
  fontSize: 'clamp(44px, 6vw, 96px)',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '160ms',
})

const attrClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '240ms',
})

const ruleClass = css({
  width: 'min(260px, 70%)',
  height: '3px',
  bg: 'accent',
  borderWidth: '0',
  margin: '0',
})

const nameClass = css({
  fontSize: '17px',
  lineHeight: '1.3',
  fontWeight: 'normal',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textMuted',
})

const nameNoteClass = css({
  color: 'textFaint',
  letterSpacing: 'wide',
  textTransform: 'none',
  marginLeft: '0.4em',
})

const deckClass = css({
  fontSize: 'clamp(20px, 2.4vw, 32px)',
  lineHeight: '1.22',
  color: 'textMuted',
  maxWidth: '24ch',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '240ms',
})

const navMotion = css({
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '240ms',
})

export function HomeHero() {
  return (
    <>
      <h1 className={monumentClass}>
        <span className={l1}>The key to success</span>
        <span className={l2}>Is emotional</span>
        <span className={l3}>Stability</span>
      </h1>
      <div className={attrClass}>
        <hr className={ruleClass} />
        <span className={nameClass}>
          Warren Buffett
          <span className={nameNoteClass}>on what carries the work</span>
        </span>
      </div>
      <p className={deckClass}>
        Ten years under one shingle, Spaceman, sometimes a solo contributor, sometimes embedded in a
        larger team.
      </p>
      <HeroNav className={navMotion} />
    </>
  )
}
