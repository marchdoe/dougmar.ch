import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { BrandLockup } from '../BrandLockup'

// The statement's dash is set as a comma on the page.
const statement = identity.statement.replace(/\s*\u2014\s*/g, ', ')

const heroCls = css({
  bg: 'bg',
  display: 'flex',
  flexDirection: 'column',
  gap: { base: '6', lg: '7' },
  paddingTop: { base: '5', lg: '7' },
  paddingBottom: { base: '7', lg: '8' },
  paddingInline: { base: '4', lg: '7', xl: '8' },
})

const eyebrowCls = css({
  fontSize: 'sm',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'accent',
  fontWeight: 'bold',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})

const h1Cls = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'lowercase',
  textStyle: { base: 'lg', lg: 'xl' },
  lineHeight: 'snug',
  color: 'text',
  maxWidth: '34ch',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

export function AboutHero() {
  return (
    <section className={heroCls}>
      <BrandLockup variant="stacked-lg" mode="original" />
      <div>
        <h1 className={h1Cls}>{statement}</h1>
        <p className={eyebrowCls}>about doug march</p>
      </div>
    </section>
  )
}
