import { css } from '../../../styled-system/css'
import { featuredProject, projects } from '../../content/projects'
import { BrandLockup } from '../BrandLockup'
import { HomePlate } from './HomePlate'

// The mockup's marquee artifact is FishSticks; fall back to the featured project if absent.
const heroProject =
  projects.find(
    (p) =>
      p.slug.toLowerCase().includes('fishsticks') ||
      p.title.toLowerCase().replace(/\s/g, '') === 'fishsticks'
  ) ?? featuredProject

const heroCls = css({
  position: 'relative',
  overflow: 'hidden',
  bg: 'bg',
  display: { base: 'flex', lg: 'grid' },
  flexDirection: 'column',
  gap: { base: '5', lg: '0' },
  minHeight: { base: '92vh', lg: '100vh' },
  gridTemplateColumns: { lg: '0.7fr 1.3fr' },
  gridTemplateRows: { lg: 'auto 1fr auto' },
  gridTemplateAreas: { lg: '"mark plate" "gap plate" "cap plate"' },
  paddingTop: { base: '5', lg: '7' },
  paddingBottom: { base: '6', lg: '7' },
  paddingLeft: { base: '4', lg: '7', xl: '8' },
  paddingRight: { base: '4', lg: '0' },
})

const driftCls = css({
  position: 'absolute',
  inset: '-4%',
  bg: 'bg',
  zIndex: 0,
  animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
})

const weatherCls = css({
  position: 'absolute',
  top: { base: '5', lg: '7' },
  right: { base: '4', lg: '7', xl: '8' },
  zIndex: 3,
  fontSize: 'sm',
  letterSpacing: 'wide',
  color: 'textMuted',
  textAlign: 'right',
  lineHeight: 'snug',
  maxWidth: '40%',
})

const markCls = css({
  gridArea: 'mark',
  position: 'relative',
  zIndex: 1,
  alignSelf: 'start',
  color: 'text',
})

const captionCls = css({
  gridArea: 'cap',
  position: 'relative',
  zIndex: 1,
  justifySelf: { lg: 'end' },
  alignSelf: { base: 'flex-end', lg: 'end' },
  textAlign: 'right',
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'lowercase',
  textStyle: '2xl',
  fontSize: { base: '24px', lg: '2xl' },
  color: 'text',
  maxWidth: { base: '18ch', lg: '15ch' },
  paddingRight: { lg: '6' },
  marginTop: { lg: '7' },
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

export function HomeHero() {
  return (
    <section className={heroCls}>
      <div aria-hidden="true" className={driftCls} />
      <p className={weatherCls}>
        aldie, va
        <br />
        48°f · overcast
      </p>
      <div className={markCls}>
        <BrandLockup variant="stacked-lg" mode="original" />
      </div>
      {heroProject && <HomePlate project={heroProject} />}
      <h1 className={captionCls}>
        Thousands of kids practicing spelling from the list the teacher sent home.
      </h1>
    </section>
  )
}
