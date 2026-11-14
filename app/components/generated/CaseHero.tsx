import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { BrandLockup } from '../BrandLockup'
import { ClientChip } from './ClientChip'

type Project = (typeof projects)[number]

const heroCls = css({
  bg: 'bg',
  display: { base: 'flex', lg: 'grid' },
  flexDirection: 'column',
  gap: { base: '5', lg: '0' },
  minHeight: { lg: '80vh' },
  gridTemplateColumns: { lg: '0.7fr 1.3fr' },
  gridTemplateRows: { lg: 'auto 1fr' },
  gridTemplateAreas: { lg: '"mark plate" "back plate"' },
  paddingTop: { base: '5', lg: '7' },
  paddingBottom: { base: '6', lg: '7' },
  paddingLeft: { base: '4', lg: '7', xl: '8' },
  paddingRight: { base: '4', lg: '0' },
})

// Mockup plate #115e58 has no semantic token; surface is the nearest dark teal plane.
const plateCls = css({
  gridArea: 'plate',
  display: 'flex',
  flexDirection: { base: 'column', lg: 'row' },
  alignItems: { lg: 'flex-start' },
  bg: 'surface',
  gap: { base: '4', lg: '5' },
  paddingTop: { base: '4', lg: '6' },
  paddingBottom: { base: '4', lg: '6' },
  paddingLeft: { base: '4', lg: '6' },
  paddingRight: { base: '4', lg: '7', xl: '8' },
  minWidth: '0',
})

const spineCls = css({
  fontWeight: 'bold',
  fontSize: 'sm',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'text',
  writingMode: { lg: 'vertical-rl' },
  transform: { lg: 'rotate(180deg)' },
  whiteSpace: { lg: 'nowrap' },
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})

const bodyCls = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '5',
  flex: '1',
  minWidth: '0',
})

const h1Cls = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'lowercase',
  textStyle: { base: '2xl', lg: '4xl' },
  lineHeight: 'tight',
  letterSpacing: 'tight',
  color: 'accent',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

const deckCls = css({
  fontSize: { base: 'base', lg: 'lede' },
  color: 'text',
  maxWidth: '46ch',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '160ms',
})

const chipsCls = css({ display: 'flex', flexWrap: 'wrap', gap: '2' })

const backCls = css({
  gridArea: 'back',
  alignSelf: 'end',
  fontSize: 'sm',
  fontWeight: 'bold',
  color: 'text',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  width: 'max-content',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
})

export function CaseHero({ project }: { project: Project }) {
  const spine = [String(project.year), project.role, project.type].filter(Boolean).join(' · ')
  return (
    <section className={heroCls}>
      <div className={css({ gridArea: 'mark', color: 'text' })}>
        <BrandLockup variant="stacked-lg" mode="original" />
      </div>
      <div className={plateCls}>
        <div className={spineCls}>{spine}</div>
        <div className={bodyCls}>
          <h1 className={h1Cls}>{project.title}</h1>
          {project.description && <p className={deckCls}>{project.description}</p>}
          {project.clients && (
            <div className={chipsCls}>
              {project.clients.map((c) => (
                <ClientChip key={c.name} client={c} lazy={false} />
              ))}
            </div>
          )}
        </div>
      </div>
      <a href="/work" className={backCls}>
        all work
      </a>
    </section>
  )
}
