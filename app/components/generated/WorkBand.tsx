import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { EntryMeta } from './EntryMeta'

type P = (typeof projects)[number]

export function WorkBand({ project }: { project: P }) {
  return (
    <>
      <div
        className={css({
          position: 'relative',
          overflow: 'hidden',
          bg: 'field',
          color: 'fieldInk',
          paddingBlock: '20px',
          paddingInline: '24px',
          md: { paddingInline: '6vw' },
          lg: { paddingBlock: '14px' },
        })}
      >
        <Ground material="dots" seed={1027631916} />
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            color: 'fieldInk',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            lg: { display: 'none' },
          })}
        >
          <BrandLockup variant="stacked-md" mode="single-color" />
        </div>
      </div>
      <header
        className={css({
          containerType: 'inline-size',
          paddingTop: '40px',
          paddingInline: '24px',
          md: { paddingTop: '56px', paddingInline: '6vw' },
        })}
      >
        <a
          href="/work"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'accent',
            marginBottom: '2',
          })}
        >
          All work
        </a>
        <div
          className={css({
            animationName: 'wipe',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '80ms',
          })}
        >
          <EntryMeta year={project.year} items={[project.type, project.role]} />
        </div>
        <h1
          className={css({
            textStyle: '5xl',
            fontSize: { base: 'min(11cqi, 56px)', lg: '5xl' },
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            color: 'text',
            textAlign: 'left',
            animationName: 'wipe',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
      </header>
    </>
  )
}
