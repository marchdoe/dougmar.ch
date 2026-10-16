import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Ground } from '../Material'
import { FeaturedMeta } from './FeaturedMeta'
import { FieldPanel } from './Panels'
import { Roster } from './Roster'

type Proj = (typeof projects)[number]

function featuredHref(p: Proj): string {
  return p.externalUrl ?? p.liveUrl ?? `/work/${p.slug}`
}

export function EvidencePanel({ project }: { project: Proj }) {
  const problem = project.problem ?? project.description
  return (
    <FieldPanel>
      <Ground material="rule" seed={910041488} />
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          right: '0',
          bottom: '-0.14em',
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(80px, 11vw, 118px)',
          lineHeight: '0.8',
          letterSpacing: 'tight',
          color: 'fieldInkMuted',
          opacity: 0.1,
        })}
      >
        ACT
      </div>
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <div
          className={css({
            fontSize: 'xs',
            fontWeight: 'bold',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            bg: 'field',
            display: 'inline-block',
            paddingBlock: '3px',
            marginBottom: '3',
          })}
        >
          The Evidence · Featured Project
        </div>
        <div>
          <div
            className={css({
              textStyle: 'hero',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: {
                base: 'clamp(44px, 15vw, 64px)',
                md: 'clamp(64px, 9vw, 128px)',
                lg: 'clamp(56px, 7vw, 128px)',
                xl: 'clamp(56px, 8vw, 128px)',
              },
              lineHeight: '1.05',
              letterSpacing: 'tight',
              color: 'fieldInk',
              bg: 'field',
              display: 'inline-block',
              paddingBlock: '0.08em',
              paddingInline: '0.04em',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '240ms',
            })}
          >
            {project.title}
          </div>
        </div>
        <FeaturedMeta project={project} />
        {problem ? (
          <p
            className={css({
              marginTop: '28px',
              maxWidth: { base: '46ch', lg: '42ch' },
              fontSize: '16px',
              lineHeight: '1.55',
              color: 'fieldInk',
              bg: 'field',
            })}
          >
            {problem}
          </p>
        ) : null}
        <a
          href={featuredHref(project)}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            marginTop: '20px',
            fontWeight: 'bold',
            color: 'fieldInk',
            bg: 'field',
            borderBottom: '2px solid',
            borderBottomColor: 'fieldBorder',
            _hover: { color: 'fieldInkMuted', borderBottomColor: 'fieldInk' },
          })}
        >
          See the {project.title} archive →
        </a>
        <Roster project={project} />
      </div>
    </FieldPanel>
  )
}
