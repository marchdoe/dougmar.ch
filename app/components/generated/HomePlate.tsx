import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

// Mockup plate #115e58 has no semantic token; surface is the nearest dark teal plane.
const plateCls = css({
  gridArea: 'plate',
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: { base: 'column', lg: 'row' },
  alignItems: { lg: 'flex-start' },
  bg: 'surface',
  gap: { base: '4', lg: '5' },
  paddingTop: { base: '4', lg: '6' },
  paddingBottom: { base: '4', lg: '6' },
  paddingLeft: { base: '4', lg: '6' },
  paddingRight: { base: '4', lg: '7', xl: '8' },
  height: { lg: '100%' },
})

const metaCls = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'sm',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'text',
  writingMode: { lg: 'vertical-rl' },
  transform: { lg: 'rotate(180deg)' },
  whiteSpace: { lg: 'nowrap' },
  alignSelf: { lg: 'flex-start' },
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})

const bodyCls = css({
  display: 'flex',
  flexDirection: 'column',
  gap: { base: '4', lg: '5' },
  flex: '1',
  minWidth: '0',
})

// Mockup title #99f6e4 maps nearest to accentAlt; accent is used so the light scheme keeps contrast on surface.
const titleCls = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'lowercase',
  textStyle: '4xl',
  fontSize: { base: '44px', lg: '116px' },
  lineHeight: 'tight',
  letterSpacing: 'tight',
  color: 'accent',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '160ms',
})

const problemCls = css({
  fontSize: { base: '15px', lg: '18px' },
  lineHeight: 'normal',
  color: 'text',
  maxWidth: '46ch',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '240ms',
})

const linkCls = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  width: 'max-content',
  maxWidth: '100%',
  fontWeight: 'bold',
  fontSize: 'sm',
  color: 'text',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
  paddingBlock: '1',
  minHeight: '44px',
  _hover: { color: 'text', borderBottomColor: 'text' },
})

function metaLine(project: Project): string {
  const parts = [project.title, String(project.year), project.type, project.role]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase())
  return Array.from(new Set(parts)).join(' · ')
}

export function HomePlate({ project }: { project: Project }) {
  const url = project.liveUrl ?? project.externalUrl
  const deck = project.description ?? project.problem
  return (
    <div className={plateCls}>
      <div className={metaCls}>{metaLine(project)}</div>
      <div className={bodyCls}>
        <div className={titleCls}>{project.title}</div>
        <p className={problemCls}>{deck}</p>
        {url && (
          <a className={linkCls} href={url}>
            visit the live app <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  )
}
